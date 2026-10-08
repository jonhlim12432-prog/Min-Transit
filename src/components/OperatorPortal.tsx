import React from 'react';
import { Bus, Ship, Plane, ShieldCheck, Users, Calendar, DollarSign, BarChart3, Star } from 'lucide-react';
import { Operator } from '../types';

interface OperatorPortalProps {
  operators: Operator[];
}

export const OperatorPortal: React.FC<OperatorPortalProps> = ({ operators }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs bg-teal-500/20 text-teal-300 font-bold px-3 py-1 rounded-full border border-teal-500/30">
            Transport Partner Dashboard
          </span>
          <h2 className="text-3xl font-extrabold mt-2">Operator Management Portal</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage your fleet schedules, seat allocations, route fares, and verified bookings across Mindanao.
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-2xl text-center">
          <div className="text-xs text-slate-400 uppercase font-bold">Active Operators</div>
          <div className="text-2xl font-extrabold text-teal-400">{operators.length} Verified Partners</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {operators.map((op) => (
          <div key={op.id} className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{op.logo}</span>
                <div>
                  <h4 className="font-extrabold text-slate-900">{op.name}</h4>
                  <p className="text-xs text-teal-600 font-bold uppercase">{op.type}</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{op.description}</p>

            <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span>Customer Rating:</span>
                <span className="font-bold text-slate-900 inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{op.rating} / 5.0 ({op.reviewCount} reviews)</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation Policy:</span>
                <span className="font-bold text-slate-700">{op.policies.cancellation}</span>
              </div>
            </div>

            <button
              onClick={() => {}}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow"
            >
              Manage Schedules & Fleet
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
