import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  ThumbsUp, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Zap, 
  Droplet, 
  Trash2, 
  ShieldAlert, 
  Users,
  Flame, 
  Check, 
  Map, 
  ListFilter,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import CityMapRadar from './CityMapRadar';

const CATEGORY_ICONS = {
  Roads: ShieldAlert,
  Sanitation: Trash2,
  Electricity: Zap,
  Water: Droplet,
  Safety: AlertTriangle
};

const URGENCY_STYLES = {
  Emergency: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 ring-1 ring-red-500/20 animate-pulse',
  High: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  Low: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
};

const QUICK_CATEGORIES = [
  { label: 'Pothole & Roads', category: 'Roads', icon: ShieldAlert, color: 'hover:border-red-400 text-red-500' },
  { label: 'Power & Wires', category: 'Electricity', icon: Zap, color: 'hover:border-amber-400 text-amber-500' },
  { label: 'Water Leaks', category: 'Water', icon: Droplet, color: 'hover:border-blue-400 text-blue-500' },
  { label: 'Trash Dumping', category: 'Sanitation', icon: Trash2, color: 'hover:border-emerald-400 text-emerald-500' },
  { label: 'Public Safety', category: 'Safety', icon: AlertTriangle, color: 'hover:border-purple-400 text-purple-500' }
];

export default function CitizenPortal({ 
  issues = [], 
  onOpenReportModal, 
  onUpvote, 
  onDeleteIssue,
  user = {} 
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mine' | 'urgent'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('feed'); // 'feed' | 'map'
  
  // Track liked issue IDs
  const [likedIssueIds, setLikedIssueIds] = useState(() => {
    try {
      const saved = localStorage.getItem('civicpulse_liked_issues');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleToggleLike = (issueId) => {
    const isCurrentlyLiked = likedIssueIds.includes(issueId);
    let updated;
    if (isCurrentlyLiked) {
      updated = likedIssueIds.filter((id) => id !== issueId);
      onUpvote(issueId, true);
    } else {
      updated = [...likedIssueIds, issueId];
      onUpvote(issueId, false);
    }
    setLikedIssueIds(updated);
    localStorage.setItem('civicpulse_liked_issues', JSON.stringify(updated));
  };

  // Filter issues
  const filtered = issues.filter((issue) => {
    const matchesSearch = 
      issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;

    if (!matchesSearch || !matchesCategory) return false;

    if (activeTab === 'mine') {
      const userEmail = (user.email || '').toLowerCase().trim();
      const userName = (user.name || '').toLowerCase().trim();
      const issueEmail = (issue.reporterEmail || '').toLowerCase().trim();
      const issueName = (issue.reporterName || '').toLowerCase().trim();

      return (
        (userEmail && issueEmail && userEmail === issueEmail) ||
        (userName && issueName && userName === issueName) ||
        (userName.includes('jane') && issueName.includes('jane'))
      );
    }

    if (activeTab === 'urgent') {
      return ['Emergency', 'High'].includes(issue.urgency) && issue.status !== 'Resolved';
    }

    return true;
  });

  const myReportsCount = issues.filter((issue) => {
    const userEmail = (user.email || '').toLowerCase().trim();
    const userName = (user.name || '').toLowerCase().trim();
    const issueEmail = (issue.reporterEmail || '').toLowerCase().trim();
    const issueName = (issue.reporterName || '').toLowerCase().trim();
    return (
      (userEmail && issueEmail && userEmail === issueEmail) ||
      (userName && issueName && userName === issueName) ||
      (userName.includes('jane') && issueName.includes('jane'))
    );
  }).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-10 shadow-2xl border border-white/10">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-blue-200 border border-white/15 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Civic Incident Network • Smart City Dispatch</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
            Report municipal hazards. <br />
            <span className="bg-linear-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Empower your neighborhood.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Snap a photo, drop a GPS pin, and let Gemini AI triage your ticket directly to municipal dispatch in milliseconds.
          </p>

          {/* Quick Categories Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report a Hazard</span>
            </button>

            {QUICK_CATEGORIES.map((item) => (
              <button
                key={item.category}
                onClick={() => {
                  setSelectedCategory(item.category);
                  setViewMode('feed');
                }}
                className={`px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer ${item.color}`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control & View Switcher Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-md transition-colors">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Alerts ({issues.length})
          </button>
          
          <button
            onClick={() => setActiveTab('mine')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'mine'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
            }`}
          >
            <span>My Reports</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 dark:bg-white/20 font-bold">
              {myReportsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('urgent')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'urgent'
                ? 'bg-red-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
            }`}
          >
            Urgent Hazards 🔥
          </button>
        </div>

        {/* View Switcher (Feed vs GIS Map Radar) & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search address or hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>City Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Feed vs Map */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <CityMapRadar issues={filtered} />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500/60" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {activeTab === 'mine' ? "You haven't reported any civic hazards yet." : 'No community alerts match your search.'}
              </p>
              {activeTab === 'mine' && (
                <button
                  onClick={onOpenReportModal}
                  className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Report Your First Issue
                </button>
              )}
            </div>
          ) : (
            filtered.map((issue) => (
              <CitizenIssueCard 
                key={issue._id} 
                issue={issue} 
                user={user}
                isLiked={likedIssueIds.includes(issue._id)}
                onToggleLike={() => handleToggleLike(issue._id)} 
                onDelete={() => onDeleteIssue && onDeleteIssue(issue._id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual Citizen Issue Card with Glassmorphic Aesthetic
 */
function CitizenIssueCard({ issue, user, isLiked, onToggleLike, onDelete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const CategoryIcon = CATEGORY_ICONS[issue.category] || AlertTriangle;
  const statusIndex = issue.status === 'Resolved' ? 2 : issue.status === 'In Progress' ? 1 : 0;
  const isCommunityEscalated = (issue.upvotes || 0) >= 5;

  const userEmail = (user?.email || '').toLowerCase().trim();
  const userName = (user?.name || '').toLowerCase().trim();
  const issueEmail = (issue.reporterEmail || '').toLowerCase().trim();
  const issueName = (issue.reporterName || '').toLowerCase().trim();

  // Author check to allow deleting own accidental/mistaken reports
  const isAuthor = Boolean(
    (userEmail && issueEmail && userEmail === issueEmail) ||
    (userName && issueName && userName === issueName)
  );

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all space-y-4">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${URGENCY_STYLES[issue.urgency] || 'bg-slate-100'}`}>
            {issue.urgency} Urgency
          </span>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
            <CategoryIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {issue.category}
          </span>

          {/* Dynamic Community Escalation Badge */}
          {isCommunityEscalated && (
            <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
              <Flame className="w-3 h-3 text-amber-500" />
              Community Escalated ({issue.upvotes} echoes)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {isAuthor ? (
              <span className="font-bold text-blue-600 dark:text-blue-400">Your Report</span>
            ) : (
              <>Reported by <strong className="text-slate-700 dark:text-slate-300">{issue.reporterName || 'Resident'}</strong></>
            )} • {new Date(issue.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Delete / Retract Report for Author */}
          {isAuthor && (
            <div>
              {isConfirmingDelete ? (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-red-500/10 border border-red-500/20 text-xs animate-in fade-in">
                  <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 pl-1">Delete report?</span>
                  <button
                    onClick={() => {
                      if (onDelete) onDelete();
                      setIsConfirmingDelete(false);
                    }}
                    className="px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[10px] hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-1.5 py-0.5 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Retract / Delete your report"
                >
                  <Trash2 className="w-3 h-3 text-slate-400" />
                  <span>Retract</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content with Optional Photo */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {issue.imageUrl && (
          <div className="w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
            <img 
              src={issue.imageUrl} 
              alt={issue.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
            />
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
            {issue.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {issue.description}
          </p>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{issue.location}</span>
          </div>
        </div>
      </div>

      {/* Interactive Status Progress Tracker & Upvote Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Visual Progress Steps */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">Status:</span>
          
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            {/* Step 1: Reported */}
            <span className={`px-2 py-0.5 rounded-md ${
              statusIndex >= 0 
                ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30' 
                : 'text-slate-400'
            }`}>
              1. Logged
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>

            {/* Step 2: Dispatched */}
            <span className={`px-2 py-0.5 rounded-md ${
              statusIndex >= 1 
                ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 font-bold' 
                : 'text-slate-400 opacity-50'
            }`}>
              2. Crew Dispatched
            </span>
            <span className="text-slate-300 dark:text-slate-700">→</span>

            {/* Step 3: Fixed */}
            <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
              statusIndex >= 2 
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold' 
                : 'text-slate-400 opacity-50'
            }`}>
              {statusIndex >= 2 && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              3. Resolved
            </span>
          </div>
        </div>

        {/* Upvote / Community Echo Button */}
        <button
          onClick={onToggleLike}
          className={`self-end sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
            isLiked 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          }`}
          title={isLiked ? 'Remove your echo' : 'Echo this hazard to raise municipal dispatch priority'}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-white' : 'text-blue-600 dark:text-blue-400'}`} />
          <span>{isLiked ? 'You echoed this' : 'I noticed this too'}</span>
          <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            isLiked ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
          }`}>
            {issue.upvotes || 1}
          </span>
        </button>
      </div>
    </div>
  );
}
