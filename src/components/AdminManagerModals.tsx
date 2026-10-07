import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, ShieldCheck, Clock, User, FileText, 
  Camera, Ticket, Tag, Route as RouteIcon, Users, Edit3, Trash2, 
  CheckCircle2, DollarSign, Calendar, MapPin, Eye, AlertTriangle
} from 'lucide-react';
import { CustomerKycRecord } from '../mockData';
import { Booking, Schedule, Voucher, SubAdmin, TransportType } from '../types';

/* =========================================================================
   1. VIEW KYC DOCUMENTS MODAL
========================================================================= */
interface ViewKycDocsModalProps {
  customer: CustomerKycRecord;
  onClose: () => void;
  onApprove: (customerId: string) => void;
  onReject: (customerId: string, reason: string) => void;
  onReset: (customerId: string) => void;
}

export const ViewKycDocsModal: React.FC<ViewKycDocsModalProps> = ({
  customer,
  onClose,
  onApprove,
  onReject,
  onReset
}) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('Document image is blurry / unreadable');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn my-6 relative flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/30 border border-teal-400 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">KYC Verification Review</h3>
              <p className="text-xs text-slate-400">{customer.name} • {customer.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Current KYC Status</span>
              <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                customer.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                customer.kycStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                customer.kycStatus === 'rejected' ? 'bg-rose-100 text-rose-800' :
                'bg-slate-200 text-slate-800'
              }`}>
                {customer.kycStatus}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Submitted Time</span>
              <span className="text-xs font-semibold text-slate-800">{customer.submittedAt}</span>
            </div>
          </div>

          {/* ID Information */}
          <div className="grid grid-cols-2 gap-4 bg-teal-50/50 p-4 rounded-2xl border border-teal-100 text-xs">
            <div>
              <span className="text-[10px] text-teal-800 font-bold uppercase block">ID Document Type</span>
              <strong className="text-slate-900 text-sm">{customer.idType}</strong>
            </div>
            <div>
              <span className="text-[10px] text-teal-800 font-bold uppercase block">Government ID Number</span>
              <strong className="text-slate-900 text-sm font-mono">{customer.idNumber || 'Pending Submission'}</strong>
            </div>
          </div>

          {/* Document Scans */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Submitted Document Attachments</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Front of ID */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center">
                <span className="text-xs font-bold text-slate-700 block">Front of ID</span>
                <div className="h-28 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-2 relative group overflow-hidden shadow-inner">
                  <FileText className="w-8 h-8 text-teal-600 mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium">{customer.idType} Front</span>
                  <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded mt-1">256-bit Validated</span>
                </div>
              </div>

              {/* Back of ID */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center">
                <span className="text-xs font-bold text-slate-700 block">Back of ID</span>
                <div className="h-28 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-2 relative group overflow-hidden shadow-inner">
                  <FileText className="w-8 h-8 text-teal-600 mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium">Barcode & Security Chip</span>
                  <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded mt-1">Barcode Verified</span>
                </div>
              </div>

              {/* Selfie Liveness */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center">
                <span className="text-xs font-bold text-slate-700 block">Selfie Liveness</span>
                <div className="h-28 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-2 relative group overflow-hidden shadow-inner">
                  <Camera className="w-8 h-8 text-teal-600 mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium">Liveness Bio-Match</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded mt-1">Face Matched (98.4%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Mode Input */}
          {rejectMode && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Specify Reason for KYC Rejection:</span>
              </div>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none"
              >
                <option value="Document image is blurry / unreadable">Document image is blurry / unreadable</option>
                <option value="ID is expired or invalid format">ID is expired or invalid format</option>
                <option value="Name on ID does not match account name">Name on ID does not match account name</option>
                <option value="Selfie photo does not match ID portrait">Selfie photo does not match ID portrait</option>
                <option value="Unsupported ID type submitted">Unsupported ID type submitted</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectMode(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onReject(customer.id, rejectReason);
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onReset(customer.id);
              onClose();
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
          >
            Reset to Unverified
          </button>

          <div className="flex items-center gap-2">
            {!rejectMode && (
              <button
                type="button"
                onClick={() => setRejectMode(true)}
                className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Reject KYC
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onApprove(customer.id);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Verify Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. EDIT CUSTOMER MODAL
========================================================================= */
interface EditCustomerModalProps {
  customer: CustomerKycRecord;
  onClose: () => void;
  onSave: (updated: CustomerKycRecord) => void;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  customer,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState<CustomerKycRecord>({ ...customer });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn my-auto max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-teal-400" />
            <span>Edit Customer Profile & KYC</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Suki Tier</label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Starter Suki">Starter Suki</option>
                  <option value="Plus Suki">Plus Suki</option>
                  <option value="Gold Suki">Gold Suki</option>
                  <option value="VIP Suki">VIP Suki</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">KYC Status</label>
                <select
                  value={form.kycStatus}
                  onChange={(e) => setForm({ ...form, kycStatus: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="verified">Verified (Approved)</option>
                  <option value="pending">Pending Review</option>
                  <option value="unverified">Unverified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Completed Trips</label>
                <input
                  type="number"
                  value={form.completedBookings}
                  onChange={(e) => setForm({ ...form, completedBookings: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ID Document Type</label>
                <input
                  type="text"
                  value={form.idType}
                  onChange={(e) => setForm({ ...form, idType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ID Number</label>
                <input
                  type="text"
                  value={form.idNumber}
                  onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   3. EDIT BOOKING MODAL
========================================================================= */
interface EditBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onSave: (updated: Booking) => void;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  booking,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState<Booking>({ ...booking });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn my-auto max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Ticket className="w-4 h-4 text-teal-400" />
            <span>Modify Booking: {form.bookingCode}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Booking Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending Payment</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Paid (₱)</label>
                <input
                  type="number"
                  value={form.totalPaid}
                  onChange={(e) => setForm({ ...form, totalPaid: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Origin</label>
                <input
                  type="text"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Travel Class</label>
                <input
                  type="text"
                  value={form.selectedClass}
                  onChange={(e) => setForm({ ...form, selectedClass: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                <input
                  type="text"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   4. EDIT SCHEDULE / ROUTE MODAL
========================================================================= */
interface EditScheduleModalProps {
  schedule: Schedule;
  onClose: () => void;
  onSave: (updated: Schedule) => void;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  schedule,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState<Schedule>({ ...schedule });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn my-auto max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <RouteIcon className="w-4 h-4 text-teal-400" />
            <span>Edit Route: {form.origin} → {form.destination}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Operator Name</label>
                <input
                  type="text"
                  required
                  value={form.operatorName}
                  onChange={(e) => setForm({ ...form, operatorName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transport Mode</label>
                <select
                  value={form.transportType}
                  onChange={(e) => setForm({ ...form, transportType: e.target.value as TransportType })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ferry">Ferry / RoRo</option>
                  <option value="bus">Bus Line</option>
                  <option value="flight">Flight / Airline</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Origin City</label>
                <input
                  type="text"
                  required
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination City</label>
                <input
                  type="text"
                  required
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Fare (₱)</label>
                <input
                  type="number"
                  required
                  value={form.baseFare}
                  onChange={(e) => setForm({ ...form, baseFare: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available Seats</label>
                <input
                  type="number"
                  value={form.availableSeats}
                  onChange={(e) => setForm({ ...form, availableSeats: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Seats</label>
                <input
                  type="number"
                  value={form.totalSeats}
                  onChange={(e) => setForm({ ...form, totalSeats: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class Type</label>
                <input
                  type="text"
                  value={form.classType}
                  onChange={(e) => setForm({ ...form, classType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              Save Route Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   5. EDIT PROMO VOUCHER MODAL
========================================================================= */
interface EditVoucherModalProps {
  voucher: Voucher;
  onClose: () => void;
  onSave: (updated: Voucher) => void;
}

export const EditVoucherModal: React.FC<EditVoucherModalProps> = ({
  voucher,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState<Voucher>({ ...voucher });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, code: form.code.toUpperCase() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn my-auto max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-400" />
            <span>Edit Promo: {form.code}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Promo Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₱)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Min Spend (₱)</label>
                <input
                  type="number"
                  value={form.minSpend}
                  onChange={(e) => setForm({ ...form, minSpend: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eligible Transport</label>
                <select
                  value={form.eligibleTransport}
                  onChange={(e) => setForm({ ...form, eligibleTransport: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Transport Types</option>
                  <option value="flight">Flights Only</option>
                  <option value="ferry">Ferries Only</option>
                  <option value="bus">Buses Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              Save Promo Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   6. EDIT SUB-ADMIN MODAL
========================================================================= */
interface EditSubAdminModalProps {
  subAdmin: SubAdmin;
  onClose: () => void;
  onSave: (updated: SubAdmin) => void;
}

const AVAILABLE_PERMISSIONS = [
  'Manage Bookings',
  'Manage Customers & KYC',
  'Manage Routes & Trips',
  'Manage Promo Vouchers',
  'Manage Site Settings',
  'Issue Refunds',
  'Manage Operators'
];

export const EditSubAdminModal: React.FC<EditSubAdminModalProps> = ({
  subAdmin,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState<SubAdmin>({ ...subAdmin });

  const togglePermission = (perm: string) => {
    if (form.permissions.includes(perm)) {
      setForm({ ...form, permissions: form.permissions.filter(p => p !== perm) });
    } else {
      setForm({ ...form, permissions: [...form.permissions, perm] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn my-auto max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <span>Edit Sub-Admin: {form.name}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Type</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Operations Admin">Operations Admin</option>
                  <option value="Ticketing Agent">Ticketing Agent</option>
                  <option value="Support Agent">Support Agent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Permissions Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Granted Console Permissions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span>{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              Save Role Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
