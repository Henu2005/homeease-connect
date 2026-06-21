import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/shared/Icon';
import { Booking, Service } from '../types';

export const ProviderDashboard: React.FC = () => {
  const {
    currentUser,
    bookings,
    services,
    providers,
    reviews,
    payments,
    categories,
    updateBookingStatus,
    addService,
    editService,
    deleteService,
    updateProviderProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews' | 'schedule' | 'profile'>('overview');

  // Service Forms
  const [showAddService, setShowAddService] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceCat, setServiceCat] = useState('Cooking');
  const [servicePrice, setServicePrice] = useState<number>(10);
  
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Profile Form states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState<number>(2);
  const [bio, setBio] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Availability Management States
  const [availDays, setAvailDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [availSlots, setAvailSlots] = useState<string[]>(['09:00 - 13:00', '14:00 - 18:00']);
  const [slotSuccess, setSlotSuccess] = useState(false);

  // Initialize profile stats when currentUser is ready
  React.useEffect(() => {
    if (currentUser) {
      const provProfile = providers.find(p => p.userId === currentUser.id);
      if (provProfile) {
        setSkills(provProfile.skills || '');
        setExperience(provProfile.experience || 2);
        setBio(provProfile.bio || '');
        setAvailDays(provProfile.availableDays || []);
        setAvailSlots(provProfile.availableTimeSlots || []);
      }
    }
  }, [currentUser, providers]);

  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-100">
          <Icon name="Activity" className="text-emerald-500 mx-auto mb-4 animate-bounce" size={40} />
          <h2 className="text-xl font-bold text-slate-800">Provider Access Required</h2>
          <p className="text-xs text-slate-400 mt-2">Please login using your Service Provider credentials.</p>
        </div>
      </div>
    );
  }

  // Find if provider is pending verification or approved
  const myProfile = providers.find(p => p.userId === currentUser.id);
  const isApproved = myProfile ? myProfile.verificationStatus === 'approved' : false;

  // Filter provider items
  const myBookings = bookings.filter(b => b.providerId === currentUser.id);
  const myServices = services.filter(s => s.providerId === currentUser.id);
  const myReviews = reviews.filter(r => r.providerId === currentUser.id);

  // Stats calculate
  const totalJobs = myBookings.length;
  const pendingRequests = myBookings.filter(b => b.status === 'pending').length;
  const activeJobs = myBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').length;
  
  // Calculate earnings
  const completedJobs = myBookings.filter(b => b.status === 'completed');
  const totalEarnings = completedJobs.reduce((acc, job) => acc + job.price, 0);

  // Handler for Accepting request
  const handleAcceptJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'accepted');
  };

  // Handler for Rejecting request
  const handleRejectJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const handleStartJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'in_progress');
  };

  const handleCompleteJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
  };

  // Profile Save
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProviderProfile({
      fullName,
      phone,
      address,
      skills,
      experience,
      bio
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  // Add category packaging service
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !serviceDesc) return;
    addService({
      name: serviceName,
      description: serviceDesc,
      category: serviceCat,
      price: Number(servicePrice) || 12
    });
    setServiceName('');
    setServiceDesc('');
    setServicePrice(10);
    setShowAddService(false);
  };

  const handleDayToggle = (day: string) => {
    if (availDays.includes(day)) {
      setAvailDays(prev => prev.filter(d => d !== day));
    } else {
      setAvailDays(prev => [...prev, day]);
    }
  };

  const handleSaveAvailability = () => {
    updateProviderProfile({
      availableDays: availDays,
      availableTimeSlots: availSlots
    });
    setSlotSuccess(true);
    setTimeout(() => setSlotSuccess(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Verification Alert Header lock */}
        {!isApproved && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 flex gap-4 items-center mb-8">
            <div className="bg-amber-100 text-amber-700 p-3 rounded-full animate-bounce">
              <Icon name="ShieldAlert" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">Account Verification Pending Approval</h3>
              <p className="text-xs text-amber-700 leading-normal">
                Your Aadhaar registration <strong>({myProfile?.aadhaar || 'Unspecified'})</strong> and skills matching are currently undergoing verification review by the Directors. Please use the <strong>Sandbox Quick Switch (Top Bar)</strong> or Login as Admin to instantly approve your work!
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Dashboard Menu Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-fit space-y-6">
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3 uppercase">
                {currentUser.fullName.substring(0, 2)}
              </div>
              <strong className="block text-slate-900 text-sm font-extrabold">{currentUser.fullName}</strong>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Verified Helper Partner</span>
              <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                Level Partner Rating: 🌟 {myProfile?.rating || 'New'}
              </span>
            </div>

            <nav className="space-y-1" id="provider-tabs-action">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="LayoutGrid" size={15} />
                Task Requests ({pendingRequests})
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'services' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="Briefcase" size={15} />
                Manage Service Packs ({myServices.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'reviews' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="Star" size={15} />
                Customer Feedbacks ({myReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'schedule' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="CalendarRange" size={15} />
                Calendar Availability
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="User" size={15} />
                Edit Caregiver Bio
              </button>
            </nav>
          </div>

          {/* Right Column: Content panel templates */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* OVERVIEW TABS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Stats cards earnings summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Total Jobs</span>
                    <strong className="text-xl font-black text-slate-900">{totalJobs}</strong>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Pending alerts</span>
                    <strong className="text-xl font-black text-blue-600">{pendingRequests}</strong>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Total Revenue</span>
                    <strong className="text-xl font-black text-emerald-600">${totalEarnings}</strong>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs text-center">
                     <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Score Average</span>
                    <strong className="text-xl font-black text-amber-500">🌟 {myProfile?.rating || '5.0'}</strong>
                  </div>
                </div>

                {/* Job Requests Module */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-sm mb-4">Pending Customer Chores & Bookings</h3>
                  
                  {myBookings.filter(b => b.status === 'pending').length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No active booking requests currently waitlisted.</p>
                  ) : (
                    <div className="space-y-3">
                      {myBookings.filter(b => b.status === 'pending').map(b => (
                        <div key={b.id} className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5_">
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 rounded">{b.category}</span>
                              <strong className="text-xs text-slate-800 font-bold">{b.serviceName}</strong>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Client: <strong>{b.customerName}</strong> • Phone: {b.customerPhone}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Time: {b.date} ({b.time}) • Note: "{b.notes || 'No instructions'}"
                            </p>
                          </div>
                          
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleRejectJob(b.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAcceptJob(b.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                            >
                              Accept Task
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Active & In Progress Contracts */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-sm mb-4">On-Going Active Domestic Assignments</h3>
                  
                  {myBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No domestic tasks currently active in progress.</p>
                  ) : (
                    <div className="space-y-3">
                      {myBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').map(b => (
                        <div key={b.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <strong className="text-xs text-slate-800 font-extrabold">{b.serviceName}</strong>
                              <span className="text-[9px] bg-slate-200 text-slate-800 font-mono px-2 py-0.2 rounded font-bold uppercase">{b.status}</span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Client: {b.customerName} ({b.customerPhone}) • Address: <strong>{b.notes || 'Contact Client'}</strong>
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Booking Schedule: {b.date} ({b.time}) • Total payout: ${b.price}
                            </p>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            {b.status === 'accepted' ? (
                              <button
                                onClick={() => handleStartJob(b.id)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                              >
                                Start Chores
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCompleteJob(b.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                              >
                                Mark completed
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Earnings breakdown metrics */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-sm mb-4">Earnings Breakdown Summary</h3>
                  <div className="grid sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Daily Earnings</span>
                      <strong className="text-lg font-black text-slate-800">${(totalEarnings * 0.15).toFixed(0)}</strong>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Weekly Earnings</span>
                      <strong className="text-lg font-black text-slate-800">${(totalEarnings * 0.45).toFixed(0)}</strong>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Monthly Earnings</span>
                      <strong className="text-lg font-black text-slate-800">${totalEarnings}</strong>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SERVICES PACKS */}
            {activeTab === 'services' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div className="flex justify-between items-center bg-transparent border-0 p-0">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">Your Registered Service Packages</h3>
                    <p className="text-xs text-slate-400 font-medium">Create customized domestic catalogs that customers purchase.</p>
                  </div>
                  <button
                    onClick={() => setShowAddService(!showAddService)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1 transition-all"
                  >
                    <Icon name="Plus" size={14} />
                    Create New
                  </button>
                </div>

                {showAddService && (
                  <form onSubmit={handleCreateService} className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-4">
                    <strong className="block text-xs font-black text-slate-800">Add Service Package Details</strong>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Package Title Name</label>
                        <input
                          type="text"
                          required
                          value={serviceName}
                          onChange={(e) => setServiceName(e.target.value)}
                          placeholder="e.g. Traditional Indian Kitchen Support"
                          className="w-full text-xs p-3 rounded-lg bg-white border border-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Category Select</label>
                        <select
                          value={serviceCat}
                          onChange={(e) => setServiceCat(e.target.value)}
                          className="w-full text-xs p-3 rounded-lg bg-white border border-slate-200 focus:outline-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Description & Guidelines</label>
                      <textarea
                        required
                        value={serviceDesc}
                        onChange={(e) => setServiceDesc(e.target.value)}
                        placeholder="Description of food types, hygienic standards or tools needed..."
                        className="w-full text-xs p-3 rounded-lg bg-white border border-slate-200 focus:outline-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Hourly Estimated Cost ($/hr)</label>
                      <input
                        type="number"
                        required
                        min="5"
                        max="50"
                        value={servicePrice}
                        onChange={(e) => setServicePrice(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-lg bg-white border border-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddService(false)}
                        className="bg-transparent text-slate-500 font-semibold px-4 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg text-xs cursor-pointer"
                      >
                        Publish Catalog
                      </button>
                    </div>
                  </form>
                )}

                {myServices.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No active service packs listed currently. Click "Create New" to submit one!</p>
                ) : (
                  <div className="space-y-3">
                    {myServices.map(s => (
                      <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.2 rounded uppercase">{s.category}</span>
                            <strong className="text-slate-800 text-xs font-bold">{s.name}</strong>
                          </div>
                          <p className="text-[11px] text-slate-400 max-w-md">{s.description}</p>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-3">
                          <strong className="text-slate-900 text-xs font-extrabold">${s.price}/hr</strong>
                          <button
                            onClick={() => {
                              deleteService(s.id);
                              alert('Service package removed.');
                            }}
                            className="text-red-500 font-bold p-1 hover:bg-red-50 rounded cursor-pointer"
                            aria-label="Delete service"
                          >
                            <Icon name="Trash" size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MY REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Domestic Client Reviews & Quality Indicators</h3>
                  <p className="text-xs text-slate-400">Read what local household managers write about your chores performance.</p>
                </div>

                {myReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No ratings matching your profile logged yet.</p>
                ) : (
                  <div className="space-y-4">
                    {myReviews.map(r => (
                      <div key={r.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-800 text-xs font-bold">Client: {r.customerName}</strong>
                          <div className="flex gap-0.5 text-amber-500">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Icon key={i} name="Star" size={12} fill="currentColor" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 italic">"{r.comment}"</p>
                        <span className="text-[9px] text-slate-400 block text-right mt-1">Submitted: {r.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SHEDULE AND AVAILABILITY */}
            {activeTab === 'schedule' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Set Weekly Working Days & Active Hours</h3>
                  <p className="text-xs text-slate-400">Control which days and hour slots coordinates match customer calendars.</p>
                </div>

                {slotSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                    <Icon name="CheckCircle" size={14} />
                    <span>Working slot configs saved successfully!</span>
                  </div>
                )}

                {/* Days multiselect checkboxes */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-slate-700">Available Days of the Week</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isSel = availDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => handleDayToggle(day)}
                          type="button"
                          className={`text-xs px-4 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-slate-700">Standard Active Slots</label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <strong className="block text-xs text-slate-800">Morning (09:00 - 13:00)</strong>
                        <span className="text-[10px] text-slate-400">Perfect for daily sweep/mopping shifts</span>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-blue-600 cursor-pointer w-4 h-4" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <strong className="block text-xs text-slate-800">Afternoon (14:00 - 18:00)</strong>
                        <span className="text-[10px] text-slate-400">Suitable for kitchen & childcare preparations</span>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-blue-600 cursor-pointer w-4 h-4" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAvailability}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer transition-all"
                >
                  Save Standard Schedule
                </button>

              </div>
            )}

            {/* PROFILE BIO SETTINGS */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Edit Caregiver Profile & Contact Coordinates</h3>
                  <p className="text-xs text-slate-400">This description text values display globally on public hiring packages.</p>
                </div>

                {profileSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                    <Icon name="CheckCircle" size={14} />
                    <span>Bio changes saved successfully in secure tables!</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Caregiver Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Phone line check</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Residential Base Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Experience (Years)</label>
                      <input
                        type="number"
                        required
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Skills Highlight & Tagline</label>
                      <input
                        type="text"
                        required
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Extended Bio Description</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none text-slate-700"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Save Biography
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
