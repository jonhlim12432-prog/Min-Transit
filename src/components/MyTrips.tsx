import React, { useState } from 'react';
import { Booking } from '../types';
import { Ticket, Calendar, QrCode, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface MyTripsProps {
  bookings: Booking[];
  onViewTicket: (booking: Booking) => void;
  onVerifyTicket?: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onExploreDestinations: () => void;
}

export const MyTrips: React.FC<MyTripsProps> = ({
  bookings,
  onViewTicket,
  onVerifyTicket,
  onCancelBooking,
  onExploreDestinations
}) => {
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const filtered = bookings.filter(b => {
    if (tab === 'upcoming') return b.status === 'confirmed';
    if (tab === 'completed') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">My Travel Itineraries</h2>
          <p className="text-slate-500 text-sm">Manage your upcoming journeys, digital boarding passes, and past trips.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === t.id ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow">
            <Ticket className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No {tab} trips found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Your travel itinerary is waiting for your next adventure across Mindanao!
          </p>
          <button
            onClick={onExploreDestinations}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-md"
          >
            Explore Destinations & Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((b) => (
            <div 
              key={b.id}
              className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 hover:border-teal-500 transition-all space-y-5"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{b.operatorLogo}</span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{b.operatorName}</h4>
                    <p className="text-xs text-slate-500 font-mono">Code: {b.bookingCode}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  b.status === 'confirmed' ? 'bg-teal-100 text-teal-800' :
                  b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {b.status.toUpperCase()}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Route</span>
                  <span className="font-extrabold text-slate-900">{b.origin} → {b.destination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Departure</span>
                  <span className="font-semibold text-slate-800">{b.departureTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Paid Amount</span>
                  <span className="font-extrabold text-slate-900">₱{b.totalPaid.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewTicket(b)}
                    className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm transition-transform active:scale-95"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Preview & Download Pass</span>
                  </button>

                  {onVerifyTicket && (
                    <button
                      onClick={() => onVerifyTicket(b)}
                      className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition-colors"
                      title="Verify Authenticity"
                    >
                      <span>Verify</span>
                    </button>
                  )}
                </div>

                {b.status === 'confirmed' && (
                  <button
                    onClick={() => onCancelBooking(b.id)}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
