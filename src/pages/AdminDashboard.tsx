import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/shared/Icon';
import { User, ServiceProviderProfile, Booking, Complaint } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    providers,
    bookings,
    payments,
    complaints,
    categories,
    verifyProvider,
    blockUser,
    unblockUser,
    addCategory,
    editCategory,
    deleteCategory,
    updateComplaintStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'verifications' | 'bookings' | 'categories' | 'complaints' | 'reports'>('stats');

  // Local Administrative States
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Home');

  // Booking filters state
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('All');
  const [bookingFilterType, setBookingFilterType] = useState<string>('All');
  const [bookingFilterDate, setBookingFilterDate] = useState<string>('');

  // Complaint local action states
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Report selection
  const [reportType, setReportType] = useState<'revenue' | 'bookings' | 'performance' | 'activity'>('revenue');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Stats Calculations
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalProviders = users.filter(u => u.role === 'provider').length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.price, 0);

  // Handle provider verification
  const handleVerify = (providerId: string, action: 'approved' | 'rejected') => {
    verifyProvider(providerId, action);
    alert(`Provider verification status set to ${action}.`);
  };

  const handleBlockToggle = (user: User) => {
    if (user.isActive) {
      blockUser(user.id);
      alert(`User ${user.fullName} blocked from accessing the platform.`);
    } else {
      unblockUser(user.id);
      alert(`User ${user.fullName} unblocked.`);
    }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatDesc) return;
    addCategory(newCatName, newCatDesc, newCatIcon);
    setNewCatName('');
    setNewCatDesc('');
    setNewCatIcon('Home');
    setAddingCat(false);
    alert('Predefined category added list.');
  };

  const handleResolveComplaint = (e: React.FormEvent, complaintId: string) => {
    e.preventDefault();
    if (!resolutionText) return;
    updateComplaintStatus(complaintId, 'resolved', resolutionText);
    setActiveComplaintId(null);
    setResolutionText('');
    alert('Complaint status updated to investigatings resolved.');
  };

  // Export report trigger
  const handleExport = (format: 'pdf' | 'excel') => {
    setExportSuccess(`Generating document... Preparing secure ${format.toUpperCase()} rows...`);
    setTimeout(() => {
      setExportSuccess(`Success! Your local report has been exported as "HSP_System_Report_${reportType.toUpperCase()}.${format === 'pdf' ? 'pdf' : 'xlsx'}" and saved to downloads.`);
      setTimeout(() => setExportSuccess(null), 3500);
    }, 1500);
  };

  // Filtering bookings
  const filteredBookings = bookings.filter(b => {
    const statusMatch = bookingFilterStatus === 'All' || b.status === bookingFilterStatus;
    const typeMatch = bookingFilterType === 'All' || b.category === bookingFilterType;
    const dateMatch = !bookingFilterDate || b.date === bookingFilterDate;
    return statusMatch && typeMatch && dateMatch;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Title Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 bg-transparent border-0 p-0 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Global Administration</h1>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Super Control Panel</span>
          </div>
          
          <div className="flex gap-2">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <Icon name="Activity" size={12} className="animate-pulse" />
              Platform Online Status
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-fit space-y-2">
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'stats' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon name="BarChart3" size={15} />
              Statistics & Revenue Analysis
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'users' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon name="Users" size={15} />
              Platform User Management
            </button>
            
            <button
              onClick={() => setActiveTab('verifications')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                activeTab === 'verifications' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="LockCheck" size={15} />
                <span>Verification Approvals</span>
              </div>
              {providers.filter(p => p.verificationStatus === 'pending').length > 0 && (
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-black ${activeTab === 'verifications' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-800'}`}>
                  {providers.filter(p => p.verificationStatus === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon name="Briefcase" size={15} />
              Global Bookings Control
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'categories' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon name="Sliders" size={15} />
              Service Categories
            </button>

            <button
              onClick={() => setActiveTab('complaints')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                activeTab === 'complaints' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={15} />
                <span>Active Complaints</span>
              </div>
              {complaints.filter(c => c.status === 'pending').length > 0 && (
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-black ${activeTab === 'complaints' ? 'bg-white text-red-500' : 'bg-red-50 text-red-700'}`}>
                  {complaints.filter(c => c.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'reports' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon name="FileBarChart" size={15} />
              Reports & Exports (PDF)
            </button>
          </div>

          {/* Right Column: Visual Sub-Views */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* STATS OVERVIEW & CHARTS */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                
                {/* Visual statistics cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Customers</span>
                    <strong className="text-2xl font-black text-slate-900">{totalCustomers}</strong>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Providers</span>
                    <strong className="text-2xl font-black text-slate-900">{totalProviders}</strong>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Bookings</span>
                    <strong className="text-2xl font-black text-blue-600">{totalBookings}</strong>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Revenue Pool</span>
                    <strong className="text-2xl font-black text-emerald-600">${totalRevenue}</strong>
                  </div>
                </div>

                {/* Simulated Custom CSS Charts Bento */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Chart 1: Monthly Bookings bar charts */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <strong className="text-sm font-extrabold text-slate-900">Monthly Bookings Analysis (2026)</strong>
                      <span className="text-[10px] text-slate-400">Total bookings per period</span>
                    </div>

                    {/* Vector Bar Chart */}
                    <div className="h-44 flex items-end justify-around gap-2 pt-4 border-b border-l border-slate-100 px-2">
                      <div className="flex flex-col items-center w-full">
                        <div className="bg-slate-200 hover:bg-blue-600 w-8 rounded-t-md transition-all cursor-pointer h-[20%]"></div>
                        <span className="text-[9px] text-slate-400 mt-2 font-mono">Mar</span>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <div className="bg-slate-200 hover:bg-blue-600 w-8 rounded-t-md transition-all cursor-pointer h-[45%]"></div>
                        <span className="text-[9px] text-slate-400 mt-2 font-mono">Apr</span>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <div className="bg-slate-200 hover:bg-blue-600 w-8 rounded-t-md transition-all cursor-pointer h-[75%]"></div>
                        <span className="text-[9px] text-slate-400 mt-2 font-mono">May</span>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <div className="bg-blue-600 w-8 rounded-t-md cursor-pointer h-[95%] text-xs text-white flex items-center justify-center font-bold">
                          95%
                        </div>
                        <span className="text-[9px] text-blue-600 font-bold mt-2 font-mono">Jun</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart 2: Popular Services Horizontal bar list */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-extrabold text-slate-900">Popular Household Services</strong>
                      <span className="text-[10px] text-slate-400">By booking count</span>
                    </div>

                    <div className="space-y-3.5 pt-2">
                      <div>
                        <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                          <span>Cooking prep</span>
                          <strong className="text-slate-800">45 Bookings (40%)</strong>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                          <span>Child Care</span>
                          <strong className="text-slate-800">30 Bookings (28%)</strong>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-teal-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                          <span>Bathroom Sanitation</span>
                          <strong className="text-slate-800">20 Bookings (18%)</strong>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* USERS REGISTER LIST */}
            {activeTab === 'users' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Global Platform Users Directory</h3>
                  <p className="text-xs text-slate-400">View and manage customers, and approve provider profiles.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="py-2.5 font-bold uppercase">Name / Email</th>
                        <th className="py-2.5 font-bold uppercase">Role</th>
                        <th className="py-2.5 font-bold uppercase">Phone</th>
                        <th className="py-2.5 font-bold uppercase">Status</th>
                        <th className="py-2.5 font-bold text-right uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="py-3">
                            <strong className="text-xs text-slate-800 block">{u.fullName}</strong>
                            <span className="text-[10px] text-slate-400">{u.email}</span>
                          </td>
                          <td className="py-3 text-slate-600 font-medium capitalize">{u.role}</td>
                          <td className="py-3 text-slate-500 font-mono">{u.phone}</td>
                          <td className="py-3">
                            {u.isActive ? (
                              <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
                            ) : (
                              <span className="bg-rose-50 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Blocked</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {u.id !== 'u-admin' && (
                              <button
                                onClick={() => handleBlockToggle(u)}
                                className={`font-bold py-1 px-2.5 rounded text-[10px] cursor-pointer ${
                                  u.isActive 
                                    ? 'bg-rose-50 hover:bg-rose-100 text-red-600' 
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                }`}
                              >
                                {u.isActive ? 'Block' : 'Unblock'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* AADHAAR VERIFICATIONS APPROVALS */}
            {activeTab === 'verifications' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Pending Service Provider Verifications</h3>
                  <p className="text-xs text-slate-400 font-medium">Verify Aadhaar details and active category qualifications to approve provider profile listings.</p>
                </div>

                {providers.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No provider applications matching state.</p>
                ) : (
                  <div className="space-y-4">
                    {providers.map(p => {
                      const userDetails = users.find(u => u.id === p.userId);
                      if (!userDetails) return null;

                      return (
                        <div key={p.userId} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <strong className="text-slate-800 text-sm font-extrabold">{userDetails.fullName}</strong>
                              <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                p.verificationStatus === 'approved' 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : p.verificationStatus === 'pending' 
                                    ? 'bg-amber-100 text-amber-800 animate-pulse' 
                                    : 'bg-red-50 text-red-700'
                              }`}>
                                {p.verificationStatus}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 leading-normal">
                              Skills Highlight: <strong>"{p.skills}"</strong>
                            </p>

                            <div className="grid sm:grid-cols-2 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                              <div>Aadhaar Check: <strong className="text-slate-700 font-mono">{p.aadhaar}</strong></div>
                              <div>Target Categories: <strong className="text-slate-700">{p.categories.join(', ')}</strong></div>
                              <div>Experience: <strong className="text-slate-700">{p.experience} Years</strong></div>
                              <div>Base Address: <strong className="text-slate-700">{userDetails.address}</strong></div>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0 md:self-center">
                            {p.verificationStatus !== 'approved' && (
                              <button
                                onClick={() => handleVerify(p.userId, 'approved')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3.5 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                              >
                                <Icon name="Check" size={12} />
                                Approve Aadhaar
                              </button>
                            )}
                            {p.verificationStatus !== 'rejected' && (
                              <button
                                onClick={() => handleVerify(p.userId, 'rejected')}
                                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] px-3 py-2 rounded-lg cursor-pointer transition-colors"
                              >
                                Reject Profile
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* GLOBAL BOOKING HISTORY CONTROL */}
            {activeTab === 'bookings' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4 bg-transparent border-0 p-0">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">Global Booking Controls Log</h3>
                    <p className="text-xs text-slate-400">View and audit all matches across the local system.</p>
                  </div>
                  
                  {/* Filters bar */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="p-1 px-2 rounded-lg bg-slate-50 border border-slate-150 text-[11px]"
                    >
                      <option value="All">All statuses</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <input
                      type="date"
                      value={bookingFilterDate}
                      onChange={(e) => setBookingFilterDate(e.target.value)}
                      className="p-1 px-2 rounded-lg bg-slate-50 border border-slate-150 text-[11px]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredBookings.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No bookings match the filtered criteria.</p>
                  ) : (
                    filteredBookings.map(b => (
                      <div key={b.id} className="p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100 flex justify-between items-center flex-wrap gap-3 text-xs text-slate-600">
                        <div>
                          <strong className="text-slate-800">Booking Ref: {b.id}</strong> • Customer: {b.customerName}
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Helper: <strong>{b.providerName}</strong> • Category: {b.category} • Date: {b.date}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold">
                          <span>${b.price}</span>
                          <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-black ${
                            b.status === 'completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-800'
                          }`}>{b.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PREDEFINED CATEGORIES MANAGEMENT */}
            {activeTab === 'categories' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div className="flex justify-between items-center bg-transparent border-0 p-0">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">Predefined Task Categories Management</h3>
                    <p className="text-xs text-slate-400">Add or alter categories offered on the public signup screens.</p>
                  </div>
                  <button
                    onClick={() => setAddingCat(!addingCat)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                  >
                    Add Category
                  </button>
                </div>

                {addingCat && (
                  <form onSubmit={handleAddCategorySubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3">
                    <strong className="block text-xs font-bold text-slate-800">Add Category Details</strong>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400">Category name</label>
                        <input
                          type="text"
                          required
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="e.g. Lawn care / Gardening"
                          className="w-full text-xs p-2.5 rounded-lg bg-white border border-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-slate-400">Lucide icon key</label>
                        <input
                          type="text"
                          required
                          value={newCatIcon}
                          onChange={(e) => setNewCatIcon(e.target.value)}
                          placeholder="Home / Sparkle / Baby"
                          className="w-full text-xs p-2.5 rounded-lg bg-white border border-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400">Brief category description</label>
                      <input
                        type="text"
                        required
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        placeholder="Description of the helpers standard chores..."
                        className="w-full text-xs p-2.5 rounded-lg bg-white border border-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 text-xs">
                      <button type="button" onClick={() => setAddingCat(false)} className="text-slate-500 font-semibold cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-blue-600 text-white font-bold py-1 px-4 rounded-lg cursor-pointer">Save Category</button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {categories.map(c => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                          <Icon name={c.icon} size={14} className="text-blue-600" />
                          {c.name}
                        </span>
                        <p className="text-[10px] text-slate-500 leading-normal">{c.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          deleteCategory(c.id);
                          alert('Category removed.');
                        }}
                        className="text-red-500 font-bold p-1 hover:bg-red-50 rounded cursor-pointer"
                        aria-label="Delete category"
                      >
                        <Icon name="Trash" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE COMPLAINT MANAGEMENT */}
            {activeTab === 'complaints' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Incident investigation & Resolution Panel</h3>
                  <p className="text-xs text-slate-400">Audit submitted grievances fairly. Enter investigation notes to resolve complaints.</p>
                </div>

                {complaints.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No complaints filed currently on the system.</p>
                ) : (
                  <div className="space-y-4">
                    {complaints.map(c => (
                      <div key={c.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <strong className="text-slate-800">Grievance Ref: {c.id}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            c.status === 'resolved' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-100 text-red-900 animate-pulse'
                          }`}>{c.status}</span>
                        </div>

                        <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                          <p className="mb-2"><strong>Client:</strong> {c.customerName} filed against <strong>Helper:</strong> {c.providerName}</p>
                          <p className="italic text-slate-500">" {c.complaintText} "</p>
                        </div>

                        {c.resolutionNotes && (
                          <div className="text-[11px] text-slate-500 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                            <strong>Resolution Action Notes:</strong> {c.resolutionNotes}
                          </div>
                        )}

                        {c.status !== 'resolved' && activeComplaintId !== c.id && (
                          <button
                            onClick={() => {
                              setActiveComplaintId(c.id);
                              setResolutionText('');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            Investigate & Resolve
                          </button>
                        )}

                        {activeComplaintId === c.id && (
                          <form onSubmit={(e) => handleResolveComplaint(e, c.id)} className="space-y-3 pt-2">
                            <label className="block text-[10px] font-bold uppercase text-slate-400">Resolution investigation notes</label>
                            <textarea
                              value={resolutionText}
                              required
                              rows={2}
                              onChange={(e) => setResolutionText(e.target.value)}
                              placeholder="e.g. Contacted helper. Settled schedule delays amicably with fine warning..."
                              className="w-full text-xs p-2.5 rounded-lg bg-white border border-slate-200 focus:outline-none"
                            ></textarea>

                            <div className="flex gap-2 justify-end">
                              <button type="button" onClick={() => setActiveComplaintId(null)} className="text-xs text-slate-400 cursor-pointer">Cancel</button>
                              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer">
                                Submit & Resolve
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REPORTS LOG & PDF EXPORTS */}
            {activeTab === 'reports' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Administrative Reports & PDF/Excel Exports</h3>
                  <p className="text-xs text-slate-400">Generate printable performance summaries or export spreadsheet values.</p>
                </div>

                {exportSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                    <Icon name="CheckCircle" size={14} className="animate-bounce" />
                    <span>{exportSuccess}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => setReportType('revenue')}
                    className={`py-2 px-3 rounded-lg font-bold border cursor-pointer transition-colors ${
                      reportType === 'revenue' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Monthly Revenue
                  </button>
                  <button
                    onClick={() => setReportType('bookings')}
                    className={`py-2 px-3 rounded-lg font-bold border cursor-pointer transition-colors ${
                      reportType === 'bookings' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Booking Reports
                  </button>
                  <button
                    onClick={() => setReportType('performance')}
                    className={`py-2 px-3 rounded-lg font-bold border cursor-pointer transition-colors ${
                      reportType === 'performance' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Provider Performance
                  </button>
                  <button
                    onClick={() => setReportType('activity')}
                    className={`py-2 px-3 rounded-lg font-bold border cursor-pointer transition-colors ${
                      reportType === 'activity' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Customer Activity
                  </button>
                </div>

                {/* Report Table Preview summary */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-slate-800 uppercase tracking-wider font-extrabold">Report Type: {reportType.toUpperCase()}</strong>
                    <span className="text-[10px] text-slate-400">Status: Compiled for 2026</span>
                  </div>

                  {reportType === 'revenue' && (
                    <div className="text-xs space-y-2 font-mono">
                      <div className="flex justify-between pb-1 border-b border-white">
                        <span>Delhi Cooking specialist task completion:</span>
                        <strong>$30.00</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-white">
                        <span>Child Care ongoing bookings base estimate:</span>
                        <strong>$120.00</strong>
                      </div>
                      <div className="flex justify-between pt-2">
                        <strong className="text-slate-900 uppercase">Gross Revenue estimate:</strong>
                        <strong className="text-slate-900">${totalRevenue + 120}</strong>
                      </div>
                    </div>
                  )}

                  {reportType === 'bookings' && (
                    <div className="text-xs space-y-2 font-sans">
                      <div className="flex justify-between pb-1 border-b border-white">
                        <span>Total platform matches scheduled:</span>
                        <strong>{totalBookings} match logs</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-white">
                        <span>Canceled / Retracted instances:</span>
                        <strong>0 bookings</strong>
                      </div>
                    </div>
                  )}

                  {reportType === 'performance' && (
                    <div className="text-xs space-y-2 font-sans">
                      <div className="flex justify-between pb-1 border-b border-white">
                        <span>Ramesh Kumar (Cooking Expert) rating:</span>
                        <strong>🌟 {providers[0]?.rating || '4.8'} (Approved Aadhaar)</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-white">
                        <span>Seema Devi (Child caretaker) rating:</span>
                        <strong>🌟 {providers[1]?.rating || '4.9'} (Approved Aadhaar)</strong>
                      </div>
                    </div>
                  )}

                  {reportType === 'activity' && (
                    <div className="text-xs space-y-2 font-sans">
                      <div className="flex justify-between pb-1 border-b border-white">
                        <span>Rahul Verma:</span>
                        <strong>2 bookings arranged</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-white">
                        <span>Neha Gupta:</span>
                        <strong>1 active childcare contract</strong>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-200/50">
                    <button
                      onClick={() => handleExport('excel')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 text-xs py-1.5 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Icon name="Grid" size={12} className="text-emerald-600" />
                      Export Excel
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Icon name="FileText" size={12} />
                      Export PDF
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
