import React, { useState, useEffect } from 'react';
import { testFirestore } from './testFirestore';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { PublicHome } from './pages/PublicHome';
import { AboutUs } from './pages/AboutUs';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { Login } from './pages/Login';
import { RegisterCustomer } from './pages/RegisterCustomer';
import { RegisterProvider } from './pages/RegisterProvider';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  useEffect(() => {
  testFirestore();
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <PublicHome navigate={navigate} />;
      case 'about':
        return <AboutUs />;
      case 'services':
        return <ServicesPage navigate={navigate} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <Login navigate={navigate} />;
      case 'register-customer':
        return <RegisterCustomer navigate={navigate} />;
      case 'register-provider':
        return <RegisterProvider navigate={navigate} />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'provider-dashboard':
        return <ProviderDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <PublicHome navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
      <Navbar currentPage={currentPage} navigate={navigate} />
      <main className="grow">
        {renderActivePage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
