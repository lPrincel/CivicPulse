import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Zap } from 'lucide-react';

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        const iconBg = isSuccess
          ? 'bg-emerald-500/20'
          : isError
          ? 'bg-red-500/20'
          : isWarning
          ? 'bg-amber-500/20'
          : 'bg-blue-500/20';

        const borderAccent = isSuccess
          ? 'border-l-emerald-500'
          : isError
          ? 'border-l-red-500'
          : isWarning
          ? 'border-l-amber-500'
          : 'border-l-blue-500';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 pl-3 pr-4 py-3 rounded-2xl shadow-2xl border border-l-4 backdrop-blur-xl transition-all animate-in slide-in-from-bottom-5 duration-300 ${borderAccent} ${
              isSuccess
                ? 'bg-slate-950/95 text-emerald-100 border-slate-800/60'
                : isError
                ? 'bg-slate-950/95 text-red-100 border-slate-800/60'
                : isWarning
                ? 'bg-slate-950/95 text-amber-100 border-slate-800/60'
                : 'bg-slate-950/95 text-slate-100 border-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Icon circle */}
              <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isError && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-blue-400" />}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight truncate">{toast.title}</p>
                {toast.message && (
                  <p className="text-[11px] opacity-70 mt-0.5 leading-snug line-clamp-2">{toast.message}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1.5 opacity-50 hover:opacity-100 rounded-lg transition-opacity shrink-0 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
