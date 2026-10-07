import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, DollarSign, Ticket, Bus, BarChart3, Settings, AlertCircle, CheckCircle2, Rocket, Globe, ExternalLink } from 'lucide-react';

interface AdminDashboardProps {
  onOpenVercelDeploy?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenVercelDeploy }) => {
  const [metrics, setMetrics] = useState({
    totalBookings: 142,
    totalRevenue: 284500,
    totalTravelers: 12450,
    activeOperators: 5,
    destinationsCount: 20,
    sukiMembers: 8420
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-3 py-1 rounded-full border border-rose-500/30">
            System Control Center
          </span>
          <h2 className="text-3xl font-extrabold mt-2">MTTH Administrator Hub</h2>
          <p className="text-slate-400 text-sm mt-1">
            Monitor overall platform revenue, bookings, operator verification, Suki tier rules, and destinations CMS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onOpenVercelDeploy && (
            <button
              onClick={onOpenVercelDeploy}
              className="flex items-center space-x-2 bg-gradient-to-r from-slate-950 to-slate-800 hover:from-black hover:to-slate-900 text-white font-extrabold px-4 py-3 rounded-2xl border border-slate-700 shadow-lg cursor-pointer transition-all hover:scale-105"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
              <span>Deploy to Vercel</span>
            </button>
          )}
          <div className="flex items-center space-x-3 bg-slate-800 border border-slate-700 px-5 py-3 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Security Status</div>
              <div className="text-xs font-bold text-emerald-300">All Services Secure</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vercel Cloud Deployment Card */}
      {onOpenVercelDeploy && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-7 rounded-3xl mb-10 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-2xl border border-slate-700 flex items-center justify-center shrink-0 shadow-md">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Vercel Production Deployment Ready</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Vite + Edge Configured
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Root vercel.json, serverless api/index.ts endpoints, and SPA rewrites are generated and ready for instant deployment.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenVercelDeploy}
            className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-lg cursor-pointer"
          >
            <Rocket className="w-4 h-4 text-teal-600" />
            <span>Launch Deployment Guide</span>
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
          <div className="text-3xl font-extrabold text-slate-900">₱{metrics.totalRevenue.toLocaleString()}</div>
          <span className="text-xs text-emerald-600 font-bold">+18.4% from last month</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Bookings</span>
          <div className="text-3xl font-extrabold text-slate-900">{metrics.totalBookings}</div>
          <span className="text-xs text-teal-600 font-bold">Bus, Ferry & Flights</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Registered Travelers</span>
          <div className="text-3xl font-extrabold text-slate-900">{metrics.totalTravelers.toLocaleString()}</div>
          <span className="text-xs text-amber-600 font-bold">{metrics.sukiMembers} Suki Members</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Destinations CMS</span>
          <div className="text-3xl font-extrabold text-slate-900">{metrics.destinationsCount} Active</div>
          <span className="text-xs text-teal-600 font-bold">Mindanao Wide</span>
        </div>
      </div>

      {/* Admin Quick Actions / CMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900">Operator Verification Requests</h3>
          <div className="space-y-3">
            {[
              { name: 'Mindanao RoRo Express', type: 'Ferry', status: 'Pending Review' },
              { name: 'Davao Star Transit', type: 'Bus', status: 'Verified Active' }
            ].map((op, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                <div>
                  <div className="font-bold text-slate-900">{op.name}</div>
                  <div className="text-xs text-slate-500">{op.type}</div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  op.status.includes('Active') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {op.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900">System Audit Logs</h3>
          <div className="space-y-3">
            {[
              { action: 'Voucher code WELCOME10 updated', time: '10 mins ago', author: 'Admin' },
              { action: 'New schedule sch-1 published', time: '1 hour ago', author: 'System' },
              { action: 'Suki tier threshold synchronized', time: '3 hours ago', author: 'Admin' }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                <div>
                  <div className="font-bold text-slate-800">{log.action}</div>
                  <div className="text-xs text-slate-400">{log.author} • {log.time}</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
