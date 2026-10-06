import React from 'react';
import { SukiAccount } from '../types';
import { X, Award, User, Mail, ShieldCheck, Ticket } from 'lucide-react';

interface ProfileModalProps {
  sukiAccount: SukiAccount;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ sukiAccount, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn">
        
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={sukiAccount.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-400" />
            <div>
              <h3 className="font-extrabold text-base">{sukiAccount.name}</h3>
              <p className="text-xs text-slate-400">{sukiAccount.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-amber-600" />
              <div>
                <div className="text-xs font-bold text-amber-800 uppercase">{sukiAccount.tier} Suki Status</div>
                <div className="text-xl font-extrabold text-slate-900">{sukiAccount.points.toLocaleString()} Points</div>
              </div>
            </div>
            <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full">
              Member
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-semibold">Completed Trips</span>
              <span className="font-extrabold text-slate-900">{sukiAccount.completedTrips}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-semibold">Vouchers Wallet</span>
              <span className="font-extrabold text-slate-900">{sukiAccount.vouchersCount} Active</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-semibold">Member Since</span>
              <span className="font-extrabold text-slate-900">{sukiAccount.joinedDate}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs shadow"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
