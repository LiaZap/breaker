/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import { useDashboard } from './context/DashboardContext';

function App() {
  const { dashboardData } = useDashboard();
  const [currentPage, setCurrentPage] = useState('loading'); // loading, admin-login, admin-panel, splash, landing, dashboard

  useEffect(() => {
    // Check for hash in URL
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');

    if (hash) {
      setCurrentPage('splash');
    } else {
      // Default to landing if no hash (development mode or new user)
      // Or admin-login if strictly admin. Let's default to admin-login as per original flow.
      setCurrentPage('admin-login');
    }
  }, []);

  const handleSplashComplete = () => {
    // Check if user has already onboarded (must have formData)
    if (dashboardData?.formData && Object.keys(dashboardData.formData).length > 0) {
        setCurrentPage('dashboard');
    } else {
        setCurrentPage('landing');
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentPage('dashboard');
  };

  const handleAdminLogin = () => {
    setCurrentPage('admin-panel');
  };

  if (currentPage === 'loading') return null;

  return (
    <>
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
