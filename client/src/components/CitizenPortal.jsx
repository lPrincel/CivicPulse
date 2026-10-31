import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  ThumbsUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter,
  Zap,
  Droplet,
  Trash2,
  ShieldAlert,
  ArrowRight,
  Send,
  Users
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
  currentUser = 'Jane Doe (Citizen)' 
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mine' | 'urgent'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter issues
  const filtered = issues.filter((issue) => {
    const matchesSearch = 
      issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;

    if (!matchesSearch || !matchesCategory) return false;

    if (activeTab === 'mine') {
      return issue.reporterName?.toLowerCase().includes('jane') || issue.reporterName?.toLowerCase().includes('you');
    }
    if (activeTab === 'urgent') {
      return ['Emergency', 'High'].includes(issue.urgency) && issue.status !== 'Resolved';
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Citizen Hero & Quick Report Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-700 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI-Powered Smart Neighborhood Response
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            See a hazard in your city? <br />
            <span className="text-blue-200">Report it in 15 seconds.</span>
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Our municipal AI engine instantly classifies urgency, detects electrical, road, or water hazards, and routes tickets directly to City Hall field crews.
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
              <Users className="w-4 h-4 text-emerald-300" />
              <span><strong>842+</strong> community issues resolved this month</span>
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
            onClick={() => setActiveTab('urgent')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'urgent'
                ? 'bg-red-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
            }`}
          >
            Urgent Hazards 🔥
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mine'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
            }`}
          >
            My Reports
          </button>
        </div>

        {/* Search & Department Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search address or problem..."
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
            <option value="All">All Departments</option>
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
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500/50" />
            <p className="text-sm font-semibold">No issues found matching your filter criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Your neighborhood is looking clear!</p>
          </div>
        ) : (
          filtered.map((issue) => (
            <CitizenIssueCard 
              key={issue._id} 
              issue={issue} 
              onUpvote={onUpvote} 
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Citizen-Facing Issue Card
 */
function CitizenIssueCard({ issue, onUpvote }) {
  const CategoryIcon = CATEGORY_ICONS[issue.category] || AlertTriangle;

  // Status step index: 0 = Reported, 1 = In Progress, 2 = Resolved
  const statusIndex = issue.status === 'Resolved' ? 2 : issue.status === 'In Progress' ? 1 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${URGENCY_STYLES[issue.urgency] || 'bg-slate-100'}`}>
            {issue.urgency}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
            <CategoryIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {issue.category}
          </span>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Reported by <strong className="text-slate-700 dark:text-slate-300">{issue.reporterName || 'Resident'}</strong> • {new Date(issue.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
          {issue.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
          {issue.description}
        </p>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <span className="font-medium">{issue.location}</span>
      </div>

      {/* AI Briefing */}
      {issue.aiSummary && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Municipal Triage Summary:
          </span>
          {issue.aiSummary}
        </div>
      )}

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
              2. Dispatched
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

        {/* Upvote / Community Echo */}
        <button
          onClick={() => onUpvote(issue._id)}
          className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          title="Echo this report to raise municipal priority"
        >
          <ThumbsUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>I noticed this too</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
            {issue.upvotes || 1}
          </span>
        </button>
      </div>
    </div>
  );
}

