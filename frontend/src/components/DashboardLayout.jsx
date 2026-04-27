import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useClock from '../hooks/useClock';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const DashboardLayout = () => {
  const { time, date } = useClock();
  const { pendingClaimsCount, isLoggedIn, userRole, logout } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Map path to page name for sidebar highlighting
  const getPageName = () => {
    const path = location.pathname;
    if (path.includes('/dashboard'))      return 'Dashboard';
    if (path.includes('/lost-items'))     return 'Lost Items';
    if (path.includes('/found-items'))    return 'Found Items';
    if (path.includes('/claim-requests')) return 'Claim Requests';
    if (path.includes('/reports'))        return 'Reports';
    if (path.includes('/users'))          return 'Users';
    return '';
  };

  const currentPage = getPageName();

  const handlePageChange = (page) => {
    const routeMap = {
      'Dashboard':      '/dashboard',
      'Lost Items':     '/lost-items',
      'Found Items':    '/found-items',
      'Claim Requests': '/claim-requests',
      'Reports':        '/reports',
      'Users':          '/users',
    };
    navigate(routeMap[page] || '/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Redirect if not logged in (basic protection)
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans text-slate-700 bg-[#F4F7FE]">
      {/* Top Brand Header */}
      <header className="w-full bg-[#2D366D] flex items-center justify-center text-center text-white z-30 shadow-md py-4 sm:py-0 sm:h-28 flex-shrink-0">
        <div>
          <h1 className="text-xl sm:text-3xl font-serif italic font-bold tracking-tight">Saint Louis College</h1>
          <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.5em] opacity-70 mt-1">San Fernando City, La Union</p>
          <p className="hidden sm:block text-[11px] italic mt-2 opacity-90 font-light">"The Beacon of Wisdom in the North"</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden sm:block flex-shrink-0">
          <Sidebar
            role={userRole}
            onLogout={handleLogout}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub-Header */}
          <div className="bg-white border-b px-4 sm:px-10 py-4 sm:py-6 flex justify-between items-center shadow-sm flex-shrink-0">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tighter uppercase italic flex items-center gap-3">
                Staff Portal
                {pendingClaimsCount > 0 && (
                  <span className="bg-orange-400 text-white text-[9px] font-black rounded-full px-2 py-0.5 animate-pulse">
                    {pendingClaimsCount} alerts
                  </span>
                )}
              </h2>
              <div className="hidden sm:flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#2D366D]">{time}</span>
                <span className="text-slate-300 text-[9px]">·</span>
                <span className="text-[9px] font-bold text-slate-400">{date}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="w-9 h-9 rounded-full bg-[#2D366D] border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="avatar" />
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 sm:p-8 overflow-y-auto flex-1 pb-20 sm:pb-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <MobileNav 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange} 
        role={userRole} 
        onLogout={handleLogout} 
      />
    </div>
  );
};

export default DashboardLayout;
