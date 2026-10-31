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
  Image as ImageIcon,
  Flame,
  Check
} from 'lucide-react';

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

export default function CitizenPortal({ 
  issues = [], 
  onOpenReportModal, 
  onUpvote, 
  user = {} 
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mine' | 'urgent'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Track which issues this user has liked to allow toggling (like / unlike)
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
      onUpvote(issueId, true); // decrement
    } else {
      updated = [...likedIssueIds, issueId];
      onUpvote(issueId, false); // increment
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

      const isMyReport = 
        (userEmail && issueEmail && userEmail === issueEmail) ||
        (userName && issueName && userName === issueName) ||
        (userName.includes('jane') && issueName.includes('jane'));

      return isMyReport;
    }

    if (activeTab === 'urgent') {
      return ['Emergency', 'High'].includes(issue.urgency) && issue.status !== 'Resolved';
    }

    return true;
  });

  // Calculate my reports count for tab badge
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
      {/* Citizen Hero & Quick Report Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-700 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
            <Users className="w-3.5 h-3.5 text-blue-200" />
            Connected Neighborhood Watch • Community Hub
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            See a hazard in your area? <br />
            <span className="text-blue-200">Report it with photo & GPS in seconds.</span>
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Every citizen report alerts nearby residents and dispatches tickets to City Hall. Upvote issues to escalate community priority!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenReportModal}
              className="px-6 py-3.5 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Report a Hazard Now</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-100">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Prevents duplicate city calls • Real-time alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Feed Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Community Alerts ({issues.length})
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

        {/* Search & Department Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search address or hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Roads">Roads</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Safety">Safety</option>
          </select>
        </div>
      </div>

      {/* Community Issues Feed */}
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
              isLiked={likedIssueIds.includes(issue._id)}
              onToggleLike={() => handleToggleLike(issue._id)} 
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Citizen-Facing Issue Card
 * (Notice: NO internal AI staff briefing displayed here! Pure citizen-friendly view)
 */
function CitizenIssueCard({ issue, isLiked, onToggleLike }) {
  const CategoryIcon = CATEGORY_ICONS[issue.category] || AlertTriangle;
  const statusIndex = issue.status === 'Resolved' ? 2 : issue.status === 'In Progress' ? 1 : 0;
  const isCommunityEscalated = (issue.upvotes || 0) >= 5;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
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

        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Reported by <strong className="text-slate-700 dark:text-slate-300">{issue.reporterName || 'Resident'}</strong> • {new Date(issue.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Main Content with Optional Photo */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {issue.imageUrl && (
          <div className="w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <img 
              src={issue.imageUrl} 
              alt={issue.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
            />
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
            {issue.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {issue.description}
          </p>

          {/* Location Address */}
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

        {/* Upvote / Community Echo Button (Toggleable!) */}
        <button
          onClick={onToggleLike}
          className={`self-end sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
            isLiked 
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
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
