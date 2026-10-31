import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Droplet, 
  Trash2, 
  ShieldAlert,
  Loader2,
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
  Emergency: 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-500/20',
  High: 'bg-amber-50 text-amber-700 border-amber-300',
  Medium: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-300'
};

export default function ReportIssueModal({ isOpen, onClose, onSubmit, onTriage }) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [isTriaging, setIsTriaging] = useState(false);
  const [triageResult, setTriageResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRunTriage = async () => {
    if (!description.trim()) return;
    setIsTriaging(true);
    try {
      const result = await onTriage(description, location);
      setTriageResult(result);
    } catch (err) {
      console.error('Triage failed:', err);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    setIsSubmitting(true);
    try {
      const finalPayload = {
        title: triageResult?.title || description.slice(0, 40) + '...',
        description,
        location,
        category: triageResult?.category || 'Safety',
        urgency: triageResult?.urgency || 'Medium',
        aiSummary: triageResult?.aiSummary || 'Issue reported directly by citizen.'
      };
      await onSubmit(finalPayload);
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setLocation('GPS: 37.7749° N, 122.4194° W (Near 4th & Market)');
  };

  const CategoryIcon = triageResult?.category ? CATEGORY_ICONS[triageResult.category] || AlertTriangle : AlertTriangle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">Report Civic Hazard</h3>
              <p className="text-xs text-slate-500">AI auto-triage classifies urgency and municipal department</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFinalSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Issue Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              What hazard or issue did you notice? <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (triageResult) setTriageResult(null); // reset preview on edit
              }}
              placeholder="e.g. Broken streetlight on corner pole sparking in the rain, pedestrian crosswalk is completely dark..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Location Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">
                Location / Landmark <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" /> Use Current GPS
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 502 Oak Street (Corner of 4th Ave)"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Mock Photo Attachment */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-xs">
                <Camera className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">
                  {photoAttached ? 'hazard_photo_attached.jpg' : 'Attach hazard photo'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {photoAttached ? 'Simulated image verified' : 'Optional: helps field inspectors assess severity'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPhotoAttached(!photoAttached)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                photoAttached 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {photoAttached ? '✓ Attached' : 'Attach Photo'}
            </button>
          </div>

          {/* AI Auto-Triage Trigger / Status */}
          {!triageResult && (
            <button
              type="button"
              onClick={handleRunTriage}
              disabled={!description.trim() || isTriaging}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                description.trim()
                  ? 'bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:opacity-95 hover:shadow-lg cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              {isTriaging ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI analyzing severity, category & dispatch priority...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Run AI Auto-Triage (Preview Analysis)</span>
                </>
              )}
            </button>
          )}

          {/* AI Triage Result Box (Judge Wow Factor!) */}
          {triageResult && (
            <div className="p-4 rounded-xl bg-linear-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  AI Triage Assessment
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${URGENCY_STYLES[triageResult.urgency] || 'bg-slate-100'}`}>
                  {triageResult.urgency} Urgency
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">Auto-Generated Title:</p>
                <p className="text-sm font-semibold text-slate-800">{triageResult.title}</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CategoryIcon className="w-4 h-4 text-indigo-600" />
                  <span>Category: <strong>{triageResult.category}</strong></span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/80 border border-indigo-100/60 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-indigo-900">🤖 Dispatch Briefing: </span>
                {triageResult.aiSummary}
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim() || !location.trim()}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm & Dispatch Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
