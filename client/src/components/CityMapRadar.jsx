import React, { useState } from 'react';
import { 
  MapPin, 
  Flame, 
  Sparkles, 
  Layers, 
  Navigation, 
  ShieldAlert, 
  Zap, 
  Droplet, 
  Trash2, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Crosshair
} from 'lucide-react';

const CATEGORY_COLORS = {
  Electricity: '#f59e0b',
  Water: '#3b82f6',
  Roads: '#ef4444',
  Sanitation: '#10b981',
  Safety: '#8b5cf6'
};

// Simulated city grid coordinates for realistic visual positioning
const MOCK_MAP_PINS = [
  { x: 28, y: 35, category: 'Electricity', urgency: 'Emergency' },
  { x: 62, y: 25, category: 'Water', urgency: 'Emergency' },
  { x: 45, y: 55, category: 'Roads', urgency: 'High' },
  { x: 78, y: 65, category: 'Sanitation', urgency: 'Medium' },
  { x: 20, y: 75, category: 'Safety', urgency: 'Medium' },
  { x: 85, y: 40, category: 'Electricity', urgency: 'Low' },
  { x: 50, y: 82, category: 'Roads', urgency: 'High' },
  { x: 38, y: 18, category: 'Sanitation', urgency: 'High' }
];

export default function CityMapRadar({ issues = [], onSelectIssue }) {
  const [selectedPinIndex, setSelectedPinIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedIssue = issues[selectedPinIndex] || issues[0];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-900 shadow-2xl text-white">
      {/* Map Top Overlay Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-bold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Hyperlocal City GIS Grid</span>
          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded-md bg-white/10">Active Radar</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
          className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
          className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Stylized Dark Vector City Map Background */}
      <div 
        className="relative w-full h-[380px] sm:h-[440px] bg-slate-950 overflow-hidden select-none transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Subtle Map Vector Roads & River */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* River */}
          <path d="M 0,220 C 300,180 500,280 800,210 C 1100,140 1300,240 1600,190" fill="none" stroke="#3b82f6" strokeWidth="28" strokeLinecap="round" opacity="0.3" />
          <path d="M 0,220 C 300,180 500,280 800,210 C 1100,140 1300,240 1600,190" fill="none" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
          
          {/* Major Highways */}
          <line x1="100" y1="0" x2="600" y2="500" stroke="#475569" strokeWidth="6" strokeDasharray="10 4" />
          <line x1="0" y1="120" x2="1600" y2="160" stroke="#475569" strokeWidth="8" />
          <line x1="0" y1="360" x2="1600" y2="340" stroke="#475569" strokeWidth="6" />
          <line x1="400" y1="0" x2="400" y2="600" stroke="#334155" strokeWidth="5" />
          <line x1="850" y1="0" x2="850" y2="600" stroke="#334155" strokeWidth="5" />
          
          {/* Grid Blocks */}
          <rect x="180" y="40" width="160" height="90" fill="#1e293b" rx="8" opacity="0.5" />
          <rect x="440" y="50" width="180" height="80" fill="#1e293b" rx="8" opacity="0.4" />
          <rect x="220" y="270" width="140" height="120" fill="#1e293b" rx="8" opacity="0.4" />
          <rect x="480" y="260" width="220" height="90" fill="#1e293b" rx="8" opacity="0.5" />
          <rect x="740" y="80" width="180" height="110" fill="#1e293b" rx="8" opacity="0.4" />
          <rect x="750" y="250" width="200" height="120" fill="#1e293b" rx="8" opacity="0.5" />
        </svg>

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

        {/* Pulsing Radar Ring Sweep */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-blue-500/20 pointer-events-none animate-ping duration-1000"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-blue-500/30 pointer-events-none"></div>

        {/* Interactive Hazard Pinned Markers */}
        {issues.map((issue, index) => {
          const pinPos = MOCK_MAP_PINS[index % MOCK_MAP_PINS.length];
          const isSelected = selectedPinIndex === index;
          const isEmergency = issue.urgency === 'Emergency';
          const isHigh = issue.urgency === 'High';
          
          const markerColor = isEmergency ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-blue-500';

          return (
            <div
              key={issue._id || index}
              onClick={() => {
                setSelectedPinIndex(index);
                if (onSelectIssue) onSelectIssue(issue);
              }}
              style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115'
              }`}
            >
              {/* Outer pulsing ring for emergency */}
              {isEmergency && (
                <div className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping"></div>
              )}

              {/* Pin Icon / Marker Pill */}
              <div className={`relative px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-xl flex items-center gap-1 border border-white/20 backdrop-blur-md transition-all ${
                isSelected 
                  ? 'bg-blue-600 ring-4 ring-blue-500/40 ring-offset-2 ring-offset-slate-950' 
                  : isEmergency 
                  ? 'bg-red-600 ring-2 ring-red-500/50' 
                  : 'bg-slate-900/90 hover:bg-slate-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${markerColor}`}></span>
                <span className="hidden sm:inline-block max-w-[90px] truncate">{issue.category}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Hazard Interactive Drawer at Bottom */}
      {selectedIssue && (
        <div className="p-4 sm:p-5 bg-slate-950/95 border-t border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            {selectedIssue.imageUrl && (
              <img 
                src={selectedIssue.imageUrl} 
                alt="Hazard preview" 
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/15" 
              />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  selectedIssue.urgency === 'Emergency'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                    : selectedIssue.urgency === 'High'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                }`}>
                  {selectedIssue.urgency}
                </span>

                <span className="text-xs text-slate-400 font-semibold">{selectedIssue.category}</span>
                <span className="text-[11px] text-slate-500">• {selectedIssue.status}</span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">
                {selectedIssue.title}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate max-w-xs">{selectedIssue.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-slate-400 hidden md:inline">
              Reported by <strong>{selectedIssue.reporterName || 'Citizen'}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
