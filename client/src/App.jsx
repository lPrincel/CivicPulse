import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import ReportIssueModal from './components/ReportIssueModal';
import { fetchIssues, createIssue, triageIssue, updateIssueStatus } from './services/api';
import { initialMockIssues } from './data/mockIssues';

export default function App() {
  const [issues, setIssues] = useState(initialMockIssues);
  const [stats, setStats] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load issues on mount
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
    loadData();
  }, []);

  // Handle AI Triage call from Modal
  const handleTriage = async (description, location) => {
    return await triageIssue(description, location);
  };

  // Handle final submission of reported issue
  const handleCreateIssue = async (newIssueData) => {
    const saved = await createIssue(newIssueData);
    setIssues((prev) => [saved, ...prev]);
  };

  // Handle Kanban status change (e.g. Reported -> In Progress -> Resolved)
  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI update for instantaneous feel
    setIssues((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );

    try {
      await updateIssueStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      <AdminDashboard
        issues={issues}
        stats={stats}
        onStatusChange={handleStatusChange}
        onOpenReportModal={() => setIsModalOpen(true)}
        onRefresh={loadData}
        isLoading={isLoading}
      />

      <ReportIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateIssue}
        onTriage={handleTriage}
      />
    </div>
  );
}
