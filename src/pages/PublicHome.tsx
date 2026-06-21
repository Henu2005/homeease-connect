import React from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/shared/Icon';

interface PublicHomeProps {
  navigate: (page: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ navigate }) => {
  const { categories, providers, services, quickSwitchRole } = useApp();

  // Get active approved providers count
  const approvedCount = providers.filter(p => p.verificationStatus === 'approved').length;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      
      {/* 1. Hero Section */}
      <section className="bg-white py-16 sm:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
              <Icon name="Heart" size={12} fill="currentColor" />
              <span>Empowering Workers, Supporting Families</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
              Verified Helpers for <span className="text-blue-600">Your Every Household Task</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
              Find background-vetted, expert assistance for Child Care, Adult Care, Mopping, Sweeping, and Meals. We bridge the gap between busy households and economic earners seeking safe, verified opportunities.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('services')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 text-sm"
              >
                Find & Book Services
                <Icon name="ArrowRight" size={16} />
              </button>
              <button
                onClick={() => navigate('register-provider')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-sm"
              >
                Become a Service Provider
              </button>
            </div>
            
            {/* Short Stats Badge */}
            <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 max-w-md">
              <div>
                <strong className="block text-2xl font-extrabold text-slate-900">8+</strong>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Service Types</span>
              </div>
              <div>
                <strong className="block text-2xl font-extrabold text-slate-900">100%</strong>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Vetted Providers</span>
              </div>
              <div>
                <strong className="block text-2xl font-extrabold text-slate-900">{approvedCount || '10+'}+</strong>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Verified Helpers</span>
              </div>
            </div>
          </div>
          
          {/* Hero Illustration / Banner Visual card with custom theme styling */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-blue-100 rounded-3xl transform rotate-3 scale-95 opacity-50 blur-xl"></div>
            <div className="relative bg-white p-7 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <Icon name="CheckCircle" className="text-emerald-500" />
                Vetting Safeguards Included
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0">
                    <Icon name="FileText" size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 mb-0.5">Aadhaar Card Checked</h4>
                    <p className="text-[11px] text-slate-500">Every provider registration requires a secure Aadhaar submission verified by our safety admin.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg shrink-0">
                    <Icon name="Sparkles" size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 mb-0.5">Categorized Skills Validation</h4>
                    <p className="text-[11px] text-slate-500">Helpers undergo basic work review matching cooking, child care, and housekeeping categories.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-violet-50 text-violet-600 p-2 rounded-lg shrink-0">
                    <Icon name="Calculator" size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 mb-0.5">Clear Pricing Guarantee</h4>
                    <p className="text-[11px] text-slate-500">Estimated cost values provided upfront. Pay or book online via secure gateway mocks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Predefined Categories Overview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Explore Predefined Household Categories
            </h2>
            <p className="text-slate-600">
              Browse professional assistance specifically cataloged to match local household requirements. High-quality standards, reliable hourly/flat packages.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon name={cat.icon} size={22} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{cat.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{cat.description}</p>
                </div>
                <button
                  onClick={() => navigate('services')}
                  className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700 cursor-pointer pt-2 group-hover:translate-x-1 transition-transform"
                >
                  View Bookings
                  <Icon name="ChevronRight" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Easy Booking Path in 3 Mapped Steps
            </h2>
            <p className="text-slate-600">
              Our digital matching service streamlines search and approval flows for frictionless support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-slate-100 z-0"></div>
            
            <div className="text-center relative z-10">
              <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center font-bold text-xl mb-6 shadow-sm border border-blue-100">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Search & Custom Filters</h3>
              <p className="text-xs text-slate-500 px-4 leading-relaxed">
                Customers filter by Service Category, localized Address, and proven star rating levels to find the perfect household candidate.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center font-bold text-xl mb-6 shadow-sm border border-blue-100">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Safe Date & Note Booking</h3>
              <p className="text-xs text-slate-500 px-4 leading-relaxed">
                Input your preferred slot times and specify notes (e.g. food allergen details, mopping layout instructions) to trigger instant provider alerts.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center font-bold text-xl mb-6 shadow-sm border border-blue-100">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Complete & Pay Securely</h3>
              <p className="text-xs text-slate-500 px-4 leading-relaxed">
                Approve booking progressions to "Accepted", "In Progress", and "Completed". Provide ratings/reviews while funding gets settled!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section (Social Impact Focusing) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">Our Social Commitment</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-4 mb-6 leading-tight">
              Creating Dignified Work for Economically Needy Individuals
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Icon name="Check" className="text-emerald-500 shrink-0" size={18} />
                <p className="text-sm text-slate-600"><strong>Poverty Reduction:</strong> Empowers women, daily earners, and low-income individuals with steady service orders.</p>
              </div>
              <div className="flex gap-3">
                <Icon name="Check" className="text-emerald-500 shrink-0" size={18} />
                <p className="text-sm text-slate-600"><strong>Fair Wage System:</strong> Services explicitly list pricing estimates. Safe negotiation supports worker livelihood protection.</p>
              </div>
              <div className="flex gap-3">
                <Icon name="Check" className="text-emerald-500 shrink-0" size={18} />
                <p className="text-sm text-slate-600"><strong>System Integrity & Aadhar checks:</strong> Ensures both user and worker have peace of mind through rigid admin account screening.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('about')}
              className="mt-8 text-blue-600 text-xs font-bold hover:text-blue-700 cursor-pointer flex items-center gap-1.5"
            >
              Learn More About Our Social Mission
              <Icon name="ArrowRight" size={14} />
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-100 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 text-slate-100 transform translate-x-1/4 translate-y-1/4 -z-10 select-none">
              <Icon name="Quote" size={160} />
            </div>
            <div className="text-yellow-400 mb-4 flex gap-1">
              <Icon name="Star" size={18} fill="currentColor" />
              <Icon name="Star" size={18} fill="currentColor" />
              <Icon name="Star" size={18} fill="currentColor" />
              <Icon name="Star" size={18} fill="currentColor" />
              <Icon name="Star" size={18} fill="currentColor" />
            </div>
            <p className="italic text-slate-600 text-sm mb-6 leading-relaxed">
              "Being able to find clean, steady cooking work through Household Support has completely transformed my household's budget. I could easily verify my Aadhar card, register my specialty recipes, and get immediate orders in Delhi!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700">RK</div>
              <div>
                <strong className="block text-slate-800 text-sm font-bold">Ramesh Kumar</strong>
                <span className="text-[10px] text-slate-500">Delhi Cooking Partner since 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action section */}
      <section className="bg-blue-600 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">Ready to Find Verified Home Help?</h2>
          <p className="text-blue-100 text-sm sm:text-base mb-8">
            Register as a customer today to schedule daily services, manage payments instantly, and access real reviews.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('register-customer')}
              className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-slate-50 cursor-pointer shadow-md transition-all hover:-translate-y-0.5"
            >
              Sign Up as Customer
            </button>
            <button
              onClick={() => navigate('register-provider')}
              className="bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-blue-800 cursor-pointer shadow-inner border border-blue-500 transition-all"
            >
              Offer Services Now
            </button>
          </div>
        </div>
      </section>

      {/* 6. Main Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-extrabold text-white text-base mb-4 tracking-wide flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Icon name="CheckSquare" size={16} />
              </div>
              Household Support
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Connecting households with background-screened professionals. Building a sustainable path forward for daily wage earners.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs mb-4 uppercase tracking-widest text-slate-300">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigate('home')} className="hover:text-white cursor-pointer bg-transparent border-0 p-0">Home Landing</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-white cursor-pointer bg-transparent border-0 p-0">Mission & Vision</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-white cursor-pointer bg-transparent border-0 p-0">Service Offerings</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-white cursor-pointer bg-transparent border-0 p-0">Get in Touch</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs mb-4 uppercase tracking-widest text-slate-300">Preset Roles Playbook</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => { quickSwitchRole('customer', 'customer1@gmail.com'); navigate('customer-dashboard'); }} className="hover:text-white pointer-events-auto bg-transparent border-0 text-left">Login Rahul (Customer)</button></li>
              <li><button onClick={() => { quickSwitchRole('provider', 'ramesh@serviceprovider.com'); navigate('provider-dashboard'); }} className="hover:text-white pointer-events-auto bg-transparent border-0 text-left">Login Ramesh (Provider)</button></li>
              <li><button onClick={() => { quickSwitchRole('admin'); navigate('admin-dashboard'); }} className="hover:text-white pointer-events-auto bg-transparent border-0 text-left">Login Administrator</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs mb-4 uppercase tracking-widest text-slate-300">Secure Operation</h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              All personal records are saved safely in local storage database tables. Registered in line with 2026 digital directives.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Icon name="Lock" size={12} />
              <span>TLS Security Active</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 Household Service Provider System. Developed for empowerment & societal harmony.</p>
        </div>
      </footer>

    </div>
  );
};
