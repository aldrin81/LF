import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";

import { useApp } from "../context/AppContext";
import useClock from "../hooks/useClock";

import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

// Import institutional logos
import Header from "./Header";

const DashboardLayout = () => {
  const { time, date } = useClock();
  const { isLoggedIn, userRole, logout } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F4F7FE]">

      {/* ─── SCREENSHOT MATCHED INSTITUTIONAL HEADER (WITH LOCKED CENTER ALIGNMENT) ─── */}
      <Header
    variant="dashboard"
    time={time}
    date={date}
/>

      {/* ─── MAIN WORKSPACE CONTENT ─── */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar
          role={userRole}
          onLogout={handleLogout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 transition-all duration-300">
          {/* Real-time tracker alternative fallback visibility for mobile layout viewports */}
          <div className="block md:hidden mb-4 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-center">
            <p className="text-[9px] font-black tracking-wider text-slate-400 uppercase font-mono">
              {date} · {time}
            </p>
          </div>
          <Outlet />
        </main>

      </div>

      <MobileNav />
    </div>
  );
};

export default DashboardLayout;