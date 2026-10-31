import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenPortal from './components/CitizenPortal';
import AdminDashboard from './components/AdminDashboard';
import ReportIssueModal from './components/ReportIssueModal';
import AuthPage from './components/AuthPage';
import ToastContainer from './components/Toast';
import { fetchIssues, createIssue, triageIssue, updateIssueStatus, upvoteIssue, seedIssues } from './services/api';
import { initialMockIssues } from './data/mockIssues';
import { playSuccessChime, playEmergencyTone } from './utils/audio';

export default function App() {
  const [issues, setIssues] = useState(initialMockIssues);
  const [stats, setStats] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Authenticated User State
  const [user, setUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('civicpulse_auth');
      return savedAuth ? JSON.parse(savedAuth) : null;
    } catch (e) {
      return null;
    }
  });

  // Dark mode setup
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('civicpulse_theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('civicpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('civicpulse_theme', 'light');
    }
  }, [isDark]);

  // Toast Helper
  const addToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load issues from server
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchIssues();
      if (res?.data) {
        setIssues(res.data);
      }
      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Using local fallback issues:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Handle Authentication Success
  const handleAuthSuccess = (authData) => {
    setUser(authData);
    localStorage.setItem('civicpulse_auth', JSON.stringify(authData));
    playSuccessChime();
    addToast(
      `Welcome, ${authData.name}!`,
      authData.role === 'admin' ? 'Authenticated as Municipal Dispatcher' : 'Connected to Citizen Safety Hub',
      'success'
    );
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('civicpulse_auth');
    addToast('Signed out', 'Session cleared successfully', 'info');
  };

  // Handle AI Triage
  const handleTriage = async (description, location) => {
    return await triageIssue(description, location);
  };

  // Handle Create Issue
  const handleCreateIssue = async (newIssueData) => {
    const payloadWithReporter = {
      ...newIssueData,
      reporterName: user?.name || 'Anonymous Resident'
    };

    const saved = await createIssue(payloadWithReporter);
    setIssues((prev) => [saved, ...prev]);

    if (saved.urgency === 'Emergency') {
      playEmergencyTone();
      addToast('🚨 EMERGENCY ALERT LOGGED', `Dispatched to City Hall Priority Queue (${saved.category})`, 'error');
    } else {
      playSuccessChime();
      addToast('✅ Ticket Created', `AI categorized under ${saved.category} (${saved.urgency} priority)`, 'success');
    }
  };

  // Handle Status Change (Admin Kanban)
  const handleStatusChange = async (id, newStatus) => {
    setIssues((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );

    if (newStatus === 'Resolved') {
      playSuccessChime();
      addToast('🎉 Issue Marked Resolved!', 'Notification dispatched to community residents', 'success');
    } else if (newStatus === 'In Progress') {
      addToast('🚜 Field Crew Dispatched', 'Municipal response unit on route to site', 'info');
    }

    try {
      await updateIssueStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }
  };

  // Handle Upvote
  const handleUpvote = async (id) => {
    setIssues((prev) =>
      prev.map((item) => (item._id === id ? { ...item, upvotes: (item.upvotes || 0) + 1 } : item))
    );
    addToast('👍 Echo Recorded', 'Your confirmation increases dispatch priority score', 'info');
    await upvoteIssue(id);
  };

  // Handle Re-seed Demo Data
  const handleSeedDemo = async () => {
    setIsLoading(true);
    try {
      const res = await seedIssues();
      if (res?.data) {
        setIssues(res.data);
      }
      playSuccessChime();
      addToast('🌱 Demo Database Seeded', 'Loaded 8 realistic municipal incident records', 'success');
    } catch (e) {
      addToast('Seed notice', 'Loaded local mock dataset', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not authenticated, render Login / Sign Up Page
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // Authenticated Application (Strictly role-separated)
  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* Role-Specific Navigation */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onOpenReportModal={() => setIsModalOpen(true)}
      />

      {/* Main Content Area based on User Role */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        {isAdmin ? (
          <AdminDashboard
            issues={issues}
            stats={stats}
            onStatusChange={handleStatusChange}
            onOpenReportModal={() => setIsModalOpen(true)}
            onRefresh={loadData}
            onSeedDemo={handleSeedDemo}
            isLoading={isLoading}
          />
        ) : (
          <CitizenPortal
            issues={issues}
            onOpenReportModal={() => setIsModalOpen(true)}
            onUpvote={handleUpvote}
            currentUser={user.name}
          />
        )}
      </main>

      {/* Citizen Report Modal */}
      <ReportIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateIssue}
        onTriage={handleTriage}
        currentUser={user.name}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
