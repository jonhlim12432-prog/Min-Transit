import React, { useState } from 'react';
import { 
  Plane, Bus, Ship, Compass, Tag, Award, BookOpen, Ticket, 
  Bell, User, Menu, X, Search, Heart, Sparkles, HelpCircle, ShieldCheck
} from 'lucide-react';
import { NotificationItem, SukiAccount } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sukiAccount: SukiAccount;
  notifications: NotificationItem[];
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenAIConcierge: () => void;
  onOpenVerifyTicket?: () => void;
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  sukiAccount,
  notifications,
  onOpenProfile,
  onOpenNotifications,
  onOpenAIConcierge,
  onOpenVerifyTicket,
  logoUrl
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'search', label: 'Book Trips', icon: Plane },
    { id: 'destinations', label: 'Explore Mindanao', icon: Sparkles },
    { id: 'deals', label: 'Deals & Vouchers', icon: Tag },
    { id: 'suki-rewards', label: 'Suki Rewards', icon: Award },
    { id: 'travel-guides', label: 'Travel Guide', icon: BookOpen },
    { id: 'my-trips', label: 'My Trips', icon: Ticket },
    { id: 'planner', label: 'Trip Planner', icon: Compass },
    { id: 'help', label: 'Help & FAQ', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-10 w-auto max-w-[200px] object-contain block select-none" 
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-tr from-teal-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Compass className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent">
                  MTTH
                </span>
                <span className="text-xs bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded-full border border-teal-500/30">
                  Mindanao
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Your Journey Starts Here
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Verify Ticket Button */}
            {onOpenVerifyTicket && (
              <button
                onClick={onOpenVerifyTicket}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700/80 border border-teal-500/40 text-teal-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                title="Verify Ticket by Reference Number or QR Code"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Verify Ticket</span>
              </button>
            )}

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIConcierge}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>AI Concierge</span>
            </button>

            {/* Suki Points Badge */}
            <button 
              onClick={() => setActiveTab('suki-rewards')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {sukiAccount.tier} Suki
                </div>
                <div className="text-xs font-bold text-amber-300">
                  {sukiAccount.points.toLocaleString()} pts
                </div>
              </div>
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <img 
                src={sukiAccount.avatar} 
                alt={sukiAccount.name} 
                className="w-7 h-7 rounded-lg object-cover border border-teal-500"
              />
              <span className="text-xs font-bold text-slate-200">{sukiAccount.name.split(' ')[0]}</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between py-3 border-b border-slate-800 mb-2">
            <div className="flex items-center space-x-3" onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}>
              <img src={sukiAccount.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-teal-500" />
              <div>
                <div className="font-bold text-sm text-white">{sukiAccount.name}</div>
                <div className="text-xs text-amber-400 font-semibold">{sukiAccount.tier} Suki • {sukiAccount.points} pts</div>
              </div>
            </div>
            <button 
              onClick={() => { onOpenAIConcierge(); setMobileMenuOpen(false); }}
              className="bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI</span>
            </button>
          </div>

          {onOpenVerifyTicket && (
            <button
              onClick={() => {
                onOpenVerifyTicket();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold bg-teal-950/60 border border-teal-500/30 text-teal-300 hover:bg-teal-900 transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>Verify Ticket (QR / Ref #)</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-teal-500 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex justify-around items-center">
        {[
          { id: 'home', label: 'Home', icon: Compass },
          { id: 'search', label: 'Search', icon: Search },
          { id: 'my-trips', label: 'Trips', icon: Ticket },
          { id: 'suki-rewards', label: 'Suki', icon: Award },
          { id: 'destinations', label: 'Explore', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
