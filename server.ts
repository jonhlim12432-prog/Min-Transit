import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
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
  MOCK_CUSTOMERS_KYC 
} from './src/mockData';
import { Booking } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Persistent DB File for Cross-Device / Cross-User Vercel Synchronization
const DB_FILE = path.join(__dirname, 'server-db.json');
let dbState: any = {};
try {
  if (fs.existsSync(DB_FILE)) {
    dbState = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  }
} catch {}

let schedulesStore = dbState.schedules || [...MOCK_SCHEDULES];
let vouchersStore = dbState.vouchers || [...MOCK_VOUCHERS];
let bookingsStore: Booking[] = dbState.bookings || [];
let customersKycStore = dbState.customersKyc || [...MOCK_CUSTOMERS_KYC];
let subAdminsStore = dbState.subAdmins || [
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
let siteSettingsStore = dbState.siteSettings || {
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
let sukiStore = dbState.sukiAccount || { ...INITIAL_SUKI_ACCOUNT };
let pointHistoryStore = [...MOCK_POINT_HISTORY];
let supportTicketsStore = [...MOCK_SUPPORT_TICKETS];
let notificationsStore = [...MOCK_NOTIFICATIONS];

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      schedules: schedulesStore,
      vouchers: vouchersStore,
      bookings: bookingsStore,
      customersKyc: customersKycStore,
      subAdmins: subAdminsStore,
      siteSettings: siteSettingsStore,
      sukiAccount: sukiStore
    }, null, 2));
  } catch {}
};

// Real-Time Cross-Device Synchronization Engine
let stateVersion = Date.now();
const sseClients = new Set<express.Response>();

const broadcastState = () => {
  stateVersion = Date.now();
  const payload = JSON.stringify({
    type: 'update',
    version: stateVersion,
    timestamp: new Date().toISOString(),
    data: {
      schedules: schedulesStore,
      vouchers: vouchersStore,
      bookings: bookingsStore,
      customersKyc: customersKycStore,
      subAdmins: subAdminsStore,
      siteSettings: siteSettingsStore,
      sukiAccount: sukiStore
    }
  });

  const message = `data: ${payload}\n\n`;
  for (const client of Array.from(sseClients)) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
};

// Gemini AI setup
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/destinations', (req, res) => {
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

app.get('/api/destinations/:slug', (req, res) => {
  const dest = MOCK_DESTINATIONS.find(d => d.slug === req.params.slug);
  if (!dest) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  res.json(dest);
});

app.get('/api/operators', (req, res) => {
  res.json(MOCK_OPERATORS);
});

app.get('/api/schedules', (req, res) => {
  const { origin, destination, transportType, date } = req.query;
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

app.get('/api/vouchers', (req, res) => {
  res.json(vouchersStore);
});

app.post('/api/vouchers/claim', (req, res) => {
  const { voucherId } = req.body;
  vouchersStore = vouchersStore.map((v: any) => v.id === voucherId ? { ...v, claimed: true } : v);
  res.json({ success: true, vouchers: vouchersStore });
});

app.get('/api/promotions', (req, res) => {
  res.json(MOCK_PROMOTIONS);
});

app.get('/api/guides', (req, res) => {
  res.json(MOCK_GUIDES);
});

app.get('/api/guides/:slug', (req, res) => {
  const guide = MOCK_GUIDES.find(g => g.slug === req.params.slug);
  if (!guide) {
    return res.status(404).json({ error: 'Guide not found' });
  }
  res.json(guide);
});

app.get('/api/reviews', (req, res) => {
  res.json(MOCK_REVIEWS);
});

app.get('/api/suki', (req, res) => {
  res.json({
    account: sukiStore,
    pointHistory: pointHistoryStore
  });
});

app.get('/api/bookings', (req, res) => {
  res.json(bookingsStore);
});

app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;
  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    bookingCode: `MTTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    userId: sukiStore.userId,
    ...bookingData,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    qrCodeToken: `MTTH-QR-SECURE-${Date.now()}`
  };

  bookingsStore.unshift(newBooking);

  // Award Suki points
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

  // Add notification
  notificationsStore.unshift({
    id: `notif-${Date.now()}`,
    title: 'Booking Confirmed!',
    message: `Your trip from ${newBooking.origin} to ${newBooking.destination} is confirmed. Booking Code: ${newBooking.bookingCode}`,
    type: 'booking',
    timestamp: 'Just now',
    read: false,
    link: '/my-trips'
  });

  saveDb();
  broadcastState();

  res.json(newBooking);
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  const { id } = req.body;
  bookingsStore = bookingsStore.map((b: any) => {
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
  saveDb();
  broadcastState();
  res.json({ success: true, bookings: bookingsStore });
});

app.get('/api/support', (req, res) => {
  res.json(supportTicketsStore);
});

app.post('/api/support', (req, res) => {
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

app.get('/api/notifications', (req, res) => {
  res.json(notificationsStore);
});

app.post('/api/notifications/read', (req, res) => {
  notificationsStore = notificationsStore.map(n => ({ ...n, read: true }));
  res.json({ success: true });
});

// AI Travel Assistant / Recommendations endpoint using @google/genai
app.post('/api/ai/recommend', async (req, res) => {
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

// Admin & Cross-Device State Sync API
app.get('/api/admin/state', (req, res) => {
  res.json({
    version: stateVersion,
    schedules: schedulesStore,
    vouchers: vouchersStore,
    bookings: bookingsStore,
    customersKyc: customersKycStore,
    subAdmins: subAdminsStore,
    siteSettings: siteSettingsStore,
    sukiAccount: sukiStore
  });
});

// Real-Time Server-Sent Events (SSE) Stream: Broadcasts instantly to all devices/users
app.get('/api/admin/state/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send current state snapshot immediately on connection
  const initialPayload = JSON.stringify({
    type: 'sync',
    version: stateVersion,
    timestamp: new Date().toISOString(),
    data: {
      schedules: schedulesStore,
      vouchers: vouchersStore,
      bookings: bookingsStore,
      customersKyc: customersKycStore,
      subAdmins: subAdminsStore,
      siteSettings: siteSettingsStore,
      sukiAccount: sukiStore
    }
  });
  res.write(`data: ${initialPayload}\n\n`);

  sseClients.add(res);

  // 25-second heartbeat ping to prevent connection timeout
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// Lightweight version check for polling fallback
app.get('/api/admin/state/version', (req, res) => {
  res.json({
    version: stateVersion,
    timestamp: new Date().toISOString()
  });
});

// Dedicated Site Settings Update endpoint (Instant live sync for brand name, logo, announcements)
app.post('/api/admin/settings', (req, res) => {
  const newSettings = req.body;
  if (newSettings && typeof newSettings === 'object') {
    siteSettingsStore = { ...siteSettingsStore, ...newSettings };
    saveDb();
    broadcastState();
  }
  res.json({ success: true, version: stateVersion, siteSettings: siteSettingsStore });
});

app.post('/api/admin/state', (req, res) => {
  const { schedules, vouchers, bookings, customersKyc, subAdmins, siteSettings, sukiAccount } = req.body;
  if (schedules) schedulesStore = schedules;
  if (vouchers) vouchersStore = vouchers;
  if (bookings) bookingsStore = bookings;
  if (customersKyc) customersKycStore = customersKyc;
  if (subAdmins) subAdminsStore = subAdmins;
  if (siteSettings) siteSettingsStore = siteSettings;
  if (sukiAccount) sukiStore = sukiAccount;
  saveDb();
  broadcastState();
  res.json({ success: true, version: stateVersion });
});

// Admin metrics & CMS
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    totalBookings: bookingsStore.length,
    totalRevenue: bookingsStore.reduce((sum: number, b: any) => sum + b.totalPaid, 0),
    totalTravelers: 12450,
    activeOperators: MOCK_OPERATORS.length,
    destinationsCount: MOCK_DESTINATIONS.length,
    sukiMembers: 8420
  });
});

// Setup Vite middleware in development or serve static files in production
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const staticPath = path.join(__dirname, 'dist');
  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mindanao Travel Ticketing Hub server running at http://localhost:${PORT}`);
});
