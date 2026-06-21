import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/shared/Icon';

interface LoginProps {
  navigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ navigate }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMess, setErrorMess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMess('Please provide an email address');
      return;
    }
    const res = login(email, password);
    if (res.success) {
      if (email.includes('admin')) {
        navigate('admin-dashboard');
      } else if (email.includes('serviceprovider') || email.includes('ramesh')) {
        navigate('provider-dashboard');
      } else {
        navigate('customer-dashboard');
      }
    } else {
      setErrorMess(res.error || 'Authentication failed');
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMess(null);
    const res = login(demoEmail, 'password123');
    if (res.success) {
      if (demoEmail.includes('admin')) {
        navigate('admin-dashboard');
      } else if (demoEmail.includes('serviceprovider') || demoEmail.includes('ramesh') || demoEmail.includes('david')) {
        navigate('provider-dashboard');
      } else {
        navigate('customer-dashboard');
      }
    } else {
      setErrorMess(res.error || 'Authentication failed');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 text-slate-800 flex justify-center items-center">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full mx-4">
        
        {/* Brand identity */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-2xl inline-flex items-center justify-center mb-3">
            <Icon name="Briefcase" size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Access Your Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to check task requests, bookings, and earnings.</p>
        </div>

        {errorMess && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 mb-4 flex items-center gap-2">
            <Icon name="AlertCircle" size={14} />
            <span>{errorMess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5_">Registered Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer1@gmail.com"
              className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Standard testing skips password match checks</span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-sm shadow-blue-100 transition-colors"
          >
            Authenticate Portal
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          New to the Platform?{' '}
          <button 
            onClick={() => navigate('register-customer')}
            className="text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Create Customer Account
          </button>
        </div>

        {/* Demo Fast Access Credentials */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <strong className="block text-[10px] font-bold uppercase text-slate-400 text-center tracking-wider mb-3">
            Developer Sandbox Credentials (Click to Sign In)
          </strong>
          
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('admin@service.com')}
              className="w-full text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between cursor-pointer group text-xs text-slate-700 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <Icon name="ShieldAlert" size={13} className="text-blue-600 font-bold" />
                <span>Default Admin Portal</span>
              </div>
              <span className="text-[9px] text-blue-600 bg-blue-50 group-hover:bg-blue-100/50 px-2 py-0.5 rounded font-bold uppercase">Admin</span>
            </button>

            <button
              onClick={() => handleQuickLogin('customer1@gmail.com')}
              className="w-full text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between cursor-pointer group text-xs text-slate-700 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <Icon name="User" size={13} className="text-slate-600" />
                <span>Rahul Verma (Cooking Bookings)</span>
              </div>
              <span className="text-[9px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold uppercase">Customer</span>
            </button>

            <button
              onClick={() => handleQuickLogin('ramesh@serviceprovider.com')}
              className="w-full text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between cursor-pointer group text-xs text-slate-700 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <Icon name="Activity" size={13} className="text-slate-600" />
                <span>Ramesh Kumar (Cooking Expert)</span>
              </div>
              <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">Provider</span>
            </button>

            <button
              onClick={() => handleQuickLogin('david@serviceprovider.com')}
              className="w-full text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between cursor-pointer group text-xs text-slate-700 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <Icon name="Clock" size={13} className="text-amber-500" />
                <span>David Gomgo (Pending Verification)</span>
              </div>
              <span className="text-[9px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold uppercase">Pending</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
