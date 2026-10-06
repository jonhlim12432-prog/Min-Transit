import React, { useState } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';

interface AIConciergeModalProps {
  onClose: () => void;
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({ onClose }) => {
  const [destination, setDestination] = useState('Camiguin Island');
  const [budget, setBudget] = useState('Mid-range (₱5,000)');
  const [style, setStyle] = useState('Adventure & Beaches');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, budget, style })
      });
      const data = await res.json();
      setRecommendation(data.recommendation);
    } catch (err) {
      console.error(err);
      setRecommendation('Failed to generate AI recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn relative my-8">
        
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">MTTH AI Travel Concierge</h3>
              <p className="text-xs text-orange-100">Powered by Google Gemini 2.5 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-orange-700/50 hover:bg-orange-700 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {!recommendation ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Where in Mindanao would you like to explore?</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Camiguin Island, Siargao, Bukidnon..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Budget Range</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Budget (₱3,000)">Budget (₱3,000)</option>
                    <option value="Mid-range (₱7,000)">Mid-range (₱7,000)</option>
                    <option value="Luxury (₱15,000+)">Luxury (₱15,000+)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Travel Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Adventure & Beaches">Adventure & Beaches</option>
                    <option value="Culture & Heritage">Culture & Heritage</option>
                    <option value="Highland Nature">Highland Nature</option>
                    <option value="Island Hopping">Island Hopping</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold py-4 rounded-2xl shadow-lg text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>AI is crafting your itinerary...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Generate AI Travel Itinerary</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-orange-50/60 p-6 rounded-2xl border border-orange-200 text-sm text-slate-800 leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap font-medium">
                {recommendation}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setRecommendation(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs"
                >
                  Ask Another Question
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs shadow"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
