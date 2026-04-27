import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import useClock from '../hooks/useClock';
import LoginModal from '../components/LoginModal';

// Pages
import PublicBoard from './PublicLanding';


import { useNavigate } from 'react-router-dom';

const AppInner = () => {
  const { time, date } = useClock();
  const { pendingClaimsCount, isLoggedIn, setLogin, userRole, logout } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (role) => {
    setLogin(role);
    setShowLogin(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    setShowLogin(false);
    navigate('/');
  };

  // PUBLIC LANDING
  return (
    <>
      <PublicBoard onOpenLogin={() => setShowLogin(true)} />
      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default AppInner;
