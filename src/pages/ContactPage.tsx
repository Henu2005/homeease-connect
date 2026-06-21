import React, { useState } from 'react';
import { Icon } from '../components/shared/Icon';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Head header styling with brand colors */}
        <div className="text-center mb-16">
          <div className="bg-blue-50 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
            <Icon name="MailCheck" size={22} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Contact Household Support</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Have questions about system verifications, payment policies, or worker opportunities? Drop us a line and our social coordinators will reach back out.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column: Inquiry Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <Icon name="Send" size={20} className="text-blue-600" />
              Write Your Inquiry
            </h2>

            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                <Icon name="CheckCircle" className="mx-auto text-emerald-500 animate-bounce" size={40} />
                <h3 className="font-bold text-md">Letter Submitted Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Thank you for writing. Our social safety coordinators will investigate and dispatch an email reply within 24 working hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  Write Another Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                  >
                    <option value="General Inquiry">General Platform Inquiry</option>
                    <option value="Worker Protection">Worker Rights / Aadhaar Approval Inquiry</option>
                    <option value="Customer Refund">Customer Booking & Payments Help</option>
                    <option value="Partnership">Commercial Partnerships & CSR Funding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Detailed Message</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can support your situation..."
                    className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Icon name="Send" size={12} />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Address, Map Simulation */}
          <div className="space-y-8">
            
            {/* Quick Contact Cards */}
            <div className="bg-white p-7 rounded-3xl border border-slate-100 space-y-6">
              
              <div className="flex gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0 h-fit">
                  <Icon name="PhoneCall" size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Coordinator Hotline</h3>
                  <p className="text-xs text-slate-500 mb-0.5">Contact support for active slot concerns:</p>
                  <strong className="text-slate-800 text-xs">+91 (11) 9876-0000</strong>
                </div>
              </div>

              <div className="flex gap-4 border-t border-slate-50 pt-6">
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl shrink-0 h-fit">
                  <Icon name="MailSearch" size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Social Services Email</h3>
                  <p className="text-xs text-slate-500 mb-0.5">Submit verification queries directly:</p>
                  <strong className="text-slate-800 text-xs">support@householdsupport.org</strong>
                </div>
              </div>

              <div className="flex gap-4 border-t border-slate-50 pt-6">
                <div className="bg-violet-50 text-violet-600 p-3 rounded-xl shrink-0 h-fit">
                  <Icon name="MapPin" size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Central Head Office</h3>
                  <p className="text-xs text-slate-500">
                    B-4/504, 5th Floor, Connaught Circle, Connaught Place, New Delhi, Pin-110001, India
                  </p>
                </div>
              </div>

            </div>

            {/* Google Map Integration Simulation with Custom Styling */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs relative overflow-hidden">
              <div className="flex justify-between items-center mb-3 px-2">
                <div>
                  <strong className="text-slate-900 text-xs font-extrabold block">Social Support Zone</strong>
                  <span className="text-[10px] text-slate-400">Delhi-NCR Mapped Base Station Area</span>
                </div>
                <div className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Icon name="Flame" size={10} fill="currentColor" />
                  Live Station
                </div>
              </div>

              {/* Map Canvas Mock Vector Styling */}
              <div className="h-56 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200">
                <div className="absolute inset-0 opacity-45 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                
                {/* Simulated Roads */}
                <div className="absolute left-0 right-0 h-4 bg-white/80 top-1/3 transform -rotate-3 border-y border-slate-200 shadow-xs"></div>
                <div className="absolute top-0 bottom-0 w-6 bg-white/80 left-1/2 transform rotate-12 border-x border-slate-200 shadow-xs"></div>

                {/* Connaught Circular block ring */}
                <div className="absolute left-[30%] top-[25%] w-32 h-32 rounded-full border-[8px] border-slate-200 bg-transparent flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-800 shadow-xs">
                    Metro Stn
                  </div>
                </div>

                {/* Central Pin */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-bounce z-10">
                  <Icon name="MapPin" size={32} className="text-blue-600 filter drop-shadow" fill="currentColor" />
                </div>
                <div className="absolute top-[38%] left-1/2 -translate-x-1/2 bg-slate-900/10 w-4 h-1.5 rounded-full blur-xs"></div>

                {/* Mapped labels */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white font-mono text-[9px] px-2 py-1 rounded-md">
                  Lat: 28.6304° N, Lon: 77.2177° E
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
