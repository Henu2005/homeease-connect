import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/shared/Icon';

interface RegisterCustomerProps {
  navigate: (page: string) => void;
}

export const RegisterCustomer: React.FC<RegisterCustomerProps> = ({ navigate }) => {
  const { registerCustomer } = useApp();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMess, setErrorMess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address || !password) {
      setErrorMess('All fields are requested.');
      return;
    }
   try {

      const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        phone,
        address,
        role: "customer",
        createdAt: new Date()
      });

      alert("Registration Successful!");

      navigate('services');

    } catch (error: any) {

      console.error(error);
      setErrorMess(error.message);

    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 text-slate-800 flex justify-center items-center">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full mx-4">
        
        {/* Brand identity */}
        <div className="text-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-2xl inline-flex items-center justify-center mb-3">
            <Icon name="User" size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Hire Home Helpers</h1>
          <p className="text-xs text-slate-400 mt-1">Register as a customer to browse skill slots & arrange care.</p>
        </div>

        {errorMess && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 mb-4 flex items-center gap-2">
            <Icon name="AlertCircle" size={14} />
            <span>{errorMess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Your Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@gmail.com"
              className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Full Residential Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. B-302, Green Avenue, Mumbai"
              className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
            />
          </div>

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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-sm shadow-blue-100 transition-colors"
          >
            Register Primary Customer Account
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Already Registered?{' '}
          <button 
            onClick={() => navigate('login')}
            className="text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Sign In Instantly
          </button>
        </div>

        <div className="text-center mt-3 text-[10px] text-slate-400 border-t border-slate-50 pt-3">
          By signing up, you agree to secure our helpers' occupational safety standards.
        </div>

      </div>
    </div>
  );
};
