import React from 'react';
import { 
  Activity, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Users, 
  Plus, 
  Sparkles,
  Building2,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  currentRole = 'citizen', // 'citizen' | 'admin'
  onRoleChange,
  isDark = false,
  onToggleDark,
  onOpenReportModal,
  currentUser = 'Jane Doe (Citizen)'
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Live Beacon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">CivicPulse</h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                AI Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Hyperlocal Infrastructure & Hazard Triage</p>
          </div>
        </div>

        {/* Center: View Switcher (Citizen vs Admin) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
          <button
            onClick={() => onRoleChange('citizen')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === 'citizen'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Citizen Portal</span>
          </button>

          <button
            onClick={() => onRoleChange('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>City Hall Admin</span>
          </button>
        </div>

        {/* Right Controls: User Pill, Theme Toggle, Report Button */}
        <div className="flex items-center gap-2.5">
          {/* User Badge / Role Simulation */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="font-semibold truncate max-w-[140px]">{currentUser}</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* New Issue CTA */}
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report Hazard</span>
          </button>
        </div>
      </div>
    </header>
  );
}
