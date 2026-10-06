import React from 'react';
import { Search, Sparkles, ShieldCheck, Ticket, Award, ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onSearchClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearchClick, onExploreClick }) => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white overflow-hidden py-16 lg:py-24">
      {/* Background decoration & overlay image */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80')` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 border border-teal-500/30 text-teal-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Mindanao’s #1 Travel Ticketing & Discovery Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Your Journey <br />
              <span className="bg-gradient-to-r from-teal-400 via-teal-200 to-orange-400 bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Book flights, ferries, and buses seamlessly across Mindanao. Enjoy exclusive Suki traveler rewards, instant digital boarding passes, and discover hidden island paradises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onSearchClick}
                className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-teal-500/30 transition-transform active:scale-95 text-base"
              >
                <Search className="w-5 h-5" />
                <span>Search Trips Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700/80 text-white font-bold px-8 py-4 rounded-2xl border border-slate-700 transition-colors text-base"
              >
                <Sparkles className="w-5 h-5 text-orange-400" />
                <span>Explore Mindanao</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Verified Operators</span>
              </div>
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-orange-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Digital QR Tickets</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Suki Rewards Points</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Card / Spotlight */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 p-6 rounded-3xl shadow-2xl space-y-6">
              <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-200 fill-amber-200" />
                <span>Flash Deal: 15% OFF</span>
              </div>

              <div className="relative h-48 rounded-2xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80" 
                  alt="Camiguin Island" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-xs bg-teal-500 text-white font-bold px-2.5 py-1 rounded-md">Camiguin Getaway</span>
                    <h3 className="text-lg font-bold text-white mt-1">Cagayan de Oro → Camiguin</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">SuperFerry Catamaran</span>
                  <span className="text-teal-400 font-bold">3h 30m</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Regular Fare: <span className="line-through">₱850</span></span>
                  <span className="text-2xl font-extrabold text-white">₱765 <span className="text-xs font-normal text-slate-400">with WELCOME10</span></span>
                </div>
              </div>

              <button
                onClick={onSearchClick}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-transform active:scale-95 text-sm flex items-center justify-center space-x-2"
              >
                <span>Book This Route Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
