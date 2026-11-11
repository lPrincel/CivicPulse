import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Sun, 
  Moon,
  Loader2,
  AlertCircle,
  Radio,
  Zap,
  MapPin,
  Bell
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

const FEATURES = [
  {
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    title: 'AI-Powered Triage',
    desc: 'Gemini AI categorizes and routes every hazard to the right municipal department in milliseconds.'
  },
  {
    icon: MapPin,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    title: 'Real-Time GIS Mapping',
    desc: 'Live OpenStreetMap integration pins incidents across your city with GPS precision.'
  },
  {
    icon: Bell,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    title: 'Community Escalation',
    desc: 'Five or more community echoes automatically escalates a hazard to City Hall\'s priority queue.'
  }
];

export default function AuthPage({ onAuthSuccess, isDark, onToggleDark }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('citizen'); // 'citizen' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Emergency Dispatch');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser({ email, password });
        if (res.token) {
          onAuthSuccess(res);
        } else {
          setError(res.error || 'Login failed. Please check credentials.');
        }
      } else {
        const res = await registerUser({ name, email, password, role, department });
        if (res.token) {
          onAuthSuccess(res);
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Auto-Logins for Judges
  const handleQuickDemo = async (demoRole) => {
    setIsLoading(true);
    setError('');
    try {
      if (demoRole === 'citizen') {
        const res = await loginUser({ email: 'citizen@civicpulse.org', password: 'citizen123' });
        onAuthSuccess(res);
      } else {
        const res = await loginUser({ email: 'admin@cityhall.gov', password: 'admin123' });
        onAuthSuccess(res);
      }
    } catch (err) {
      setError('Demo login fallback error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      {/* Top Bar */}
      <header className="px-6 lg:px-12 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">CivicPulse</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-0.5">Municipal AI Infrastructure</span>
          </div>
        </div>

        <button
          onClick={onToggleDark}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:shadow-sm cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </header>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex items-stretch">
        {/* Left Panel — Branding (hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-between w-[46%] xl:w-[42%] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 xl:p-14 relative overflow-hidden">
          {/* Ambient glows */}
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

          {/* Top badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Smart City Platform · Live</span>
            </div>
          </div>

          {/* Center headline */}
          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Your city.<br />
              <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                Your voice.
              </span>
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed max-w-sm">
              CivicPulse connects citizens directly to municipal dispatch — turning neighborhood hazards into actionable city-wide intelligence.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 pt-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-xl ${f.bg} border border-white/10 flex items-center justify-center shrink-0`}>
                    <f.icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{f.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer trust signal */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-end encrypted · ISO 27001 compliant</span>
          </div>
        </div>

        {/* Right Panel — Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50 dark:bg-slate-950">
          <div className="w-full max-w-md space-y-6">
            {/* Mobile brand */}
            <div className="lg:hidden text-center space-y-1 mb-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">CivicPulse AI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Municipal Hazard Dispatch Platform</p>
            </div>

            {/* Auth Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
              {/* Card Header */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isLogin ? 'Sign in to your citizen dashboard or municipal dispatch console' : 'Join your local civic community network'}
                </p>
              </div>

              <div className="px-8 py-6 space-y-5">
                {/* Sign In vs Sign Up Tabs */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(''); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      isLogin 
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(''); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      !isLogin 
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* If Sign Up: Choose Account Role */}
                  {!isLogin && (
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Select Account Type
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setRole('citizen')}
                          className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                            role === 'citizen'
                              ? 'border-blue-500 bg-blue-500/8 dark:bg-blue-500/10 shadow-sm shadow-blue-500/10'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${role === 'citizen' ? 'bg-blue-500/15' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <Users className={`w-3.5 h-3.5 ${role === 'citizen' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                          </div>
                          <span className={`text-xs font-bold ${role === 'citizen' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>Citizen Resident</span>
                          <span className="text-[10px] text-slate-400 leading-tight">Report & track neighborhood hazards</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRole('admin')}
                          className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                            role === 'admin'
                              ? 'border-indigo-500 bg-indigo-500/8 dark:bg-indigo-500/10 shadow-sm shadow-indigo-500/10'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${role === 'admin' ? 'bg-indigo-500/15' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <Building2 className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                          </div>
                          <span className={`text-xs font-bold ${role === 'admin' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>City Hall Admin</span>
                          <span className="text-[10px] text-slate-400 leading-tight">Dispatch crews & triage tickets</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* If Sign Up: Name */}
                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-wide">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* If Sign Up as Admin: Department */}
                  {!isLogin && role === 'admin' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-wide">
                        Municipal Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer"
                      >
                        <option value="Emergency Dispatch">Emergency Dispatch</option>
                        <option value="Public Works & Roads">Public Works & Roads</option>
                        <option value="Water Department">Water Department</option>
                        <option value="Electrical Grid">Electrical Grid</option>
                        <option value="Sanitation & Waste">Sanitation & Waste</option>
                      </select>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-wide">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="name@civicpulse.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{isLogin ? 'Sign In to CivicPulse' : 'Create Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Demo Credentials Box */}
                <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>One-Click Demo Access:</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('citizen')}
                      disabled={isLoading}
                      className="py-3 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-400/40 dark:hover:border-blue-500/30"
                    >
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Citizen (Jane)</span>
                      <span className="text-[10px] text-slate-400 font-normal">citizen@civicpulse.org</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemo('admin')}
                      disabled={isLoading}
                      className="py-3 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-indigo-400/40 dark:hover:border-indigo-500/30"
                    >
                      <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Admin (Officer Davis)</span>
                      <span className="text-[10px] text-slate-400 font-normal">admin@cityhall.gov</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
        CivicPulse Smart Cities • Emergency Hazard Dispatch System
      </footer>
    </div>
  );
}
