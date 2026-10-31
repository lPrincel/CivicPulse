import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300 ${
              isSuccess
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/60'
                : isError
                ? 'bg-red-950/90 text-red-100 border-red-700/60'
                : isWarning
                ? 'bg-amber-950/90 text-amber-100 border-amber-700/60'
                : 'bg-slate-900/90 text-slate-100 border-slate-700/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isError && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              
              <div>
                <p className="text-xs font-semibold">{toast.title}</p>
                {toast.message && <p className="text-[11px] opacity-80">{toast.message}</p>}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 opacity-60 hover:opacity-100 rounded-lg transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

