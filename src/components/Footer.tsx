import React from 'react';
import { Compass, Sparkles, ShieldCheck, Ticket, Award, Rocket } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  logoUrl?: string;
  onOpenVercelDeploy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, logoUrl, onOpenVercelDeploy }) => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="h-10 w-auto max-w-[200px] object-contain block select-none" 
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-tr from-teal-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Compass className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Mindanao Travel Ticketing Hub
                </span>
                <p className="text-xs text-teal-400 font-bold">Your Journey Starts Here.</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier full-stack transportation booking and travel discovery platform connecting flights, ferries, and buses across Mindanao with Suki rewards and digital tickets.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-teal-400 uppercase tracking-wider">Explore Hub</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-semibold">
              <li><button onClick={() => setActiveTab('search')} className="hover:text-white">Flights, Buses & Ferries</button></li>
              <li><button onClick={() => setActiveTab('destinations')} className="hover:text-white">Explore Mindanao</button></li>
              <li><button onClick={() => setActiveTab('deals')} className="hover:text-white">Deals & Flash Sales</button></li>
              <li><button onClick={() => setActiveTab('travel-guides')} className="hover:text-white">Travel Guides</button></li>
            </ul>
          </div>

          {/* Suki & My Travel */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-amber-400 uppercase tracking-wider">Suki Rewards</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-semibold">
              <li><button onClick={() => setActiveTab('suki-rewards')} className="hover:text-white">Suki Traveler Dashboard</button></li>
              <li><button onClick={() => setActiveTab('suki-rewards')} className="hover:text-white">Voucher Wallet</button></li>
              <li><button onClick={() => setActiveTab('my-trips')} className="hover:text-white">My Trips & Digital Pass</button></li>
              <li><button onClick={() => setActiveTab('planner')} className="hover:text-white">Trip Planner & Budget</button></li>
            </ul>
          </div>

          {/* Partner & Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-orange-400 uppercase tracking-wider">Partners & Help</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-semibold">
              <li><button onClick={() => setActiveTab('operator')} className="hover:text-white">Operator Portal</button></li>
              <li><button onClick={() => setActiveTab('help')} className="hover:text-white">Help Center & FAQ</button></li>
              {onOpenVercelDeploy && (
                <li>
                  <button 
                    onClick={onOpenVercelDeploy} 
                    className="inline-flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-bold"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Deploy to Vercel</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Mindanao Travel Ticketing Hub (MTTH). All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0 font-semibold">
            {onOpenVercelDeploy && (
              <button
                onClick={onOpenVercelDeploy}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <svg className="w-3 h-3 fill-white" viewBox="0 0 1155 1000">
                  <path d="m577.3 0 577.4 1000H0z" />
                </svg>
                <span>Deploy to Vercel</span>
              </button>
            )}
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Booking Conditions</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
