import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Camera, 
  Loader2, 
  Check, 
  Upload, 
  AlertTriangle,
  ThumbsUp,
  Layers,
  ShieldAlert
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
  currentUser = 'Jane Doe',
  existingIssues = [],
  onEchoExisting
}) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedDuplicate, setDetectedDuplicate] = useState(null);
  
  const fileInputRef = useRef(null);

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

  /**
   * Smart Duplicate Detection Engine
   * Analyzes location proximity, category overlap, and semantic hazard keywords
   */
  const findPotentialDuplicate = (descText, locText) => {
    if (!existingIssues || existingIssues.length === 0) return null;

    const descLower = (descText || '').toLowerCase().trim();
    const locLower = (locText || '').toLowerCase().trim();

    if (descLower.length < 5 || locLower.length < 3) return null;

    // Filter to active unresolved issues
    const activeIssues = existingIssues.filter((i) => i.status !== 'Resolved');

    const hazardKeywords = [
      'pothole', 'road', 'asphalt', 'crater', 'sinkhole',
      'water', 'pipe', 'leak', 'flood', 'flooding', 'drain', 'hydrant',
      'wire', 'spark', 'sparking', 'electric', 'power', 'transformer', 'blackout', 'streetlight', 'light',
      'trash', 'garbage', 'dump', 'dumping', 'waste', 'dumpster',
      'tree', 'branch', 'sidewalk', 'walkway'
    ];

    const matchedKeywords = hazardKeywords.filter((kw) => descLower.includes(kw));

    // Extract significant location tokens (ignore short words like "near", "at", "the", "and")
    const ignoreWords = new Set(['near', 'corner', 'street', 'road', 'avenue', 'blvd', 'the', 'and', 'with', 'from']);
    const locTokens = locLower
      .replace(/[(),°NWES\d.]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !ignoreWords.has(w));

    for (const issue of activeIssues) {
      const issueDesc = (issue.description || '').toLowerCase();
      const issueLoc = (issue.location || '').toLowerCase();
      const issueTitle = (issue.title || '').toLowerCase();

      // Check location overlap
      const hasLocationMatch = locTokens.some((token) => issueLoc.includes(token));

      // Check keyword/category overlap
      const hasHazardMatch = matchedKeywords.some(
        (kw) => issueDesc.includes(kw) || issueTitle.includes(kw)
      );

      const hasCategoryMatch = issue.category && descLower.includes(issue.category.toLowerCase());

      if (hasLocationMatch && (hasHazardMatch || hasCategoryMatch)) {
        return issue;
      }
    }

    return null;
  };

  // Perform Final Submission
  const executeSubmit = async () => {
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
      setDetectedDuplicate(null);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Handler with Duplicate Interception
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    // Check for nearby duplicates before creating a redundant ticket
    const duplicate = findPotentialDuplicate(description, location);
    if (duplicate) {
      setDetectedDuplicate(duplicate);
      return;
    }

    await executeSubmit();
  };

  const handleClose = () => {
    setDetectedDuplicate(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">Report Civic Hazard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Powered by Gemini AI · Smart Duplicate Prevention</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DUPLICATE INTERCEPTOR SCREEN */}
        {detectedDuplicate ? (
          <div className="p-6 space-y-5 animate-in fade-in zoom-in duration-200 overflow-y-auto">
            {/* Warning Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-900 dark:text-amber-300">
                  Similar Incident Already Reported Nearby!
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                  A citizen has already logged a matching hazard near this location. Submitting another ticket creates duplicate backlogs for municipal crews.
                </p>
              </div>
            </div>

            {/* Existing Issue Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-start gap-3.5">
                {detectedDuplicate.imageUrl ? (
                  <img 
                    src={detectedDuplicate.imageUrl} 
                    alt="Existing hazard" 
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-400">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                )}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      {detectedDuplicate.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500/20 text-red-600 dark:text-red-400">
                      {detectedDuplicate.urgency}
                    </span>
                    <span className="text-xs text-slate-400">· {detectedDuplicate.status}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {detectedDuplicate.title}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{detectedDuplicate.location}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Reported by: <strong className="text-slate-700 dark:text-slate-300">{detectedDuplicate.reporterName}</strong></span>
                <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{detectedDuplicate.upvotes || 1} Community Echoes</span>
                </span>
              </div>
            </div>

            {/* Smart Tip */}
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-blue-500/5 border border-blue-500/15 rounded-2xl p-4 leading-relaxed">
              💡 <strong>Why Echoing Works Better:</strong> When multiple citizens echo the same hazard, CivicPulse automatically escalates its urgency (5+ echoes → High, 10+ echoes → Emergency), putting it at the top of City Hall's dispatch queue!
            </div>

            {/* Decision Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  if (onEchoExisting) {
                    onEchoExisting(detectedDuplicate._id);
                  }
                  handleClose();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Echo Existing Hazard (+1 Community Priority)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDetectedDuplicate(null);
                  executeSubmit();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-all cursor-pointer text-center"
              >
                No, this is a separate hazard (Submit as New Ticket)
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD REPORT FORM */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* User Tag */}
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-400">
              <span>Reporting as: <strong className="text-slate-900 dark:text-white">{currentUser}</strong></span>
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/15">
                Verified Citizen
              </span>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                What hazard or issue did you notice? <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Deep pothole damaging tires at expressway exit ramp, or sparking power transformer near school..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500/50 transition-all resize-none placeholder-slate-400"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Gemini AI will categorize the department & evaluate urgency automatically.
              </p>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Location / Address <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className={`text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all px-3 py-1.5 rounded-xl ${
                    isGettingLocation
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'bg-blue-500/10 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5" />
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
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500/50 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Photo Attachment */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                    className="w-full h-40 object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors cursor-pointer shadow-md"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[11px] font-semibold backdrop-blur-sm flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Photo attached
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400/40 dark:hover:border-blue-500/30 transition-all flex flex-col gap-3">
                  {/* Upload area */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                        <Camera className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload or Pick Sample</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Helps municipal crew assess severity</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-blue-400/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Image</span>
                    </button>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                    <span className="text-slate-400 shrink-0">Quick Samples:</span>
                    {PRESET_SAMPLE_PHOTOS.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => setImageUrl(sample.url)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-[10px] font-bold cursor-pointer"
                      >
                        + {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim() || !location.trim()}
                className="flex-2 flex-grow py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
        )}
      </div>
    </div>
  );
}
