import React, { useState } from 'react';
import { TravelGuide } from '../types';
import { BookOpen, Clock, User, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface TravelGuidesProps {
  guides: TravelGuide[];
  onBookRoute: (destinationName: string) => void;
}

export const TravelGuides: React.FC<TravelGuidesProps> = ({ guides, onBookRoute }) => {
  const [activeArticle, setActiveArticle] = useState<TravelGuide | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
          Expert Travel Inspiration
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Mindanao Travel Guides</h2>
        <p className="text-slate-500 text-sm">
          Detailed itineraries, ferry tips, bus connections, and local advice written by seasoned travelers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((g) => (
          <div
            key={g.id}
            onClick={() => setActiveArticle(g)}
            className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200/80 hover:border-teal-500 hover:shadow-xl transition-all flex flex-col cursor-pointer group"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={g.heroImage} 
                alt={g.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {g.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-xs text-slate-400 font-semibold">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{g.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{g.readingTime}</span>
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {g.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  {g.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{g.date}</span>
                <span className="flex items-center space-x-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn relative my-8">
            
            <div className="relative h-72">
              <img 
                src={activeArticle.heroImage} 
                alt={activeArticle.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs bg-teal-500 font-bold px-3 py-1 rounded-full">{activeArticle.category}</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold">{activeArticle.title}</h2>
                <p className="text-xs text-slate-300">By {activeArticle.author} • {activeArticle.date}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <p className="text-slate-700 text-base font-medium leading-relaxed">{activeArticle.introduction}</p>

              <div className="space-y-4 pt-2">
                {activeArticle.content.map((paragraph, i) => (
                  <p key={i} className="text-slate-600 text-sm leading-relaxed">{paragraph}</p>
                ))}
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm">Essential Travel Tips</h4>
                <div className="space-y-2">
                  {activeArticle.travelTips.map((tip, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Estimated Budget</span>
                  <div className="font-extrabold text-slate-900 text-sm">{activeArticle.estimatedBudget}</div>
                </div>

                <button
                  onClick={() => {
                    const guideTitle = activeArticle.title;
                    setActiveArticle(null);
                    onBookRoute('Camiguin Island');
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow"
                >
                  <span>Find Tickets Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
