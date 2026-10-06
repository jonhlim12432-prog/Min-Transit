import React, { useState } from 'react';
import { UserProfile, SukiAccount, KycVerification, KycStatus } from '../types';
import { 
  X, Award, User, Mail, ShieldCheck, Ticket, CheckCircle2, 
  AlertCircle, Clock, FileText, Camera, Upload, Phone, 
  MapPin, Calendar, Lock, Check, Sparkles, RefreshCw
} from 'lucide-react';

interface ProfileModalProps {
  userProfile: UserProfile;
  sukiAccount: SukiAccount;
  initialTab?: 'info' | 'kyc' | 'settings' | 'suki';
  onClose: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onQuickVerifyKyc?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  userProfile, 
  sukiAccount, 
  initialTab = 'info', 
  onClose,
  onUpdateProfile,
  onQuickVerifyKyc
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'kyc' | 'settings' | 'suki'>(initialTab);
  
  // Local form state for Personal Info
  const [formData, setFormData] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    fullName: userProfile.fullName,
    email: userProfile.email,
    phone: userProfile.phone,
    dob: userProfile.dob,
    gender: userProfile.gender,
    nationality: userProfile.nationality,
    street: userProfile.address.street,
    city: userProfile.address.city,
    province: userProfile.address.province,
    region: userProfile.address.region,
    zipCode: userProfile.address.zipCode,
    emergencyName: userProfile.emergencyContact.name,
    emergencyPhone: userProfile.emergencyContact.phone,
    emergencyRelationship: userProfile.emergencyContact.relationship
  });

  // Local form state for KYC Verification
  const [kycForm, setKycForm] = useState({
    idType: userProfile.kyc.idType || 'philsys_national_id',
    idNumber: userProfile.kyc.idNumber || '4829-1092-3849',
    frontUploaded: !!userProfile.kyc.frontIdUrl,
    backUploaded: !!userProfile.kyc.backIdUrl,
    selfieUploaded: !!userProfile.kyc.selfieUrl
  });

  // Local settings state
  const [settingsForm, setSettingsForm] = useState({
    seatPreference: userProfile.travelPreferences.seatPreference,
    specialAssistance: userProfile.travelPreferences.specialAssistance,
    preferredBusClass: userProfile.travelPreferences.preferredBusClass,
    preferredFerryClass: userProfile.travelPreferences.preferredFerryClass,
    emailTripUpdates: userProfile.notificationSettings.emailTripUpdates,
    smsDepartureAlerts: userProfile.notificationSettings.smsDepartureAlerts,
    promotionalOffers: userProfile.notificationSettings.promotionalOffers,
    twoFactorAuth: true
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Handle saving personal info
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender,
      nationality: formData.nationality,
      address: {
        street: formData.street,
        city: formData.city,
        province: formData.province,
        region: formData.region,
        zipCode: formData.zipCode
      },
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relationship: formData.emergencyRelationship
      }
    };
    onUpdateProfile(updated);
    setSaveSuccessMsg('Profile information updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Handle saving settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      travelPreferences: {
        ...userProfile.travelPreferences,
        seatPreference: settingsForm.seatPreference,
        specialAssistance: settingsForm.specialAssistance,
        preferredBusClass: settingsForm.preferredBusClass,
        preferredFerryClass: settingsForm.preferredFerryClass
      },
      notificationSettings: {
        emailTripUpdates: settingsForm.emailTripUpdates,
        smsDepartureAlerts: settingsForm.smsDepartureAlerts,
        promotionalOffers: settingsForm.promotionalOffers
      }
    };
    onUpdateProfile(updated);
    setSaveSuccessMsg('Travel preferences and settings saved!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Submit KYC for review
  const handleSubmitKyc = (instant = false) => {
    const isInstant = instant;
    const updatedKyc: KycVerification = {
      status: isInstant ? 'verified' : 'pending',
      idType: kycForm.idType,
      idNumber: kycForm.idNumber || '4829-1092-3849',
      frontIdUrl: 'uploaded-front.png',
      backIdUrl: 'uploaded-back.png',
      selfieUrl: 'uploaded-selfie.png',
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      verifiedAt: isInstant ? new Date().toISOString().slice(0, 10) : undefined,
      verificationCode: isInstant ? `KYC-PH-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED` : undefined
    };

    const updatedProfile: UserProfile = {
      ...userProfile,
      kyc: updatedKyc
    };

    onUpdateProfile(updatedProfile);
    setSaveSuccessMsg(isInstant ? 'Account verified successfully! You can now make purchases.' : 'KYC submitted for review!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Auto-fill demo valid ID
  const handleAutoFillDemoId = () => {
    setKycForm({
      idType: 'philsys_national_id',
      idNumber: '4829-1092-3849-1102',
      frontUploaded: true,
      backUploaded: true,
      selfieUploaded: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn my-6 relative flex flex-col max-h-[92vh]">
        
        {/* Modal Top Banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img 
                src={sukiAccount.avatar} 
                alt="" 
                className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-400" 
              />
              {userProfile.kyc.status === 'verified' && (
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5" title="KYC Verified">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{userProfile.fullName}</h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  userProfile.kyc.status === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : userProfile.kyc.status === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {userProfile.kyc.status === 'verified' ? 'KYC Verified' : userProfile.kyc.status === 'pending' ? 'KYC Pending' : 'KYC Required'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{userProfile.email} • {sukiAccount.tier} Suki Member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 shrink-0 overflow-x-auto gap-1">
          {[
            { id: 'info', label: 'Profile Information', icon: User },
            { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck, badge: userProfile.kyc.status !== 'verified' ? 'Required' : 'Verified' },
            { id: 'settings', label: 'Preferences & Settings', icon: Lock },
            { id: 'suki', label: 'Suki Rewards', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'border-teal-600 text-teal-700 bg-white rounded-t-xl shadow-2xs' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    tab.badge === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {saveSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-bold flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {saveSuccessMsg}
            </span>
            <button onClick={() => setSaveSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">

          {/* ========================================================
              TAB 1: PROFILE INFORMATION
          ======================================================== */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">Traveler Personal Data</h4>
                <p className="text-xs text-slate-500">Official passenger name must match your government-issued ID for domestic travel clearance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Philippine Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+63 917 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Home Address (Mindanao)</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Street Address, Barangay"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City / Municipality (e.g. CDO)"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="Province"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="ZIP Code"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Emergency Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    placeholder="Contact Full Name"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <input
                    type="text"
                    value={formData.emergencyRelationship}
                    onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                    placeholder="Relationship"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    placeholder="Contact Mobile Number"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 2: KYC VERIFICATION (MANDATORY IDENTITY VERIFICATION)
          ======================================================== */}
          {activeTab === 'kyc' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* KYC Status Header Card */}
              {userProfile.kyc.status === 'verified' ? (
                <div className="bg-emerald-50 border-2 border-emerald-400/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-emerald-950">Identity Verified (KYC Level 2)</h4>
                        <p className="text-xs text-emerald-700">Account verified and cleared for all flight, bus, and ferry ticketing.</p>
                      </div>
                    </div>
                    <span className="bg-emerald-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-emerald-200 text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-700 uppercase font-bold block">Document Type</span>
                      <strong className="text-emerald-900">{kycForm.idType.replace(/_/g, ' ').toUpperCase()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-700 uppercase font-bold block">Masked ID Number</span>
                      <strong className="text-emerald-900">{kycForm.idNumber ? `${kycForm.idNumber.slice(0, 4)}••••${kycForm.idNumber.slice(-4)}` : 'Verified on file'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-700 uppercase font-bold block">Verification Code</span>
                      <strong className="text-emerald-900">{userProfile.kyc.verificationCode || 'KYC-PH-8829-VERIFIED'}</strong>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] text-emerald-700">You can now proceed to purchase tickets and checkout.</span>
                    <button
                      type="button"
                      onClick={() => {
                        const revoked: UserProfile = { ...userProfile, kyc: { ...userProfile.kyc, status: 'unverified' } };
                        onUpdateProfile(revoked);
                        setSaveSuccessMsg('Status set to Unverified (for testing)');
                      }}
                      className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      Test: Reset to Unverified
                    </button>
                  </div>
                </div>
              ) : userProfile.kyc.status === 'pending' ? (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-amber-950">Verification Under Review</h4>
                        <p className="text-xs text-amber-700">Your government ID is currently being reviewed by MTTH compliance agents.</p>
                      </div>
                    </div>
                    <span className="bg-amber-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                      Pending
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center justify-between pt-2 border-t border-amber-200">
                    <span className="text-xs text-amber-800">Submitted on: {userProfile.kyc.submittedAt || 'Today'}</span>
                    <button
                      type="button"
                      onClick={() => handleSubmitKyc(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow cursor-pointer"
                    >
                      Instant Approve (Demo Mode)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-rose-950">Mandatory KYC Verification Required</h4>
                      <p className="text-xs text-rose-700 leading-relaxed">
                        In compliance with Department of Transportation (DOTr) and Maritime/Aviation security guidelines, all passengers must be verified before booking or purchasing transport tickets.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Form (when not verified or modifying) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    {userProfile.kyc.status === 'verified' ? 'Update ID Information' : 'Submit Philippine Government ID'}
                  </h4>
                  <button
                    type="button"
                    onClick={handleAutoFillDemoId}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Auto-Fill Valid Demo ID</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Government ID Type</label>
                    <select
                      value={kycForm.idType}
                      onChange={(e) => setKycForm({ ...kycForm, idType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      <option value="philsys_national_id">PhilSys National ID (Philippine ID)</option>
                      <option value="ph_passport">Philippine Passport (DFA)</option>
                      <option value="umid">Unified Multi-Purpose ID (UMID)</option>
                      <option value="drivers_license">Driver's License (LTO)</option>
                      <option value="sss_gsis">SSS / GSIS ID Card</option>
                      <option value="postal_id">Postal ID (Digitized)</option>
                      <option value="prc_id">PRC Professional ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Government ID Number</label>
                    <input
                      type="text"
                      value={kycForm.idNumber}
                      onChange={(e) => setKycForm({ ...kycForm, idNumber: e.target.value })}
                      placeholder="e.g. 4829-1092-3849-1102"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                {/* ID Upload Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Front of ID */}
                  <div className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    kycForm.frontUploaded ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto shadow-2xs">
                      {kycForm.frontUploaded ? <Check className="w-5 h-5 text-teal-600" /> : <FileText className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Front of ID</span>
                      <span className="text-[10px] text-slate-500">{kycForm.frontUploaded ? 'Document Loaded' : 'Clear photo of card front'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setKycForm({ ...kycForm, frontUploaded: true })}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        kycForm.frontUploaded ? 'bg-teal-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {kycForm.frontUploaded ? 'Loaded' : 'Upload Front'}
                    </button>
                  </div>

                  {/* Back of ID */}
                  <div className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    kycForm.backUploaded ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto shadow-2xs">
                      {kycForm.backUploaded ? <Check className="w-5 h-5 text-teal-600" /> : <FileText className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Back of ID</span>
                      <span className="text-[10px] text-slate-500">{kycForm.backUploaded ? 'Document Loaded' : 'Barcode & signature side'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setKycForm({ ...kycForm, backUploaded: true })}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        kycForm.backUploaded ? 'bg-teal-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {kycForm.backUploaded ? 'Loaded' : 'Upload Back'}
                    </button>
                  </div>

                  {/* Liveness Selfie */}
                  <div className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    kycForm.selfieUploaded ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto shadow-2xs">
                      {kycForm.selfieUploaded ? <Check className="w-5 h-5 text-teal-600" /> : <Camera className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Selfie Liveness</span>
                      <span className="text-[10px] text-slate-500">{kycForm.selfieUploaded ? 'Photo Captured' : 'Face scan verification'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setKycForm({ ...kycForm, selfieUploaded: true })}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        kycForm.selfieUploaded ? 'bg-teal-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {kycForm.selfieUploaded ? 'Captured' : 'Take Selfie'}
                    </button>
                  </div>
                </div>

                {/* Submission Actions */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Encrypted with PhilSys security standards & 256-bit SSL.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSubmitKyc(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Submit for Review
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSubmitKyc(true)}
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Instant Verify (Demo Mode)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: PREFERENCES & SETTINGS
          ======================================================== */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">Traveler Preferences</h4>
                <p className="text-xs text-slate-500">Pre-fill seat and accommodation preferences for rapid checkout.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Seat Placement</label>
                  <select
                    value={settingsForm.seatPreference}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seatPreference: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="window">Window Seat (Scenic View)</option>
                    <option value="aisle">Aisle Seat (Easy Access)</option>
                    <option value="no_preference">No Preference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Bus Seating Class</label>
                  <select
                    value={settingsForm.preferredBusClass}
                    onChange={(e) => setSettingsForm({ ...settingsForm, preferredBusClass: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Executive Aircon">Executive Aircon (With WiFi)</option>
                    <option value="Sleeper Luxury">Sleeper Luxury (Long-haul)</option>
                    <option value="Standard Aircon">Standard Aircon</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Senior Citizen / PWD / Student Assistance</span>
                  <span className="text-[11px] text-slate-500">Enable priority boarding assistance and mandatory statutory discount validation.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.specialAssistance}
                  onChange={(e) => setSettingsForm({ ...settingsForm, specialAssistance: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
              </div>

              {/* Notification Settings */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Alerts & Notifications</h4>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">SMS Boarding & Departure Alerts</span>
                      <span className="text-[11px] text-slate-500">Real-time gate and terminal SMS notifications 2 hours before trip.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.smsDepartureAlerts}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smsDepartureAlerts: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Email E-Boarding Pass & Official Receipt</span>
                      <span className="text-[11px] text-slate-500">PDF tickets sent directly to your registered email address.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.emailTripUpdates}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emailTripUpdates: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 4: SUKI REWARDS & LOYALTY
          ======================================================== */}
          {activeTab === 'suki' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-teal-500/10 p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">{sukiAccount.tier} Suki Status</div>
                    <div className="text-2xl font-extrabold text-slate-900">{sukiAccount.points.toLocaleString()} Points</div>
                    <span className="text-[11px] text-slate-500">{sukiAccount.pointsToNextTier} points to VIP Platinum</span>
                  </div>
                </div>
                <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                  Active Tier
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-semibold block">Completed Journeys</span>
                  <strong className="text-lg font-extrabold text-slate-900 block">{sukiAccount.completedTrips} Trips</strong>
                  <span className="text-[10px] text-teal-600 font-bold">Earned 10% on fares</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-semibold block">Vouchers Wallet</span>
                  <strong className="text-lg font-extrabold text-slate-900 block">{sukiAccount.vouchersCount} Active</strong>
                  <span className="text-[10px] text-slate-400">Ready at checkout</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-semibold block">Member Since</span>
                  <strong className="text-lg font-extrabold text-slate-900 block">{sukiAccount.joinedDate}</strong>
                  <span className="text-[10px] text-slate-400">Pioneer traveler</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-1 text-xs">
                <strong className="text-teal-900 font-bold block">Gold Suki Privilege:</strong>
                <p className="text-teal-700">
                  You enjoy 5% point cashbacks, priority boarding queue clearance, and 30-day voucher validity on all Mindanao routes.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs">
            {userProfile.kyc.status === 'verified' ? (
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified for Booking & Ticketing
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Verification Required for Booking
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
