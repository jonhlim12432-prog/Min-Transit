import React, { useState } from 'react';
import { Destination } from '../types';
import { Sparkles, MapPin, Calendar, Users, ArrowRight, Heart, X, CheckCircle2, Compass } from 'lucide-react';

interface ExploreMindanaoProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onBookRoute: (destinationName: string) => void;
}

export const ExploreMindanao: React.FC<ExploreMindanaoProps> = ({
  destinations,
  onSelectDestination,
  onBookRoute
}) => {
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDestinationModal, setActiveDestinationModal] = useState<Destination | null>(null);

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'islands', label: 'Islands & Beaches' },
    { id: 'waterfalls', label: 'Waterfalls' },
    { id: 'mountains', label: 'Highlands & Nature' },
    { id: 'cities', label: 'Cities & Hubs' },
    { id: 'cultural', label: 'Culture & Heritage' }
  ];

  let filtered = destinations;
  if (category !== 'all') {
    filtered = filtered.filter(d => d.category === category);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.province.toLowerCase().includes(q) || d.shortDescription.toLowerCase().includes(q));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-6 translate-y-6">
          <Compass className="w-56 h-56 text-teal-300" />
        </div>

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase border border-teal-500/30">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Explore Mindanao Discovery Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Discover Paradise Across Mindanao
          </h2>

          <p className="text-slate-300 text-sm sm:text-base">
            From the white sandbars of Camiguin and surf breaks of Siargao to the misty highlands of Bukidnon and Enchanted River of Surigao.
          </p>

          <div className="pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, provinces, waterfalls, or islands..."
              className="w-full sm:max-w-md bg-slate-800/90 border border-slate-700 rounded-2xl px-5 py-3.5 text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto space-x-3 pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              category === cat.id
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200/80 hover:border-teal-500 hover:shadow-xl transition-all flex flex-col group cursor-pointer"
            onClick={() => setActiveDestinationModal(dest)}
          >
            <div className="relative h-60 overflow-hidden">
              <img 
                src={dest.heroImage} 
                alt={dest.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700">
                {dest.province}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  {dest.shortDescription}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Best Time: {dest.bestTimeToVisit.split(' ')[0]}</span>
                  <span className="text-teal-600 font-bold">{dest.recommendedDuration}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-extrabold text-slate-900">{dest.budgetEstimate}</span>
                  <span className="flex items-center space-x-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Destination Details Modal */}
      {activeDestinationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn relative my-8">
            
            <div className="relative h-72">
              <img 
                src={activeDestinationModal.heroImage} 
                alt={activeDestinationModal.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setActiveDestinationModal(null)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs bg-teal-500 font-bold px-3 py-1 rounded-full">{activeDestinationModal.province}</span>
                <h2 className="text-3xl font-extrabold">{activeDestinationModal.name}</h2>
                <p className="text-xs text-slate-300">{activeDestinationModal.region}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">About {activeDestinationModal.name}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{activeDestinationModal.longDescription}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Best Time to Visit</span>
                  <p className="font-extrabold text-slate-900 text-sm">{activeDestinationModal.bestTimeToVisit}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Estimated Budget</span>
                  <p className="font-extrabold text-slate-900 text-sm">{activeDestinationModal.budgetEstimate}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-base">Top Attractions & Spots</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeDestinationModal.attractions.map((att, i) => (
                    <div key={i} className="flex items-center space-x-2 p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{att}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base">Transportation Options</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  {activeDestinationModal.transportationOptions.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    const destName = activeDestinationModal.name;
                    setActiveDestinationModal(null);
                    onBookRoute(destName);
                  }}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-500/25 text-sm flex items-center space-x-2"
                >
                  <span>Book Transportation to {activeDestinationModal.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
