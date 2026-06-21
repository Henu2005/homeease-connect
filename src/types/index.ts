export type Role = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  fullName: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface CustomerProfile {
  userId: string;
  phone: string;
  address: string;
}

export interface ServiceProviderProfile {
  userId: string;
  aadhaar: string;
  skills: string;
  experience: number; // in years
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  categories: string[];
  availableDays: string[];
  availableTimeSlots: string[];
  profilePhoto?: string;
  bio?: string;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  name: string;
  description: string;
  category: string;
  price: number; // per hour or flat rate
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  price: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  providerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  paymentMethod: 'card' | 'upi' | 'cash';
  date: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  complaintText: string;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  date: string;
  resolutionNotes?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}
