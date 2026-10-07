import React, { useState } from 'react';
import { 
  X, Check, Copy, ExternalLink, Terminal, ShieldCheck, 
  Layers, Globe, Sparkles, CheckCircle2, Rocket, FileCode, Cpu, AlertCircle 
} from 'lucide-react';

interface VercelDeployModalProps {
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ onClose, onToast }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'cli' | 'config' | 'env'>('quick');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onToast(`Copied ${key} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const vercelJsonCode = `{
  "version": 2,
  "framework": "vite",
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const envConfigText = `GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production`;

  const cliCommands = `# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy to Preview
vercel

# 4. Deploy to Production
vercel --prod`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 sm:p-7 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-black rounded-2xl border border-slate-700 flex items-center justify-center shadow-md shrink-0">
              {/* Vercel Triangle SVG */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">Deploy MTTH to Vercel</h3>
                <span className="bg-teal-500/20 text-teal-300 font-bold text-[10px] px-2 py-0.5 rounded-full border border-teal-500/30">
                  Ready to Ship
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero-config edge & serverless deployment for Mindanao Travel Ticketing Hub
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex space-x-2 overflow-x-auto">
          {[
            { id: 'quick', label: '1-Click / Git Deploy', icon: Rocket },
            { id: 'cli', label: 'Vercel CLI', icon: Terminal },
            { id: 'config', label: 'vercel.json', icon: FileCode },
            { id: 'env', label: 'Environment Variables', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: QUICK 1-CLICK / GIT DEPLOY */}
          {activeTab === 'quick' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Big Vercel Deploy Button */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 sm:p-7 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-md">
                  <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-teal-500/30">
                    <Sparkles className="w-3 h-3" />
                    <span>Instant Production Deployment</span>
                  </div>
                  <h4 className="text-xl font-extrabold text-white">Deploy with 1-Click to Vercel</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Automatically builds Vite frontend, serverless API routes (`/api/*`), and enables global CDN caching with custom domains.
                  </p>
                </div>

                <a 
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-100 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2.5 shadow-2xl transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <svg className="w-4 h-4 fill-black" viewBox="0 0 1155 1000">
                    <path d="m577.3 0 577.4 1000H0z" />
                  </svg>
                  <span>Deploy to Vercel</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                </a>
              </div>

              {/* Pre-deployment Checklist */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Vercel Build Verification Checklist</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block font-bold">vercel.json Configured</strong>
                      <span className="text-slate-500 text-[11px]">Vite framework & SPA rewrite rules defined</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block font-bold">api/index.ts Serverless Entry</strong>
                      <span className="text-slate-500 text-[11px]">All /api endpoints ready for Node serverless runtime</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block font-bold">SPA Fallback Routing</strong>
                      <span className="text-slate-500 text-[11px]">Seamless client routing with no 404 on refresh</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block font-bold">Tailwind CSS & React 19</strong>
                      <span className="text-slate-500 text-[11px]">Optimized production asset bundling</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Step Guide */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">3-Step Web Deployment</h4>
                <ol className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <div>
                      <strong className="text-slate-900 block font-bold">Import Project into Vercel</strong>
                      <span className="text-slate-500">Go to vercel.com/new and connect your GitHub/GitLab repository.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <div>
                      <strong className="text-slate-900 block font-bold">Confirm Build Settings</strong>
                      <span className="text-slate-500">Preset: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">Vite</code> • Build Command: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">vite build</code> • Output: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">dist</code></span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <div>
                      <strong className="text-slate-900 block font-bold">Set Environment Variable & Deploy</strong>
                      <span className="text-slate-500">Add <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">GEMINI_API_KEY</code> in Vercel project settings and click <strong>Deploy</strong>.</span>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: VERCEL CLI */}
          {activeTab === 'cli' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Deploy directly using the Vercel CLI</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Run these commands in your project root terminal to instantly push a preview or production build.
                </p>
              </div>

              <div className="relative bg-slate-950 text-slate-100 rounded-2xl p-5 font-mono text-xs shadow-inner overflow-x-auto">
                <pre>{cliCommands}</pre>
                <button
                  onClick={() => copyToClipboard(cliCommands, 'CLI Commands')}
                  className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKey === 'CLI Commands' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'CLI Commands' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
                <strong className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  Pro Tip: Custom Domain Routing
                </strong>
                <p>
                  After deploying, run <code className="bg-teal-100 px-1 py-0.5 rounded font-mono font-bold">vercel domains add mindanaotickethub.ph</code> to bind your custom Philippine travel domain with automatic SSL.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: VERCEL.JSON */}
          {activeTab === 'config' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">vercel.json Configuration File</h4>
                  <p className="text-xs text-slate-500">Root configuration already generated in the project root.</p>
                </div>
                <button
                  onClick={() => copyToClipboard(vercelJsonCode, 'vercel.json')}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  {copiedKey === 'vercel.json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'vercel.json' ? 'Copied!' : 'Copy Config'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-emerald-400 rounded-2xl p-5 font-mono text-xs shadow-inner overflow-x-auto">
                <pre>{vercelJsonCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: ENVIRONMENT VARIABLES */}
          {activeTab === 'env' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Vercel Environment Variables</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Configure these keys in <strong>Vercel Dashboard → Project Settings → Environment Variables</strong>.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Variable Key</th>
                      <th className="p-3">Required</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-mono font-bold text-teal-700">GEMINI_API_KEY</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Recommended</span>
                      </td>
                      <td className="p-3 text-slate-600">Enables Gemini AI Concierge and smart itinerary generation for travel assistance</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-slate-800">NODE_ENV</td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Optional</span>
                      </td>
                      <td className="p-3 text-slate-600">Set to <code className="font-mono text-slate-800">production</code> for optimized asset delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="relative bg-slate-950 text-slate-200 rounded-2xl p-5 font-mono text-xs">
                <pre>{envConfigText}</pre>
                <button
                  onClick={() => copyToClipboard(envConfigText, '.env config')}
                  className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKey === '.env config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === '.env config' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Deployment Target: <strong>Vercel Global Edge Network</strong></span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 hover:bg-black text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
              <span>Go to Vercel</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
