import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Eye, EyeOff, Award, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { RegisteredUser, UserProfile, SukiAccount } from '../types';
import { createBlankUserProfile, createBlankSukiAccount } from '../mockData';

interface UserAuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  message?: string;
  onClose: () => void;
  onLoginSuccess: (user: RegisteredUser) => void;
  registeredUsers?: RegisteredUser[];
  onSyncRegisteredUsers?: (users: RegisteredUser[]) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  message,
  onClose,
  onLoginSuccess,
  registeredUsers = [],
  onSyncRegisteredUsers
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regIdType, setRegIdType] = useState('philsys_national_id');
  const [regIdNumber, setRegIdNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Load existing registered users from storage or cloud store
  const getRegisteredUsers = (): RegisteredUser[] => {
    let localUsers: RegisteredUser[] = [];
    try {
      const saved = localStorage.getItem('mtth_registered_users');
      if (saved) localUsers = JSON.parse(saved);
    } catch {}

    const map = new Map<string, RegisteredUser>();
    [...registeredUsers, ...localUsers].forEach(u => {
      if (u && u.email) map.set(u.email.toLowerCase(), u);
    });
    return Array.from(map.values());
  };

  const saveRegisteredUsers = (users: RegisteredUser[]) => {
    try {
      localStorage.setItem('mtth_registered_users', JSON.stringify(users));
    } catch {}
    if (onSyncRegisteredUsers) {
      onSyncRegisteredUsers(users);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      setErrorMsg('No account found with this email. Please register to create an account.');
      return;
    }

    if (existing.password !== cleanPass) {
      setErrorMsg('Incorrect password. Please verify your credentials and try again.');
      return;
    }

    setSuccessMsg(`Welcome back, ${existing.fullName}!`);
    setTimeout(() => {
      onLoginSuccess(existing);
      onClose();
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = regFullName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPhone = regPhone.trim();
    const cleanPass = regPassword.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('Please provide a valid mobile contact number.');
      return;
    }
    if (!cleanPass || cleanPass.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (cleanPass !== regConfirmPassword.trim()) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      setErrorMsg('An account with this email address already exists. Please log in instead.');
      return;
    }

    const newUserId = `user-${Date.now()}`;
    const userProfile = createBlankUserProfile(newUserId, cleanName, cleanEmail, cleanPhone);
    if (regIdNumber) {
      userProfile.kyc.idType = regIdType;
      userProfile.kyc.idNumber = regIdNumber.trim();
      userProfile.kyc.status = 'unverified';
    }
    const sukiAccount = createBlankSukiAccount(newUserId, cleanName, cleanEmail);

    const newUser: RegisteredUser = {
      id: newUserId,
      email: cleanEmail,
      password: cleanPass,
      fullName: cleanName,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      phone: cleanPhone,
      createdAt: new Date().toISOString(),
      userProfile,
      sukiAccount
    };

    const updatedUsers = [newUser, ...users];
    saveRegisteredUsers(updatedUsers);

    setSuccessMsg(`Account created successfully! 100 Welcome Suki points credited.`);
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
              MTTH
            </span>
            <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">Traveler Access</span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create Traveler Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {message || 'Manage bookings, earn Suki Rewards, and purchase tickets across Mindanao.'}
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 bg-slate-800/80 p-1 rounded-xl mt-4 border border-slate-700/60">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white text-slate-950 shadow-md' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                mode === 'register' 
                  ? 'bg-teal-500 text-white shadow-md' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. traveler@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Sign In & Continue</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                New to Mindanao Ticket Hub?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-teal-600 hover:text-teal-700 font-bold underline cursor-pointer"
                >
                  Create an account
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Full Legal Name (as on ID)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan Carlos Cruz"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+63 9XX XXX XXXX"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ID Details for Travel Authorization */}
              <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-teal-900 font-extrabold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Philippine Travel ID (Optional Now, Needed for KYC)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={regIdType}
                    onChange={(e) => setRegIdType(e.target.value)}
                    className="p-1.5 bg-white border border-teal-200 rounded-lg text-xs font-medium text-slate-800 outline-none"
                  >
                    <option value="philsys_national_id">PhilSys National ID</option>
                    <option value="ph_passport">Philippine Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="umid">UMID</option>
                    <option value="postal_id">Postal ID</option>
                  </select>

                  <input
                    type="text"
                    placeholder="ID Number (optional)"
                    value={regIdNumber}
                    onChange={(e) => setRegIdNumber(e.target.value)}
                    className="p-1.5 bg-white border border-teal-200 rounded-lg text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-medium">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You will automatically receive <strong>100 Suki Points</strong> upon registration!</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Complete Registration & Sign In</span>
                <ArrowRight className="w-4 h-4 text-teal-200" />
              </button>

              <div className="text-center text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-teal-600 hover:text-teal-700 font-bold underline cursor-pointer"
                >
                  Log in here
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
