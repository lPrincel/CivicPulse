import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Search, 
  Filter, 
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
  Activity
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
    badge: 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-500/20 animate-pulse',
    pill: 'bg-red-500',
    label: 'Emergency'
  },
  High: {
    badge: 'bg-amber-50 text-amber-700 border-amber-300',
    pill: 'bg-amber-500',
    label: 'High Urgency'
  },
  Medium: {
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-300',
    pill: 'bg-yellow-500',
    label: 'Medium'
  },
  Low: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    pill: 'bg-emerald-500',
    label: 'Low Priority'
  }
};

const STATUS_COLUMNS = [
  { id: 'Reported', label: 'Reported & Triaged', color: 'border-yellow-400 bg-yellow-500/5', badge: 'bg-yellow-100 text-yellow-800' },
  { id: 'In Progress', label: 'Under Municipal Action', color: 'border-blue-400 bg-blue-500/5', badge: 'bg-blue-100 text-blue-800' },
  { id: 'Resolved', label: 'Resolved & Closed', color: 'border-emerald-400 bg-emerald-500/5', badge: 'bg-emerald-100 text-emerald-800' }
];

export default function AdminDashboard({ 
  issues = [], 
  stats = {}, 
  onStatusChange, 
  onOpenReportModal,
  onRefresh,
  isLoading = false 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'grid'

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

  // Calculate live stats
  const totalCount = stats.total ?? issues.length;
  const urgentCount = stats.urgent ?? issues.filter(i => ['High', 'Emergency'].includes(i.urgency) && i.status !== 'Resolved').length;
  const reportedCount = stats.reported ?? issues.filter(i => i.status === 'Reported').length;
  const resolvedCount = stats.resolved ?? issues.filter(i => i.status === 'Resolved').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-lg tracking-tight">CivicPulse AI</h1>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Municipal Hazard Triage & Response Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onRefresh}
              title="Refresh issues"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200/80"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 space-y-6">
        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Issues */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
              <span className="text-xs text-slate-500 font-medium">registered</span>
            </div>
          </div>

          {/* Urgent Hazards */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Urgent Hazards</span>
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-600">{urgentCount}</span>
              <span className="text-xs text-red-500 font-medium">immediate action</span>
            </div>
          </div>

          {/* Under Action */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Action</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{reportedCount}</span>
              <span className="text-xs text-slate-500 font-medium">in queue</span>
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Resolution Rate</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">{resolutionRate}%</span>
              <span className="text-xs text-emerald-600 font-medium">({resolvedCount} resolved)</span>
            </div>
          </div>
        </div>

        {/* Filter and View Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search by hazard, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9.5 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Layout switch */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end md:self-auto">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'kanban' 
                    ? 'bg-white text-slate-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-slate-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium mr-1 text-[11px] uppercase tracking-wider">Department:</span>
            {['All', 'Electricity', 'Water', 'Roads', 'Sanitation', 'Safety'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 text-white font-semibold shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 font-medium'
                }`}
              >
                {cat}
              </button>
            ))}

            <span className="text-slate-400 font-medium ml-3 mr-1 text-[11px] uppercase tracking-wider">Urgency:</span>
            {['All', 'Emergency', 'High', 'Medium', 'Low'].map((urg) => (
              <button
                key={urg}
                onClick={() => setSelectedUrgency(urg)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                  selectedUrgency === urg 
                    ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 font-medium'
                }`}
              >
                {urg}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode: Kanban vs Grid */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATUS_COLUMNS.map((col) => {
              const columnIssues = filteredIssues.filter((i) => i.status === col.id);

              return (
                <div 
                  key={col.id} 
                  className={`rounded-2xl border p-4 bg-white/60 shadow-xs flex flex-col min-h-[500px] ${col.color}`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800 text-sm">{col.label}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                        {columnIssues.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-3.5 flex-1 overflow-y-auto">
                    {columnIssues.length === 0 ? (
                      <div className="h-32 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                        No issues in this stage
                      </div>
                    ) : (
                      columnIssues.map((issue) => (
                        <IssueCard 
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
              <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200/80">
                No civic issues match your current filters.
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <IssueCard 
                  key={issue._id} 
                  issue={issue} 
                  onStatusChange={onStatusChange} 
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Individual Issue Card Component
 */
function IssueCard({ issue, onStatusChange }) {
  const urgencyCfg = URGENCY_CONFIG[issue.urgency] || URGENCY_CONFIG.Medium;
  const CategoryIcon = CATEGORY_ICONS[issue.category] || AlertTriangle;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3">
      {/* Badges Header */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${urgencyCfg.badge}`}>
          {issue.urgency}
        </span>

        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          <CategoryIcon className="w-3 h-3 text-slate-600" />
          {issue.category}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
          {issue.title}
        </h4>
        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
          {issue.description}
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">{issue.location}</span>
      </div>

      {/* AI Summary Highlight */}
      {issue.aiSummary && (
        <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100/70 text-[11px] text-indigo-950 leading-relaxed">
          <span className="font-semibold text-indigo-700 flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            AI Field Briefing:
          </span>
          {issue.aiSummary}
        </div>
      )}

      {/* Status Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400">
          {new Date(issue.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        <div className="flex items-center gap-1.5">
          {issue.status === 'Reported' && (
            <button
              onClick={() => onStatusChange(issue._id, 'In Progress')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Dispatch Crew</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {issue.status === 'In Progress' && (
            <button
              onClick={() => onStatusChange(issue._id, 'Resolved')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
          )}

          {issue.status === 'Resolved' && (
            <button
              onClick={() => onStatusChange(issue._id, 'Reported')}
              className="text-[11px] font-medium px-2 py-0.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

