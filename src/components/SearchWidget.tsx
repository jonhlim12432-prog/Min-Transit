import React, { useState } from 'react';
import { Plane, Bus, Ship, Calendar, Users, MapPin, Search } from 'lucide-react';
import { TransportType } from '../types';

interface SearchWidgetProps {
  onSearch: (params: {
    transportType: TransportType;
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  }) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  const [transportType, setTransportType] = useState<TransportType>('ferry');
  const [origin, setOrigin] = useState('Cagayan de Oro');
  const [destination, setDestination] = useState('Camiguin Island');
  const [date, setDate] = useState('2026-10-10');
  const [passengers, setPassengers] = useState(1);
  const [busType, setBusType] = useState('Aircon');

  const popularLocations = [
    'Cagayan de Oro',
    'Camiguin Island',
    'Davao City',
    'Siargao Island',
    'Iligan City',
    'Zamboanga City',
    'General Santos City',
    'Surigao City',
    'Bukidnon Highlands',
    'Lake Sebu'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      transportType,
      origin,
      destination,
      date,
      passengers
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20 mb-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 backdrop-blur-xl">
        
        {/* Tabs */}
        <div className="flex space-x-2 border-b border-slate-100 pb-4 mb-6">
          {[
            { id: 'ferry', label: 'Ferries & RoRo', icon: Ship },
            { id: 'bus', label: 'Buses', icon: Bus },
            { id: 'flight', label: 'Flights', icon: Plane }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = transportType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTransportType(tab.id as TransportType)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Origin */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>From (Origin)</span>
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {popularLocations.map((loc) => (
                  <option key={`orig-${loc}`} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>To (Destination)</span>
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {popularLocations.map((loc) => (
                  <option key={`dest-${loc}`} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Departure Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Departure Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Passengers / Class */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Travelers & Class</span>
              </label>
              <div className="flex space-x-2">
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3.5 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} Pax</option>
                  ))}
                </select>
                <select
                  value={busType}
                  onChange={(e) => setBusType(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3.5 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Aircon">Aircon</option>
                  <option value="Tourist">Tourist</option>
                  <option value="Sleeper">Sleeper</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold px-10 py-4 rounded-2xl shadow-xl shadow-teal-500/25 transition-transform active:scale-95 text-base"
            >
              <Search className="w-5 h-5" />
              <span>Search Available Trips</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
