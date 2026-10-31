import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Search, 
  Plus, 
  MapPin, 
  ArrowRight, 
  Zap, 
  Droplet, 
  Trash2, 
  LayoutGrid, 
  Columns3,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Activity,
  DatabaseZap,
  Check,
  Flame
} from 'lucide-react';

const CATEGORY_ICONS = {
  Roads: ShieldAlert,
  Sanitation: Trash2,
  Electricity: Zap,
  Water: Droplet,
  Safety: AlertTriangle
};

const URGENCY_CONFIG = {
  Emergency: {
    badge: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 ring-2 ring-red-500/20 animate-pulse',
    label: 'Emergency'
  },
  High: {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    label: 'High Priority'
  },
  Medium: {
    badge: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    label: 'Medium'
  },
  Low: {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    label: 'Low Priority'
  }
};

const STATUS_COLUMNS = [
  { id: 'Reported', label: '1. Triage & Queue', color: 'border-yellow-500/40 bg-yellow-500/5', badge: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300' },
  { id: 'In Progress', label: '2. Field Crew Dispatched', color: 'border-blue-500/40 bg-blue-500/5', badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' },
  { id: 'Resolved', label: '3. Verified & Closed', color: 'border-emerald-500/40 bg-emerald-500/5', badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' }
];

export default function AdminDashboard({ 
  issues = [], 
  stats = {}, 
  onStatusChange, 
  onOpenReportModal,
  onRefresh,
  onSeedDemo,
  isLoading = false 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [viewMode, setViewMode] = useState('kanban');

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'All' || issue.urgency === selectedUrgency;

    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const totalCount = stats.total ?? issues.length;
  const urgentCount = stats.urgent ?? issues.filter(i => ['High', 'Emergency'].includes(i.urgency) && i.status !== 'Resolved').length;
  const reportedCount = stats.reported ?? issues.filter(i => i.status === 'Reported').length;
  const resolvedCount = stats.resolved ?? issues.filter(i => i.status === 'Resolved').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Issues */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Reports</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-xs text-slate-500 font-medium">tickets logged</span>
          </div>
        </div>

        {/* Urgent Hazards */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Critical Hazards</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">{urgentCount}</span>
            <span className="text-xs text-red-500 font-medium">immediate SLA</span>
          </div>
        </div>

        {/* Active Dispatch */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending Queue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{reportedCount}</span>
            <span className="text-xs text-slate-500 font-medium">awaiting crew</span>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Resolution Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{resolutionRate}%</span>
            <span className="text-xs text-emerald-600/90 font-medium">({resolvedCount} resolved)</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search title, description, street..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Quick Actions (Reset Seed & Layout Switch) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onSeedDemo}
              title="Reset sample records for judges demo"
              className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <DatabaseZap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Seed Demo Data</span>
            </button>

            <button
              onClick={onRefresh}
              title="Refresh issues"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'kanban' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider shrink-0">Department:</span>
          {['All', 'Electricity', 'Water', 'Roads', 'Sanitation', 'Safety'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white font-bold shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold'
              }`}
            >
              {cat}
            </button>
          ))}

          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider shrink-0 ml-3">Urgency:</span>
          {['All', 'Emergency', 'High', 'Medium', 'Low'].map((urg) => (
            <button
              key={urg}
              onClick={() => setSelectedUrgency(urg)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedUrgency === urg 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold'
              }`}
            >
              {urg}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board or Grid View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUS_COLUMNS.map((col) => {
            const columnIssues = filteredIssues.filter((i) => i.status === col.id);

            return (
              <div 
                key={col.id} 
                className={`rounded-3xl border p-4 bg-white/70 dark:bg-slate-900/60 shadow-xs flex flex-col min-h-[550px] transition-colors ${col.color}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{col.label}</h3>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                      {columnIssues.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-3.5 flex-1 overflow-y-auto">
                  {columnIssues.length === 0 ? (
                    <div className="h-36 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                      No tickets currently in this stage
                    </div>
                  ) : (
                    columnIssues.map((issue) => (
                      <AdminIssueCard 
                        key={issue._id} 
                        issue={issue} 
                        onStatusChange={onStatusChange} 
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              No civic issues match your current filters.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <AdminIssueCard 
                key={issue._id} 
                issue={issue} 
                onStatusChange={onStatusChange} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Municipal Admin Kanban Issue Card
 */
function AdminIssueCard({ issue, onStatusChange }) {
  const urgencyCfg = URGENCY_CONFIG[issue.urgency] || URGENCY_CONFIG.Medium;
  const CategoryIcon = CATEGORY_ICONS[issue.category] || AlertTriangle;
  const isCommunityEscalated = (issue.upvotes || 0) >= 5;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3">
      {/* Badges Header */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${urgencyCfg.badge}`}>
            {issue.urgency}
          </span>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            <CategoryIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            {issue.category}
          </span>
        </div>

        {isCommunityEscalated && (
          <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Flame className="w-3 h-3 text-amber-500" />
            {issue.upvotes} echoes
          </span>
        )}
      </div>

      {/* Optional Photo Attachment */}
      {issue.imageUrl && (
        <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          <img 
            src={issue.imageUrl} 
            alt={issue.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Title & Description */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
          {issue.title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
          {issue.description}
        </p>
      </div>

      {/* Address & Reporter */}
      <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate font-medium">{issue.location}</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Reported by: <strong>{issue.reporterName || 'Citizen'}</strong>
        </div>
      </div>

      {/* AI Summary Highlight */}
      {issue.aiSummary && (
        <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-950 dark:text-indigo-300 leading-relaxed">
          <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            AI Dispatch Protocol:
          </span>
          {issue.aiSummary}
        </div>
      )}

      {/* Status Action Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400">
          {new Date(issue.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        <div className="flex items-center gap-1.5">
          {issue.status === 'Reported' && (
            <button
              onClick={() => onStatusChange(issue._id, 'In Progress')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span>Dispatch Crew</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {issue.status === 'In Progress' && (
            <button
              onClick={() => onStatusChange(issue._id, 'Resolved')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
          )}

          {issue.status === 'Resolved' && (
            <button
              onClick={() => onStatusChange(issue._id, 'Reported')}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
