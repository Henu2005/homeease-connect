import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/shared/Icon';

interface RegisterProviderProps {
  navigate: (page: string) => void;
}

export const RegisterProvider: React.FC<RegisterProviderProps> = ({ navigate }) => {
  const { categories } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState<number>(2);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [errorMess, setErrorMess] = useState<string | null>(null);

  const handleCategoryToggle = (catName: string) => {
    if (selectedCats.includes(catName)) {
      setSelectedCats(prev => prev.filter(c => c !== catName));
    } else {
      setSelectedCats(prev => [...prev, catName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess(null);

    if (!fullName || !email || !phone || !address || !aadhaar || !skills || !password) {
      setErrorMess('Please capture all operational profile fields.');
      return;
    }

    if (selectedCats.length === 0) {
      setErrorMess('Please select at least one predefined Service Category.');
      return;
    }

    // Direct registration
    try {
      await addDoc(collection(db, "providers"), {
        fullName,
        email,
        phone,
        address,
        aadhaar,
        skills,
        experience,
        categories: selectedCats,
        password,
        status: "pending",
        createdAt: serverTimestamp()
      });

      setSuccessInfo("Provider registration submitted successfully!");

    } catch (error) {
      console.error(error);
      setErrorMess("Failed to save provider data");
    } 

    
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 text-slate-800 flex justify-center items-center">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-lg w-full mx-4">
        
        {/* Brand identity */}
        <div className="text-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-2xl inline-flex items-center justify-center mb-3">
            <Icon name="Activity" size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Offer Household Work</h1>
          <p className="text-xs text-slate-400 mt-1">Get local orders, control your availability, & withdraw full earnings.</p>
        </div>

        {successInfo ? (
          <div className="space-y-6 py-4">
            <div className="bg-blue-50 text-blue-800 border border-blue-200 p-6 rounded-2xl text-center space-y-3">
              <Icon name="SearchCheck" className="mx-auto text-blue-600 animate-pulse" size={44} />
              <h3 className="font-extrabold text-base">Registration Submitted!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your profile has been created in a <strong>Pending Verification</strong> status, backed by Aadhaar validation.
              </p>
              
              {/* Highlight Admin action option */}
              <div className="bg-white p-4 rounded-xl text-left border border-blue-100 space-y-2 mt-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase block tracking-wider">Fast-track Demo Action</span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  To test the complete workflow, switch to the <strong>Admin Portal</strong> at the top bar or via Login to verify and approve this account instantly!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('login')}
                    
                    className="w-full text-center py-2 bg-blue-600 text-white text-[10px] rounded-lg font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    Go to Login Screen
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMess && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 mb-2 flex items-center gap-2">
                <Icon name="AlertCircle" size={14} />
                <span>{errorMess}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. David Gomgo"
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="david@serviceprovider.com"
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Contact Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 77722 33445"
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                />
              </div>

              {/* Aadhaar */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Aadhaar Card Number (12 Digits)</label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder="e.g. 9999-8888-7777"
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Full Residential Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Kandivali West, Mumbai"
                className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
              />
            </div>

            {/* Experience & Skills */}
            <div className="grid sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-1">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Experience (Years)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="40"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Skills Highlight & Bio</label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. South Indian chef, child-friendly storyteller"
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Service categories multi-select checkboxes */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">
                Offering Service Categories (Select at least one)
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-36 overflow-y-auto">
                {categories.map((cat) => {
                  const isChecked = selectedCats.includes(cat.name);
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCategoryToggle(cat.name)}
                        className="rounded accent-blue-600 border-slate-300 w-4 h-4"
                      />
                      <span>{cat.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Choose Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-sm transition-colors"
            >
              Submit Professional Registration
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-xs text-slate-500">
          Already Registered?{' '}
          <button 
            onClick={() => navigate('login')}
            className="text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Go to Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
