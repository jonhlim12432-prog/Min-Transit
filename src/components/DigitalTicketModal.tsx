import React from 'react';
import { Booking } from '../types';
import { X, QrCode, ShieldCheck, Ticket, Download, Printer, Compass } from 'lucide-react';

interface DigitalTicketModalProps {
  booking: Booking;
  onClose: () => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn relative my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-extrabold text-base">MTTH Digital Boarding Pass</h3>
              <p className="text-xs text-slate-400">Code: {booking.bookingCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="flex justify-between items-center bg-teal-50 p-4 rounded-2xl border border-teal-200">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{booking.operatorLogo}</span>
              <div>
                <h4 className="font-extrabold text-slate-900">{booking.operatorName}</h4>
                <p className="text-xs text-teal-700 font-bold">{booking.transportType.toUpperCase()} • {booking.selectedClass}</p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {booking.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
              <div className="font-extrabold text-slate-900">{booking.origin}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">To</span>
              <div className="font-extrabold text-slate-900">{booking.destination}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Departure Time</span>
              <div className="font-extrabold text-slate-900">{booking.departureTime}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Arrival Time</span>
              <div className="font-extrabold text-slate-900">{booking.arrivalTime}</div>
            </div>
          </div>

          {/* Passenger & Seat */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passenger Details</span>
            {booking.passengers.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                <span className="font-bold text-slate-800">{p.fullName}</span>
                <span className="font-extrabold bg-teal-100 text-teal-800 px-3 py-0.5 rounded-lg text-xs">
                  {p.seatNumber || 'Seat A1'}
                </span>
              </div>
            ))}
          </div>

          {/* QR Code Section */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl text-center space-y-3">
            <div className="w-36 h-36 bg-white rounded-2xl mx-auto flex items-center justify-center p-3 shadow-inner">
              {/* Simulated QR Pattern */}
              <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white font-mono text-[10px]">
                <QrCode className="w-24 h-24 text-slate-900" />
              </div>
            </div>
            <div className="text-xs font-mono text-teal-400 tracking-wider">
              {booking.qrCodeToken}
            </div>
            <p className="text-[11px] text-slate-400">
              Show this secure QR code at terminal boarding gate or airport counter.
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
