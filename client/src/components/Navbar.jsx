import React from 'react';
import { 
  Activity, 
  Sun, 
  Moon, 
  LogOut, 
  Plus, 
  ShieldCheck, 
  User, 
  Building2 
} from 'lucide-react';

export default function Navbar({ 
  user,
  onLogout,
  isDark = false,
  onToggleDark,
  onOpenReportModal
}) {
  const isAdmin = user?.role === 'admin';
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 bg-white/88 dark:bg-slate-900/88 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors shadow-sm shadow-slate-900/5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Dynamic Sub-Header based on Role */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${
            isAdmin 
              ? 'bg-gradient-to-tr from-slate-800 via-indigo-900 to-blue-900 shadow-indigo-500/20' 
              : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/25'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">CivicPulse</h1>
              
              {isAdmin ? (
                <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/12 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
                  <ShieldCheck className="w-3 h-3 text-indigo-500" />
                  City Hall Command Center
                </span>
              ) : (
                <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/12 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Citizen Portal
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
              {isAdmin ? 'Municipal Hazard Triage & Priority Crew Dispatch' : 'Hyperlocal Community Watch & Real-Time Reporting'}
            </p>
          </div>
        </div>

        {/* Right Section: User Profile, Dark Mode, CTA & Logout */}
        <div className="flex items-center gap-2">
          {/* User Profile Pill — Avatar initial + name */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 ${
              isAdmin 
                ? 'bg-gradient-to-br from-indigo-600 to-purple-700' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-slate-900 dark:text-white text-xs block leading-tight">{user?.name || 'User'}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5">
                {user?.department || (isAdmin ? 'Municipal Dispatcher' : 'Community Resident')}
              </span>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Citizen Report Action */}
          {!isAdmin && (
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Report Hazard</span>
              <span className="sm:hidden">Report</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Sign out of CivicPulse"
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
