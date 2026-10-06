import React, { useState } from 'react';
import { SukiAccount, PointHistoryItem, Voucher } from '../types';
import { Award, Tag, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Gift, Crown, Trophy, Ticket, Star } from 'lucide-react';

interface SukiRewardsProps {
  sukiAccount: SukiAccount;
  pointHistory: PointHistoryItem[];
  vouchers: Voucher[];
  onClaimVoucher: (voucherId: string) => void;
}

export const SukiRewards: React.FC<SukiRewardsProps> = ({
  sukiAccount,
  pointHistory,
  vouchers,
  onClaimVoucher
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vouchers' | 'history'>('dashboard');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Suki Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-6 -translate-y-6">
          <Crown className="w-56 h-56 text-amber-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase border border-amber-500/30">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Suki Traveler Loyalty Program</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              The More You Travel, The More You Save.
            </h2>

            <p className="text-slate-300 text-sm">
              Earn Suki points on every bus, ferry, and flight booking across Mindanao. Unlock Gold and VIP perks, free upgrades, and exclusive travel vouchers.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <img src={sukiAccount.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400" />
                <div>
                  <h4 className="font-bold text-white">{sukiAccount.name}</h4>
                  <p className="text-xs text-amber-300 font-semibold">{sukiAccount.tier} Suki Member</p>
                </div>
              </div>
              <span className="text-2xl font-extrabold text-amber-400">{sukiAccount.points.toLocaleString()} pts</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300 font-semibold">
                <span>Progress to VIP Tier</span>
                <span>{sukiAccount.pointsToNextTier} pts left</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-3 mb-8">
        {[
          { id: 'dashboard', label: 'Suki Overview' },
          { id: 'vouchers', label: 'Voucher Center' },
          { id: 'history', label: 'Points History' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === t.id ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Completed Trips</h4>
            <div className="text-3xl font-extrabold text-slate-900">{sukiAccount.completedTrips}</div>
            <p className="text-xs text-slate-500">Verified completed Mindanao journeys across bus, ferry, and flights.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
              <Ticket className="w-5 h-5 text-teal-600" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Claimed Vouchers</h4>
            <div className="text-3xl font-extrabold text-slate-900">{vouchers.filter(v => v.claimed).length}</div>
            <p className="text-xs text-slate-500">Active promo codes and discount vouchers ready in your wallet.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Suki Tier Benefits</h4>
            <div className="text-sm font-bold text-amber-600">Gold Tier Status</div>
            <p className="text-xs text-slate-500">Extra 5% discount, priority boarding, and birthday point bonuses.</p>
          </div>
        </div>
      )}

      {activeTab === 'vouchers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {vouchers.map((v) => (
            <div key={v.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">{v.code}</span>
                  <span className="text-xs font-bold text-teal-600">{v.eligibleTransport.toUpperCase()}</span>
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">{v.title}</h4>
                <p className="text-slate-500 text-xs">{v.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">Valid until {v.validUntil}</span>
                {v.claimed ? (
                  <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Your Wallet</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onClaimVoucher(v.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow"
                  >
                    Claim Voucher
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 animate-fadeIn">
          <h3 className="text-xl font-extrabold text-slate-900 mb-6">Suki Points Activity Log</h3>
          <div className="space-y-4">
            {pointHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                <div>
                  <div className="font-bold text-slate-900">{item.description}</div>
                  <div className="text-xs text-slate-400">{item.date}</div>
                </div>
                <span className={`font-extrabold px-3 py-1 rounded-full text-xs ${
                  item.type === 'earned' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {item.type === 'earned' ? `+${item.pointsChange}` : item.pointsChange} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
