import React, { useState } from 'react';
import { Schedule, Passenger, Voucher, SukiAccount } from '../types';
import { ShieldCheck, Tag, Award, CreditCard, CheckCircle2, ArrowRight, User, Phone, Mail, Calendar, Check, Smartphone, Landmark, Wallet } from 'lucide-react';

interface BookingCheckoutProps {
  schedule: Schedule;
  passengersCount: number;
  sukiAccount: SukiAccount;
  vouchers: Voucher[];
  onCompleteBooking: (bookingData: any) => void;
  onCancel: () => void;
}

export const BookingCheckout: React.FC<BookingCheckoutProps> = ({
  schedule,
  passengersCount,
  sukiAccount,
  vouchers,
  onCompleteBooking,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Passengers form state
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: passengersCount }, (_, idx) => ({
      fullName: idx === 0 ? sukiAccount.name : '',
      dob: '1995-06-15',
      gender: 'female',
      mobile: idx === 0 ? '+639171234567' : '',
      email: idx === 0 ? sukiAccount.email : '',
      passengerType: 'adult',
      seatNumber: `Seat ${idx + 12}`
    }))
  );

  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string>('WELCOME10');
  const [useSukiPoints, setUseSukiPoints] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<string>('GCash');

  // Fare calculations
  const baseTotal = (schedule.baseFare + schedule.terminalFee + schedule.serviceFee) * passengersCount;
  const taxes = Math.round(baseTotal * 0.05);

  let discountAmount = 0;
  if (selectedVoucherCode === 'WELCOME10') discountAmount = Math.round(baseTotal * 0.1);
  if (selectedVoucherCode === 'MINDANAO200') discountAmount = 200;
  if (selectedVoucherCode === 'SUKIGOLD') discountAmount = 500;
  if (selectedVoucherCode === 'BUSBUDDY') discountAmount = 100;

  const sukiDiscount = useSukiPoints ? 50 : 0;
  const finalTotal = Math.max(100, baseTotal + taxes - discountAmount - sukiDiscount);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleFinishPayment = () => {
    const bookingPayload = {
      scheduleId: schedule.id,
      transportType: schedule.transportType,
      operatorName: schedule.operatorName,
      operatorLogo: schedule.operatorLogo,
      origin: schedule.origin,
      destination: schedule.destination,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      passengers,
      selectedClass: schedule.classType,
      baseFare: schedule.baseFare * passengersCount,
      terminalFee: schedule.terminalFee * passengersCount,
      serviceFee: schedule.serviceFee * passengersCount,
      taxes,
      discountAmount,
      voucherCode: selectedVoucherCode,
      sukiDiscountAmount: sukiDiscount,
      totalPaid: finalTotal,
      sukiPointsEarned: Math.round(finalTotal * 0.1),
      paymentMethod
    };
    onCompleteBooking(bookingPayload);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        {[
          { num: 1, label: 'Traveler Info' },
          { num: 2, label: 'Review & Seats' },
          { num: 3, label: 'Voucher & Suki' },
          { num: 4, label: 'Secure Payment' }
        ].map((st) => (
          <div key={st.num} className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= st.num ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30' : 'bg-slate-100 text-slate-500'
            }`}>
              {step > st.num ? <Check className="w-4 h-4 text-white" /> : st.num}
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${step >= st.num ? 'text-slate-900' : 'text-slate-400'}`}>
              {st.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Step Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {step === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6 animate-fadeIn">
              <h3 className="text-xl font-extrabold text-slate-900">Passenger Information</h3>
              <p className="text-xs text-slate-500">Please ensure traveler names match government-issued identification cards.</p>

              {passengers.map((p, idx) => (
                <div key={idx} className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-sm text-teal-700 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Passenger #{idx + 1} ({p.passengerType.toUpperCase()})</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Full Name (as in ID)</label>
                      <input 
                        type="text" 
                        value={p.fullName}
                        onChange={(e) => handlePassengerChange(idx, 'fullName', e.target.value)}
                        placeholder="e.g. Maria Santos"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Date of Birth</label>
                      <input 
                        type="date" 
                        value={p.dob}
                        onChange={(e) => handlePassengerChange(idx, 'dob', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Mobile Number</label>
                      <input 
                        type="text" 
                        value={p.mobile}
                        onChange={(e) => handlePassengerChange(idx, 'mobile', e.target.value)}
                        placeholder="+639..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Email Address</label>
                      <input 
                        type="email" 
                        value={p.email}
                        onChange={(e) => handlePassengerChange(idx, 'email', e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md text-sm flex items-center space-x-2"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6 animate-fadeIn">
              <h3 className="text-xl font-extrabold text-slate-900">Review Journey & Seat Assignment</h3>
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>{schedule.origin} → {schedule.destination}</span>
                  <span className="text-teal-600">{schedule.operatorName}</span>
                </div>
                <div className="text-xs text-slate-600">
                  Departure: {schedule.departureTime} | Class: {schedule.classType} | Vehicle: {schedule.vehicleType}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800">Seat Preferences</h4>
                {passengers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-sm font-bold text-slate-800">{p.fullName || `Passenger #${i+1}`}</span>
                    <span className="text-xs font-extrabold bg-teal-100 text-teal-800 px-3 py-1 rounded-lg">
                      {p.seatNumber} (Window)
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md text-sm flex items-center space-x-2"
                >
                  <span>Apply Vouchers & Suki</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6 animate-fadeIn">
              <h3 className="text-xl font-extrabold text-slate-900">Voucher Wallet & Suki Rewards</h3>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Promo Voucher</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { code: 'WELCOME10', title: '10% OFF First Booking' },
                    { code: 'MINDANAO200', title: '₱200 OFF Island Trips' },
                    { code: 'SUKIGOLD', title: '₱500 OFF Gold Suki Reward' },
                    { code: 'BUSBUDDY', title: '₱100 OFF Bus Travel' }
                  ].map((v) => (
                    <div 
                      key={v.code}
                      onClick={() => setSelectedVoucherCode(v.code)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedVoucherCode === v.code 
                          ? 'border-teal-500 bg-teal-50/50 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded">{v.code}</span>
                        {selectedVoucherCode === v.code && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-2">{v.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suki Tier Perk */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold text-amber-800 uppercase">{sukiAccount.tier} Suki Traveler Privilege</div>
                    <div className="text-sm font-extrabold text-slate-900">Apply Suki Member ₱50 instant rebate</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={useSukiPoints}
                  onChange={(e) => setUseSukiPoints(e.target.checked)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md text-sm flex items-center space-x-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6 animate-fadeIn">
              <h3 className="text-xl font-extrabold text-slate-900">Select Secure Payment Gateway</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'GCash', label: 'GCash', icon: Wallet, color: 'text-emerald-500' },
                  { id: 'Maya', label: 'Maya', icon: Smartphone, color: 'text-violet-500' },
                  { id: 'CreditCard', label: 'Credit Card', icon: CreditCard, color: 'text-blue-500' },
                  { id: 'OnlineBanking', label: 'Online Bank', icon: Landmark, color: 'text-teal-600' }
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        paymentMethod === pm.id
                          ? 'border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-center mb-2">
                        <Icon className={`w-7 h-7 ${pm.color}`} />
                      </div>
                      <div className="text-xs font-bold text-slate-800">{pm.label}</div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Demo Payment Mode Active</p>
                <p>This is a simulated secure transaction for the Mindanao Travel Ticketing Hub preview environment. No real funds will be charged.</p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleFinishPayment}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold px-10 py-4 rounded-2xl shadow-xl shadow-teal-500/25 text-base flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Pay ₱{finalTotal.toLocaleString()} & Issue Ticket</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Price Breakdown Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-6 sticky top-28">
            <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3">Price Summary</h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({passengersCount}x)</span>
                <span className="font-semibold text-slate-900">₱{baseTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Terminal & Service Fees</span>
                <span className="font-semibold text-slate-900">₱{((schedule.terminalFee + schedule.serviceFee) * passengersCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Gov Fees</span>
                <span className="font-semibold text-slate-900">₱{taxes.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher ({selectedVoucherCode})</span>
                  <span>-₱{discountAmount.toLocaleString()}</span>
                </div>
              )}

              {sukiDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>Suki Traveler Rebate</span>
                  <span>-₱{sukiDiscount}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Final Total</span>
                <div className="text-2xl font-extrabold text-slate-900">₱{finalTotal.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-full">
                  +{Math.round(finalTotal * 0.1)} Suki Pts
                </span>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="w-full text-center text-xs text-rose-600 font-bold hover:underline pt-2"
            >
              Cancel Booking
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
