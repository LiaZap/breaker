/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ClientLogin from './components/ClientLogin';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import { useDashboard } from './context/DashboardContext';

function App() {
  const { dashboardData } = useDashboard();
  const [currentPage, setCurrentPage] = useState('loading');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');

    if (hash) {
      setCurrentPage('splash');
    } else {
      setCurrentPage('client-login');
    }
  }, []);

  const handleSplashComplete = () => {
    if (dashboardData?.formData && Object.keys(dashboardData.formData).length > 0) {
        setCurrentPage('dashboard');
    } else {
        setCurrentPage('landing');
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentPage('dashboard');
  };

  const handleClientLogin = (hash) => {
    window.location.href = `${window.location.pathname}?hash=${hash}`;
  };

  const handleAdminLogin = () => {
    setCurrentPage('admin-panel');
  };

  if (currentPage === 'loading') return null;

  return (
    <>
      {/* CLIENT LOGIN */}
      {currentPage === 'client-login' && (
        <ClientLogin 
          onLogin={handleClientLogin} 
          onAdminAccess={() => setCurrentPage('admin-login')}
        />
      )}

      {/* ADMIN FLOW */}
      {currentPage === 'admin-login' && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}
      {currentPage === 'admin-panel' && (
        <AdminPanel />
      )}

      {/* CLIENT FLOW */}
      {currentPage === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      {currentPage === 'landing' && (
        <LandingPage onComplete={handleOnboardingComplete} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard />
      )}
    </>
  );
}

export default App;
