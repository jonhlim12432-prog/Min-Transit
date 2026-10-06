import React, { useState } from 'react';
import { Compass, Calendar, DollarSign, CheckSquare, Plus, ArrowRight } from 'lucide-react';

interface TravelPlannerProps {
  onSearchRoute: (dest: string) => void;
}

export const TravelPlanner: React.FC<TravelPlannerProps> = ({ onSearchRoute }) => {
  const [destination, setDestination] = useState('Camiguin Island');
  const [budgetItems, setBudgetItems] = useState([
    { category: 'Transportation', amount: 1500 },
    { category: 'Accommodation (2 nights)', amount: 2800 },
    { category: 'Food & Dining', amount: 2000 },
    { category: 'Activities & Tours', amount: 1500 }
  ]);

  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemCategory || !newItemAmount) return;
    setBudgetItems([...budgetItems, { category: newItemCategory, amount: Number(newItemAmount) }]);
    setNewItemCategory('');
    setNewItemAmount('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
          Trip Planning Suite
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Mindanao Trip Planner & Budget</h2>
        <p className="text-slate-500 text-sm">
          Organize multi-stop journeys, calculate estimated trip budgets, and build custom itineraries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Budget Calculator */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              <span>Trip Budget Calculator</span>
            </h3>
            <span className="text-xl font-extrabold text-teal-600">₱{totalBudget.toLocaleString()}</span>
          </div>

          <div className="space-y-3">
            {budgetItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                <span className="font-bold text-slate-800">{item.category}</span>
                <span className="font-extrabold text-slate-900">₱{item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddBudgetItem} className="pt-4 border-t border-slate-100 flex gap-3">
            <input 
              type="text" 
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              placeholder="Expense category..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
            />
            <input 
              type="number" 
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              placeholder="Amount (₱)"
              className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow"
            >
              Add
            </button>
          </form>
        </div>

        {/* Quick Actions & Destination Selector */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs bg-teal-500/20 text-teal-300 font-bold px-3 py-1 rounded-full border border-teal-500/30">
              Ready to Depart?
            </span>
            <h3 className="text-2xl font-extrabold">Start Booking Your Itinerary</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Select your destination and instantly search available buses, ferries, and flights across Mindanao.
            </p>
          </div>

          <div className="space-y-4">
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-bold text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="Camiguin Island">Camiguin Island</option>
              <option value="Siargao Island">Siargao Island</option>
              <option value="Bukidnon Highlands">Bukidnon Highlands</option>
              <option value="Davao City">Davao City</option>
              <option value="Zamboanga City">Zamboanga City</option>
            </select>

            <button
              onClick={() => onSearchRoute(destination)}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold py-4 rounded-2xl shadow-lg text-sm flex items-center justify-center space-x-2"
            >
              <span>Search Transport for {destination}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
