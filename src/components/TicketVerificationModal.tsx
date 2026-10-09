import React, { useState, useEffect, useRef } from 'react';
import { Booking } from '../types';
import { 
  X, Search, QrCode, ShieldCheck, CheckCircle2, AlertTriangle, 
  XCircle, Camera, Upload, ArrowRight, Download, Ticket, 
  MapPin, Calendar, Clock, User, Compass, ExternalLink, RefreshCw, Copy, Check
} from 'lucide-react';
import jsQR from 'jsqr';

interface TicketVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewTicket: (booking: Booking) => void;
  allBookings?: Booking[];
  initialCode?: string;
}

interface VerificationResult {
  found: boolean;
  verified: boolean;
  status?: string;
  booking?: Booking;
  verifiedAt?: string;
  authenticityCertificate?: string;
  error?: string;
}

export const TicketVerificationModal: React.FC<TicketVerificationModalProps> = ({
  isOpen,
  onClose,
  onPreviewTicket,
  allBookings = [],
  initialCode = ''
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'scan' | 'upload'>('search');
  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanLoopRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-verify if initialCode is provided
  useEffect(() => {
    if (isOpen && initialCode) {
      setSearchQuery(initialCode);
      verifyCode(initialCode);
    } else if (!isOpen) {
      // Cleanup camera when closing
      stopCamera();
      setResult(null);
    }
  }, [isOpen, initialCode]);

  // Clean camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tickScanner);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or upload a QR image.');
      setCameraActive(false);
    }
  };

  const tickScanner = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          // Found QR Code!
          stopCamera();
          parseAndVerifyQrData(code.data);
          return;
        }
      }
    }
    scanLoopRef.current = requestAnimationFrame(tickScanner);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            parseAndVerifyQrData(code.data);
          } else {
            setResult({
              found: false,
              verified: false,
              error: 'No QR code could be detected in the uploaded image. Please ensure the QR code is clearly visible.'
            });
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const parseAndVerifyQrData = (data: string) => {
    // If QR contains URL like https://...?verify=MTTH-8F92A1
    let extractedCode = data;
    try {
      if (data.includes('verify=')) {
        const url = new URL(data, window.location.origin);
        extractedCode = url.searchParams.get('verify') || data;
      } else if (data.startsWith('MTTH-QR-')) {
        // e.g. MTTH-QR-8F92A1-SECURE
        const parts = data.split('-');
        if (parts[2]) {
          extractedCode = `MTTH-${parts[2]}`;
        }
      }
    } catch {}

    setSearchQuery(extractedCode);
    setActiveTab('search');
    verifyCode(extractedCode);
  };

  const verifyCode = async (rawCode: string) => {
    const clean = rawCode.trim();
    if (!clean) return;

    setIsVerifying(true);
    setResult(null);

    // 1. First check local bookings state
    const normalizedQuery = clean.toLowerCase().replace(/[^a-z0-9]/g, '');
    const localMatch = allBookings.find(b => {
      const bCode = (b.bookingCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const bId = (b.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const bQr = (b.qrCodeToken || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return bCode === normalizedQuery || bId === normalizedQuery || bQr.includes(normalizedQuery) ||
             (normalizedQuery.length >= 6 && bCode.includes(normalizedQuery));
    });

    if (localMatch) {
      setResult({
        found: true,
        verified: localMatch.status === 'confirmed',
        status: localMatch.status,
        booking: localMatch,
        verifiedAt: new Date().toISOString(),
        authenticityCertificate: `MTTH-AUTH-DOT-${localMatch.bookingCode}-${Date.now().toString(36).toUpperCase()}`
      });
      setIsVerifying(false);
      return;
    }

    // 2. Query backend API endpoint
    try {
      const res = await fetch(`/api/tickets/verify/${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult({
          found: false,
          verified: false,
          error: `Ticket reference "${clean}" was not found in the verified ticketing ledger.`
        });
      }
    } catch {
      // Fallback: check if matches demo pattern
      if (clean.toUpperCase().startsWith('MTTH-')) {
        setResult({
          found: false,
          verified: false,
          error: `Ticket reference "${clean}" could not be confirmed. Please check that the code is active.`
        });
      } else {
        setResult({
          found: false,
          verified: false,
          error: `Invalid reference number format. MTTH reference numbers follow the format MTTH-XXXXXX.`
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyVerificationLink = () => {
    if (!result?.booking) return;
    const url = `${window.location.origin}/?verify=${result.booking.bookingCode}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn relative my-6 text-slate-900">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Verify Travel Ticket</h3>
              <p className="text-xs text-slate-400">Official Philippine DOTr & MTTH Security Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => { setActiveTab('search'); stopCamera(); }}
            className={`flex items-center space-x-1.5 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'search'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Reference #</span>
          </button>

          <button
            onClick={() => { setActiveTab('scan'); startCamera(); }}
            className={`flex items-center space-x-1.5 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'scan'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => { setActiveTab('upload'); stopCamera(); }}
            className={`flex items-center space-x-1.5 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload QR Image</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-7 space-y-5">

          {/* TAB 1: Search Reference Number */}
          {activeTab === 'search' && (
            <div className="space-y-3">
              <form 
                onSubmit={(e) => { e.preventDefault(); verifyCode(searchQuery); }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Booking Reference (e.g. MTTH-8F92A1)"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isVerifying || !searchQuery.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold px-5 py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Verifying...' : 'Verify'}</span>
                </button>
              </form>

              {/* Recent Booking Quick-Fill if traveler has bookings */}
              {allBookings.length > 0 && allBookings[0] && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <span className="text-[11px] font-bold text-slate-400">Your recent trip:</span>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(allBookings[0].bookingCode); verifyCode(allBookings[0].bookingCode); }}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-700 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border border-teal-200 transition-colors cursor-pointer"
                  >
                    {allBookings[0].bookingCode} ({allBookings[0].origin} → {allBookings[0].destination})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Scan with Camera */}
          {activeTab === 'scan' && (
            <div className="text-center space-y-4">
              <div className="relative w-full max-w-sm mx-auto aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center shadow-inner">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Target overlay reticle */}
                <div className="absolute inset-8 border-2 border-dashed border-teal-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-12 h-12 border-t-2 border-l-2 border-teal-400 absolute top-0 left-0" />
                  <div className="w-12 h-12 border-t-2 border-r-2 border-teal-400 absolute top-0 right-0" />
                  <div className="w-12 h-12 border-b-2 border-l-2 border-teal-400 absolute bottom-0 left-0" />
                  <div className="w-12 h-12 border-b-2 border-r-2 border-teal-400 absolute bottom-0 right-0" />
                  <div className="w-full h-0.5 bg-teal-400/50 animate-pulse" />
                </div>
              </div>

              {cameraError ? (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs font-medium border border-amber-200 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-medium">
                  Point your camera at the QR code on any printed or mobile MTTH Boarding Pass.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: Upload QR Image */}
          {activeTab === 'upload' && (
            <div className="text-center space-y-3">
              <label className="block border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 rounded-2xl p-8 cursor-pointer transition-colors">
                <Upload className="w-10 h-10 text-teal-600 mx-auto mb-2" />
                <span className="font-extrabold text-sm text-slate-900 block">
                  Click to select QR Code screenshot or photo
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Supports PNG, JPG, WEBP boarding passes
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          )}

          {/* VERIFICATION RESULT PANEL */}
          {result && (
            <div className="pt-2 animate-fadeIn space-y-4">
              {result.found && result.booking ? (
                <div className={`p-5 rounded-2xl border ${
                  result.verified 
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-300 shadow-lg shadow-emerald-500/10'
                    : 'bg-rose-50 border-rose-300'
                }`}>
                  
                  {/* Status Banner */}
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3 mb-4">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        result.verified ? 'bg-emerald-600 text-white shadow-md' : 'bg-rose-600 text-white'
                      }`}>
                        {result.verified ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center space-x-1.5">
                          <span>{result.verified ? 'VALID & VERIFIED TICKET' : 'CANCELLED / REFUNDED'}</span>
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold">
                          Mindanao Travel Ticketing Hub • Authenticated
                        </div>
                      </div>
                    </div>

                    <span className={`text-xs font-black px-3 py-1 rounded-full uppercase shadow-sm ${
                      result.verified ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {result.booking.status}
                    </span>
                  </div>

                  {/* Certificate ID */}
                  <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-900 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">Certificate ID</span>
                      <span className="font-bold">{result.authenticityCertificate || `MTTH-AUTH-${result.booking.bookingCode}`}</span>
                    </div>
                    <button
                      onClick={handleCopyVerificationLink}
                      className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-800 transition-colors"
                      title="Copy link"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Journey & Passenger Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-white/90 p-4 rounded-xl border border-emerald-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Passenger(s)</span>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {result.booking.passengers[0]?.fullName || 'Guest'}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-bold">
                        {result.booking.passengers[0]?.seatNumber || 'Seat 14A'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Operator & Class</span>
                      <div className="font-bold text-slate-900">
                        {result.booking.operatorName}
                      </div>
                      <div className="text-[11px] text-slate-500 uppercase">
                        {result.booking.transportType} • {result.booking.selectedClass}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Route</span>
                      <div className="font-bold text-slate-900">
                        {result.booking.origin} → {result.booking.destination}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Departure</span>
                      <div className="font-bold text-slate-900">
                        {result.booking.departureTime}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Fare Paid</span>
                      <div className="font-bold text-slate-900">
                        ₱{result.booking.totalPaid.toLocaleString()} ({result.booking.paymentMethod})
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Issued At</span>
                      <div className="font-bold text-slate-700">
                        {result.booking.createdAt.slice(0, 10)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        onClose();
                        onPreviewTicket(result.booking!);
                      }}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Preview & Download Full Boarding Pass</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Ticket Not Found</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    {result.error || `No ticket matched the reference "${searchQuery}". Please check the booking code or verify with MTTH ticketing office.`}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center text-[11px] text-slate-400">
          Philippine DOTr & Mindanao Travel Ticketing Hub Secured Verification Infrastructure
        </div>

      </div>
    </div>
  );
};
