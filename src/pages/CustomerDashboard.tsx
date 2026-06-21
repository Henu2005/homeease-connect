import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/shared/Icon';
import { Booking } from '../types';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    bookings,
    payments,
    reviews,
    complaints,
    providers,
    services,
    updateBookingStatus,
    processPayment,
    submitReview,
    submitComplaint,
    updateCustomerProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'book' | 'history' | 'payments' | 'complaints' | 'profile'>('overview');

  // Profile Form States
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [pass, setPass] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Complaint States
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Review Form States
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Search/Filter local states for inner book tab
  const [searchCat, setSearchCat] = useState('All');
  const [searchRating, setSearchRating] = useState(0);

  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <Icon name="UserCheck" className="text-blue-500 mx-auto mb-4" size={40} />
          <h2 className="text-xl font-bold text-slate-800">Customer Access Required</h2>
          <p className="text-xs text-slate-400 mt-2">Please login using a Customer account to view this dashboard.</p>
        </div>
      </div>
    );
  }

  // Filter components belonging strictly to this customer
  const customerBookings = bookings.filter(b => b.customerId === currentUser.id);
  const customerPayments = payments.filter(p => p.customerName === currentUser.fullName);
  const customerComplaints = complaints.filter(c => c.customerId === currentUser.id);

  // Statistic Totals
  const totalBookings = customerBookings.length;
  const pendingBookings = customerBookings.filter(b => b.status === 'pending' || b.status === 'accepted').length;
  const completedBookings = customerBookings.filter(b => b.status === 'completed').length;

  // Handle profile update
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({ fullName, phone, address });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  // Handle complaint submission
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProviderId || !complaintText) return;
    submitComplaint(selectedProviderId, complaintText);
    setComplaintText('');
    setSelectedProviderId('');
    setComplaintSuccess(true);
    setTimeout(() => setComplaintSuccess(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId || !reviewComment) return;
    submitReview(reviewBookingId, reviewRating, reviewComment);
    setReviewBookingId(null);
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 2500);
  };

  // Status colors helper
  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Pending Approval</span>;
      case 'accepted':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Accepted</span>;
      case 'in_progress':
        return <span className="bg-violet-100 text-violet-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">In Progress</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Toast Review Feedback */}
        {reviewSuccess && (
          <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg border border-emerald-500 flex items-center gap-2">
            <Icon name="CheckCircle" />
            <span>Review submitted successfully! Recalculating rating averages...</span>
          </div>
        )}

        {/* Dashboard Frame Grid split sidebar */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Left Column: Vertical Control Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-fit space-y-6">
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3 uppercase">
                {currentUser.fullName.substring(0, 2)}
              </div>
              <strong className="block text-slate-900 text-sm font-extrabold">{currentUser.fullName}</strong>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Customer Portal</span>
            </div>

            <nav className="space-y-1" id="customer-nav-tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="LayoutGrid" size={15} />
                Overview Home
              </button>
              <button
                onClick={() => setActiveTab('book')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'book' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="Search" size={15} />
                Search & Arrange Bookings
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'history' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="History" size={15} />
                Booking Record ({totalBookings})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'payments' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="CreditCard" size={15} />
                Payment & Billing Locks
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'complaints' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="Activity" size={15} />
                Grievance Panel ({customerComplaints.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon name="Settings" size={15} />
                Edit Profile Settings
              </button>
            </nav>
          </div>

          {/* Right Column: Dynamic Subview Modules */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* OVERVIEW HOME PAGE */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Stats Cards Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Placed</span>
                    <strong className="text-2xl font-black text-slate-900">{totalBookings}</strong>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Slots</span>
                    <strong className="text-2xl font-black text-blue-600">{pendingBookings}</strong>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Completed jobs</span>
                    <strong className="text-2xl font-black text-emerald-600">{completedBookings}</strong>
                  </div>
                </div>

                {/* Scheduled Bookings Section */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-sm mb-4">Pending and Active Schedules</h3>
                  {customerBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No active work scheduled currently. Browse services to create one.</p>
                  ) : (
                    <div className="space-y-3">
                      {customerBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').map(b => (
                        <div key={b.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap justify-between items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.2 rounded uppercase">{b.category}</span>
                              <strong className="text-slate-800 text-xs font-bold">{b.serviceName}</strong>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Helper: <strong>{b.providerName}</strong> • Slot: {b.date} ({b.time})
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(b.status)}
                            {b.status === 'pending' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                className="bg-red-50 text-red-600 font-bold text-[10px] px-2.5 py-1 rounded hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                Cancel Task
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Impact Reminder */}
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
                  <div className="bg-blue-600 text-white p-3 rounded-xl h-fit">
                    <Icon name="Briefcase" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-blue-900 text-sm mb-1">Dignity and Employment Contribution</h4>
                    <p className="text-xs text-blue-700 leading-normal">
                      By hiring Ramesh, Seema, and other helpers, you are directly paying fair, standard wages that sustain their households. Report any task changes early to respect their busy schedules.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* INNER SEARCH & BOOK WORKFLOW */}
            {activeTab === 'book' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Instant Services Registry</h3>
                  <p className="text-xs text-slate-400">Select standard packages registered by verified local providers. Filters active instantly.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['All', 'Adult Care', 'Child Care', 'Cooking', 'Sweeping', 'Mopping'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSearchCat(c)}
                      className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        searchCat === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Search Result Inner Grid list helper */}
                <div className="space-y-4">
                  {providers
                    .filter(p => p.verificationStatus === 'approved')
                    .map(p => {
                      const servicesForProv = services.filter(s => s.providerId === p.userId && (searchCat === 'All' || s.category === searchCat));
                      const userDetails = p; // simplified matches
                      const actualUser = providers.find(prov => prov.userId === p.userId); // matching user details helper

                      if (servicesForProv.length === 0) return null;

                      return servicesForProv.map(s => (
                        <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center flex-wrap gap-4">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">{s.category}</span>
                              <strong className="text-slate-800 text-xs font-bold">{s.name}</strong>
                            </div>
                            <p className="text-[11px] text-slate-400 mb-2">{s.description}</p>
                            <span className="text-[10px] text-slate-500">
                              Provider: <strong>{s.providerName}</strong> • Experience: {p.experience} Years • Star rating: 🌟 {p.rating}
                            </span>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <strong className="block text-slate-800 text-sm font-extrabold mb-2">${s.price}/hr</strong>
                            <button
                              onClick={() => {
                                // Simple quick book
                                setActiveTab('history');
                                alert(`Booking triggered! To specify custom slots, please click "Book" in the main navigation services page!`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer"
                            >
                              Arrange Now
                            </button>
                          </div>
                        </div>
                      ));
                    })}
                </div>
              </div>
            )}

            {/* BOOKING HISTORY LOG */}
            {activeTab === 'history' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-sm mb-4">Complete Booking & Task Progress History</h3>
                
                {customerBookings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No booking records found in local storage database tables.</p>
                ) : (
                  <div className="space-y-4">
                    {customerBookings.map((b) => {
                      const hasReview = reviews.some(rv => rv.bookingId === b.id);
                      return (
                        <div key={b.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3">
                          
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <strong className="text-xs text-slate-800 font-extrabold">Booking Ref: {b.id}</strong>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Created: {new Date(b.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(b.status)}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                            <div>
                              <span className="text-slate-400 block uppercase font-bold text-[9px]">Helper Details</span>
                              <strong>{b.providerName}</strong> (Experience certified)
                            </div>
                            <div>
                              <span className="text-slate-400 block uppercase font-bold text-[9px]">Requested Slot</span>
                              <strong>{b.date}</strong> ({b.time})
                            </div>
                            <div className="sm:col-span-2 pt-1 border-t border-slate-50">
                              <span className="text-slate-400 block uppercase font-bold text-[9px]">Task Name & Notes</span>
                              {b.serviceName} {b.notes ? `(${b.notes})` : ''}
                            </div>
                          </div>

                          {/* Action flows: Cancel, Review, Submit complains */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-blue-700">Billable Price: ${b.price}</span>
                            
                            <div className="flex gap-2">
                              {b.status === 'completed' && !hasReview && (
                                <button
                                  onClick={() => {
                                    setReviewBookingId(b.id);
                                    setReviewRating(5);
                                    setReviewComment('');
                                  }}
                                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] px-3 py-1 rounded transition-colors cursor-pointer"
                                >
                                  Post Review (1-5 Star)
                                </button>
                              )}

                              {b.status === 'completed' && hasReview && (
                                <span className="text-[10px] text-emerald-600 font-semibold uppercase">✓ Feedback Posted</span>
                              )}

                              {b.status === 'pending' && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                  className="bg-rose-50 text-red-600 font-bold text-[10px] px-2.5 py-1 rounded hover:bg-red-100 transition-colors cursor-pointer"
                                >
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Dynamic inline Review drawer form */}
                          {reviewBookingId === b.id && (
                            <form onSubmit={handleReviewSubmit} className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-2 space-y-3">
                              <strong className="block text-xs font-bold text-slate-800">Review Ramesh/Seema Service</strong>
                              
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-600 font-medium">Star Select:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map(num => (
                                    <button
                                      key={num}
                                      type="button"
                                      onClick={() => setReviewRating(num)}
                                      className={`p-1 cursor-pointer transition-colors ${reviewRating >= num ? 'text-amber-500' : 'text-slate-300'}`}
                                    >
                                      <Icon name="Star" size={16} fill={reviewRating >= num ? 'currentColor' : 'none'} />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows={2}
                                required
                                placeholder="Write comments about clean attitude, cooking skills or diaper change support..."
                                className="w-full text-xs p-2 rounded-lg bg-white border border-amber-100 focus:outline-none"
                              ></textarea>

                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  type="button"
                                  onClick={() => setReviewBookingId(null)}
                                  className="bg-transparent px-3 py-1 text-slate-500 font-semibold cursor-pointer"
                                >
                                  Hide
                                </button>
                                <button
                                  type="submit"
                                  className="bg-amber-600 text-white font-bold px-4 py-1 rounded hover:bg-amber-700 cursor-pointer"
                                >
                                  Submit Review
                                </button>
                              </div>
                            </form>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS LOG */}
            {activeTab === 'payments' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Standard Payment History & Settlements</h3>
                  <p className="text-xs text-slate-400">Process checkout bills or review structural UPI/Card settlement logs.</p>
                </div>

                {customerPayments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No payment history matches.</p>
                ) : (
                  <div className="space-y-3">
                    {customerPayments.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center gap-4">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1 text-xs">
                            <span className="font-extrabold text-slate-700">Ref Booking: {p.bookingId}</span>
                            <span className="text-slate-400">• Method: {p.paymentMethod.toUpperCase()}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">Provider recipient: <strong>{p.providerName}</strong></span>
                        </div>
                        <div className="text-right">
                          <strong className="block text-slate-800 text-xs font-black">${p.amount}</strong>
                          {p.status === 'paid' ? (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase">Paid & Cleared</span>
                          ) : p.status === 'pending' ? (
                            <button
                              onClick={() => {
                                processPayment(p.bookingId, 'upi', p.amount);
                                alert('Mock UPI payment interface completed! Thank you.');
                              }}
                              className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              Mock Pay Now
                            </button>
                          ) : (
                            <span className="text-[10px] text-red-500 font-bold uppercase">Declined</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMPLAINTS & GRIEVANCE REPORT */}
            {activeTab === 'complaints' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                
                {complaintSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-100 mb-2 flex items-center gap-2">
                    <Icon name="CheckCircle" size={14} />
                    <span>Inquiry submitted! Admin will investigate and reach out.</span>
                  </div>
                )}

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Grievance Feedback Panel (Submit Complaint)</h3>
                  <p className="text-xs text-slate-400">File an issue if a helper arrives late consistently, behaves inappropriately or fails chores.</p>
                </div>

                <form onSubmit={handleComplaintSubmit} className="space-y-4 pt-4 border-t border-slate-50">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Select provider concerned</label>
                    <select
                      value={selectedProviderId}
                      required
                      onChange={(e) => setSelectedProviderId(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                    >
                      <option value="">-- Select Provider --</option>
                      {providers
                        .filter(p => p.verificationStatus === 'approved')
                        .map(p => {
                          const userMatch = providers.find(prov => prov.userId === p.userId);
                          // We mock search for the matching name
                          const servicesFiltered = services.filter(s => s.providerId === p.userId);
                          const resolvedName = servicesFiltered[0]?.providerName || "Ramesh/Seema";
                          return (
                            <option key={p.userId} value={p.userId}>
                              {resolvedName} (Skills verified)
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Grievance / Incident text</label>
                    <textarea
                      value={complaintText}
                      required
                      onChange={(e) => setComplaintText(e.target.value)}
                      rows={4}
                      placeholder="e.g. Cleared sweep list but missed mopping active spots, arrived delayed..."
                      className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none text-slate-700"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg text-xs cursor-pointer shadow-xs"
                  >
                    Submit Grievance to Admin
                  </button>
                </form>

                {/* List submitted complaints */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-900 text-xs">Your Complaint Records</h4>
                  
                  {customerComplaints.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">No grievances filled currently.</p>
                  ) : (
                    <div className="space-y-3">
                      {customerComplaints.map(c => (
                        <div key={c.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-extrabold text-red-800 uppercase tracking-wide">Incident ID: {c.id}</span>
                            <span className="text-[10px] bg-red-100 text-red-900 uppercase px-2 py-0.5 rounded font-bold">{c.status}</span>
                          </div>
                          <p className="text-xs text-slate-600">Concern: {c.complaintText}</p>
                          {c.resolutionNotes && (
                            <div className="mt-2 bg-white p-2.5 rounded border border-red-200 text-[11px] text-slate-500">
                              <span className="text-red-700 font-bold block mb-0.5">Admin Resolution Action:</span>
                              {c.resolutionNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Manage Profile & Resident parameters</h3>
                  <p className="text-xs text-slate-400">Keep coordinates corresponding to physical task locations accurate.</p>
                </div>

                {profileSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                    <Icon name="CheckCircle" size={14} />
                    <span>Profile context updated in database successfully!</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Phone Lock</label>
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
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Billing Residential Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Change Password (Mock)</label>
                    <input
                      type="password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      placeholder="Enter new pass..."
                      className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Save Edited Changes
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
