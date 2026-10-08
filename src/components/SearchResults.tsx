import React, { useState } from 'react';
import { Schedule, TransportType } from '../types';
import { Plane, Bus, Ship, Clock, ShieldCheck, Award, ArrowRight, Filter, Tag, CheckCircle2, Briefcase, Users } from 'lucide-react';

interface SearchResultsProps {
  schedules: Schedule[];
  searchParams: {
    transportType: TransportType;
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  };
  onSelectSchedule: (schedule: Schedule) => void;
  onBackToSearch: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  schedules,
  searchParams,
  onSelectSchedule,
  onBackToSearch
}) => {
  const [sortBy, setSortBy] = useState<'recommended' | 'cheapest' | 'fastest'>('recommended');
  const [selectedTransportFilter, setSelectedTransportFilter] = useState<string>('all');

  // Filter & Sort
  let filtered = schedules;
  if (selectedTransportFilter !== 'all') {
    filtered = filtered.filter(s => s.transportType === selectedTransportFilter);
  }

  if (sortBy === 'cheapest') {
    filtered = [...filtered].sort((a, b) => (a.baseFare + a.terminalFee + a.serviceFee) - (b.baseFare + b.terminalFee + b.serviceFee));
  } else if (sortBy === 'fastest') {
    filtered = [...filtered].sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Route Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Mindanao Route Search Result</span>
            <span>•</span>
            <span>{searchParams.date}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center space-x-3">
            <span>{searchParams.origin}</span>
            <ArrowRight className="w-6 h-6 text-teal-400" />
            <span>{searchParams.destination}</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {filtered.length} available transport options for {searchParams.passengers} traveler(s)
          </p>
        </div>

        <button
          onClick={onBackToSearch}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl border border-slate-700 text-sm transition-colors"
        >
          Modify Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 flex items-center space-x-2">
                <Filter className="w-4 h-4 text-teal-600" />
                <span>Filters</span>
              </h3>
              <button 
                onClick={() => setSelectedTransportFilter('all')}
                className="text-xs text-teal-600 font-bold hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Transport Type Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transport Type</label>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Types' },
                  { id: 'ferry', label: 'Ferries & RoRo' },
                  { id: 'bus', label: 'Buses' },
                  { id: 'flight', label: 'Flights' }
                ].map((type) => (
                  <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="transportFilter" 
                      checked={selectedTransportFilter === type.id}
                      onChange={() => setSelectedTransportFilter(type.id)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Suki & Discount Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rewards & Perks</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm font-semibold text-slate-700 flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Suki Points Eligible</span>
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm font-semibold text-slate-700 flex items-center space-x-1.5">
                    <Tag className="w-4 h-4 text-orange-500" />
                    <span>Voucher & Promo Ready</span>
                  </span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Sorting Header */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort Results By:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'recommended', label: 'Recommended' },
                { id: 'cheapest', label: 'Cheapest Price' },
                { id: 'fastest', label: 'Fastest Duration' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    sortBy === s.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Bus className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Trips Found for this Route</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                We couldn't find scheduled trips for this exact route right now. Try searching for nearby terminals or another date.
              </p>
              <button
                onClick={onBackToSearch}
                className="bg-teal-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md"
              >
                Search Another Route
              </button>
            </div>
          ) : (
            filtered.map((sch) => {
              const totalFare = (sch.baseFare + sch.terminalFee + sch.serviceFee) * searchParams.passengers;
              return (
                <div 
                  key={sch.id}
                  className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 hover:border-teal-500 transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        {sch.operatorLogo}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-slate-900 text-base">{sch.operatorName}</h4>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{sch.vehicleType} • {sch.classType}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-semibold uppercase">Total for {searchParams.passengers} Pax</div>
                      <div className="text-2xl font-extrabold text-slate-900">₱{totalFare.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Journey Times */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase">Departure</div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {new Date(sch.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-slate-600">{sch.originTerminal}</div>
                    </div>

                    <div className="text-center flex flex-col items-center">
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                        {sch.duration}
                      </span>
                      <div className="w-full border-t border-dashed border-slate-300 my-2" />
                      <span className="text-[10px] text-slate-400 font-semibold">Direct Route</span>
                    </div>

                    <div className="text-right sm:text-left">
                      <div className="text-xs text-slate-500 font-bold uppercase">Arrival</div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {new Date(sch.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-slate-600">{sch.destinationTerminal}</div>
                    </div>
                  </div>

                  {/* Footer perks & CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {sch.baggageAllowance}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {sch.availableSeats} seats left</span>
                      <span className="text-amber-600 flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Earn ~{Math.round(totalFare * 0.1)} Suki pts</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectSchedule(sch)}
                      className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md transition-transform active:scale-95 text-sm flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Select Trip</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>
    </div>
  );
};
