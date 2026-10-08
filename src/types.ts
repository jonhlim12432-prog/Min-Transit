export type TransportType = 'flight' | 'bus' | 'ferry';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  province: string;
  region: string;
  heroImage: string;
  shortDescription: string;
  longDescription: string;
  category: 'beaches' | 'mountains' | 'waterfalls' | 'cities' | 'islands' | 'cultural';
  attractions: string[];
  bestTimeToVisit: string;
  recommendedDuration: string;
  budgetEstimate: string;
  transportationOptions: string[];
  nearbyAirports: string[];
  nearbyPorts: string[];
  nearbyTerminals: string[];
  travelTips: string[];
  activities: string[];
  isFeatured?: boolean;
  searchCount?: number;
  favoriteCount?: number;
}

export interface Operator {
  id: string;
  name: string;
  type: TransportType;
  logo: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  policies: {
    cancellation: string;
    baggage: string;
    boarding: string;
  };
}

export interface Schedule {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorLogo: string;
  transportType: TransportType;
  origin: string;
  destination: string;
  originTerminal: string;
  destinationTerminal: string;
  departureTime: string; // ISO or formatted time
  arrivalTime: string;
  duration: string;
  vehicleType: string;
  vehicleNumber?: string;
  availableSeats: number;
  totalSeats: number;
  baseFare: number;
  terminalFee: number;
  serviceFee: number;
  discountEligible: boolean;
  sukiEligible: boolean;
  baggageAllowance: string;
  classType: string; // e.g. Economy, Aircon, Sleeper, Business, Tourist, VIP
}

export interface Passenger {
  id?: string;
  fullName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  email: string;
  passengerType: 'adult' | 'child' | 'senior' | 'student';
  seatNumber?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  scheduleId: string;
  transportType: TransportType;
  operatorName: string;
  operatorLogo: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  passengers: Passenger[];
  selectedClass: string;
  baseFare: number;
  terminalFee: number;
  serviceFee: number;
  taxes: number;
  discountAmount: number;
  voucherCode?: string;
  sukiDiscountAmount: number;
  totalPaid: number;
  sukiPointsEarned: number;
  paymentMethod: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  createdAt: string;
  qrCodeToken: string;
  cancellationReason?: string;
  refundStatus?: 'none' | 'requested' | 'approved' | 'processing' | 'completed' | 'rejected';
  refundAmount?: number;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  validUntil: string;
  eligibleTransport: TransportType | 'all';
  requiredSukiTier?: 'Starter' | 'Plus' | 'Gold' | 'VIP';
  claimed: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  discountText: string;
  transportType: TransportType | 'all';
  originalPrice?: number;
  discountedPrice?: number;
  heroImage: string;
  expiryDate: string;
  isFlashSale?: boolean;
}

export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface KycVerification {
  status: KycStatus;
  idType: 'ph_passport' | 'umid' | 'drivers_license' | 'philsys_national_id' | 'sss_gsis' | 'prc_id' | 'postal_id' | string;
  idNumber: string;
  frontIdUrl?: string;
  backIdUrl?: string;
  selfieUrl?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  verificationCode?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'female' | 'male' | 'other';
  nationality: string;
  address: {
    street: string;
    city: string;
    province: string;
    region: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  travelPreferences: {
    seatPreference: 'window' | 'aisle' | 'no_preference';
    specialAssistance: boolean;
    frequentFlyerNo?: string;
    preferredBusClass: string;
    preferredFerryClass: string;
  };
  notificationSettings: {
    emailTripUpdates: boolean;
    smsDepartureAlerts: boolean;
    promotionalOffers: boolean;
  };
  kyc: KycVerification;
}

export interface SukiAccount {
  userId: string;
  name: string;
  email: string;
  tier: 'Starter' | 'Plus' | 'Gold' | 'VIP';
  points: number;
  pointsToNextTier: number;
  completedTrips: number;
  vouchersCount: number;
  joinedDate: string;
  avatar: string;
}

export interface PointHistoryItem {
  id: string;
  date: string;
  description: string;
  pointsChange: number;
  type: 'earned' | 'redeemed';
}

export interface TravelGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  heroImage: string;
  author: string;
  date: string;
  readingTime: string;
  introduction: string;
  content: string[];
  travelTips: string[];
  estimatedBudget: string;
  howToGetThere: string;
  thingsToDo: string[];
  transportationTips: string;
  relatedDestinations: string[];
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  overall: number;
  comfort: number;
  punctuality: number;
  staff: number;
  cleanliness: number;
  comment: string;
  date: string;
  operatorName: string;
  route: string;
}

export interface SupportTicket {
  id: string;
  ticketNo: string;
  category: 'Booking' | 'Payment' | 'Refund' | 'Voucher' | 'Suki' | 'General';
  bookingNumber?: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'reminder' | 'voucher' | 'suki' | 'alert';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface SiteSettings {
  siteName: string;
  siteSubtitle: string;
  tagline: string;
  logoEmoji?: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  announcementText: string;
  announcementActive: boolean;
  allowNewRegistrations: boolean;
  currency: string;
}

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Operations Admin' | 'Ticketing Agent' | 'Support Agent';
  status: 'Active' | 'Suspended';
  permissions: string[];
  createdAt: string;
  lastActive: string;
}

export interface RegisteredUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  userProfile: UserProfile;
  sukiAccount: SukiAccount;
}

export interface AdminSession {
  email: string;
  name: string;
  role: 'Super Admin' | 'Operations Admin' | 'Ticketing Agent' | 'Support Agent';
  token: string;
  loggedInAt: string;
}

