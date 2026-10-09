import React, { useState, useEffect, useRef } from 'react';
import { Booking } from '../types';
import { 
  X, QrCode, ShieldCheck, Ticket, Download, Printer, Compass, 
  CheckCircle2, Share2, Copy, Check, Clock, MapPin, User, Calendar, AlertCircle
} from 'lucide-react';
import QRCode from 'qrcode';

interface DigitalTicketModalProps {
  booking: Booking;
  onClose: () => void;
  onVerifyTicket?: (booking: Booking) => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({ 
  booking, 
  onClose,
  onVerifyTicket 
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Generate real, phone-camera-scannable QR code
  useEffect(() => {
    const verificationUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/?verify=${encodeURIComponent(booking.bookingCode)}`
      : `https://mtth.ph/verify?code=${booking.bookingCode}`;
    
    QRCode.toDataURL(verificationUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => {
        console.warn('QR Code generation fallback:', err);
      });
  }, [booking.bookingCode]);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(booking.bookingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // High-Resolution PNG Ticket Generator using HTML5 Canvas
  const handleDownloadTicket = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 1200;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        window.print();
        setIsDownloading(false);
        return;
      }

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Card Container
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, 30, 30, width - 60, height - 60, 24);
      ctx.fill();

      // Top Header (Navy)
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, 30, 30, width - 60, 160, 24, true);
      ctx.fill();

      // Header Texts
      ctx.fillStyle = '#14b8a6';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('MTTH PHILIPPINES', 60, 80);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('OFFICIAL DIGITAL BOARDING PASS & TRAVEL TICKET', 60, 110);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`REF: ${booking.bookingCode}`, 60, 145);

      // Status pill
      ctx.fillStyle = booking.status === 'confirmed' ? '#059669' : '#e11d48';
      roundRect(ctx, width - 230, 65, 170, 42, 21);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(booking.status.toUpperCase(), width - 145, 92);
      ctx.textAlign = 'left';

      // Operator Info Bar
      ctx.fillStyle = '#f8fafc';
      roundRect(ctx, 60, 220, width - 120, 90, 16);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(booking.operatorName, 85, 260);

      ctx.fillStyle = '#0d9488';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`${booking.transportType.toUpperCase()} • ${booking.selectedClass}`, 85, 288);

      // Route Section
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('ORIGIN', 85, 350);
      ctx.fillText('DESTINATION', 450, 350);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(booking.origin, 85, 385);
      ctx.fillText(booking.destination, 450, 385);

      // Route arrow line
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(85, 410);
      ctx.lineTo(width - 85, 410);
      ctx.stroke();

      // Departure / Arrival Times
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('DEPARTURE TIME', 85, 445);
      ctx.fillText('ESTIMATED ARRIVAL', 450, 445);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(booking.departureTime, 85, 475);
      ctx.fillText(booking.arrivalTime, 450, 475);

      // Passenger Details Box
      ctx.fillStyle = '#f1f5f9';
      roundRect(ctx, 60, 510, width - 120, 140, 16);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('PASSENGER NAME', 85, 545);
      ctx.fillText('SEAT ASSIGNMENT', 450, 545);

      const primaryPassenger = booking.passengers[0] || { fullName: 'Passenger', seatNumber: 'Seat A1' };
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(primaryPassenger.fullName, 85, 580);
      ctx.fillStyle = '#0d9488';
      ctx.fillText(primaryPassenger.seatNumber || 'Seat 14A', 450, 580);

      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText(`Fare Paid: ₱${booking.totalPaid.toLocaleString()} (${booking.paymentMethod})`, 85, 620);
      ctx.fillText(`Boarding Gate: Gate 02 (Mindanao Terminal)`, 450, 620);

      // Dashed Perforation Line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(30, 680);
      ctx.lineTo(width - 30, 680);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw QR Code
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImg.onload = () => {
            ctx.drawImage(qrImg, width / 2 - 110, 715, 220, 220);
            resolve(true);
          };
          qrImg.onerror = () => resolve(false);
        });
      }

      // Security & Authenticity Footers
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`TOKEN: ${booking.qrCodeToken}`, width / 2, 970);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('VERIFIED AUTHENTIC BY PHILIPPINE DOT & MTTH SECURE LEDGER', width / 2, 1005);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Issued: ${booking.createdAt.slice(0, 10)} • Scan QR code to verify live validity at terminal`, width / 2, 1035);

      // Barcode simulation
      drawBarcode(ctx, 120, 1070, width - 240, 45);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(`*${booking.bookingCode}*`, width / 2, 1135);

      // Trigger automatic file download
      const link = document.createElement('a');
      link.download = `MTTH-Ticket-${booking.bookingCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.warn('Canvas download fallback to print:', e);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div 
        ref={ticketRef}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn relative my-6 text-slate-900"
      >
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg">Digital Boarding Pass</h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                  DOT Verified
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span>Ref: <strong className="text-white font-mono">{booking.bookingCode}</strong></span>
                <button 
                  onClick={handleCopyCode}
                  className="hover:text-teal-300 transition-colors"
                  title="Copy reference code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Body */}
        <div className="p-5 sm:p-7 space-y-5">
          
          {/* Operator and Status Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 p-4 rounded-2xl border border-teal-200/80">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-teal-100 flex items-center justify-center text-2xl font-black text-teal-700">
                {booking.operatorLogo || 'MT'}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                  {booking.operatorName}
                </h4>
                <p className="text-xs text-teal-700 font-bold flex items-center space-x-1 mt-0.5">
                  <span className="uppercase">{booking.transportType}</span>
                  <span>•</span>
                  <span>{booking.selectedClass}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center space-x-1 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm ${
                booking.status === 'confirmed' 
                  ? 'bg-emerald-600 text-white' 
                  : booking.status === 'cancelled'
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{booking.status.toUpperCase()}</span>
              </span>
            </div>
          </div>

          {/* Route Grid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Origin</span>
                <div className="font-extrabold text-slate-900 text-base">{booking.origin}</div>
                <div className="text-xs text-slate-500 font-medium">Terminal Gate 02</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Destination</span>
                <div className="font-extrabold text-slate-900 text-base">{booking.destination}</div>
                <div className="text-xs text-slate-500 font-medium">Arrival Terminal</div>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Departure</span>
                <div className="font-bold text-slate-800">{booking.departureTime}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Arrival</span>
                <div className="font-bold text-slate-800">{booking.arrivalTime}</div>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider">
                Passenger(s) Details
              </span>
              <span className="text-slate-400">
                Total Paid: <strong className="text-slate-900">₱{booking.totalPaid.toLocaleString()}</strong> ({booking.paymentMethod})
              </span>
            </div>
            {booking.passengers.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="font-bold text-slate-900 block">{p.fullName}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{p.passengerType}</span>
                  </div>
                </div>
                <span className="font-extrabold bg-teal-100 text-teal-800 px-3 py-1 rounded-lg text-xs">
                  {p.seatNumber || 'Seat 14A'}
                </span>
              </div>
            ))}
          </div>

          {/* Perforated Separator */}
          <div className="relative py-2">
            <div className="border-t-2 border-dashed border-slate-300" />
            <div className="absolute -left-7 top-0 w-5 h-5 bg-slate-950/85 rounded-full" />
            <div className="absolute -right-7 top-0 w-5 h-5 bg-slate-950/85 rounded-full" />
          </div>

          {/* Authentic Scannable QR Code Section */}
          <div className="bg-slate-950 text-white p-5 rounded-2xl text-center space-y-3 shadow-inner">
            <div className="inline-block bg-white p-3 rounded-2xl shadow-md">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt={`QR for ${booking.bookingCode}`}
                  className="w-44 h-44 object-contain mx-auto block"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center bg-slate-100 text-slate-400">
                  <QrCode className="w-20 h-20 animate-pulse" />
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-mono text-teal-400 tracking-wider font-bold">
                {booking.bookingCode}
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs mx-auto">
                {booking.qrCodeToken}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 py-1.5 px-3 rounded-xl border border-emerald-500/20 max-w-sm mx-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official Live DOT & MTTH Verified Digital Boarding Pass</span>
            </div>

            <p className="text-[10px] text-slate-400">
              Present this QR code on your mobile device at terminal gate or airport scanner for instant check-in.
            </p>
          </div>

          {/* Action Buttons: Preview, Download, Print & Verify */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={handleDownloadTicket}
                disabled={isDownloading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold py-3 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Generating...' : 'Download Ticket (PNG)'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all active:scale-95"
              >
                <Printer className="w-4 h-4 text-teal-400" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            {onVerifyTicket && (
              <button
                onClick={() => {
                  onClose();
                  onVerifyTicket(booking);
                }}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verify Ticket Authenticity Online</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Done & Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

// Canvas helper functions
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, topOnly = false) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  if (topOnly) {
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
  } else {
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  }
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#0f172a';
  let curX = x;
  const pattern = [2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 4, 2, 5, 3, 2, 1, 4, 3, 2, 5, 1, 4, 2, 3];
  let pIdx = 0;
  while (curX < x + w) {
    const barW = (pattern[pIdx % pattern.length] || 2) * 2;
    ctx.fillRect(curX, y, barW, h);
    curX += barW + ((pattern[(pIdx + 1) % pattern.length] || 2) * 1.5);
    pIdx++;
  }
}
