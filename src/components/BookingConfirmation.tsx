import React from 'react';
import { Booking } from '../types';
import { CheckCircle2, Ticket, Download, ArrowRight, Award, ShieldCheck, QrCode } from 'lucide-react';

interface BookingConfirmationProps {
  booking: Booking;
  onViewTrips: () => void;
  onViewDigitalTicket: (booking: Booking) => void;
  onHome: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onViewTrips,
  onViewDigitalTicket,
  onHome
}) => {
  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-12 shadow-2xl border border-slate-200/80 text-center space-y-6 animate-fadeIn">
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
            Booking Confirmed Successfully
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Journey is Secured!</h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            Booking Code: <strong className="text-slate-900 font-mono">{booking.bookingCode}</strong>. A digital boarding pass with secure QR token has been generated.
          </p>
        </div>

        {/* Ticket Summary Card */}
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{booking.operatorLogo}</span>
              <div>
                <h4 className="font-extrabold text-slate-900">{booking.operatorName}</h4>
                <p className="text-xs text-slate-500">{booking.transportType.toUpperCase()} • {booking.selectedClass}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Paid</div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">₱{booking.totalPaid.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Route</span>
              <div className="font-bold text-slate-900">{booking.origin} → {booking.destination}</div>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Departure</span>
              <div className="font-bold text-slate-900">{booking.departureTime}</div>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Travelers</span>
              <div className="font-bold text-slate-900">{booking.passengers.length} Passenger(s)</div>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Suki Points Earned</span>
              <div className="font-bold text-amber-600 flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>+{booking.sukiPointsEarned} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onViewDigitalTicket(booking)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-teal-500/25 text-sm"
          >
            <QrCode className="w-5 h-5" />
            <span>View Digital Ticket & QR</span>
          </button>

          <button
            onClick={onViewTrips}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl text-sm"
          >
            <Ticket className="w-5 h-5" />
            <span>Go to My Trips</span>
          </button>
        </div>

        <div>
          <button
            onClick={onHome}
            className="text-xs text-teal-600 font-bold hover:underline"
          >
            ← Return to Homepage & Discover More
          </button>
        </div>

      </div>
    </div>
  );
};
