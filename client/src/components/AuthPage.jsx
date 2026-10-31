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
  AlertCircle
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar */}
      <header className="px-6 lg:px-12 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight">CivicPulse</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-0.5">Municipal AI Infrastructure</span>
          </div>
        </div>

        <button
          onClick={onToggleDark}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-xs"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
            {/* Header Titles */}
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {isLogin ? 'Sign in to CivicPulse' : 'Create your account'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isLogin ? 'Access your citizen dashboard or municipal dispatch console' : 'Join your local civic community network'}
              </p>
            </div>

            {/* Sign In vs Sign Up Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isLogin 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  !isLogin 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* If Sign Up: Choose Account Role */}
              {!isLogin && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('citizen')}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        role === 'citizen'
                          ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-bold">Citizen Resident</span>
                      <span className="text-[10px] text-slate-400">Report & track neighborhood hazards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        role === 'admin'
                          ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="text-xs font-bold">City Hall Admin</span>
                      <span className="text-[10px] text-slate-400">Dispatch crews & triage tickets</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If Sign Up: Name */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              )}

              {/* If Sign Up as Admin: Department */}
              {!isLogin && role === 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Municipal Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@civicpulse.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Box (Judge Lifesaver!) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>One-Click Hackathon Evaluator Login:</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/80 dark:border-slate-700"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Citizen (Jane)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/80 dark:border-slate-700"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Admin (Officer Davis)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
        CivicPulse Smart Cities • Emergency Hazard Dispatch System
      </footer>
    </div>
  );
}
