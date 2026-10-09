import express, { Request, Response, NextFunction } from 'express';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { 
  MOCK_DESTINATIONS, 
  MOCK_OPERATORS, 
  MOCK_SCHEDULES, 
  MOCK_VOUCHERS, 
  MOCK_PROMOTIONS, 
  MOCK_GUIDES, 
  MOCK_REVIEWS, 
  INITIAL_SUKI_ACCOUNT, 
  MOCK_POINT_HISTORY, 
  MOCK_SUPPORT_TICKETS, 
  MOCK_NOTIFICATIONS,
  MOCK_CUSTOMERS_KYC,
  DEFAULT_SAMPLE_BOOKINGS
} from '../src/mockData';
import { Booking } from '../src/types';

// Shared Cloud Firestore database instance for Vercel Serverless
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig, 'vercel-api') : getApp('vercel-api');
const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS & Security Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Normalize URL to handle both direct and rewritten routes (/api/... or /...)
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (!req.url.startsWith('/api') && !req.url.startsWith('/api/')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// Serverless persistent memory stores
let schedulesStore = [...MOCK_SCHEDULES];
let vouchersStore = [...MOCK_VOUCHERS];
let bookingsStore: Booking[] = [...DEFAULT_SAMPLE_BOOKINGS];
let customersKycStore = [...MOCK_CUSTOMERS_KYC];
let subAdminsStore = [
  {
    id: 'sub-super-admin',
    name: 'Mark Kenneth Ulgasan',
    email: 'markkennethulgasan@gmail.com',
    role: 'Super Admin',
    status: 'Active',
    permissions: ['Full Access', 'Super Admin', 'Manage Bookings', 'Manage Operators', 'Issue Refunds', 'Site Settings'],
    createdAt: '2026-10-01',
    lastActive: 'Online now'
  },
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
];
let siteSettingsStore = {
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
let sukiStore = { ...INITIAL_SUKI_ACCOUNT };
let pointHistoryStore = [...MOCK_POINT_HISTORY];
let supportTicketsStore = [...MOCK_SUPPORT_TICKETS];
let notificationsStore = [...MOCK_NOTIFICATIONS];

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    platform: 'Vercel Serverless Function',
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/destinations', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = [...MOCK_DESTINATIONS];
  if (category && category !== 'all') {
    results = results.filter(d => d.category === category);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(d => d.name.toLowerCase().includes(q) || d.province.toLowerCase().includes(q) || d.shortDescription.toLowerCase().includes(q));
  }
  res.json(results);
});

app.get('/api/destinations/:slug', (req: Request, res: Response) => {
  const dest = MOCK_DESTINATIONS.find(d => d.slug === req.params.slug);
  if (!dest) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  res.json(dest);
});

app.get('/api/operators', (_req: Request, res: Response) => {
  res.json(MOCK_OPERATORS);
});

app.get('/api/schedules', (req: Request, res: Response) => {
  const { origin, destination, transportType } = req.query;
  let schedules = [...schedulesStore];

  if (origin && typeof origin === 'string') {
    schedules = schedules.filter(s => s.origin.toLowerCase().includes(origin.toLowerCase()));
  }
  if (destination && typeof destination === 'string') {
    schedules = schedules.filter(s => s.destination.toLowerCase().includes(destination.toLowerCase()));
  }
  if (transportType && transportType !== 'all') {
    schedules = schedules.filter(s => s.transportType === transportType);
  }

  res.json(schedules);
});

app.get('/api/vouchers', (_req: Request, res: Response) => {
  res.json(vouchersStore);
});

app.post('/api/vouchers/claim', (req: Request, res: Response) => {
  const { voucherId } = req.body;
  vouchersStore = vouchersStore.map(v => v.id === voucherId ? { ...v, claimed: true } : v);
  res.json({ success: true, vouchers: vouchersStore });
});

app.get('/api/promotions', (_req: Request, res: Response) => {
  res.json(MOCK_PROMOTIONS);
});

app.get('/api/guides', (_req: Request, res: Response) => {
  res.json(MOCK_GUIDES);
});

app.get('/api/guides/:slug', (req: Request, res: Response) => {
  const guide = MOCK_GUIDES.find(g => g.slug === req.params.slug);
  if (!guide) {
    return res.status(404).json({ error: 'Guide not found' });
  }
  res.json(guide);
});

app.get('/api/reviews', (_req: Request, res: Response) => {
  res.json(MOCK_REVIEWS);
});

app.get('/api/suki', (_req: Request, res: Response) => {
  res.json({
    account: sukiStore,
    pointHistory: pointHistoryStore
  });
});

app.get(['/api/bookings', '/bookings'], async (_req: Request, res: Response) => {
  try {
    const snap = await getDoc(doc(firestoreDb, 'app_state', 'main'));
    if (snap.exists() && Array.isArray(snap.data()?.bookings)) {
      bookingsStore = snap.data()!.bookings;
    }
  } catch {}
  res.json(bookingsStore);
});

app.post(['/api/bookings', '/bookings'], async (req: Request, res: Response) => {
  const bookingData = req.body;
  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    bookingCode: `MTTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    userId: bookingData.userId || sukiStore.userId || 'guest-user',
    ...bookingData,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    qrCodeToken: `MTTH-QR-SECURE-${Date.now()}`
  };

  // Pull existing bookings from Firestore first to avoid overwriting on serverless cold starts
  try {
    const snap = await getDoc(doc(firestoreDb, 'app_state', 'main'));
    if (snap.exists() && Array.isArray(snap.data()?.bookings)) {
      bookingsStore = snap.data()!.bookings;
    }
  } catch {}

  bookingsStore = [newBooking, ...bookingsStore.filter(b => b.id !== newBooking.id)];

  // Sync new booking into Firestore with clean sanitized JSON payload
  try {
    const payload = JSON.parse(JSON.stringify({
      bookings: bookingsStore,
      version: Date.now(),
      updatedAt: new Date().toISOString()
    }));
    await setDoc(doc(firestoreDb, 'app_state', 'main'), payload, { merge: true });
  } catch (err) {
    console.warn('Vercel API Firestore booking write notice:', err);
  }

  const pointsEarned = Math.round(newBooking.totalPaid * 0.1);
  sukiStore.points += pointsEarned;
  sukiStore.completedTrips += 1;
  pointHistoryStore.unshift({
    id: `pt-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    description: `Booking completed: ${newBooking.origin} to ${newBooking.destination}`,
    pointsChange: pointsEarned,
    type: 'earned'
  });

  notificationsStore.unshift({
    id: `notif-${Date.now()}`,
    title: 'Booking Confirmed!',
    message: `Your trip from ${newBooking.origin} to ${newBooking.destination} is confirmed. Booking Code: ${newBooking.bookingCode}`,
    type: 'booking',
    timestamp: 'Just now',
    read: false,
    link: '/my-trips'
  });

  res.json(newBooking);
});

// Official Digital Ticket Verification Endpoint: Look up by Reference Number, Booking Code or QR Token
app.get('/api/tickets/verify/:code', async (req: Request, res: Response) => {
  const query = (req.params.code || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ found: false, error: 'Reference number is required' });
  }

  const cleanQuery = query.replace(/[^a-z0-9]/g, '');

  let listToSearch = [...bookingsStore];
  try {
    const snap = await getDoc(doc(firestoreDb, 'app_state', 'main'));
    if (snap.exists() && Array.isArray(snap.data()?.bookings)) {
      listToSearch = snap.data().bookings;
    }
  } catch {}

  const match = listToSearch.find((b: any) => {
    const code = (b.bookingCode || '').toLowerCase();
    const id = (b.id || '').toLowerCase();
    const qr = (b.qrCodeToken || '').toLowerCase();
    const cleanCode = code.replace(/[^a-z0-9]/g, '');
    const cleanQr = qr.replace(/[^a-z0-9]/g, '');

    return code === query || id === query || qr === query ||
           cleanCode === cleanQuery || cleanQr.includes(cleanQuery) || (cleanQuery.length >= 6 && cleanCode.includes(cleanQuery));
  });

  if (match) {
    res.json({
      found: true,
      verified: match.status === 'confirmed',
      status: match.status,
      booking: match,
      verifiedAt: new Date().toISOString(),
      authenticityCertificate: `MTTH-AUTH-DOT-${match.bookingCode}-${Date.now().toString(36).toUpperCase()}`
    });
  } else {
    res.json({
      found: false,
      verified: false,
      error: `Ticket reference "${req.params.code}" was not found in the verified ticketing ledger.`
    });
  }
});

app.post(['/api/bookings/:id/cancel', '/bookings/:id/cancel'], async (req: Request, res: Response) => {
  try {
    const snap = await getDoc(doc(firestoreDb, 'app_state', 'main'));
    if (snap.exists() && Array.isArray(snap.data()?.bookings)) {
      bookingsStore = snap.data()!.bookings;
    }
  } catch {}

  bookingsStore = bookingsStore.map(b => {
    if (b.id === req.params.id) {
      return {
        ...b,
        status: 'cancelled',
        refundStatus: 'requested',
        refundAmount: Math.round(b.totalPaid * 0.8)
      };
    }
    return b;
  });

  try {
    const payload = JSON.parse(JSON.stringify({
      bookings: bookingsStore,
      version: Date.now(),
      updatedAt: new Date().toISOString()
    }));
    await setDoc(doc(firestoreDb, 'app_state', 'main'), payload, { merge: true });
  } catch (err) {
    console.warn('Vercel API Firestore cancel write notice:', err);
  }

  res.json({ success: true, bookings: bookingsStore });
});

app.get('/api/support', (_req: Request, res: Response) => {
  res.json(supportTicketsStore);
});

app.post('/api/support', (req: Request, res: Response) => {
  const ticket = req.body;
  const newTicket = {
    id: `sup-${Date.now()}`,
    ticketNo: `MTTH-${Math.floor(1000 + Math.random() * 9000)}`,
    ...ticket,
    status: 'Open' as const,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  supportTicketsStore.unshift(newTicket);
  res.json(newTicket);
});

app.get('/api/notifications', (_req: Request, res: Response) => {
  res.json(notificationsStore);
});

app.post('/api/notifications/read', (_req: Request, res: Response) => {
  notificationsStore = notificationsStore.map(n => ({ ...n, read: true }));
  res.json({ success: true });
});

app.post('/api/ai/recommend', async (req: Request, res: Response) => {
  const { prompt, destination, budget, style } = req.body;
  
  if (!ai) {
    return res.json({ 
      recommendation: `Here is a wonderful itinerary for ${destination || 'Mindanao'}! Enjoy exploring the stunning beaches, local culture, and delicious cuisine with a budget of ${budget || 'moderate'}. (AI API Key not configured, showing smart curation).` 
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an expert Mindanao travel concierge for Mindanao Travel Ticketing Hub (MTTH). Provide a warm, helpful, detailed travel recommendation and 3-day itinerary for destination "${destination || 'Camiguin'}", travel style "${style || 'Adventure & Leisure'}", and budget "${budget || 'Mid-range'}". ${prompt || ''}. IMPORTANT: Do NOT use any emojis in your response. Keep all formatting clean, professional, and readable without emojis.`,
    });

    res.json({ recommendation: response.text });
  } catch (error) {
    console.error('Gemini AI error:', error);
    res.status(500).json({ error: 'Failed to generate AI recommendation' });
  }
});

let serverlessStateVersion = 1;

// Admin & Cross-Device State Sync API backed by Cloud Firestore
app.get(['/api/admin/state', '/admin/state'], async (_req: Request, res: Response) => {
  try {
    const snap = await getDoc(doc(firestoreDb, 'app_state', 'main'));
    if (snap.exists()) {
      const data = snap.data();
      if (data) {
        if (data.schedules) schedulesStore = data.schedules;
        if (data.vouchers) vouchersStore = data.vouchers;
        if (data.bookings) bookingsStore = data.bookings;
        if (data.customersKyc) customersKycStore = data.customersKyc;
        if (data.subAdmins) subAdminsStore = data.subAdmins;
        if (data.siteSettings) siteSettingsStore = data.siteSettings;
        if (data.sukiAccount) sukiStore = data.sukiAccount;
        if (data.version) serverlessStateVersion = data.version;

        return res.json({
          version: data.version || serverlessStateVersion,
          schedules: data.schedules || schedulesStore,
          vouchers: data.vouchers || vouchersStore,
          bookings: data.bookings || bookingsStore,
          customersKyc: data.customersKyc || customersKycStore,
          subAdmins: data.subAdmins || subAdminsStore,
          siteSettings: data.siteSettings || siteSettingsStore,
          sukiAccount: data.sukiAccount || sukiStore
        });
      }
    }
  } catch (err) {
    console.warn('Vercel API Firestore read error:', err);
  }

  res.json({
    version: serverlessStateVersion,
    schedules: schedulesStore,
    vouchers: vouchersStore,
    bookings: bookingsStore,
    customersKyc: customersKycStore,
    subAdmins: subAdminsStore,
    siteSettings: siteSettingsStore,
    sukiAccount: sukiStore
  });
});

app.get(['/api/admin/state/version', '/admin/state/version'], async (_req: Request, res: Response) => {
  try {
    const snap = await getDoc(doc(firestoreDb, 'app_state', 'main'));
    if (snap.exists() && snap.data()?.version) {
      serverlessStateVersion = snap.data()!.version;
    }
  } catch {}

  res.json({
    version: serverlessStateVersion,
    timestamp: new Date().toISOString()
  });
});

app.post(['/api/admin/settings', '/admin/settings'], async (req: Request, res: Response) => {
  const newSettings = req.body;
  if (newSettings && typeof newSettings === 'object') {
    siteSettingsStore = { ...siteSettingsStore, ...newSettings };
    serverlessStateVersion = Date.now();
    try {
      const payload = JSON.parse(JSON.stringify({
        version: serverlessStateVersion,
        siteSettings: siteSettingsStore,
        updatedAt: new Date().toISOString()
      }));
      await setDoc(doc(firestoreDb, 'app_state', 'main'), payload, { merge: true });
    } catch (err) {
      console.warn('Vercel API Firestore settings write error:', err);
    }
  }
  res.json({ success: true, version: serverlessStateVersion, siteSettings: siteSettingsStore });
});

app.post(['/api/admin/state', '/admin/state'], async (req: Request, res: Response) => {
  const { schedules, vouchers, bookings, customersKyc, subAdmins, siteSettings, sukiAccount } = req.body;
  if (schedules) schedulesStore = schedules;
  if (vouchers) vouchersStore = vouchers;
  if (bookings) bookingsStore = bookings;
  if (customersKyc) customersKycStore = customersKyc;
  if (subAdmins) subAdminsStore = subAdmins;
  if (siteSettings) siteSettingsStore = siteSettings;
  if (sukiAccount) sukiStore = sukiAccount;
  serverlessStateVersion = Date.now();

  try {
    const rawPayload = {
      version: serverlessStateVersion,
      schedules: schedulesStore,
      vouchers: vouchersStore,
      bookings: bookingsStore,
      customersKyc: customersKycStore,
      subAdmins: subAdminsStore,
      siteSettings: siteSettingsStore,
      sukiAccount: sukiStore,
      updatedAt: new Date().toISOString()
    };
    const payload = JSON.parse(JSON.stringify(rawPayload));
    await setDoc(doc(firestoreDb, 'app_state', 'main'), payload, { merge: true });
  } catch (err) {
    console.warn('Vercel API Firestore state write error:', err);
  }

  res.json({ success: true, version: serverlessStateVersion });
});

app.get(['/api/admin/metrics', '/admin/metrics'], (_req: Request, res: Response) => {
  res.json({
    totalBookings: bookingsStore.length,
    totalRevenue: bookingsStore.reduce((sum, b) => sum + b.totalPaid, 0),
    totalTravelers: 12450,
    activeOperators: MOCK_OPERATORS.length,
    destinationsCount: MOCK_DESTINATIONS.length,
    sukiMembers: 8420
  });
});

// Fallback 404 handler for unmatched API routes
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API route not found' });
});

export default function handler(req: Request, res: Response) {
  return app(req, res);
}

export { app };
