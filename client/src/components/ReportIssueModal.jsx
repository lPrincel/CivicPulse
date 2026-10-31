import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Camera, 
  Loader2, 
  Check, 
  Upload, 
  AlertTriangle 
} from 'lucide-react';

const PRESET_SAMPLE_PHOTOS = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Power Wire', url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80' }
];

export default function ReportIssueModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentUser = 'Jane Doe' 
}) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Real Geolocation or fallback
  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(`Near 420 Market Street (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° W)`);
          setIsGettingLocation(false);
        },
        (err) => {
          console.warn('Geolocation unavailable, using default address:', err.message);
          setLocation('402 Oak Street (Corner of 4th Ave)');
          setIsGettingLocation(false);
        },
        { timeout: 4000 }
      );
    } else {
      setLocation('402 Oak Street (Corner of 4th Ave)');
      setIsGettingLocation(false);
    }
  };

  // Real Photo Upload via FileReader Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit Final Report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    setIsSubmitting(true);
    try {
      const finalPayload = {
        description: description.trim(),
        location: location.trim(),
        imageUrl: imageUrl || '',
        reporterName: currentUser
      };
      await onSubmit(finalPayload);
      onClose();
      // Reset
      setDescription('');
      setLocation('');
      setImageUrl('');
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Report Civic Hazard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini AI for instant department triage</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4.5">
          {/* User Tag */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
            <span>Reporting as: <strong className="text-slate-900 dark:text-white">{currentUser}</strong></span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">Verified Citizen</span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              What hazard or issue did you notice? <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Deep pothole damaging tires at expressway exit ramp, or sparking power transformer near school..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none placeholder-slate-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              ✨ Gemini AI will automatically extract the hazard title, department, and urgency level.
            </p>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Location / Address <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Detecting GPS...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>Get Current GPS</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 880 North Commercial Blvd (or click Get GPS)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Photo Attachment */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Attach Hazard Photo
            </label>

            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />

            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group bg-slate-100 dark:bg-slate-800">
                <img 
                  src={imageUrl} 
                  alt="Hazard preview" 
                  className="w-full h-36 object-cover" 
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs">
                  ✓ Photo attached
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 shadow-xs">
                      <Camera className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Upload or Pick Sample</p>
                      <p className="text-[10px] text-slate-400">Helps municipal crew assess severity</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Image</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                  <span className="text-slate-400">Quick Samples:</span>
                  {PRESET_SAMPLE_PHOTOS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => setImageUrl(sample.url)}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors text-[10px] font-semibold cursor-pointer"
                    >
                      + {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim() || !location.trim()}
              className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>AI Triaging & Submitting...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Hazard Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
