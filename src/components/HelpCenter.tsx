import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { SupportTicket } from '../types';

interface HelpCenterProps {
  supportTickets: SupportTicket[];
  onSubmitTicket: (ticket: { category: string; subject: string; message: string; bookingNumber?: string }) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ supportTickets, onSubmitTicket }) => {
  const [category, setCategory] = useState('Booking');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [bookingNumber, setBookingNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { q: 'How do I access my digital boarding pass and QR code?', a: 'Go to "My Trips" in the navigation bar or click "View Digital Ticket" after booking confirmation to display your secure QR code.' },
    { q: 'How do Suki Traveler points work?', a: 'You automatically earn Suki points on every completed bus, ferry, and flight booking. Accumulate points to advance from Starter to Plus, Gold, and VIP tiers for extra discounts.' },
    { q: 'Can I cancel or refund my ticket?', a: 'Yes. Go to My Trips, select your booking, and click "Cancel Booking". Refunds are processed according to the operator policy.' },
    { q: 'What payment methods are supported?', a: 'We support GCash, Maya, credit/debit cards, and online banking simulations.' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    onSubmitTicket({ category, subject, message, bookingNumber });
    setSubject('');
    setMessage('');
    setBookingNumber('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
          Customer Support Center
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How Can We Help You Travel?</h2>
        <p className="text-slate-500 text-sm">
          Browse frequently asked questions or submit a support ticket to our Mindanao concierge team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base">{faq.q}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Support Ticket Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <span>Submit Support Ticket</span>
          </h3>

          {submitted && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 flex items-center space-x-3 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Support ticket submitted successfully! Our team will respond shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
              >
                <option value="Booking">Booking Assistance</option>
                <option value="Payment">Payment & GCash</option>
                <option value="Refund">Refunds & Cancellation</option>
                <option value="Voucher">Vouchers & Promo Codes</option>
                <option value="Suki">Suki Rewards</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Booking Number (Optional)</label>
              <input
                type="text"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value)}
                placeholder="e.g. MTTH-CAM-8821"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of issue..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Provide details how we can assist..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3.5 rounded-2xl shadow-md text-sm flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
