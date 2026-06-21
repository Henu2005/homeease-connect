import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../shared/Icon';
import { Role } from '../../types';

interface NavbarProps {
  currentPage: string;
  navigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, navigate }) => {
  const { currentUser, logout, quickSwitchRole, users } = useApp();
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuickSwitch = (role: Role, email?: string) => {
    quickSwitchRole(role, email);
    setShowDemoDropdown(false);
    if (role === 'admin') navigate('admin-dashboard');
    else if (role === 'customer') navigate('customer-dashboard');
    else navigate('provider-dashboard');
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: 'Home' },
    { id: 'about', label: 'About Us', icon: 'Info' },
    { id: 'services', label: 'Services', icon: 'Briefcase' },
    { id: 'contact', label: 'Contact', icon: 'Mail' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs">
      {/* Demo Role Access Hub Top Baner */}
      <div className="bg-blue-600 text-white text-xs py-1.5 px-4 font-medium flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Icon name="Users" size={14} className="animate-pulse" />
          <span><strong>Quick Sandbox Switch:</strong> Test multiple perspectives seamlessly</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDemoDropdown(!showDemoDropdown)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-2.5 py-0.5 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            Switch Role <Icon name="ChevronDown" size={12} />
          </button>
          
          {showDemoDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                Select Account Context
              </div>
              
              <button 
                onClick={() => handleQuickSwitch('admin')}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm group-hover:text-blue-600 flex items-center gap-1">
                    <Icon name="ShieldAlert" size={14} className="text-blue-600" />
                    Admin Portal
                  </div>
                  <div className="text-xs text-slate-500">Full platform controls & approvals</div>
                </div>
                <Icon name="ArrowRight" size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button 
                onClick={() => handleQuickSwitch('customer', 'customer1@gmail.com')}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between cursor-pointer group border-t border-slate-50"
              >
                <div>
                  <div className="font-semibold text-sm group-hover:text-blue-600 flex items-center gap-1">
                    <Icon name="User" size={14} className="text-violet-600" />
                    Customer (Rahul Verma)
                  </div>
                  <div className="text-xs text-slate-500">Book culinary & care professionals</div>
                </div>
                <Icon name="ArrowRight" size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button 
                onClick={() => handleQuickSwitch('customer', 'customer2@gmail.com')}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between cursor-pointer group border-t border-slate-50"
              >
                <div>
                  <div className="font-semibold text-sm group-hover:text-blue-600 flex items-center gap-1">
                    <Icon name="User" size={14} className="text-indigo-600" />
                    Customer (Neha Gupta)
                  </div>
                  <div className="text-xs text-slate-500">Ongoing babysitting contract logs</div>
                </div>
                <Icon name="ArrowRight" size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button 
                onClick={() => handleQuickSwitch('provider', 'ramesh@serviceprovider.com')}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between cursor-pointer group border-t border-slate-50"
              >
                <div>
                  <div className="font-semibold text-sm group-hover:text-blue-600 flex items-center gap-1">
                    <Icon name="Activity" size={14} className="text-emerald-600" />
                    Provider: Ramesh Kumar (Approved)
                  </div>
                  <div className="text-xs text-slate-500">Set availability & accept chef requests</div>
                </div>
                <Icon name="ArrowRight" size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button 
                onClick={() => handleQuickSwitch('provider', 'david@serviceprovider.com')}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between cursor-pointer group border-t border-slate-50"
              >
                <div>
                  <div className="font-semibold text-sm group-hover:text-blue-600 flex items-center gap-1">
                    <Icon name="Clock" size={14} className="text-amber-500" />
                    Provider: David Gomgo (Pending)
                  </div>
                  <div className="text-xs text-slate-500">Showcases signup approval lifecycle</div>
                </div>
                <Icon name="ArrowRight" size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer border-0 p-0 hover:opacity-90"
            id="brand-logo"
          >
            <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center">
              <Icon name="Briefcase" size={20} />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base sm:text-lg block tracking-tight leading-none">
                Household Support
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Social Service Provider Hub
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" id="nav-desktop-links">
            {menuItems.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer pb-1 border-b-2 ${
                    isActive 
                      ? 'text-blue-600 border-blue-600 font-bold' 
                      : 'text-slate-600 border-transparent hover:text-blue-600'
                  }`}
                >
                  <Icon name={item.icon} size={15} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Auth State & Access Buttons */}
          <div className="hidden md:flex items-center gap-3" id="nav-auth-actions">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (currentUser.role === 'admin') navigate('admin-dashboard');
                    else if (currentUser.role === 'customer') navigate('customer-dashboard');
                    else navigate('provider-dashboard');
                  }}
                  className="bg-slate-50 font-semibold hover:bg-slate-100 text-slate-800 text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Icon name="LayoutDashboard" size={14} className="text-blue-600" />
                  Dashboard ({currentUser.fullName.split(' ')[0]})
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('home');
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Icon name="LogOut" size={13} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('login')}
                  className="text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer transition-all border border-slate-200"
                >
                  Sign In
                </button>
                <div className="relative group">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1">
                    Join Platform <Icon name="ChevronDown" size={12} />
                  </button>
                  <div className="absolute right-0 w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all transform translate-y-1 z-50">
                    <button
                      onClick={() => navigate('register-customer')}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium text-slate-700 cursor-pointer"
                    >
                      Hire Service (Customer)
                    </button>
                    <button
                      onClick={() => navigate('register-provider')}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-medium text-slate-700 cursor-pointer border-t border-slate-100"
                    >
                      Offer Work (Service Provider)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg border-0 cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-2 shadow-inner">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer ${
                currentPage === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    if (currentUser.role === 'admin') navigate('admin-dashboard');
                    else if (currentUser.role === 'customer') navigate('customer-dashboard');
                    else navigate('provider-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center bg-slate-100 text-slate-800 text-xs px-4 py-2.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="LayoutDashboard" size={14} className="text-blue-600" />
                  Dashboard ({currentUser.fullName})
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center bg-red-50 text-red-600 text-xs px-4 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="LogOut" size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-center py-2 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-100"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('register-customer');
                    setMobileMenuOpen(false);
                  }}
                  className="text-center py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
