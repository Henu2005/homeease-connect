import React from 'react';
import { Icon } from '../components/shared/Icon';

export const AboutUs: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="bg-blue-50 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg shadow-xs">
            <Icon name="Info" size={22} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">About Us & Our Social Promise</h1>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Connecting homes with verified assistance to alleviate structural housework stress while championing employment for underprivileged domestic workers.
          </p>
        </div>

        {/* Mission and Vision Bento */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mb-6">
                <Icon name="Target" size={20} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-4">Our Core Mission</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                To simplify modern household workflows by delivering background-screened, dependable home caretakers, cleaners, and chefs, while ensuring absolute fair wages and safe, respectful work environments for physical helpers.
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center mb-6">
                <Icon name="Eye" size={20} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-4">Our Forward Vision</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                To build India's most trusted, socially conscious decentralized domestic services matching engine. We aim to formalize unregulated manual task labor through digital transparent tracking and state-regulated Aadhaar verifications.
              </p>
            </div>
          </div>
        </div>

        {/* Social Impact and Employment Generation */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Icon name="Sparkles" className="text-blue-500 animate-bounce" />
            Social Impact & Work Generation Blueprint
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Domestic help has historically lacked formal framework safeguards, leaving low-income individuals vulnerable to underpayment, arbitrary terminations, and physical exploitation. Our platform directly combats these inequities through a structured role ecosystem:
          </p>

          <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div>
              <div className="font-extrabold text-slate-900 mb-1 flex items-center gap-1">
                <span className="text-blue-600">01.</span> Aadhaar Protection
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                By ensuring Aadhaar profile checks, we defend customers while validating worker identities, increasing safety scores on both sides of the contract.
              </p>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 mb-1 flex items-center gap-1">
                <span className="text-blue-600">02.</span> Standard Living Hourly Rates
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Predefined hourly estimates prevent low-ball wage deals, helping daily wage workers lift their families out of extreme poverty.
              </p>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 mb-1 flex items-center gap-1">
                <span className="text-blue-600">03.</span> Dignity in Work
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                With a built-in grievance and review system, complaints can be registered properly, monitored and closed fairly by an administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics or Key Milestones */}
        <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-md flex justify-around flex-wrap gap-6 text-center">
          <div>
            <span className="block text-3xl font-black mb-1">500+</span>
            <span className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Unprivileged Helper Signups</span>
          </div>
          <div>
            <span className="block text-3xl font-black mb-1">₹4.5L+</span>
            <span className="text-xs text-blue-100 font-semibold uppercase tracking-wider font-semibold uppercase tracking-wider">Livelihoods Distributed</span>
          </div>
          <div>
            <span className="block text-3xl font-black mb-1">4.9/5.0</span>
            <span className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Average Service Rating</span>
          </div>
        </div>

      </div>
    </div>
  );
};
