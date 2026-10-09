import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AdminSession, SubAdmin } from '../types';

interface AdminLoginScreenProps {
  onLoginSuccess: (session: AdminSession) => void;
  onBackToSite: () => void;
  subAdmins?: SubAdmin[];
  siteName?: string;
  siteSubtitle?: string;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLoginSuccess,
  onBackToSite,
  subAdmins = [],
  siteName = 'MTTH',
  siteSubtitle = 'Mindanao'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const SUPER_ADMINS: Record<string, string> = {
    'markkennethulgasan@gmail.com': 'Mark Kenneth Ulgasan',
    'jonhlim12432@gmail.com': 'Jonh Lim'
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    setTimeout(() => {
      // 1. Check Super Admin credential
      if (SUPER_ADMINS[cleanEmail]) {
        const session: AdminSession = {
          email: cleanEmail,
          name: SUPER_ADMINS[cleanEmail],
          role: 'Super Admin',
          token: `mtth-admin-super-${Date.now()}`,
          loggedInAt: new Date().toISOString()
        };
        onLoginSuccess(session);
        setIsLoading(false);
        return;
      }

      // 2. Check Sub-Admins in store
      const subAdminMatch = subAdmins.find(sa => sa.email.toLowerCase() === cleanEmail && sa.status === 'Active');
      if (subAdminMatch) {
        const session: AdminSession = {
          email: subAdminMatch.email,
          name: subAdminMatch.name,
          role: subAdminMatch.role,
          token: `mtth-subadmin-${subAdminMatch.id}-${Date.now()}`,
          loggedInAt: new Date().toISOString()
        };
        onLoginSuccess(session);
        setIsLoading(false);
        return;
      }

      setErrorMsg('Invalid administrative credentials. Access restricted to authorized personnel.');
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Top brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-amber-400 text-slate-950 shadow-xl mb-1">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {siteName} <span className="text-teal-400">Admin CMS</span>
          </h1>
          <p className="text-xs text-slate-400">
            Authorized administrative access for {siteName} {siteSubtitle} management.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@mtth.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 font-medium focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 font-medium focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-teal-900/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="pt-2 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={onBackToSite}
            className="text-xs text-slate-400 hover:text-teal-400 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Travel Portal</span>
          </button>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-slate-500 mt-6 relative z-10">
        © 2026 {siteName} Mindanao Travel Ticketing Hub • Restricted Access
      </div>
    </div>
  );
};
