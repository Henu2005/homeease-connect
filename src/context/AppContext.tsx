import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ServiceProviderProfile,
  Service,
  Booking,
  Payment,
  Review,
  Complaint,
  ServiceCategory,
  Role
} from '../types';

interface AppContextProps {
  currentUser: User | null;
  users: User[];
  providers: ServiceProviderProfile[];
  services: Service[];
  bookings: Booking[];
  payments: Payment[];
  reviews: Review[];
  complaints: Complaint[];
  categories: ServiceCategory[];
  currentRole: Role | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  registerCustomer: (data: { fullName: string; email: string; phone: string; address: string; password: string }) => { success: boolean; error?: string };
  registerProvider: (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    aadhaar: string;
    skills: string;
    experience: number;
    categories: string[];
    password: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  quickSwitchRole: (role: Role, email?: string) => void;
  addService: (service: Omit<Service, 'id' | 'providerId' | 'providerName'>) => void;
  editService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'customerName' | 'customerPhone' | 'createdAt' | 'status'>) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  processPayment: (bookingId: string, method: Payment['paymentMethod'], amount: number) => void;
  submitReview: (bookingId: string, rating: number, comment: string) => void;
  submitComplaint: (providerId: string, text: string) => void;
  updateComplaintStatus: (complaintId: string, status: Complaint['status'], resolutionNotes?: string) => void;
  verifyProvider: (providerId: string, status: 'approved' | 'rejected') => void;
  updateProviderProfile: (data: Partial<ServiceProviderProfile> & { fullName?: string; phone?: string; address?: string }) => void;
  updateCustomerProfile: (data: { fullName: string; phone: string; address: string }) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  addCategory: (name: string, description: string, icon: string) => void;
  editCategory: (id: string, name: string, description: string, icon: string) => void;
  deleteCategory: (id: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Initial Static Data Seeds
const DEFAULT_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-1', name: 'Adult Care', icon: 'HeartHandshake', description: 'Caring support for elderly members of the household.' },
  { id: 'cat-2', name: 'Child Care', icon: 'Baby', description: 'Nurturing babysitting and educational supervision.' },
  { id: 'cat-3', name: 'Cooking', icon: 'Flame', description: 'Exquisite daily meal preparation & dietary cooking.' },
  { id: 'cat-4', name: 'Utensil Washing', icon: 'GlassWater', description: 'Thorough cleaning and arrangements of cooking pans.' },
  { id: 'cat-5', name: 'Sweeping', icon: 'Eraser', description: 'Clearing dust particles, dry leaves and fine sweep filters.' },
  { id: 'cat-6', name: 'Mopping', icon: 'Sparkle', description: 'Antibacterial wet floors clean-up for stellar hygiene.' },
  { id: 'cat-7', name: 'Bathroom/Lavatory Cleaning', icon: 'Bath', description: 'Thorough, high-pressure sanitation and scrubbing.' },
  { id: 'cat-8', name: 'House Cleaning', icon: 'Home', description: 'Complete vertical deep cleaner service.' }
];

const DEFAULT_USERS: User[] = [
  { id: 'u-admin', username: 'admin@service.com', email: 'admin@service.com', role: 'admin', fullName: 'Director Admin', phone: '+1 555-0199', address: 'System Head Office, Suite 404', isActive: true },
  { id: 'u-cust1', username: 'customer1@gmail.com', email: 'customer1@gmail.com', role: 'customer', fullName: 'Rahul Verma', phone: '+91 98765 43210', address: 'B-302, Green Avenue, Mumbai', isActive: true },
  { id: 'u-cust2', username: 'customer2@gmail.com', email: 'customer2@gmail.com', role: 'customer', fullName: 'Neha Gupta', phone: '+91 87654 32109', address: 'A-45, Shalimar Heights, New Delhi', isActive: true },
  { id: 'u-prov1', username: 'ramesh@serviceprovider.com', email: 'ramesh@serviceprovider.com', role: 'provider', fullName: 'Ramesh Kumar', phone: '+91 99911 22334', address: 'Sector 15, Dwarka, Delhi', isActive: true },
  { id: 'u-prov2', username: 'seema@serviceprovider.com', email: 'seema@serviceprovider.com', role: 'provider', fullName: 'Seema Devi', phone: '+91 99955 66778', address: 'Rajnagar Ext., Ghaziabad', isActive: true },
  { id: 'u-prov3', username: 'david@serviceprovider.com', email: 'david@serviceprovider.com', role: 'provider', fullName: 'David Gomgo', phone: '+91 77722 33445', address: 'Kandivali West, Mumbai', isActive: true },
  { id: 'u-prov4', username: 'anita@serviceprovider.com', email: 'anita@serviceprovider.com', role: 'provider', fullName: 'Anita Raj', phone: '+91 88833 44556', address: 'HSR Layout, Bangalore', isActive: true }
];

const DEFAULT_PROVIDERS: ServiceProviderProfile[] = [
  {
    userId: 'u-prov1',
    aadhaar: '1234-5678-9012',
    skills: 'Expert home cook specializing in North & South Indian meals. Clean, hygienic, and punctual.',
    experience: 5,
    verificationStatus: 'approved',
    rating: 4.8,
    categories: ['Cooking', 'Utensil Washing'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeSlots: ['07:00 - 10:00', '12:00 - 15:00', '19:00 - 21:00'],
    bio: 'Dedicated family cook with extensive experience in low-oil nutritional cooking.'
  },
  {
    userId: 'u-prov2',
    aadhaar: '8765-4321-0987',
    skills: 'Compassionate care taker for children. Expert sweeping & mopping helper holding neat habits.',
    experience: 8,
    verificationStatus: 'approved',
    rating: 4.9,
    categories: ['Child Care', 'Sweeping', 'Mopping'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeSlots: ['08:00 - 14:00', '15:00 - 18:00'],
    bio: 'Mother of two, extremely attentive to newborn needs and household sanitization.'
  },
  {
    userId: 'u-prov3',
    aadhaar: '9999-8888-7777',
    skills: 'Detailed deep cleaning and mopping. Fast helper.',
    experience: 3,
    verificationStatus: 'pending',
    rating: 0,
    categories: ['Mopping', 'House Cleaning'],
    availableDays: ['Mon', 'Wed', 'Fri', 'Sun'],
    availableTimeSlots: ['09:00 - 13:00', '14:00 - 18:00'],
    bio: 'Energetic cleaning professional looking to take household cleaning tasks around West Mumbai.'
  },
  {
    userId: 'u-prov4',
    aadhaar: '1111-2222-3333',
    skills: 'Sanitization specialist for bathrooms & lavatories. High-pressure spotless floor clean.',
    experience: 2,
    verificationStatus: 'pending',
    rating: 0,
    categories: ['Bathroom/Lavatory Cleaning'],
    availableDays: ['Sat', 'Sun'],
    availableTimeSlots: ['08:00 - 12:00', '13:00 - 17:00'],
    bio: 'Trained sanitation worker focused on toilet deep scrub controls.'
  }
];

const DEFAULT_SERVICES: Service[] = [
  { id: 's-1', providerId: 'u-prov1', providerName: 'Ramesh Kumar', name: 'Premium Cooking Specialist', description: 'Prepare 3 full home meals (Breakfast, Lunch, Dinner). High-hygiene kitchen standard.', category: 'Cooking', price: 15 },
  { id: 's-2', providerId: 'u-prov1', providerName: 'Ramesh Kumar', name: 'Utensil Washing Routine', description: 'Wash & organize everyday family utensils. Includes counter wipe down.', category: 'Utensil Washing', price: 10 },
  { id: 's-3', providerId: 'u-prov2', providerName: 'Seema Devi', name: 'Loving Child Care Support', description: 'Infant monitoring, reading activities, feeding, and light afternoon supervision.', category: 'Child Care', price: 20 },
  { id: 's-4', providerId: 'u-prov2', providerName: 'Seema Devi', name: 'Eco Sweep & Wipe', description: 'Sweeping and garbage separation for typical apartment spaces.', category: 'Sweeping', price: 8 }
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    customerId: 'u-cust1',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 43210',
    providerId: 'u-prov1',
    providerName: 'Ramesh Kumar',
    serviceId: 's-1',
    serviceName: 'Premium Cooking Specialist',
    category: 'Cooking',
    date: '2026-06-10',
    time: '19:00 - 21:00',
    notes: 'Please prepare mild food with very low oil.',
    status: 'completed',
    createdAt: '2026-06-08T10:30:00.000Z',
    price: 30 // 2 hours
  },
  {
    id: 'BK-1002',
    customerId: 'u-cust2',
    customerName: 'Neha Gupta',
    customerPhone: '+91 87654 32109',
    providerId: 'u-prov2',
    providerName: 'Seema Devi',
    serviceId: 's-3',
    serviceName: 'Loving Child Care Support',
    category: 'Child Care',
    date: '2026-06-18',
    time: '08:00 - 14:00',
    notes: 'Need someone extremely careful around toddlers.',
    status: 'accepted',
    createdAt: '2026-06-14T11:15:00.000Z',
    price: 120 // 6 hours
  },
  {
    id: 'BK-1003',
    customerId: 'u-cust1',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 43210',
    providerId: 'u-prov2',
    providerName: 'Seema Devi',
    serviceId: 's-4',
    serviceName: 'Eco Sweep & Wipe',
    category: 'Sweeping',
    date: '2026-06-19',
    time: '08:00 - 14:00',
    notes: 'Please sweep balconies thoroughly as well.',
    status: 'pending',
    createdAt: '2026-06-15T09:00:00.000Z',
    price: 48
  }
];

const DEFAULT_PAYMENTS: Payment[] = [
  { id: 'p-1', bookingId: 'BK-1001', customerName: 'Rahul Verma', providerName: 'Ramesh Kumar', amount: 30, status: 'paid', paymentMethod: 'upi', date: '2026-06-10' },
  { id: 'p-2', bookingId: 'BK-1002', customerName: 'Neha Gupta', providerName: 'Seema Devi', amount: 120, status: 'pending', paymentMethod: 'card', date: '2026-06-14' }
];

const DEFAULT_REVIEWS: Review[] = [
  { id: 'rv-1', bookingId: 'BK-1001', customerId: 'u-cust1', customerName: 'Rahul Verma', providerId: 'u-prov1', rating: 5, comment: 'Pristine cooking! Prepared exact low oil dishes we asked. Ramesh is very friendly and cooperative.', date: '2026-06-10' }
];

const DEFAULT_COMPLAINTS: Complaint[] = [
  { id: 'cmp-1', customerId: 'u-cust1', customerName: 'Rahul Verma', providerId: 'u-prov1', providerName: 'Ramesh Kumar', complaintText: 'Delayed arrival of Ramesh by 1 hour. However, the cooking was lovely.', status: 'resolved', date: '2026-06-11', resolutionNotes: 'Contacted Ramesh Kumar. Confirmed flat tyre delay. Issue settled amicably.' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  // States initialized from local storage or static seeds
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hsp_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [providers, setProviders] = useState<ServiceProviderProfile[]>(() => {
    const saved = localStorage.getItem('hsp_providers');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDERS;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('hsp_services');
    return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('hsp_bookings');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('hsp_payments');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('hsp_reviews');
    return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('hsp_complaints');
    return saved ? JSON.parse(saved) : DEFAULT_COMPLAINTS;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem('hsp_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Keep state matching local storage
  useEffect(() => {
    localStorage.setItem('hsp_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('hsp_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('hsp_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('hsp_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('hsp_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('hsp_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('hsp_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('hsp_categories', JSON.stringify(categories));
  }, [categories]);

  // Keep current active session in memory or restoration
  useEffect(() => {
    const activeSession = sessionStorage.getItem('hsp_active_user');
    if (activeSession) {
      const user = JSON.parse(activeSession);
      setCurrentUser(user);
      setCurrentRole(user.role);
    }
  }, []);

  const login = (email: string, password: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) {
      return { success: false, error: 'User account not found' };
    }
    if (!foundUser.isActive) {
      return { success: false, error: 'This account has been blocked by the admin' };
    }
    
    // Check if provider and approved
    if (foundUser.role === 'provider') {
      const provProfile = providers.find(p => p.userId === foundUser.id);
      if (provProfile && provProfile.verificationStatus === 'rejected') {
        return { success: false, error: 'Your registration was rejected by the Admin.' };
      }
    }

    // Standard login bypass password for ease of prototype check
    setCurrentUser(foundUser);
    setCurrentRole(foundUser.role);
    sessionStorage.setItem('hsp_active_user', JSON.stringify(foundUser));
    return { success: true };
  };

  const registerCustomer = (data: { fullName: string; email: string; phone: string; address: string; password: string }) => {
    const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      username: data.email,
      email: data.email,
      role: 'customer',
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      isActive: true
    };

    setUsers(prev => [...prev, newUser]);
    
    // Automatically log in
    setCurrentUser(newUser);
    setCurrentRole('customer');
    sessionStorage.setItem('hsp_active_user', JSON.stringify(newUser));
    return { success: true };
  };

  const registerProvider = (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    aadhaar: string;
    skills: string;
    experience: number;
    categories: string[];
    password: string;
  }) => {
    const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Email already registered' };
    }

    const providerId = `u-prov-${Date.now()}`;
    const newUser: User = {
      id: providerId,
      username: data.email,
      email: data.email,
      role: 'provider',
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      isActive: true
    };

    const newProfile: ServiceProviderProfile = {
      userId: providerId,
      aadhaar: data.aadhaar,
      skills: data.skills,
      experience: Number(data.experience) || 0,
      verificationStatus: 'pending', // Admin approval key criteria
      rating: 0,
      categories: data.categories,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableTimeSlots: ['09:00 - 13:00', '14:00 - 18:00'],
      bio: `Professional service provider in ${data.categories.join(', ')}.`
    };

    setUsers(prev => [...prev, newUser]);
    setProviders(prev => [...prev, newProfile]);

    return { success: true, error: 'Registration submitted successfully! Waiting for Admin verification.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    sessionStorage.removeItem('hsp_active_user');
  };

  const quickSwitchRole = (role: Role, email?: string) => {
    let targetUser: User | undefined;
    if (email) {
      targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      targetUser = users.find(u => u.role === role);
    }

    if (targetUser) {
      setCurrentUser(targetUser);
      setCurrentRole(role);
      sessionStorage.setItem('hsp_active_user', JSON.stringify(targetUser));
    }
  };

  const addService = (service: Omit<Service, 'id' | 'providerId' | 'providerName'>) => {
    if (!currentUser || currentUser.role !== 'provider') return;
    const newService: Service = {
      ...service,
      id: `s-${Date.now()}`,
      providerId: currentUser.id,
      providerName: currentUser.fullName
    };
    setServices(prev => [...prev, newService]);
  };

  const editService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'customerName' | 'customerPhone' | 'createdAt' | 'status'>) => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      customerName: currentUser?.fullName || 'Anonymous Customer',
      customerPhone: currentUser?.phone || 'No Phone',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    setBookings(prev => [newBooking, ...prev]);

    // Create a pending payment log automatically
    const newPayment: Payment = {
      id: `p-${Date.now()}`,
      bookingId,
      customerName: newBooking.customerName,
      providerName: newBooking.providerName,
      amount: newBooking.price,
      status: 'pending',
      paymentMethod: 'upi',
      date: newBooking.date
    };
    setPayments(prev => [...prev, newPayment]);

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    
    // Automatically update payment parameters if cancelled
    if (status === 'cancelled') {
      setPayments(prev => prev.map(p => p.bookingId === bookingId ? { ...p, status: 'failed' } : p));
    }
  };

  const processPayment = (bookingId: string, method: Payment['paymentMethod'], amount: number) => {
    setPayments(prev => prev.map(p => p.bookingId === bookingId ? { ...p, status: 'paid', paymentMethod: method } : p));
    
    // Accept payment also updates matching booking items if complete transitions
    setBookings(prev => prev.map(b => b.id === bookingId && b.status === 'pending' ? { ...b, status: 'accepted' } : b));
  };

  const submitReview = (bookingId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newReview: Review = {
      id: `rv-${Date.now()}`,
      bookingId,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      providerId: booking.providerId,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => [...prev, newReview]);

    // Recalculate provider profile ratings
    setProviders(prevProviders => prevProviders.map(p => {
      if (p.userId === booking.providerId) {
        const matches = [...reviews, newReview].filter(rv => rv.providerId === booking.providerId);
        const avg = matches.reduce((acc, rv) => acc + rv.rating, 0) / matches.length;
        return { ...p, rating: parseFloat(avg.toFixed(1)) };
      }
      return p;
    }));
  };

  const submitComplaint = (providerId: string, text: string) => {
    if (!currentUser) return;
    const providerUser = users.find(u => u.id === providerId);
    if (!providerUser) return;

    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      providerId,
      providerName: providerUser.fullName,
      complaintText: text,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (complaintId: string, status: Complaint['status'], resolutionNotes?: string) => {
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status, resolutionNotes } : c));
  };

  const verifyProvider = (providerId: string, status: 'approved' | 'rejected') => {
    setProviders(prev => prev.map(p => p.userId === providerId ? { ...p, verificationStatus: status } : p));
  };

  const updateProviderProfile = (data: Partial<ServiceProviderProfile> & { fullName?: string; phone?: string; address?: string }) => {
    if (!currentUser) return;
    
    // Update basic user parameters
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = {
          ...u,
          fullName: data.fullName ?? u.fullName,
          phone: data.phone ?? u.phone,
          address: data.address ?? u.address
        };
        sessionStorage.setItem('hsp_active_user', JSON.stringify(updated));
        setTimeout(() => setCurrentUser(updated), 0);
        return updated;
      }
      return u;
    }));

    // Update profile parameters
    setProviders(prev => prev.map(p => {
      if (p.userId === currentUser.id) {
        return {
          ...p,
          skills: data.skills ?? p.skills,
          experience: data.experience !== undefined ? Number(data.experience) : p.experience,
          availableDays: data.availableDays ?? p.availableDays,
          availableTimeSlots: data.availableTimeSlots ?? p.availableTimeSlots,
          profilePhoto: data.profilePhoto ?? p.profilePhoto,
          bio: data.bio ?? p.bio
        };
      }
      return p;
    }));
  };

  const updateCustomerProfile = (data: { fullName: string; phone: string; address: string }) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = {
          ...u,
          fullName: data.fullName,
          phone: data.phone,
          address: data.address
        };
        sessionStorage.setItem('hsp_active_user', JSON.stringify(updated));
        setTimeout(() => setCurrentUser(updated), 0);
        return updated;
      }
      return u;
    }));
  };

  const blockUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: false } : u));
  };

  const unblockUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: true } : u));
  };

  const addCategory = (name: string, description: string, icon: string) => {
    const id = `cat-${Date.now()}`;
    setCategories(prev => [...prev, { id, name, description, icon }]);
  };

  const editCategory = (id: string, name: string, description: string, icon: string) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { id, name, description, icon } : cat));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      providers,
      services,
      bookings,
      payments,
      reviews,
      complaints,
      categories,
      currentRole,
      login,
      registerCustomer,
      registerProvider,
      logout,
      quickSwitchRole,
      addService,
      editService,
      deleteService,
      addBooking,
      updateBookingStatus,
      processPayment,
      submitReview,
      submitComplaint,
      updateComplaintStatus,
      verifyProvider,
      updateProviderProfile,
      updateCustomerProfile,
      blockUser,
      unblockUser,
      addCategory,
      editCategory,
      deleteCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
