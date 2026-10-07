import React, { useState, useEffect } from 'react';
import { 
  Plane, Ship, Bus, Sparkles, Bot, Award, Tag, Ticket, Bell, User, 
  MapPin, Calendar, Users, ArrowLeftRight, Search, ShieldCheck, QrCode, 
  Settings, LayoutDashboard, Route as RouteIcon, Gift, Heart, ArrowRight, 
  Check, X, Compass, Globe, Smartphone, HelpCircle, Layers, FileText,
  ChevronDown, Zap, Star, AlertCircle, Clock, Lock, Rocket, Terminal, ExternalLink, Copy
} from 'lucide-react';
import { 
  Schedule, Voucher, Booking, SukiAccount, TransportType, SiteSettings, SubAdmin, UserProfile, KycVerification 
} from './types';
import { 
  MOCK_SCHEDULES, MOCK_VOUCHERS, INITIAL_SUKI_ACCOUNT, INITIAL_USER_PROFILE, MOCK_CUSTOMERS_KYC, CustomerKycRecord 
} from './mockData';

import { SearchResults } from './components/SearchResults';
import { BookingCheckout } from './components/BookingCheckout';
import { BookingConfirmation } from './components/BookingConfirmation';
import { DigitalTicketModal } from './components/DigitalTicketModal';
import { NotificationCenter } from './components/NotificationCenter';
import { ProfileModal } from './components/ProfileModal';
import { VercelDeployModal } from './components/VercelDeployModal';

export default function App() {
  // Navigation & View mode: 'landing' | 'dashboard' | 'admin' | 'search-results' | 'checkout' | 'confirmation'
  // Admin is strictly separated from main user website; accessible only via /admin or #admin
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'admin' | 'search-results' | 'checkout' | 'confirmation'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
        return 'admin';
      }
    }
    return 'landing';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
        setActiveView('admin');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Responsive Sidebar Minimization States
  const [adminSidebarMinimized, setAdminSidebarMinimized] = useState(false);
  const [adminMobileDrawerOpen, setAdminMobileDrawerOpen] = useState(false);
  const [userDashSidebarMinimized, setUserDashSidebarMinimized] = useState(false);

  // Site Settings (Editable by Admin with persistent storage & automatic favicon sync)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('mtth_site_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      siteName: 'MTTH',
      siteSubtitle: 'Mindanao',
      tagline: 'Your Journey Starts Here',
      logoUrl: '',
      contactEmail: 'support@mtth.ph',
      contactPhone: '+63 88 123 4567',
      announcementText: 'Mindanao Travel Week — Earn 2X Suki Points on selected routes',
      announcementActive: true,
      allowNewRegistrations: true,
      currency: 'PHP (₱)'
    };
  });

  // Save siteSettings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mtth_site_settings', JSON.stringify(siteSettings));
    } catch {}
  }, [siteSettings]);

  // Automatic Favicon Sync: when a logo is uploaded or changed, update the tab's favicon dynamically
  useEffect(() => {
    const updateFavicon = (url?: string) => {
      let iconLink: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
      }
      
      let appleIconLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleIconLink) {
        appleIconLink = document.createElement('link');
        appleIconLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleIconLink);
      }

      if (url) {
        iconLink.href = url;
        iconLink.type = url.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/png';
        appleIconLink.href = url;

        // Create a crisp square 64x64 favicon on canvas for optimal browser rendering
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, 64, 64);
              const maxDim = Math.max(img.width, img.height) || 64;
              const scale = 58 / maxDim;
              const w = img.width * scale;
              const h = img.height * scale;
              const x = (64 - w) / 2;
              const y = (64 - h) / 2;
              ctx.drawImage(img, x, y, w, h);
              const squareDataUrl = canvas.toDataURL('image/png');
              iconLink!.href = squareDataUrl;
              appleIconLink!.href = squareDataUrl;
            }
          } catch {
            iconLink!.href = url;
          }
        };
        img.src = url;
      } else {
        // Reset to default MTTH SVG brand mark favicon
        const defaultSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ffc64b'/%3E%3Cstop offset='100%25' stop-color='%232ad2b5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='24' fill='url(%23g)'/%3E%3Cpolygon points='50,22 75,50 50,44 25,50' fill='white'/%3E%3Cpolygon points='50,78 75,50 50,56 25,50' fill='%23063451'/%3E%3C/svg%3E";
        iconLink.href = defaultSvg;
        iconLink.type = 'image/svg+xml';
        appleIconLink.href = defaultSvg;
      }
    };

    updateFavicon(siteSettings.logoUrl);
  }, [siteSettings.logoUrl]);

  // Search State
  const [transportTab, setTransportTab] = useState<'flight' | 'ferry' | 'bus'>('flight');
  const [fromLoc, setFromLoc] = useState('Cagayan de Oro');
  const [toLoc, setToLoc] = useState('Siargao');
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  });
  const [passengers, setPassengers] = useState(1);
  const [searchMsg, setSearchMsg] = useState('');

  // Data Stores
  const [sukiAccount, setSukiAccount] = useState<SukiAccount>(INITIAL_SUKI_ACCOUNT);
  const [schedules, setSchedules] = useState<Schedule[]>(MOCK_SCHEDULES);
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'bk-101',
      bookingCode: 'MTTH-CAM-8821',
      userId: 'user-suki-001',
      scheduleId: 'sch-1',
      transportType: 'ferry',
      operatorName: 'SuperFerry Mindanao',
      operatorLogo: 'SFM',
      origin: 'Cagayan de Oro',
      destination: 'Camiguin Island',
      departureTime: '2026-10-18T06:00:00',
      arrivalTime: '2026-10-18T09:30:00',
      passengers: [
        { fullName: 'Maria Santos', dob: '1992-05-14', gender: 'female', mobile: '+639171234567', email: 'maria.santos@example.com', passengerType: 'adult', seatNumber: 'A12' }
      ],
      selectedClass: 'Tourist',
      baseFare: 850,
      terminalFee: 30,
      serviceFee: 50,
      taxes: 45,
      discountAmount: 85,
      voucherCode: 'WELCOME10',
      sukiDiscountAmount: 40,
      totalPaid: 900,
      sukiPointsEarned: 250,
      paymentMethod: 'GCash',
      status: 'confirmed',
      createdAt: '2026-10-01T10:00:00Z',
      qrCodeToken: 'MTTH-QR-SECURE-CAM-9921'
    },
    {
      id: 'bk-102',
      bookingCode: 'MTTH-20261104-002',
      userId: 'user-suki-001',
      scheduleId: 'sch-5',
      transportType: 'flight',
      operatorName: 'Mindanao Express Airlines',
      operatorLogo: 'MXA',
      origin: 'Davao City',
      destination: 'Siargao Island',
      departureTime: '2026-11-04T07:30:00',
      arrivalTime: '2026-11-04T08:35:00',
      passengers: [
        { fullName: 'Maria Santos', dob: '1992-05-14', gender: 'female', mobile: '+639171234567', email: 'maria.santos@example.com', passengerType: 'adult', seatNumber: '12F' }
      ],
      selectedClass: 'Economy',
      baseFare: 2450,
      terminalFee: 200,
      serviceFee: 100,
      taxes: 120,
      discountAmount: 500,
      voucherCode: 'FLYSUKI',
      sukiDiscountAmount: 171,
      totalPaid: 2199,
      sukiPointsEarned: 350,
      paymentMethod: 'Maya',
      status: 'confirmed',
      createdAt: '2026-10-03T14:30:00Z',
      qrCodeToken: 'MTTH-QR-SECURE-DVO-8812'
    }
  ]);

  // Sub-Admins Store
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([
    {
      id: 'sub-1',
      name: 'Carlos Mendoza',
      email: 'carlos.ops@mtth.ph',
      role: 'Operations Admin',
      status: 'Active',
      permissions: ['Manage Bookings', 'Manage Operators', 'Issue Refunds'],
      createdAt: '2026-08-12',
      lastActive: '10 mins ago'
    },
    {
      id: 'sub-2',
      name: 'Eileen Dalisay',
      email: 'eileen.ticketing@mtth.ph',
      role: 'Ticketing Agent',
      status: 'Active',
      permissions: ['Manage Bookings', 'Issue Tickets'],
      createdAt: '2026-09-01',
      lastActive: '1 hour ago'
    },
    {
      id: 'sub-3',
      name: 'Ramon Bautista',
      email: 'ramon.support@mtth.ph',
      role: 'Support Agent',
      status: 'Active',
      permissions: ['Manage Support', 'Review Inquiries'],
      createdAt: '2026-09-15',
      lastActive: 'Yesterday'
    }
  ]);

  // Booking & Selection
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [digitalTicketBooking, setDigitalTicketBooking] = useState<Booking | null>(null);
  const [selectedTicketCode, setSelectedTicketCode] = useState<string | null>(null);

  // Modals & Popups
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiBudgetInput, setAiBudgetInput] = useState('');
  const [aiPlanOutput, setAiPlanOutput] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalInitialTab, setProfileModalInitialTab] = useState<'info' | 'kyc' | 'settings' | 'suki'>('info');
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // User Profile & Mandatory KYC Verification State (with localStorage persistence)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mtth_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USER_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mtth_user_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  // Admin Customers KYC directory
  const [customersKyc, setCustomersKyc] = useState<CustomerKycRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mtth_customers_kyc');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_CUSTOMERS_KYC;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mtth_customers_kyc', JSON.stringify(customersKyc));
    } catch {}
  }, [customersKyc]);

  const [customerFilter, setCustomerFilter] = useState<'all' | 'verified' | 'pending' | 'unverified'>('all');
  const [customerSearch, setCustomerSearch] = useState('');

  const handleQuickVerifyKyc = () => {
    const verifiedProfile: UserProfile = {
      ...userProfile,
      kyc: {
        status: 'verified',
        idType: userProfile.kyc.idType || 'philsys_national_id',
        idNumber: userProfile.kyc.idNumber || '4829-1092-3849',
        frontIdUrl: 'uploaded-front.png',
        backIdUrl: 'uploaded-back.png',
        selfieUrl: 'uploaded-selfie.png',
        submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        verifiedAt: new Date().toISOString().slice(0, 10),
        verificationCode: `KYC-PH-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`
      }
    };
    setUserProfile(verifiedProfile);
    setCustomersKyc(prev => prev.map(c => c.email === userProfile.email ? { ...c, kycStatus: 'verified' } : c));
    showToast('Identity verified (KYC Approved)! You can now complete purchases.');
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    setSukiAccount(prev => ({
      ...prev,
      name: updated.fullName,
      email: updated.email,
      avatar: updated.avatarUrl || prev.avatar
    }));
    setCustomersKyc(prev => prev.map(c => c.email === updated.email ? {
      ...c,
      name: updated.fullName,
      phone: updated.phone,
      kycStatus: updated.kyc.status as any,
      idNumber: updated.kyc.idNumber || c.idNumber
    } : c));
  };

  // Admin Active Tab & Modals
  const [adminTab, setAdminTab] = useState<'Dashboard' | 'Bookings' | 'Customers' | 'Operators' | 'Destinations' | 'Routes' | 'Promos' | 'SubAdmins' | 'Settings' | 'Deployment'>('Dashboard');
  const [vercelModalOpen, setVercelModalOpen] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [showAddOperatorModal, setShowAddOperatorModal] = useState(false);
  const [showAddDestinationModal, setShowAddDestinationModal] = useState(false);
  const [refundCount, setRefundCount] = useState(27);

  // Form states for Admin modals
  const [newSubAdminForm, setNewSubAdminForm] = useState({
    name: '',
    email: '',
    role: 'Operations Admin' as const,
    password: ''
  });

  const [newRouteForm, setNewRouteForm] = useState({
    origin: 'Cagayan de Oro',
    destination: 'Camiguin Island',
    transportType: 'ferry' as TransportType,
    operatorName: 'SuperFerry Mindanao',
    duration: '1h 30m',
    baseFare: 450,
    seats: 60
  });

  const [newPromoForm, setNewPromoForm] = useState({
    code: '',
    title: '',
    discountType: 'fixed' as const,
    discountValue: 200,
    minSpend: 500,
    validUntil: '2026-12-31'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  // Swap Locations
  const handleSwap = () => {
    const temp = fromLoc;
    setFromLoc(toLoc);
    setToLoc(temp);
    showToast('Locations swapped');
  };

  // Perform Search
  const handleSearchTrips = () => {
    setSearchMsg(`Searching trips from ${fromLoc} to ${toLoc} on ${departureDate}…`);
    setTimeout(() => {
      setSearchMsg('');
      setActiveView('search-results');
      showToast(`Found trips: ${fromLoc} → ${toLoc}`);
    }, 400);
  };

  // Complete Booking flow
  const handleCompleteBooking = async (bookingPayload: any) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      const newBooking = await res.json();
      setBookings([newBooking, ...bookings]);
      setActiveBooking(newBooking);
      setActiveView('confirmation');
      setSukiAccount(prev => ({
        ...prev,
        points: prev.points + newBooking.sukiPointsEarned,
        completedTrips: prev.completedTrips + 1
      }));
      showToast(`Booking ${newBooking.bookingCode} confirmed! +${newBooking.sukiPointsEarned} Suki pts`);
    } catch {
      showToast('Booking issued in demo mode!');
    }
  };

  // AI Concierge Generation with Gemini 3.8 Flash backend
  const handleGenerateAiPlan = async () => {
    const budgetPrompt = aiBudgetInput.trim() || '₱5,000 for 3 days';
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: budgetPrompt,
          destination: toLoc || 'Camiguin',
          budget: budgetPrompt,
          style: 'Adventure & Leisure'
        })
      });
      const data = await res.json();
      setAiPlanOutput(data.recommendation || `Suggested: ${fromLoc} → Camiguin\nBudget: ${budgetPrompt}\n• Day 1 — Ferry + White Island\n• Day 2 — Katibawasan Falls + hot springs\n• Day 3 — Local food + return ferry\nEstimated budget: ₱4,450`);
    } catch {
      setAiPlanOutput(`Suggested: ${fromLoc} → Camiguin\nBudget: ${budgetPrompt}\n• Day 1 — Ferry + White Island\n• Day 2 — Katibawasan Falls + hot springs\n• Day 3 — Local food + return ferry\nEstimated budget: ₱4,450`);
    } finally {
      setAiLoading(false);
    }
  };

// Sample Full Logos for instant testing (Clean SVG without emojis)
const SAMPLE_LOGO_1 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 260 60'%3E%3Cdefs%3E%3ClinearGradient id='lg1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2308aaa8'/%3E%3Cstop offset='100%25' stop-color='%23ff9f43'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M14 12 L40 30 L14 48 L22 30 Z' fill='url(%23lg1)'/%3E%3Cpath d='M28 18 L48 30 L28 42 L34 30 Z' fill='%232ad2b5'/%3E%3Ctext x='58' y='35' font-family='system-ui, -apple-system, sans-serif' font-size='22' font-weight='900' fill='%23082538'%3EMTTH%3C/text%3E%3Ctext x='136' y='35' font-family='system-ui, -apple-system, sans-serif' font-size='14' font-weight='700' fill='%2308aaa8'%3EMindanao%3C/text%3E%3Ctext x='60' y='48' font-family='system-ui, -apple-system, sans-serif' font-size='8.5' font-weight='700' letter-spacing='1.5' fill='%237d9ba8'%3ETICKETING HUB%3C/text%3E%3C/svg%3E";

const SAMPLE_LOGO_2 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 56'%3E%3Cdefs%3E%3ClinearGradient id='lg2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230284c7'/%3E%3Cstop offset='100%25' stop-color='%2310b981'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='26' cy='28' r='18' fill='none' stroke='url(%23lg2)' stroke-width='3.5'/%3E%3Cpolygon points='26,16 34,34 18,34' fill='%230284c7'/%3E%3Ctext x='54' y='33' font-family='system-ui, -apple-system, sans-serif' font-size='20' font-weight='800' fill='%230f172a'%3EMindanao%3C/text%3E%3Ctext x='152' y='33' font-family='system-ui, -apple-system, sans-serif' font-size='15' font-weight='700' fill='%2310b981'%3ETransit%3C/text%3E%3Ctext x='55' y='46' font-family='system-ui, -apple-system, sans-serif' font-size='8' font-weight='700' letter-spacing='1' fill='%2364748b'%3EOFFICIAL TICKET HUB%3C/text%3E%3C/svg%3E";

  // Admin: Handle Logo File Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSiteSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
          showToast('Full logo applied (frame removed) & Favicon updated automatically!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin: Create Sub-Admin Account
  const handleCreateSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubAdminForm.name || !newSubAdminForm.email) return;
    const newAdmin: SubAdmin = {
      id: `sub-${Date.now()}`,
      name: newSubAdminForm.name,
      email: newSubAdminForm.email,
      role: newSubAdminForm.role,
      status: 'Active',
      permissions: ['Manage Bookings', 'Standard Console Access'],
      createdAt: new Date().toISOString().slice(0, 10),
      lastActive: 'Just now'
    };
    setSubAdmins([newAdmin, ...subAdmins]);
    setShowAddSubAdminModal(false);
    setNewSubAdminForm({ name: '', email: '', role: 'Operations Admin', password: '' });
    showToast(`Sub-admin account created for ${newAdmin.name}!`);
  };

  // Admin: Create Route
  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const newSch: Schedule = {
      id: `sch-${Date.now()}`,
      operatorId: 'op-custom',
      operatorName: newRouteForm.operatorName,
      operatorLogo: newRouteForm.transportType.toUpperCase(),
      transportType: newRouteForm.transportType,
      origin: newRouteForm.origin,
      destination: newRouteForm.destination,
      originTerminal: `${newRouteForm.origin} Central Terminal`,
      destinationTerminal: `${newRouteForm.destination} Terminal`,
      departureTime: `${departureDate}T08:00:00`,
      arrivalTime: `${departureDate}T10:00:00`,
      duration: newRouteForm.duration,
      vehicleType: `${newRouteForm.transportType.toUpperCase()} Express`,
      availableSeats: newRouteForm.seats,
      totalSeats: newRouteForm.seats,
      baseFare: Number(newRouteForm.baseFare),
      terminalFee: 30,
      serviceFee: 40,
      discountEligible: true,
      sukiEligible: true,
      baggageAllowance: '15kg',
      classType: 'Standard'
    };
    setSchedules([newSch, ...schedules]);
    setShowAddRouteModal(false);
    showToast(`New route added: ${newSch.origin} → ${newSch.destination}`);
  };

  // Admin: Create Promo
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoForm.code) return;
    const newVoucher: Voucher = {
      id: `v-${Date.now()}`,
      code: newPromoForm.code.toUpperCase(),
      title: newPromoForm.title || `${newPromoForm.code.toUpperCase()} Special`,
      description: `Save ₱${newPromoForm.discountValue} on eligible trips.`,
      discountType: newPromoForm.discountType,
      discountValue: Number(newPromoForm.discountValue),
      minSpend: Number(newPromoForm.minSpend),
      validUntil: newPromoForm.validUntil,
      eligibleTransport: 'all',
      claimed: true
    };
    setVouchers([newVoucher, ...vouchers]);
    setShowAddPromoModal(false);
    showToast(`Promo voucher ${newVoucher.code} created and published!`);
  };

  // Dynamic Logo renderer: Full logo with NO frame/gradient/box when uploaded; Default brand emblem when empty
  const renderBrandMark = (sizeClass = "h-8 sm:h-9 md:h-10") => {
    if (siteSettings.logoUrl) {
      return (
        <div className="flex items-center shrink-0">
          <img 
            src={siteSettings.logoUrl} 
            alt={siteSettings.siteName || "Brand Logo"} 
            className={`${sizeClass} w-auto max-w-[190px] sm:max-w-[250px] object-contain block select-none`}
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))' }}
          />
        </div>
      );
    }
    return (
      <span className="brand-mark logo flex items-center justify-center shrink-0">
        <Compass className="w-5 h-5 text-white" />
      </span>
    );
  };

  // Helper for transport icons
  const renderTransportIcon = (type: TransportType | string, className = "w-4 h-4") => {
    if (type === 'flight') return <Plane className={className} />;
    if (type === 'ferry') return <Ship className={className} />;
    return <Bus className={className} />;
  };

  return (
    <div>
      {/* ========================================================
          FLOATING AI CONCIERGE BUTTON (FAB)
      ======================================================== */}
      {activeView !== 'admin' && (
        <aside aria-label="Floating AI Concierge Launcher" className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <button 
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white font-extrabold px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border border-teal-300/30 cursor-pointer"
            onClick={() => setAiModalOpen(true)}
            aria-label="Open AI Travel Concierge"
            style={{ boxShadow: '0 10px 30px rgba(11, 186, 180, 0.45)' }}
          >
            {/* Ambient pulse ring */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-teal-800"></span>
            </span>

            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs tracking-wider uppercase font-extrabold leading-none">AI Concierge</span>
              <span className="text-[10px] text-teal-200/90 font-semibold leading-tight hidden sm:inline">Ask Gemini</span>
            </div>
          </button>
        </aside>
      )}

      {/* ========================================================
          VIEW: ADMIN CMS (admin.html)
      ======================================================== */}
      {activeView === 'admin' ? (
        <div className="admin min-h-screen">
          <header className="admin-top">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-1.5 text-white text-base bg-slate-800 rounded cursor-pointer"
                onClick={() => setAdminMobileDrawerOpen(!adminMobileDrawerOpen)}
                title="Toggle Menu"
              >
                <Compass className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                {renderBrandMark("h-7 sm:h-8")}
                <b>
                  {siteSettings.siteName} <span>Admin CMS</span>
                </b>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                className="bg-slate-900 hover:bg-black text-white font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-xs transition-all hover:scale-105"
                onClick={() => setVercelModalOpen(true)}
                title="Open Vercel Deployment Assistant"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 1155 1000">
                  <path d="m577.3 0 577.4 1000H0z" />
                </svg>
                <span className="hidden sm:inline">Deploy to Vercel</span>
                <span className="sm:hidden">Deploy</span>
              </button>
              <span className="hidden lg:inline text-xs text-slate-300 font-medium">Super Admin</span>
              <button 
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  if (window.location.pathname.startsWith('/admin')) {
                    window.history.pushState({}, '', '/');
                  } else if (window.location.hash === '#admin') {
                    window.location.hash = '';
                  }
                  setActiveView('landing');
                }}
              >
                <span>View Website</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </header>

          <main className={`admin-layout ${adminSidebarMinimized ? 'minimized' : ''}`}>
            {/* Admin Sidebar */}
            <aside className={`admin-side ${adminSidebarMinimized ? 'minimized' : ''} ${adminMobileDrawerOpen ? 'block' : 'hidden md:block'}`}>
              <button 
                className="sidebar-toggle-btn"
                onClick={() => setAdminSidebarMinimized(!adminSidebarMinimized)}
                title="Minimize Sidebar"
              >
                <span className="text-label">{adminSidebarMinimized ? 'Expand Menu' : 'Minimize Menu'}</span>
              </button>

              <h3>CONTROL CENTER</h3>
              {[
                { id: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
                { id: 'Bookings', icon: <Ticket className="w-4 h-4" />, label: 'Bookings' },
                { id: 'Customers', icon: <ShieldCheck className="w-4 h-4" />, label: 'Customers & KYC' },
                { id: 'Routes', icon: <RouteIcon className="w-4 h-4" />, label: 'Routes & Trips' },
                { id: 'Promos', icon: <Tag className="w-4 h-4" />, label: 'Promo Vouchers' },
                { id: 'SubAdmins', icon: <Users className="w-4 h-4" />, label: 'Sub-Admins & Roles' },
                { id: 'Settings', icon: <Settings className="w-4 h-4" />, label: 'Site Settings & Logo' },
                { id: 'Deployment', icon: <Rocket className="w-4 h-4" />, label: 'Vercel Deployment' }
              ].map(item => (
                <a 
                  key={item.id}
                  className={adminTab === item.id ? 'selected' : ''}
                  onClick={() => { 
                    setAdminTab(item.id as any); 
                    setAdminMobileDrawerOpen(false);
                    showToast(`Admin section: ${item.label}`); 
                  }}
                  title={item.label}
                >
                  <span className="icon mr-2 flex items-center">{item.icon}</span>
                  <span className="text-label">{item.label}</span>
                </a>
              ))}
            </aside>

            {/* Admin Content Area */}
            <section className="admin-main">
              {/* TAB: DASHBOARD */}
              {adminTab === 'Dashboard' && (
                <div className="space-y-6">
                  <div className="heading row">
                    <div>
                      <h1>Operations Dashboard</h1>
                      <p>Real-time activity for {siteSettings.siteName} {siteSettings.siteSubtitle}.</p>
                    </div>
                    <button className="primary flex items-center gap-1.5" onClick={() => setShowAddRouteModal(true)}>
                      <span>+ Add Route</span>
                    </button>
                  </div>

                  <div className="admin-stats">
                    <div>
                      <small>TODAY'S BOOKINGS</small>
                      <b>{486 + bookings.length}</b>
                      <span>↑ 18.4% this week</span>
                    </div>
                    <div>
                      <small>GROSS SALES</small>
                      <b>₱{(842650 + bookings.reduce((acc, b) => acc + b.totalPaid, 0)).toLocaleString()}</b>
                      <span>↑ 12.7% growth</span>
                    </div>
                    <div>
                      <small>ACTIVE CUSTOMERS</small>
                      <b>18,492</b>
                      <span>↑ 8.2% Suki members</span>
                    </div>
                    <div>
                      <small>PENDING REFUNDS</small>
                      <b>{refundCount}</b>
                      <span className="text-amber-500 font-bold">Needs review</span>
                    </div>
                  </div>

                  <div className="admin-grid">
                    <div className="admin-panel">
                      <div className="panel-head">
                        <h2>Recent Bookings</h2>
                        <a onClick={() => showToast('Exporting bookings CSV file…')}>Export CSV</a>
                      </div>
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Booking</th>
                              <th>Customer</th>
                              <th>Route</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.slice(0, 5).map((b) => (
                              <tr key={b.id}>
                                <td>{b.bookingCode}</td>
                                <td>{b.passengers[0]?.fullName || 'Maria Santos'}</td>
                                <td>{b.origin} → {b.destination}</td>
                                <td>₱{b.totalPaid.toLocaleString()}</td>
                                <td>
                                  <i className={b.status === 'confirmed' ? 'ok' : 'pending'}>
                                    {b.status.toUpperCase()}
                                  </i>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="admin-panel">
                      <div className="panel-head">
                        <h2>Route Performance</h2>
                      </div>
                      <div className="bars">
                        <label>CDO → Cebu <b style={{ width: '88%' }}>88%</b></label>
                        <label>Davao → Manila <b style={{ width: '76%' }}>76%</b></label>
                        <label>CDO → Camiguin <b style={{ width: '68%' }}>68%</b></label>
                        <label>Davao → Siargao <b style={{ width: '55%' }}>55%</b></label>
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel">
                    <div className="panel-head">
                      <h2>Quick Management</h2>
                    </div>
                    <div className="quick">
                      <button onClick={() => setShowAddDestinationModal(true)}>+ Add Destination</button>
                      <button onClick={() => setShowAddPromoModal(true)}>+ Create Promo</button>
                      <button onClick={() => setShowAddOperatorModal(true)}>+ Add Operator</button>
                      <button onClick={() => {
                        if (refundCount > 0) {
                          setRefundCount(prev => prev - 1);
                          showToast('Refund request reviewed and approved!');
                        }
                      }}>
                        Review Refunds <em>{refundCount}</em>
                      </button>
                      <button onClick={() => { setAdminTab('SubAdmins'); setShowAddSubAdminModal(true); }}>
                        + Add Sub-Admin
                      </button>
                      <button onClick={() => setAdminTab('Settings')}>
                        Edit Site & Logo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SITE SETTINGS & LOGO UPLOAD */}
              {adminTab === 'Settings' && (
                <div className="admin-panel space-y-6">
                  <div className="panel-head border-b pb-3">
                    <h2>Site Brand, Name & Logo Management</h2>
                    <span className="text-xs text-teal-600 font-bold">Changes reflect instantly across the entire platform</span>
                  </div>

                  {/* Logo Upload Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Logo & Automatic Favicon</h3>
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        Frame Removed • Auto-Favicon Active
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      {/* Logo Preview & Favicon Sync Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Logo Display (Frame Removed) */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Full Logo (Frame Removed)</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Natural Dimensions</span>
                          </div>
                          <div className="min-h-[76px] flex items-center justify-center p-2.5 rounded-lg bg-slate-50/80 border border-dashed border-slate-200">
                            {siteSettings.logoUrl ? (
                              <img 
                                src={siteSettings.logoUrl} 
                                alt="Full Logo" 
                                className="max-h-16 max-w-full w-auto object-contain block select-none transition-all" 
                              />
                            ) : (
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                <Compass className="w-5 h-5 text-teal-500" />
                                <span>Default brand emblem active (Upload full logo below)</span>
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Rendered uncropped with natural aspect ratio across navigation, header, and footer.
                          </p>
                        </div>

                        {/* Automatic Browser Favicon Display */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Browser Tab Favicon</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">Auto-Synced</span>
                          </div>
                          <div className="min-h-[76px] flex items-center justify-center p-2.5 rounded-lg bg-slate-50/80 border border-slate-200">
                            <div className="flex items-center gap-2.5 px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-xs max-w-full">
                              <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                {siteSettings.logoUrl ? (
                                  <img src={siteSettings.logoUrl} alt="Favicon" className="w-4 h-4 object-contain" />
                                ) : (
                                  <Compass className="w-3.5 h-3.5 text-teal-600" />
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-800 truncate">
                                {siteSettings.siteName} — {siteSettings.siteSubtitle}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Automatically updated in browser tab via dynamic <code className="text-teal-700 font-semibold">&lt;link rel="icon"&gt;</code>.
                          </p>
                        </div>
                      </div>

                      {/* Controls & Quick Test Presets */}
                      <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2.5 items-center justify-between">
                        <div className="flex flex-wrap gap-2 items-center">
                          <label className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer shadow flex items-center gap-1.5 transition-colors">
                            <span>Upload Full Logo Image</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleLogoUpload} 
                            />
                          </label>

                          <button 
                            type="button"
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer"
                            onClick={() => {
                              setSiteSettings(prev => ({ ...prev, logoUrl: SAMPLE_LOGO_1 }));
                              showToast('Applied sample full logo & synced favicon!');
                            }}
                          >
                            Sample 1: MTTH Modern
                          </button>

                          <button 
                            type="button"
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer"
                            onClick={() => {
                              setSiteSettings(prev => ({ ...prev, logoUrl: SAMPLE_LOGO_2 }));
                              showToast('Applied sample full logo & synced favicon!');
                            }}
                          >
                            Sample 2: Transit Hub
                          </button>

                          {siteSettings.logoUrl && (
                            <button 
                              type="button"
                              className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer"
                              onClick={() => {
                                setSiteSettings(prev => ({ ...prev, logoUrl: '' }));
                                showToast('Reset to default brand emblem & favicon');
                              }}
                            >
                              Reset Logo
                            </button>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-500">
                          Recommended format: Transparent PNG, SVG, or WebP.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* General Site Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="admin-form-group">
                      <label>Site Brand Name</label>
                      <input 
                        type="text" 
                        value={siteSettings.siteName}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                        placeholder="e.g. MTTH"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Site Subtitle / Region</label>
                      <input 
                        type="text" 
                        value={siteSettings.siteSubtitle}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, siteSubtitle: e.target.value }))}
                        placeholder="e.g. Mindanao"
                      />
                    </div>
                    <div className="admin-form-group sm:col-span-2">
                      <label>Platform Tagline</label>
                      <input 
                        type="text" 
                        value={siteSettings.tagline}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, tagline: e.target.value }))}
                        placeholder="e.g. Your Journey Starts Here"
                      />
                    </div>
                    <div className="admin-form-group sm:col-span-2">
                      <label>Top Announcement Banner Text</label>
                      <input 
                        type="text" 
                        value={siteSettings.announcementText}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, announcementText: e.target.value }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Contact Email</label>
                      <input 
                        type="email" 
                        value={siteSettings.contactEmail}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Contact Phone</label>
                      <input 
                        type="text" 
                        value={siteSettings.contactPhone}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button 
                      className="primary px-6 py-2.5 rounded-xl font-bold"
                      onClick={() => showToast('Site brand and settings updated successfully!')}
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: VERCEL DEPLOYMENT */}
              {adminTab === 'Deployment' && (
                <div className="admin-panel space-y-6 animate-fadeIn">
                  <div className="panel-head border-b pb-3">
                    <div>
                      <h2>Vercel Production Deployment & Hosting</h2>
                      <p className="text-xs text-slate-500">Zero-config global hosting on Vercel's Edge network for Mindanao Ticket Hub.</p>
                    </div>
                    <button 
                      className="bg-slate-900 hover:bg-black text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                      onClick={() => setVercelModalOpen(true)}
                    >
                      <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 1155 1000">
                        <path d="m577.3 0 577.4 1000H0z" />
                      </svg>
                      <span>Open Deploy Assistant</span>
                    </button>
                  </div>

                  {/* Deployment Status Card */}
                  <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-7 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Configuration Ready</span>
                      </div>
                      <h3 className="text-xl font-black">Ready to Deploy on Vercel</h3>
                      <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                        The codebase includes root <code className="text-teal-300 font-mono font-bold">vercel.json</code>, serverless <code className="text-teal-300 font-mono font-bold">api/index.ts</code> handler, and SPA rewrite rules.
                      </p>
                    </div>

                    <a 
                      href="https://vercel.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-slate-100 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                      <svg className="w-4 h-4 fill-black" viewBox="0 0 1155 1000">
                        <path d="m577.3 0 577.4 1000H0z" />
                      </svg>
                      <span>Deploy to Vercel</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>

                  {/* Build Specs & CLI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-teal-600" />
                        <span>Project Preset Settings</span>
                      </h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-500">Framework Preset:</span>
                          <span className="font-bold text-slate-800">Vite</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-500">Build Command:</span>
                          <span className="font-bold text-slate-800">vite build</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-500">Output Directory:</span>
                          <span className="font-bold text-slate-800">dist</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-500">API Runtime:</span>
                          <span className="font-bold text-emerald-600">Node.js Serverless (api/index.ts)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-slate-700" />
                        <span>Instant Vercel CLI Deploy</span>
                      </h4>
                      <div className="bg-slate-950 text-slate-200 rounded-xl p-3.5 font-mono text-xs space-y-1">
                        <p className="text-slate-400"># Deploy in seconds</p>
                        <p className="text-emerald-400">npm i -g vercel</p>
                        <p className="text-emerald-400">vercel --prod</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('npm i -g vercel && vercel --prod');
                          showToast('Copied Vercel CLI command to clipboard!');
                        }}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy CLI Command</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SUB-ADMINS & ROLES */}
              {adminTab === 'SubAdmins' && (
                <div className="admin-panel space-y-4">
                  <div className="panel-head">
                    <div>
                      <h2>Sub-Admin Accounts & Role-Based Access</h2>
                      <p className="text-xs text-slate-500">Manage your operations team, ticketing agents, and support administrators.</p>
                    </div>
                    <button className="primary" onClick={() => setShowAddSubAdminModal(true)}>
                      + Create Sub-Admin
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Last Active</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subAdmins.map((admin) => (
                          <tr key={admin.id}>
                            <td className="font-bold text-slate-800">{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>
                              <span className={`role-badge ${
                                admin.role === 'Super Admin' ? 'role-super' :
                                admin.role === 'Operations Admin' ? 'role-ops' :
                                admin.role === 'Ticketing Agent' ? 'role-ticket' : 'role-support'
                              }`}>
                                {admin.role}
                              </span>
                            </td>
                            <td>
                              <span className={admin.status === 'Active' ? 'ok' : 'pending'}>
                                {admin.status}
                              </span>
                            </td>
                            <td>{admin.lastActive}</td>
                            <td>
                              <div className="flex gap-2">
                                <button 
                                  className="text-teal-600 font-bold hover:underline"
                                  onClick={() => {
                                    setSubAdmins(subAdmins.map(a => a.id === admin.id ? { ...a, status: a.status === 'Active' ? 'Suspended' : 'Active' } : a));
                                    showToast(`Status updated for ${admin.name}`);
                                  }}
                                >
                                  {admin.status === 'Active' ? 'Suspend' : 'Activate'}
                                </button>
                                <button 
                                  className="text-rose-500 font-bold hover:underline"
                                  onClick={() => {
                                    setSubAdmins(subAdmins.filter(a => a.id !== admin.id));
                                    showToast(`Account for ${admin.name} removed`);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: ROUTES & TRIPS */}
              {adminTab === 'Routes' && (
                <div className="admin-panel space-y-4">
                  <div className="panel-head">
                    <div>
                      <h2>Mindanao Travel Routes & Schedules</h2>
                      <p className="text-xs text-slate-500">{schedules.length} active transportation routes.</p>
                    </div>
                    <button className="primary" onClick={() => setShowAddRouteModal(true)}>
                      + Add Route
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Operator</th>
                          <th>Route</th>
                          <th>Duration</th>
                          <th>Base Fare</th>
                          <th>Available Seats</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.map((s) => (
                          <tr key={s.id}>
                            <td className="font-semibold text-slate-800">{s.transportType.toUpperCase()}</td>
                            <td className="font-bold text-slate-800">{s.operatorName}</td>
                            <td>{s.origin} → {s.destination}</td>
                            <td>{s.duration}</td>
                            <td className="font-bold text-teal-600">₱{s.baseFare.toLocaleString()}</td>
                            <td>{s.availableSeats} / {s.totalSeats}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: PROMOS & VOUCHERS */}
              {adminTab === 'Promos' && (
                <div className="admin-panel space-y-4">
                  <div className="panel-head">
                    <div>
                      <h2>Active Promo Codes & Suki Vouchers</h2>
                      <p className="text-xs text-slate-500">{vouchers.length} promotional codes configured.</p>
                    </div>
                    <button className="primary" onClick={() => setShowAddPromoModal(true)}>
                      + Create Promo
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Title</th>
                          <th>Discount</th>
                          <th>Min Spend</th>
                          <th>Valid Until</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vouchers.map((v) => (
                          <tr key={v.id}>
                            <td className="font-mono font-bold text-orange-600">{v.code}</td>
                            <td>{v.title}</td>
                            <td className="font-bold">
                              {v.discountType === 'percentage' ? `${v.discountValue}% OFF` : `₱${v.discountValue} OFF`}
                            </td>
                            <td>₱{v.minSpend}</td>
                            <td>{v.validUntil}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: BOOKINGS */}
              {adminTab === 'Bookings' && (
                <div className="admin-panel space-y-4">
                  <div className="panel-head">
                    <h2>Live Booking Ledger</h2>
                    <a onClick={() => showToast('Exporting full booking ledger…')}>Export CSV</a>
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Booking Code</th>
                          <th>Customer</th>
                          <th>Route</th>
                          <th>Class</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td className="font-mono font-bold">{b.bookingCode}</td>
                            <td>{b.passengers[0]?.fullName || 'Maria Santos'}</td>
                            <td>{b.origin} → {b.destination}</td>
                            <td>{b.selectedClass}</td>
                            <td className="font-bold">₱{b.totalPaid.toLocaleString()}</td>
                            <td>
                              <span className={b.status === 'confirmed' ? 'ok' : 'pending'}>
                                {b.status.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="text-teal-600 font-bold hover:underline"
                                onClick={() => setSelectedTicketCode(b.bookingCode)}
                              >
                                View Ticket
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      ) : activeView === 'dashboard' ? (
        /* ========================================================
            VIEW: CUSTOMER DASHBOARD / MY TRIPS (dashboard.html)
        ======================================================== */
        <div className="dashboard min-h-screen">
          <header className="topbar">
            <a className="brand" onClick={() => setActiveView('landing')}>
              {renderBrandMark("h-8 sm:h-9")}
              <span>
                <b>{siteSettings.siteName} <i>{siteSettings.siteSubtitle}</i></b>
                <small>{siteSettings.tagline}</small>
              </span>
            </a>
            <nav style={{ display: 'flex' }}>
              <a onClick={() => setActiveView('landing')} style={{ cursor: 'pointer' }}>Home</a>
              <a className="active" style={{ cursor: 'pointer' }}>My Trips</a>
            </nav>
            <a className="user flex items-center gap-1.5" onClick={() => { setProfileModalInitialTab('info'); setProfileModalOpen(true); }} style={{ cursor: 'pointer' }}>
              {userProfile.avatarUrl ? (
                <img 
                  src={userProfile.avatarUrl} 
                  alt="" 
                  className="w-5 h-5 rounded-full object-cover border border-teal-400" 
                />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              <span>{userProfile.firstName || 'Maria'}</span>
              {userProfile.kyc.status === 'verified' ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-400/30 flex items-center gap-0.5" title="KYC Verified">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  KYC
                </span>
              ) : (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30 flex items-center gap-0.5" title="KYC Required">
                  <AlertCircle className="w-2.5 h-2.5 text-amber-300" />
                  KYC
                </span>
              )}
            </a>
          </header>

          <main className={`dash-wrap ${userDashSidebarMinimized ? 'minimized' : ''}`}>
            <aside className={userDashSidebarMinimized ? 'minimized' : ''}>
              <button 
                className="sidebar-toggle-btn"
                onClick={() => setUserDashSidebarMinimized(!userDashSidebarMinimized)}
                title="Toggle Sidebar"
              >
                <span className="text-label">{userDashSidebarMinimized ? 'Expand Menu' : 'Minimize Menu'}</span>
              </button>

              <div className="dash-user cursor-pointer group" onClick={() => { setProfileModalInitialTab('info'); setProfileModalOpen(true); }} title="Click to view & edit Profile & KYC">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-400 bg-teal-100 text-teal-800 flex items-center justify-center font-bold mx-auto mb-1.5 shadow-sm group-hover:scale-105 transition-transform">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt={userProfile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userProfile.firstName?.[0] || 'M'}{userProfile.lastName?.[0] || 'S'}</span>
                  )}
                </div>
                <b>{userProfile.fullName || 'Maria Santos'}</b>
                <small className="flex items-center justify-center gap-1">
                  {userProfile.kyc.status === 'verified' ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> KYC Verified
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> KYC Required
                    </span>
                  )}
                  • Gold Suki
                </small>
              </div>
              <a className="selected flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-label">Overview</span>
              </a>
              <a className="flex items-center gap-2" onClick={() => showToast('All confirmed tickets shown below')}>
                <Ticket className="w-4 h-4" />
                <span className="text-label">My Tickets</span>
              </a>
              <a className="flex items-center gap-2" onClick={() => showToast('Favorite routes: CDO → Camiguin, Davao → Siargao')}>
                <Heart className="w-4 h-4" />
                <span className="text-label">Favorites</span>
              </a>
              <a className="flex items-center gap-2" onClick={() => setNotifModalOpen(true)}>
                <Bell className="w-4 h-4" />
                <span className="text-label">Notifications</span>
              </a>
              <a className="flex items-center gap-2" onClick={() => showToast('Redeem catalog: 3 active vouchers available')}>
                <Award className="w-4 h-4" />
                <span className="text-label">Suki Rewards</span>
              </a>
              <a className="flex items-center gap-2" onClick={() => setProfileModalOpen(true)}>
                <Settings className="w-4 h-4" />
                <span className="text-label">Settings</span>
              </a>
            </aside>

            <section className="dash-main">
              <div className="heading row">
                <div>
                  <h1>Good evening, Maria</h1>
                  <p>Here's your travel activity at a glance.</p>
                </div>
                <a className="primary" onClick={() => setActiveView('landing')} style={{ cursor: 'pointer' }}>
                  + Book a Trip
                </a>
              </div>

              <div className="stats">
                <div>
                  <small>UPCOMING TRIPS</small>
                  <b>{bookings.filter(b => b.status === 'confirmed').length}</b>
                  <span>Next: Camiguin</span>
                </div>
                <div>
                  <small>BOOKINGS</small>
                  <b>{bookings.length + 10}</b>
                  <span>8 completed</span>
                </div>
                <div>
                  <small>SUKI POINTS</small>
                  <b>{sukiAccount.points.toLocaleString()}</b>
                  <span>750 to Platinum</span>
                </div>
                <div>
                  <small>SAVED</small>
                  <b>₱3,840</b>
                  <span>Through Suki deals</span>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h2>Upcoming Trips</h2>
                  <a onClick={() => showToast('Showing all scheduled journeys')}>View all</a>
                </div>

                {bookings.filter(b => b.status === 'confirmed').map((b) => (
                  <article key={b.id} className="trip">
                    <div className="trip-icon">
                      {renderTransportIcon(b.transportType, "w-5 h-5 text-teal-700")}
                    </div>
                    <div>
                      <b>{b.origin} → {b.destination}</b>
                      <small>{b.departureTime} · {b.selectedClass} · {b.passengers.length} Pax</small>
                      <span className="confirmed">Confirmed</span>
                    </div>
                    <strong>₱{b.totalPaid.toLocaleString()}</strong>
                    <button onClick={() => setSelectedTicketCode(b.bookingCode)}>
                      View Ticket
                    </button>
                  </article>
                ))}
              </div>

              <div className="two-panels">
                <div className="panel">
                  <div className="panel-head">
                    <h2>Recent Bookings</h2>
                  </div>
                  <p>CDO → Manila <span className="right">₱2,499 · Completed</span></p>
                  <p>CDO → Camiguin <span className="right">₱450 · Completed</span></p>
                  <p>Davao → General Santos <span className="right">₱650 · Completed</span></p>
                </div>

                <div className="panel reward-panel">
                  <h2>Gold Suki</h2>
                  <b>{sukiAccount.points.toLocaleString()} Points</b>
                  <div className="progress"><span style={{ width: '72%' }}></span></div>
                  <small>750 points until Platinum</small>
                  <button onClick={() => showToast('Reward catalog opened — voucher SUKI500 redeemed!')}>
                    Redeem Rewards
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      ) : (
        /* ========================================================
            VIEW: PUBLIC MARKETPLACE (index.html)
        ======================================================== */
        <div>
          {/* Top Announcement Bar */}
          {showAnnouncement && siteSettings.announcementActive && (
            <div className="announcement">
              <span>{siteSettings.announcementText}</span>
              <button 
                id="closeAnnouncement" 
                aria-label="Close" 
                onClick={() => setShowAnnouncement(false)}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Top Header */}
          <header className="topbar">
            <a className="brand" onClick={() => setActiveView('landing')}>
              {renderBrandMark("h-8 sm:h-9 md:h-10")}
              <span>
                <strong>{siteSettings.siteName} <em>{siteSettings.siteSubtitle}</em></strong>
                <small>{siteSettings.tagline}</small>
              </span>
            </a>

            <nav className="desktop-nav" style={{ display: mobileMenuOpen ? 'flex' : undefined }}>
              <div className="nav-group">
                <button onClick={() => setActiveView('landing')}>Home</button>
              </div>
              <div className="nav-group">
                <button className="flex items-center gap-1">Book <ChevronDown className="w-3.5 h-3.5 text-slate-400" /></button>
                <div className="mega-menu">
                  <button onClick={() => { setTransportTab('flight'); setActiveView('landing'); }}>
                    <Plane className="w-3.5 h-3.5 text-teal-600" />
                    <span>Flights</span>
                  </button>
                  <button onClick={() => { setTransportTab('ferry'); setActiveView('landing'); }}>
                    <Ship className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ferries</span>
                  </button>
                  <button onClick={() => { setTransportTab('bus'); setActiveView('landing'); }}>
                    <Bus className="w-3.5 h-3.5 text-teal-600" />
                    <span>Buses</span>
                  </button>
                </div>
              </div>
              <div className="nav-group">
                <button className="flex items-center gap-1">Explore <ChevronDown className="w-3.5 h-3.5 text-slate-400" /></button>
                <div className="mega-menu">
                  <a href="#destinations" onClick={() => setActiveView('landing')}>
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Destinations</span>
                  </a>
                  <a href="#inspiration" onClick={() => setActiveView('landing')}>
                    <Compass className="w-3.5 h-3.5 text-teal-600" />
                    <span>Travel Guides</span>
                  </a>
                  <a href="#destinations" onClick={() => setActiveView('landing')}>
                    <Globe className="w-3.5 h-3.5 text-teal-600" />
                    <span>Things to Do</span>
                  </a>
                </div>
              </div>
              <div className="nav-group">
                <button className="flex items-center gap-1">Deals <ChevronDown className="w-3.5 h-3.5 text-slate-400" /></button>
                <div className="mega-menu">
                  <a href="#deals" onClick={() => setActiveView('landing')}>
                    <Tag className="w-3.5 h-3.5 text-teal-600" />
                    <span>Promo Codes</span>
                  </a>
                  <a href="#deals" onClick={() => setActiveView('landing')}>
                    <Gift className="w-3.5 h-3.5 text-teal-600" />
                    <span>Vouchers</span>
                  </a>
                  <a href="#rewards" onClick={() => setActiveView('landing')}>
                    <Award className="w-3.5 h-3.5 text-teal-600" />
                    <span>Suki Rewards</span>
                  </a>
                </div>
              </div>
              <div className="nav-group">
                <button onClick={() => setActiveView('dashboard')}>My Trips</button>
              </div>
            </nav>

            <div className="top-actions">
              <button className="points flex items-center" onClick={() => setActiveView('dashboard')}>
                <Award className="w-3.5 h-3.5 text-amber-400 mr-1" />
                <div>
                  <b>GOLD SUKI</b>
                  <strong id="pointsValue">{sukiAccount.points.toLocaleString()}</strong> pts
                </div>
              </button>
              <button className="icon-btn" aria-label="Notifications" onClick={() => setNotifModalOpen(true)}>
                <Bell className="w-4 h-4 text-slate-200" />
              </button>
              <button className="profile user flex items-center gap-1.5" onClick={() => { setProfileModalInitialTab('info'); setProfileModalOpen(true); }} title="Profile Settings & KYC Verification">
                <span className="avatar overflow-hidden flex items-center justify-center border border-teal-300">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    userProfile.firstName?.[0] || 'M'
                  )}
                </span>
                <span>{userProfile.firstName || sukiAccount.name.split(' ')[0]}</span>
                {userProfile.kyc.status === 'verified' ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-400/30 flex items-center gap-0.5" title="KYC Verified">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                    KYC
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30 flex items-center gap-0.5" title="KYC Required">
                    <AlertCircle className="w-2.5 h-2.5 text-amber-300" />
                    KYC
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            <button 
              className="mobile-menu hamb" 
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Compass className="w-5 h-5 text-white" />
            </button>
          </header>

          {/* Main Views for Marketplace */}
          {activeView === 'landing' && (
            <main>
              {/* Hero Section */}
              <section className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content hero-copy">
                  <div className="eyebrow"><label>DISCOVER MINDANAO</label></div>
                  <h1>Your Journey<br /><span>Starts Here.</span></h1>
                  <p>Book flights, ferries, and buses across Mindanao while earning <b>Suki Rewards</b> on every journey.</p>
                  <div className="hero-pills chips">
                    <button 
                      className={`hero-pill ${transportTab === 'flight' ? 'active' : ''}`}
                      onClick={() => { setTransportTab('flight'); showToast('Flight mode selected'); }}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>Flights</span>
                    </button>
                    <button 
                      className={`hero-pill ${transportTab === 'ferry' ? 'active' : ''}`}
                      onClick={() => { setTransportTab('ferry'); showToast('Ferry mode selected'); }}
                    >
                      <Ship className="w-3.5 h-3.5" />
                      <span>Ferries</span>
                    </button>
                    <button 
                      className={`hero-pill ${transportTab === 'bus' ? 'active' : ''}`}
                      onClick={() => { setTransportTab('bus'); showToast('Bus mode selected'); }}
                    >
                      <Bus className="w-3.5 h-3.5" />
                      <span>Buses</span>
                    </button>
                  </div>
                </div>
                <div className="hero-script script">More destinations.<br />More stories.<br />Mindanao.</div>

                {/* Search Card */}
                <section className="search-card searchbox" id="transport">
                  <div className="transport-tabs tabs">
                    <button 
                      className={`transport-tab ${transportTab === 'flight' ? 'active' : ''}`}
                      onClick={() => setTransportTab('flight')}
                    >
                      <Plane className="w-4 h-4" />
                      <span>Flights</span>
                    </button>
                    <button 
                      className={`transport-tab ${transportTab === 'ferry' ? 'active' : ''}`}
                      onClick={() => setTransportTab('ferry')}
                    >
                      <Ship className="w-4 h-4" />
                      <span>Ferries</span>
                    </button>
                    <button 
                      className={`transport-tab ${transportTab === 'bus' ? 'active' : ''}`}
                      onClick={() => setTransportTab('bus')}
                    >
                      <Bus className="w-4 h-4" />
                      <span>Buses</span>
                    </button>
                  </div>

                  <div className="search-fields fields">
                    <label>
                      <small>FROM</small>
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <select id="from" value={fromLoc} onChange={(e) => setFromLoc(e.target.value)}>
                        <option>Cagayan de Oro</option>
                        <option>Davao</option>
                        <option>General Santos</option>
                        <option>Zamboanga</option>
                        <option>Butuan</option>
                      </select>
                    </label>

                    <button className="swap flex items-center justify-center" onClick={handleSwap} title="Swap Places">
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>

                    <label>
                      <small>TO</small>
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <select id="to" value={toLoc} onChange={(e) => setToLoc(e.target.value)}>
                        <option>Siargao</option>
                        <option>Camiguin</option>
                        <option>Cebu</option>
                        <option>Manila</option>
                        <option>Lake Sebu</option>
                      </select>
                    </label>

                    <label>
                      <small>DEPARTURE</small>
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <input 
                        id="date"
                        type="date" 
                        value={departureDate} 
                        onChange={(e) => setDepartureDate(e.target.value)} 
                      />
                    </label>

                    <label>
                      <small>PASSENGERS</small>
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                      </select>
                    </label>

                    <button className="search-btn search flex items-center justify-center gap-1.5" onClick={handleSearchTrips}>
                      <Search className="w-4 h-4" />
                      <span>Search Trips</span>
                    </button>
                  </div>

                  {searchMsg && <div className="search-message show">{searchMsg}</div>}
                </section>
              </section>

              {/* Travel Types Section */}
              <section className="section travel-types">
                <div className="section-heading heading">
                  <h2>How do you want to <span>travel?</span></h2>
                  <p>Choose your preferred way to explore Mindanao.</p>
                </div>
                <div className="travel-grid transport-grid">
                  <article className="travel-card flight-card travel flight">
                    <div className="round-icon">
                      <Plane className="w-5 h-5 text-teal-700" />
                    </div>
                    <div>
                      <h3>Flights</h3>
                      <p>Fly across Mindanao</p>
                      <strong>From ₱1,299</strong>
                      <button onClick={() => { setTransportTab('flight'); handleSearchTrips(); }}>Explore Flights →</button>
                    </div>
                  </article>

                  <article className="travel-card ferry-card travel ferry">
                    <div className="round-icon">
                      <Ship className="w-5 h-5 text-teal-700" />
                    </div>
                    <div>
                      <h3>Ferries</h3>
                      <p>Island hopping made easy</p>
                      <strong>From ₱450</strong>
                      <button onClick={() => { setTransportTab('ferry'); handleSearchTrips(); }}>Find Ferries →</button>
                    </div>
                  </article>

                  <article className="travel-card bus-card travel bus">
                    <div className="round-icon">
                      <Bus className="w-5 h-5 text-teal-700" />
                    </div>
                    <div>
                      <h3>Buses</h3>
                      <p>Comfortable land journeys</p>
                      <strong>From ₱350</strong>
                      <button onClick={() => { setTransportTab('bus'); handleSearchTrips(); }}>Find Buses →</button>
                    </div>
                  </article>
                </div>
              </section>

              {/* Explore Mindanao Destinations Grid */}
              <section className="section" id="destinations">
                <div className="section-heading inline heading row">
                  <div>
                    <h2>Explore <span>Mindanao</span></h2>
                    <p>Discover places worth traveling for.</p>
                  </div>
                  <button className="link-btn" onClick={() => showToast('Displaying 20+ verified Mindanao destinations')}>
                    View All Destinations →
                  </button>
                </div>
                <div className="destination-grid dest-grid">
                  <article className="destination">
                    <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80" alt="Siargao" />
                    <div>
                      <h3>Siargao</h3>
                      <p>Surigao del Norte</p>
                      <small>• Surf • Island Life • Beaches</small>
                      <button onClick={() => { setToLoc('Siargao'); handleSearchTrips(); }}>Explore →</button>
                    </div>
                  </article>

                  <article className="destination">
                    <img src="https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=700&q=80" alt="Camiguin" />
                    <div>
                      <h3>Camiguin</h3>
                      <p>Island Born of Fire</p>
                      <small>• Hot Springs • Waterfalls • Beaches</small>
                      <button onClick={() => { setToLoc('Camiguin'); handleSearchTrips(); }}>Explore →</button>
                    </div>
                  </article>

                  <article className="destination">
                    <img src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80" alt="Samal Island" />
                    <div>
                      <h3>Samal Island</h3>
                      <p>Davao del Norte</p>
                      <small>• Resorts • Diving • Island Hopping</small>
                      <button onClick={() => { setToLoc('Davao'); handleSearchTrips(); }}>Explore →</button>
                    </div>
                  </article>

                  <article className="destination">
                    <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80" alt="Bukidnon" />
                    <div>
                      <h3>Bukidnon</h3>
                      <p>The Highland Escape</p>
                      <small>• Mountains • Farms • Adventure</small>
                      <button onClick={() => { setToLoc('Cagayan de Oro'); handleSearchTrips(); }}>Explore →</button>
                    </div>
                  </article>

                  <article className="destination">
                    <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80" alt="Lake Sebu" />
                    <div>
                      <h3>Lake Sebu</h3>
                      <p>South Cotabato</p>
                      <small>• Culture • Nature • Adventure</small>
                      <button onClick={() => { setToLoc('General Santos'); handleSearchTrips(); }}>Explore →</button>
                    </div>
                  </article>

                  <article className="destination">
                    <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80" alt="Dahican" />
                    <div>
                      <h3>Dahican</h3>
                      <p>Mati, Davao Oriental</p>
                      <small>• Surf • Beach • Sunrise</small>
                      <button onClick={() => { setToLoc('Davao'); handleSearchTrips(); }}>Explore →</button>
                    </div>
                  </article>
                </div>
              </section>

              {/* Split Section: Deals & Trending Routes */}
              <section className="section split two">
                <div className="deals" id="deals">
                  <div className="section-heading compact heading row">
                    <div>
                      <h2>Exclusive <span>Suki Deals</span></h2>
                      <p>The more you travel, the more you save.</p>
                    </div>
                    <button className="link-btn" onClick={() => showToast('All Suki vouchers loaded in wallet')}>
                      View All Deals →
                    </button>
                  </div>
                  <div className="deal-grid dealgrid">
                    <article className="deal blue" onClick={() => showToast('Code SUKI300 copied: ₱300 OFF Ferries!')}>
                      <b>₱300 OFF</b>
                      <strong>Ferry Tickets</strong>
                      <small>Use code: SUKI300</small>
                      <Ship className="w-10 h-10 opacity-30 absolute right-3 bottom-2 text-white" />
                    </article>

                    <article className="deal green" onClick={() => showToast('Code MINDANAO15 copied: 15% OFF Buses!')}>
                      <b>15% OFF</b>
                      <strong>Bus Tickets</strong>
                      <small>Use code: MINDANAO15</small>
                      <Bus className="w-10 h-10 opacity-30 absolute right-3 bottom-2 text-white" />
                    </article>

                    <article className="deal orange" onClick={() => showToast('Code FLYSUKI copied: ₱500 OFF Flights!')}>
                      <b>₱500 OFF</b>
                      <strong>Flight Booking</strong>
                      <small>Use code: FLYSUKI</small>
                      <Plane className="w-10 h-10 opacity-30 absolute right-3 bottom-2 text-white" />
                    </article>

                    <article className="deal purple" onClick={() => showToast('Weekend 2X Suki points activated!')}>
                      <b>2X Points</b>
                      <strong>Weekend Travel</strong>
                      <small>Activate Deal →</small>
                      <Award className="w-10 h-10 opacity-30 absolute right-3 bottom-2 text-white" />
                    </article>
                  </div>
                </div>

                <div className="routes">
                  <div className="section-heading compact heading row">
                    <h2>Trending Travel Routes</h2>
                    <a onClick={() => setActiveView('dashboard')} style={{ cursor: 'pointer' }}>View All →</a>
                  </div>
                  <div className="route-list" id="routes">
                    <div className="route">
                      <span className="route-img route-icon">
                        <Plane className="w-4 h-4 text-teal-600" />
                      </span>
                      <div>
                        <b>Cagayan de Oro → Manila</b>
                        <small>Flight · 1h 45m · Rating 4.8</small>
                      </div>
                      <strong>₱2,499+</strong>
                      <button onClick={() => { setFromLoc('Cagayan de Oro'); setToLoc('Manila'); handleSearchTrips(); }}>Book Now</button>
                    </div>

                    <div className="route">
                      <span className="route-img route-icon">
                        <Plane className="w-4 h-4 text-teal-600" />
                      </span>
                      <div>
                        <b>Cagayan de Oro → Cebu</b>
                        <small>Flight · 1h 30m · Rating 4.7</small>
                      </div>
                      <strong>₱1,899+</strong>
                      <button onClick={() => { setFromLoc('Cagayan de Oro'); setToLoc('Cebu'); handleSearchTrips(); }}>Book Now</button>
                    </div>

                    <div className="route">
                      <span className="route-img route-icon">
                        <Plane className="w-4 h-4 text-teal-600" />
                      </span>
                      <div>
                        <b>Davao → Siargao</b>
                        <small>Flight · 1h 55m · Rating 4.9</small>
                      </div>
                      <strong>₱2,199+</strong>
                      <button onClick={() => { setFromLoc('Davao'); setToLoc('Siargao'); handleSearchTrips(); }}>Book Now</button>
                    </div>

                    <div className="route">
                      <span className="route-img route-icon">
                        <Ship className="w-4 h-4 text-teal-600" />
                      </span>
                      <div>
                        <b>CDO → Camiguin</b>
                        <small>Ferry · 1h 30m · Rating 4.6</small>
                      </div>
                      <strong>₱450+</strong>
                      <button onClick={() => { setFromLoc('Cagayan de Oro'); setToLoc('Camiguin'); handleSearchTrips(); }}>Book Now</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Concierge & Rewards Row */}
              <section className="section concierge-row feature-row">
                <article className="concierge" id="concierge">
                  <div className="bot flex items-center justify-center">
                    <Bot className="w-12 h-12 text-teal-300" />
                  </div>
                  <div className="concierge-copy">
                    <h2>Meet Your AI Travel Concierge</h2>
                    <p>Tell us where you want to go. We'll help plan the journey.</p>
                    <div className="chat-bubble">I have ₱5,000 and want to travel from CDO for 3 days.</div>
                    <button className="flex items-center gap-1.5" onClick={() => setAiModalOpen(true)}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Plan my trip</span>
                    </button>
                  </div>
                  <div className="ai-result">
                    <b>CDO → Camiguin</b>
                    <small>Ferry · 2–3 night stay · Island tour</small>
                    <em>Estimated budget: ₱4,450</em>
                    <button onClick={() => { setToLoc('Camiguin'); handleSearchTrips(); }}>View Trip Plan →</button>
                  </div>
                </article>

                <article className="rewards suki" id="rewards">
                  <div>
                    <span className="mini-logo flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </span>
                    <h3>GOLD SUKI</h3>
                    <strong id="rewardPoints">{sukiAccount.points.toLocaleString()}</strong> 
                    <span>Points</span>
                  </div>
                  <div className="progress"><span style={{ width: '72%' }}></span></div>
                  <small>750 pts until Platinum</small>
                  <div className="reward-actions">
                    <button onClick={() => showToast('Voucher wallet: 3 rewards ready to apply at checkout!')}>Redeem Rewards</button>
                    <button onClick={() => setActiveView('dashboard')}>View Benefits</button>
                  </div>
                  <ul>
                    <li>Discount vouchers</li>
                    <li>Travel discounts</li>
                    <li>Birthday rewards</li>
                    <li>Priority deals</li>
                    <li>Bonus points</li>
                  </ul>
                </article>
              </section>

              {/* Travel Inspiration */}
              <section className="section" id="inspiration">
                <div className="section-heading inline heading">
                  <h2>Travel <span>Inspiration</span></h2>
                  <p>Real stories. Helpful guides. Endless adventures.</p>
                </div>
                <div className="article-grid articles">
                  <article onClick={() => showToast('Opening: 10 Must-Visit Places in Mindanao')}>
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80" alt="" />
                    <small>TRAVEL GUIDE</small>
                    <h3>10 Must-Visit Places in Mindanao Before You Die</h3>
                    <span>→</span>
                  </article>

                  <article onClick={() => showToast('Opening: The Ultimate Siargao Weekend Guide')}>
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80" alt="" />
                    <small>TRAVEL GUIDE</small>
                    <h3>The Ultimate Siargao Weekend Guide</h3>
                    <span>→</span>
                  </article>

                  <article onClick={() => showToast('Opening: Best Budget Destinations in Mindanao')}>
                    <img src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80" alt="" />
                    <small>BUDGET TRAVEL</small>
                    <h3>Best Budget Destinations in Mindanao</h3>
                    <span>→</span>
                  </article>

                  <article onClick={() => showToast('Opening: Hidden Beaches You Need to Discover')}>
                    <img src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=900&q=80" alt="" />
                    <small>ADVENTURE</small>
                    <h3>Hidden Beaches You Need to Discover</h3>
                    <span>→</span>
                  </article>
                </div>
              </section>

              {/* Steps Section */}
              <section className="steps">
                <div className="section steps-inner">
                  <div className="steps-title">
                    <h2>Plan Your Trip</h2>
                    <p>It's easy, fast, and rewarding.</p>
                  </div>
                  <div className="step">
                    <b>01</b>
                    <span className="flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </span>
                    <div><strong>Discover</strong><small>Find your next destination.</small></div>
                  </div>
                  <div className="step">
                    <b>02</b>
                    <span className="flex items-center justify-center">
                      <Plane className="w-3.5 h-3.5 text-white" />
                    </span>
                    <div><strong>Book</strong><small>Flights, ferries and buses.</small></div>
                  </div>
                  <div className="step">
                    <b>03</b>
                    <span className="flex items-center justify-center">
                      <Ticket className="w-3.5 h-3.5 text-white" />
                    </span>
                    <div><strong>Travel</strong><small>Get your digital boarding pass.</small></div>
                  </div>
                  <div className="step">
                    <b>04</b>
                    <span className="flex items-center justify-center">
                      <Award className="w-3.5 h-3.5 text-white" />
                    </span>
                    <div><strong>Earn</strong><small>Collect Suki Points.</small></div>
                  </div>
                  <div className="steps-script">One platform.<br />Every journey.<br />All across Mindanao.</div>
                </div>
              </section>
            </main>
          )}

          {/* Search Results View */}
          {activeView === 'search-results' && (
            <SearchResults
              schedules={schedules}
              searchParams={{
                transportType: transportTab as TransportType,
                origin: fromLoc,
                destination: toLoc,
                date: departureDate,
                passengers: passengers
              }}
              onSelectSchedule={(sch) => {
                setSelectedSchedule(sch);
                setActiveView('checkout');
              }}
              onBackToSearch={() => setActiveView('landing')}
            />
          )}

          {/* Booking Checkout View */}
          {activeView === 'checkout' && selectedSchedule && (
            <BookingCheckout
              schedule={selectedSchedule}
              passengersCount={passengers}
              sukiAccount={sukiAccount}
              vouchers={vouchers}
              userProfile={userProfile}
              onOpenKyc={() => {
                setProfileModalInitialTab('kyc');
                setProfileModalOpen(true);
              }}
              onQuickVerifyKyc={handleQuickVerifyKyc}
              onCompleteBooking={handleCompleteBooking}
              onCancel={() => setActiveView('search-results')}
            />
          )}

          {/* Booking Confirmation View */}
          {activeView === 'confirmation' && activeBooking && (
            <BookingConfirmation
              booking={activeBooking}
              onViewTrips={() => setActiveView('dashboard')}
              onViewDigitalTicket={(b) => setDigitalTicketBooking(b)}
              onHome={() => setActiveView('landing')}
            />
          )}

          {/* Footer */}
          <footer id="footer">
            <div className="footer-main">
              <div className="footer-brand">
                {renderBrandMark("h-7 sm:h-8")}
                <div>
                  <strong>{siteSettings.siteName} <em>{siteSettings.siteSubtitle}</em></strong>
                  <small>{siteSettings.tagline}</small>
                </div>
              </div>
              <div className="footer-links">
                <button onClick={() => showToast('Mindanao Ticket Hub is the premier travel gateway across Southern Philippines.')}>About Us</button>
                <button onClick={() => showToast(`Support contact: ${siteSettings.contactEmail} or ${siteSettings.contactPhone}`)}>Contact</button>
                <button onClick={() => showToast('Help Center: 24/7 travel assistance available')}>Help Center</button>
                <button onClick={() => showToast('Travel Policies: 24h flexible cancellations on select routes')}>Travel Policies</button>
                <button onClick={() => showToast('Terms: Official Philippine domestic ticketing conditions apply')}>Terms & Conditions</button>
                <button onClick={() => showToast('Privacy: User data encrypted with standard Philippine privacy compliance')}>Privacy Policy</button>
                <button onClick={() => setVercelModalOpen(true)} className="text-teal-400 font-bold flex items-center gap-1">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Deploy to Vercel</span>
                </button>
              </div>
              <div className="stores flex items-center gap-2">
                <button
                  onClick={() => setVercelModalOpen(true)}
                  className="bg-black text-white border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold hover:bg-slate-900 transition-colors"
                >
                  <svg className="w-3 h-3 fill-white" viewBox="0 0 1155 1000">
                    <path d="m577.3 0 577.4 1000H0z" />
                  </svg>
                  <span>Deploy to Vercel</span>
                </button>
                <button onClick={() => showToast('Google Play Android app coming soon!')}>Google Play</button>
                <button onClick={() => showToast('iOS App Store app coming soon!')}>App Store</button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ========================================================
          ADMIN MODALS & POPUPS
      ======================================================== */}

      {/* Modal: Add Sub-Admin */}
      {showAddSubAdminModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddSubAdminModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-base font-extrabold text-slate-900">Create Sub-Admin Account</h2>
              <button 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg" 
                onClick={() => setShowAddSubAdminModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubAdmin} className="space-y-3">
              <div className="admin-form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Joy Belmonte"
                  value={newSubAdminForm.name}
                  onChange={(e) => setNewSubAdminForm({ ...newSubAdminForm, name: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@mtth.ph"
                  value={newSubAdminForm.email}
                  onChange={(e) => setNewSubAdminForm({ ...newSubAdminForm, email: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Admin Role & Permissions</label>
                <select 
                  value={newSubAdminForm.role}
                  onChange={(e) => setNewSubAdminForm({ ...newSubAdminForm, role: e.target.value as any })}
                >
                  <option value="Operations Admin">Operations Admin (Routes, Schedules, Refunds)</option>
                  <option value="Ticketing Agent">Ticketing Agent (Bookings & Issuance)</option>
                  <option value="Support Agent">Support Agent (Inquiries & Customer Care)</option>
                  <option value="Super Admin">Super Admin (Full Administrative Privileges)</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Temporary Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  value={newSubAdminForm.password}
                  onChange={(e) => setNewSubAdminForm({ ...newSubAdminForm, password: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600"
                  onClick={() => setShowAddSubAdminModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary px-5 py-2 rounded-xl text-xs font-bold">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Route */}
      {showAddRouteModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddRouteModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-base font-extrabold text-slate-900">+ Add Transportation Route</h2>
              <button 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg" 
                onClick={() => setShowAddRouteModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRoute} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="admin-form-group">
                  <label>Origin</label>
                  <input 
                    type="text" 
                    value={newRouteForm.origin}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, origin: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Destination</label>
                  <input 
                    type="text" 
                    value={newRouteForm.destination}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, destination: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="admin-form-group">
                  <label>Transport Type</label>
                  <select 
                    value={newRouteForm.transportType}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, transportType: e.target.value as any })}
                  >
                    <option value="ferry">Ferry / RoRo</option>
                    <option value="flight">Flight</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Operator Name</label>
                  <input 
                    type="text" 
                    value={newRouteForm.operatorName}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, operatorName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="admin-form-group">
                  <label>Duration</label>
                  <input 
                    type="text" 
                    value={newRouteForm.duration}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, duration: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Base Fare (₱)</label>
                  <input 
                    type="number" 
                    value={newRouteForm.baseFare}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, baseFare: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600"
                  onClick={() => setShowAddRouteModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary px-5 py-2 rounded-xl text-xs font-bold">
                  Publish Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Promo */}
      {showAddPromoModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddPromoModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-base font-extrabold text-slate-900">+ Create Promo Voucher</h2>
              <button 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg" 
                onClick={() => setShowAddPromoModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePromo} className="space-y-3">
              <div className="admin-form-group">
                <label>Promo Code (Uppercase)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MINDAFEST"
                  value={newPromoForm.code}
                  onChange={(e) => setNewPromoForm({ ...newPromoForm, code: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Promo Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mindanao Festival Special"
                  value={newPromoForm.title}
                  onChange={(e) => setNewPromoForm({ ...newPromoForm, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="admin-form-group">
                  <label>Discount Value (₱)</label>
                  <input 
                    type="number" 
                    value={newPromoForm.discountValue}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, discountValue: Number(e.target.value) })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Minimum Spend (₱)</label>
                  <input 
                    type="number" 
                    value={newPromoForm.minSpend}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, minSpend: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600"
                  onClick={() => setShowAddPromoModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary px-5 py-2 rounded-xl text-xs font-bold">
                  Save Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Operator */}
      {showAddOperatorModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddOperatorModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-base font-extrabold text-slate-900">+ Onboard Partner Operator</h2>
              <button 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg" 
                onClick={() => setShowAddOperatorModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="admin-form-group">
                <label>Operator Company Name</label>
                <input type="text" placeholder="e.g. FastCat Mindanao Ferry" />
              </div>
              <div className="admin-form-group">
                <label>Transport Mode</label>
                <select>
                  <option>Ferry & RoRo</option>
                  <option>Bus Line</option>
                  <option>Airlines</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Contact Number / Dispatch</label>
                <input type="text" placeholder="+63 917..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600"
                  onClick={() => setShowAddOperatorModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="primary px-5 py-2 rounded-xl text-xs font-bold"
                  onClick={() => {
                    setShowAddOperatorModal(false);
                    showToast('Partner operator onboarded and verified!');
                  }}
                >
                  Onboard Operator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Destination */}
      {showAddDestinationModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddDestinationModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-base font-extrabold text-slate-900">+ Add Mindanao Destination</h2>
              <button 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg" 
                onClick={() => setShowAddDestinationModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="admin-form-group">
                <label>Destination Name</label>
                <input type="text" placeholder="e.g. Britania Islands" />
              </div>
              <div className="admin-form-group">
                <label>Province / Region</label>
                <input type="text" placeholder="e.g. Surigao del Sur" />
              </div>
              <div className="admin-form-group">
                <label>Hero Image URL</label>
                <input type="text" placeholder="https://images.unsplash.com/..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600"
                  onClick={() => setShowAddDestinationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="primary px-5 py-2 rounded-xl text-xs font-bold"
                  onClick={() => {
                    setShowAddDestinationModal(false);
                    showToast('Destination added to Mindanao Tourism guide!');
                  }}
                >
                  Publish Destination
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SHARED USER MODALS
      ======================================================== */}

      {/* Digital Ticket Modal (dashboard.html spec) */}
      {selectedTicketCode && (
        <div className="ticket-modal show" id="ticket">
          <div>
            <button onClick={() => setSelectedTicketCode(null)}>
              <X className="w-4 h-4" />
            </button>
            <div className="qr flex items-center justify-center my-3">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <h2>Digital Ticket</h2>
            <b id="ticketNo">{selectedTicketCode}</b>
            <p>Show this ticket QR code at the port or bus terminal gate.</p>
            <span>MTTH · Verified Mindanao Booking</span>
          </div>
        </div>
      )}

      {/* Full Digital Ticket Modal with barcode / itinerary */}
      {digitalTicketBooking && (
        <DigitalTicketModal 
          booking={digitalTicketBooking}
          onClose={() => setDigitalTicketBooking(null)}
        />
      )}

      {/* AI Concierge Modal */}
      <div 
        className={`modal ${aiModalOpen ? 'show' : ''}`} 
        onClick={(e) => { if ((e.target as HTMLElement).id === 'aiModal') setAiModalOpen(false); }} 
        id="aiModal"
      >
        <div className="modal-card">
          <button className="modal-close flex items-center justify-center" onClick={() => setAiModalOpen(false)} aria-label="Close modal">
            <X className="w-4 h-4 text-slate-600" />
          </button>
          <div className="bot flex items-center justify-center my-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shadow-inner">
              <Bot className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <h2>AI Travel Concierge</h2>
          <p>Tell us your budget, destination, or travel style. Powered by Google Gemini AI.</p>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5 justify-center my-2">
            {[
              { label: '3-Day Camiguin Island (₱4,500)', prompt: '₱4,500 for 3 days in Camiguin Island from CDO' },
              { label: 'Siargao Surf & Lagoon (₱8,000)', prompt: '₱8,000 for 4 days in Siargao Island surfing and Sugba Lagoon' },
              { label: 'Bukidnon Nature Highlands (₱3,500)', prompt: '₱3,500 for 2 days in Dahilayan Bukidnon highland retreat' },
              { label: 'Davao to Samal Island (₱5,000)', prompt: '₱5,000 for 3 days in Davao City and Samal Island beaches' }
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setAiBudgetInput(chip.prompt);
                  const budgetPrompt = chip.prompt;
                  setAiLoading(true);
                  fetch('/api/ai/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      prompt: budgetPrompt,
                      destination: chip.label.split(' ')[1] || 'Camiguin',
                      budget: budgetPrompt,
                      style: 'Adventure & Leisure'
                    })
                  })
                    .then(res => res.json())
                    .then(data => {
                      setAiPlanOutput(data.recommendation || `Suggested: ${fromLoc} → ${chip.label}\nBudget: ${budgetPrompt}\n• Day 1 — Ferry / Flight arrival\n• Day 2 — Island tour & local attractions\n• Day 3 — Scenic spots & return trip\nEstimated budget: ${budgetPrompt}`);
                    })
                    .catch(() => {
                      setAiPlanOutput(`Suggested: ${fromLoc} → ${chip.label}\nBudget: ${budgetPrompt}\n• Day 1 — Ferry / Flight arrival\n• Day 2 — Island tour & local attractions\n• Day 3 — Scenic spots & return trip\nEstimated budget: ${budgetPrompt}`);
                    })
                    .finally(() => setAiLoading(false));
                }}
                className="text-[11px] font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="ai-input">
            <input 
              id="aiInput"
              placeholder="e.g. ₱5,000 for 3 days in Camiguin from CDO"
              value={aiBudgetInput}
              onChange={(e) => setAiBudgetInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateAiPlan(); }}
            />
            <button onClick={handleGenerateAiPlan} disabled={aiLoading} className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiLoading ? 'Thinking…' : 'Generate Plan'}</span>
            </button>
          </div>
          {aiPlanOutput && (
            <div className="generated-plan" id="plan">
              <div style={{ background: '#edf9f8', borderRadius: '12px', padding: '14px', border: '1px solid #c7f2ed' }}>
                <b style={{ color: '#093c4e', display: 'block', marginBottom: '6px' }}>Mindanao Itinerary</b>
                <p style={{ margin: '6px 0', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{aiPlanOutput}</p>
                <button 
                  onClick={() => { setAiModalOpen(false); handleSearchTrips(); }}
                  style={{ marginTop: '10px', background: '#08aaa8', color: '#fff', borderRadius: '10px', padding: '8px 14px', fontSize: '11px', fontWeight: 700 }}
                >
                  Book This Journey →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <ProfileModal 
          userProfile={userProfile}
          sukiAccount={sukiAccount} 
          initialTab={profileModalInitialTab}
          onClose={() => setProfileModalOpen(false)} 
          onUpdateProfile={handleUpdateProfile}
          onQuickVerifyKyc={handleQuickVerifyKyc}
        />
      )}

      {/* Notifications Modal */}
      {notifModalOpen && (
        <NotificationCenter
          notifications={[
            { id: '1', title: 'Upcoming Trip', message: 'Your Camiguin ferry trip is on October 18!', type: 'reminder', timestamp: '2h ago', read: false },
            { id: '2', title: 'Suki Points Credited', message: '+250 pts added to your Gold Suki account', type: 'suki', timestamp: '1d ago', read: true }
          ]}
          onClose={() => setNotifModalOpen(false)}
          onMarkAllRead={() => showToast('All notifications marked as read')}
        />
      )}

      {/* Vercel Deploy Modal */}
      {vercelModalOpen && (
        <VercelDeployModal
          onClose={() => setVercelModalOpen(false)}
          onToast={showToast}
        />
      )}

      {/* Toast Notification */}
      <div className={`toast ${toastVisible ? 'show' : ''}`} id="toast">
        {toastMessage}
      </div>
    </div>
  );
}
