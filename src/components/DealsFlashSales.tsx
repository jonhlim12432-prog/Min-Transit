import React from 'react';
import { Promotion } from '../types';
import { Tag, Sparkles, ArrowRight, Clock } from 'lucide-react';

interface DealsFlashSalesProps {
  promotions: Promotion[];
  onBookDeal: (promo: Promotion) => void;
}

export const DealsFlashSales: React.FC<DealsFlashSalesProps> = ({ promotions, onBookDeal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span className="text-xs bg-orange-50 text-orange-700 font-bold px-3 py-1 rounded-full border border-orange-200">
          Limited Time Offers
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Flash Sales & Travel Promos</h2>
        <p className="text-slate-500 text-sm">
          Save big on your next Mindanao bus, ferry, or flight trip with our verified promotional codes and deals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {promotions.map((promo) => (
          <div 
            key={promo.id}
            className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200/80 hover:border-orange-500 hover:shadow-xl transition-all flex flex-col group"
          >
            <div className="relative h-52 overflow-hidden">
              <img 
                src={promo.heroImage} 
                alt={promo.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow">
                {promo.discountText}
              </div>
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white font-mono text-xs font-bold px-3 py-1.5 rounded-full">
                {promo.code}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-slate-500 text-xs font-medium">{promo.subtitle}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {promo.discountedPrice && (
                    <div className="text-xs text-slate-400 font-semibold line-through">₱{promo.originalPrice}</div>
                  )}
                  <div className="text-lg font-extrabold text-slate-900">
                    {promo.discountedPrice ? `₱${promo.discountedPrice}` : promo.discountText}
                  </div>
                </div>

                <button
                  onClick={() => onBookDeal(promo)}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow flex items-center space-x-1.5"
                >
                  <span>Book Deal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
