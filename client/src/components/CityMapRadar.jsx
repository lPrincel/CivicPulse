import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Crosshair, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  Compass, 
  Radio, 
  ExternalLink,
  ChevronDown,
  Globe2
} from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'My Current Location (GPS)', lat: null, lng: null },
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru, India', lat: 12.9716, lng: 77.5946 },
  { name: 'New York City, USA', lat: 40.7128, lng: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 }
];

// Color palette for category pins
const CATEGORY_COLORS = {
  Electricity: '#f59e0b',
  Water: '#3b82f6',
  Roads: '#ef4444',
  Sanitation: '#10b981',
  Safety: '#8b5cf6'
};

export default function CityMapRadar({ issues = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Auto-detect dark mode and re-theme tiles dynamically
  const [isDark, setIsDark] = useState(() => {
    return typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [currentCityName, setCurrentCityName] = useState('My Current Location (GPS)');
  const [selectedIssue, setSelectedIssue] = useState(issues[0] || null);
  const [centerCoords, setCenterCoords] = useState([28.6139, 77.2090]); // Default fallback
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);

  // Initialize GPS on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsDetectingGPS(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCenterCoords(coords);
          setIsDetectingGPS(false);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(coords, 14, { duration: 1.5 });
          }
        },
        () => {
          setIsDetectingGPS(false);
        },
        { timeout: 4000 }
      );
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof window === 'undefined' || !window.L) return;

    const L = window.L;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: centerCoords,
      zoom: 13,
      zoomControl: false // custom position
    });
    mapInstanceRef.current = map;

    // Add zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // 100% Free OpenStreetMap Standard Tiles (Zero API Key, Zero Watermarks)
    // Dark mode is styled with sleek GPU-accelerated CSS filters in index.css
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution
    }).addTo(map);

    // Layer group for issue markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when issues or center change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !window.L) return;

    const L = window.L;
    markersLayerRef.current.clearLayers();

    // Scatter offsets for demo issues around the active center
    const offsets = [
      [0.008, 0.012],
      [-0.011, 0.009],
      [0.014, -0.015],
      [-0.007, -0.011],
      [0.018, 0.004],
      [-0.016, -0.006],
      [0.005, -0.019],
      [-0.003, 0.018]
    ];

    issues.forEach((issue, index) => {
      const offset = offsets[index % offsets.length];
      const issueLat = centerCoords[0] + offset[0];
      const issueLng = centerCoords[1] + offset[1];

      const isEmergency = issue.urgency === 'Emergency';
      const isHigh = issue.urgency === 'High';
      const color = CATEGORY_COLORS[issue.category] || '#3b82f6';

      // Custom animated HTML Marker
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isEmergency ? '<div class="absolute -inset-2 rounded-full bg-red-500/50 animate-ping"></div>' : ''}
          <div style="background-color: ${color};" class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg ring-2 ring-white dark:ring-slate-900 transition-transform group-hover:scale-125">
            ${isEmergency ? '!' : '📍'}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([issueLat, issueLng], { icon: customIcon });

      // Rich interactive Popup
      const popupHtml = `
        <div class="p-2 min-w-[210px] font-sans text-slate-900">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span style="background-color: ${color}20; color: ${color};" class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-current">
              ${issue.category}
            </span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${isEmergency ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}">
              ${issue.urgency}
            </span>
          </div>
          ${issue.imageUrl ? `<img src="${issue.imageUrl}" class="w-full h-20 object-cover rounded-lg mb-2" />` : ''}
          <h4 class="font-bold text-xs leading-snug mb-1">${issue.title}</h4>
          <p class="text-[11px] text-slate-500 mb-1 leading-relaxed line-clamp-2">${issue.description}</p>
          <div class="text-[10px] text-slate-400 font-medium">📍 ${issue.location}</div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'civicpulse-leaflet-popup'
      });

      marker.on('click', () => {
        setSelectedIssue(issue);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [issues, centerCoords]);

  // Handle City Dropdown Change
  const handleCitySelect = (city) => {
    setCurrentCityName(city.name);

    if (city.lat && city.lng) {
      const coords = [city.lat, city.lng];
      setCenterCoords(coords);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(coords, 13, { duration: 1.8 });
      }
    } else {
      // Re-trigger GPS
      if ('geolocation' in navigator) {
        setIsDetectingGPS(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = [pos.coords.latitude, pos.coords.longitude];
            setCenterCoords(coords);
            setIsDetectingGPS(false);
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo(coords, 14, { duration: 1.5 });
            }
          },
          () => setIsDetectingGPS(false)
        );
      }
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(centerCoords, 14, { duration: 1.2 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-900 shadow-2xl text-white">
      {/* Top Overlay Controls: City Selector & Live GIS Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        {/* City Switcher Dropdown */}
        <div className="relative">
          <select
            value={currentCityName}
            onChange={(e) => {
              const selected = POPULAR_CITIES.find(c => c.name === e.target.value);
              if (selected) handleCitySelect(selected);
            }}
            className="px-3.5 py-2 pr-8 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
          >
            {POPULAR_CITIES.map((city) => (
              <option key={city.name} value={city.name} className="bg-slate-900 text-white">
                {city.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>

        {/* Live OpenStreetMap GIS Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-xs font-bold shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>OpenStreetMap GIS</span>
          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded-md bg-white/10">Zero API Key</span>
        </div>
      </div>

      {/* Recenter Button (Top-Right) */}
      <div className="absolute top-4 right-14 z-20">
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-xl bg-slate-950/85 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white transition-colors cursor-pointer shadow-xl flex items-center gap-1.5 text-xs font-bold"
          title="Recenter Map"
        >
          <Crosshair className={`w-4 h-4 text-blue-400 ${isDetectingGPS ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Recenter</span>
        </button>
      </div>

      {/* The Real Leaflet OpenStreetMap Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[420px] sm:h-[480px] z-10 select-none bg-slate-950"
      />

      {/* Selected Incident Drawer at Bottom */}
      {selectedIssue && (
        <div className="p-4 sm:p-5 bg-slate-950/95 border-t border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 relative">
          <div className="flex items-start sm:items-center gap-3.5">
            {selectedIssue.imageUrl && (
              <img 
                src={selectedIssue.imageUrl} 
                alt="Hazard preview" 
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/15 shadow-sm" 
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

                <span className="text-xs text-slate-300 font-bold">{selectedIssue.category}</span>
                <span className="text-[11px] text-slate-400">• {selectedIssue.status}</span>
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
