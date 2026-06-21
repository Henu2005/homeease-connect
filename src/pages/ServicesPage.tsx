import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/shared/Icon';
import { Service } from '../types';

interface ServicesPageProps {
  navigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { services, categories, providers, currentUser, addBooking, quickSwitchRole } = useApp();

  // Search and Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(30);

  // Booking Modal states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('09:00 - 12:00');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingHours, setBookingHours] = useState<number>(2);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter approved service providers
  const approvedProviderIds = providers
    .filter(p => p.verificationStatus === 'approved')
    .map(p => p.userId);

  const approvedServices = services.filter(s => approvedProviderIds.includes(s.providerId));

  const filteredServices = approvedServices.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = s.price <= maxPrice;
    return matchesCategory && matchesQuery && matchesPrice;
  });

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    // Autofill soonest tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingNotes('');
    setBookingHours(2);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!selectedService) return;

    if (!bookingDate) {
      alert('Please select a valid date');
      return;
    }

    const calculatedPrice = selectedService.price * bookingHours;

    addBooking({
      customerId: currentUser.id,
      providerId: selectedService.providerId,
      providerName: selectedService.providerName,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      date: bookingDate,
      time: bookingTime,
      notes: bookingNotes,
      price: calculatedPrice
    });

    setToastMessage(`Booking (${selectedService.name}) placed successfully! Redirecting to dashboard...`);
    setSelectedService(null);

    // Hide toast and redirect to user dashboard
    setTimeout(() => {
      setToastMessage(null);
      navigate('customer-dashboard');
    }, 2000);
  };

  const triggerAutoLoginCustomer = () => {
    // Quickly login as Rahul Verma to test physical checkout booking
    quickSwitchRole('customer', 'customer1@gmail.com');
  };

  // Get matching provider ratings
  const getProviderRating = (providerId: string): number => {
    const prov = providers.find(p => p.userId === providerId);
    return prov ? prov.rating : 4.5;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notifier */}
        {toastMessage && (
          <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg border border-emerald-500 flex items-center gap-2 animate-bounce">
            <Icon name="CheckCircle" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
            Find and Hire Household Support
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Review live lists of verified skills, browse ratings, and book immediate support slots. No hidden margins.
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs mb-8">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            
            {/* 1. Keyword search */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Search keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ramesh, North Indian, Baby"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs py-2.5 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Icon name="Search" className="absolute left-3 top-3 text-slate-400" size={14} />
              </div>
            </div>

            {/* 2. Category selection dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Service Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* 3. Slider or Max price input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase text-slate-400">Max Price: ${maxPrice}/hr</label>
                <span className="text-[10px] text-slate-500">$5 Min - $50 Max</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* List of Services */}
        {filteredServices.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
            <Icon name="SearchCode" className="mx-auto text-slate-300 mb-4" size={44} />
            <h3 className="font-bold text-slate-800 text-lg mb-1">No services found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any services matching "{selectedCategory}" under ${maxPrice}/hr. Try resetting your search filters.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(30); }}
              className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const rating = getProviderRating(service.providerId);
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6">
                    {/* Top Meta */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {service.category}
                      </span>
                      <strong className="text-xl font-extrabold text-blue-600">${service.price}<span className="text-slate-400 text-xs font-medium">/hr</span></strong>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mb-1 hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[40px]">
                      {service.description}
                    </p>

                    {/* Provider attribution card */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-xs uppercase" aria-label={service.providerName}>
                          {service.providerName.substring(0, 2)}
                        </div>
                        <div>
                          <strong className="block text-xs font-bold text-slate-800 leading-tight">{service.providerName}</strong>
                          <span className="text-[9px] text-slate-400 font-sans block">Verified Helper Profile</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold">
                        <Icon name="Star" size={12} fill="currentColor" />
                        <span>{rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => handleOpenBooking(service)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Icon name="Calendar" size={13} />
                      Book Service
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Absolute Modal for booking actions */}
        {selectedService && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 transform scale-100 transition-transform">
              
              <div className="bg-blue-600 text-white p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <Icon name="BookmarkCheck" />
                    Secure Booking Form
                  </h3>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-white hover:text-slate-200 cursor-pointer border-0 p-1 bg-transparent"
                    aria-label="Close dialog"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
                <div className="text-xs text-blue-100">
                  Provider: <strong>{selectedService.providerName}</strong> • Price: ${selectedService.price}/hr
                </div>
              </div>

              {currentUser ? (
                <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
                  
                  {/* Selected service metadata layout detail */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="block text-xs font-bold text-slate-800 mb-0.5">{selectedService.name}</strong>
                    <span className="text-[10px] text-slate-500 leading-normal">{selectedService.description}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Selected Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Duration Selection */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Hours Requested</label>
                      <select
                        value={bookingHours}
                        onChange={(e) => setBookingHours(Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      >
                        <option value="1">1 Hour</option>
                        <option value="2">2 Hours</option>
                        <option value="4">4 Hours</option>
                        <option value="6">6 Hours</option>
                        <option value="8">Full Day (8 Hrs)</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Time Window Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none"
                    >
                      <option value="07:00 - 10:00">Early Morning (07:00 - 10:00)</option>
                      <option value="09:00 - 12:00">Mid-Morning (09:00 - 12:00)</option>
                      <option value="12:00 - 15:00">Afternoon (12:00 - 15:00)</option>
                      <option value="17:00 - 19:00">Late Afternoon (17:00 - 19:00)</option>
                      <option value="19:00 - 21:00">Evening Meal time (19:00 - 21:00)</option>
                    </select>
                  </div>

                  {/* Task Notes */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Task Notes & Instructions</label>
                    <textarea
                      rows={3}
                      value={bookingNotes}
                      placeholder="e.g. Please bring mild detergent. Need cooking low spice levels."
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none text-slate-700"
                    ></textarea>
                  </div>

                  {/* Pricing Total Calculation Panel */}
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-medium leading-none mb-1">Pricing Math</span>
                      <span className="font-bold text-slate-800">${selectedService.price} × {bookingHours} Hours</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium text-right leading-none mb-1">Total (Due in-person / online)</span>
                      <strong className="text-base text-blue-700 font-extrabold">${selectedService.price * bookingHours}</strong>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2 text-xs text-slate-500 font-semibold hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-md shadow-blue-100 cursor-pointer"
                    >
                      Book & Pay Later
                    </button>
                  </div>

                </form>
              ) : (
                <div className="p-8 text-center text-slate-600 space-y-4">
                  <Icon name="UserCheck" className="mx-auto text-blue-500" size={32} />
                  <h4 className="font-bold text-slate-900 text-sm">Customer Session Required</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    You need to be signed in as a Customer to arrange bookings on Household Support.
                  </p>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={triggerAutoLoginCustomer}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Icon name="Zap" size={13} />
                      One-Click Demo Customer Login
                    </button>
                    <button
                      onClick={() => { setSelectedService(null); navigate('login'); }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-xs cursor-pointer"
                    >
                      Go to Standard Sign-In Screen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
