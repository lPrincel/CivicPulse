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
  Flame, 
  Map, 
  Radio
} from 'lucide-react';
import CityMapRadar from './CityMapRadar';

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
    label: 'Emergency',
    border: 'border-l-red-500'
  },
  High: {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    label: 'High Priority',
    border: 'border-l-amber-500'
  },
  Medium: {
    badge: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    label: 'Medium',
    border: 'border-l-yellow-400'
  },
  Low: {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    label: 'Low Priority',
    border: 'border-l-emerald-400'
  }
};

const STATUS_COLUMNS = [
  { id: 'Reported', label: '1. Triage & Queue', color: 'border-yellow-500/30', headerColor: 'border-b-yellow-500/40', badge: 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-300', dot: 'bg-yellow-500' },
  { id: 'In Progress', label: '2. Field Crew Dispatched', color: 'border-blue-500/30', headerColor: 'border-b-blue-500/40', badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300', dot: 'bg-blue-500' },
  { id: 'Resolved', label: '3. Verified & Closed', color: 'border-emerald-500/30', headerColor: 'border-b-emerald-500/40', badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300', dot: 'bg-emerald-500' }
];

export default function AdminDashboard({ 
  issues = [], 
  stats = {}, 
  onStatusChange, 
  onOpenReportModal, 
  onRefresh, 
  onSeedDemo, 
  onDeleteIssue,
  isLoading = false 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'grid' | 'map'

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

  const KPI_CARDS = [
    {
      label: 'Total Reports',
      value: totalCount,
      suffix: 'tickets logged',
      icon: Clock,
      colorClass: 'kpi-card-blue',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-slate-900 dark:text-white'
    },
    {
      label: 'Critical Hazards',
      value: urgentCount,
      suffix: 'immediate SLA',
      icon: AlertTriangle,
      colorClass: 'kpi-card-red',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-600 dark:text-red-400',
      valueColor: 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Pending Queue',
      value: reportedCount,
      suffix: 'awaiting crew',
      icon: Activity,
      colorClass: 'kpi-card-amber',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-slate-900 dark:text-white'
    },
    {
      label: 'Resolution Rate',
      value: `${resolutionRate}%`,
      suffix: `(${resolvedCount} resolved)`,
      icon: CheckCircle2,
      colorClass: 'kpi-card-emerald',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* City Hall Dispatch Operations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-white/10 shadow-2xl shadow-indigo-900/30">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/25 flex items-center justify-center">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-sm tracking-tight">Municipal Operations Command</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/35">
                ● SLA Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time incident stream · Automated Gemini AI field dispatch</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSeedDemo}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/18 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/15 hover:border-white/25"
            title="Reset sample records for judges demo"
          >
            <DatabaseZap className="w-3.5 h-3.5 text-blue-400" />
            <span>Seed Demo Data</span>
          </button>

          <button
            onClick={onRefresh}
            title="Refresh issues"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/18 text-white transition-all border border-white/15 hover:border-white/25 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : 'text-slate-300'}`} />
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className={`bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm card-hover ${kpi.colorClass}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">{kpi.label}</span>
              <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} ${kpi.iconColor} flex items-center justify-center`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black tracking-tight ${kpi.valueColor}`}>{kpi.value}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 font-medium">{kpi.suffix}</p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900/90 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 backdrop-blur-md transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search title, description, street..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Layout Switcher (Kanban vs Grid vs City GIS Map) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'kanban' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'map' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>GIS Map</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider shrink-0">Department:</span>
          {['All', 'Electricity', 'Water', 'Roads', 'Sanitation', 'Safety'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
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
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold ${
                selectedUrgency === urg 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {urg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'map' ? (
        <CityMapRadar issues={filteredIssues} />
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STATUS_COLUMNS.map((col) => {
            const columnIssues = filteredIssues.filter((i) => i.status === col.id);

            return (
              <div 
                key={col.id} 
                className={`rounded-3xl border ${col.color} bg-white/80 dark:bg-slate-900/60 shadow-sm flex flex-col min-h-[560px] transition-colors`}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between px-4 py-3.5 border-b ${col.headerColor} dark:border-opacity-30`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{col.label}</h3>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${col.badge}`}>
                    {columnIssues.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto p-3.5">
                  {columnIssues.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                      No tickets in this stage
                    </div>
                  ) : (
                    columnIssues.map((issue) => (
                      <AdminIssueCard 
                        key={issue._id} 
                        issue={issue} 
                        onStatusChange={onStatusChange} 
                        onDelete={() => onDeleteIssue && onDeleteIssue(issue._id)}
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
 * Municipal Admin Kanban Issue Card — Premium Redesign
 */
function AdminIssueCard({ issue, onStatusChange, onDelete }) {
  const urgencyCfg = URGENCY_CONFIG[issue.urgency] || URGENCY_CONFIG.Medium;
  const CategoryIcon = CATEGORY_ICONS[issue.category] || AlertTriangle;
  const isCommunityEscalated = (issue.upvotes || 0) >= 5;
  const borderClass = urgencyCfg.border || 'border-l-slate-300';

  return (
    <div className={`bg-white dark:bg-slate-900/90 rounded-2xl border-l-4 ${borderClass} border border-slate-200/90 dark:border-slate-800 shadow-sm card-hover hover:border-blue-500/35 dark:hover:border-blue-500/35 space-y-3 overflow-hidden`}>
      <div className="p-4 space-y-3">
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
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
            />
          </div>
        )}

        {/* Title & Description */}
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
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
            Reported by: <strong className="text-slate-600 dark:text-slate-300">{issue.reporterName || 'Citizen'}</strong>
          </div>
        </div>

        {/* AI Dispatch Protocol (Staff-Only Intelligence) */}
        {issue.aiSummary && (
          <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-[11px] text-indigo-900 dark:text-indigo-300 leading-relaxed">
            <span className="font-extrabold text-indigo-700 dark:text-indigo-400 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Dispatch Protocol:
            </span>
            {issue.aiSummary}
          </div>
        )}

        {/* Status Action Buttons */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-400 font-medium">
            {new Date(issue.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          <div className="flex items-center gap-1.5">
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`Permanently remove ticket: "${issue.title}"?`)) {
                    onDelete();
                  }
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                title="Purge / Delete Incident"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {issue.status === 'Reported' && (
              <button
                onClick={() => onStatusChange(issue._id, 'In Progress')}
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1 cursor-pointer shadow-sm shadow-blue-500/20"
              >
                <span>Dispatch Crew</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {issue.status === 'In Progress' && (
              <button
                onClick={() => onStatusChange(issue._id, 'Resolved')}
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 cursor-pointer shadow-sm shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>
            )}

            {issue.status === 'Resolved' && (
              <button
                onClick={() => onStatusChange(issue._id, 'Reported')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Reopen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
