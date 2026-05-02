import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, CheckCircle, Users, LogOut, ChevronLeft, ChevronRight, BarChart2, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = ({ role, onLogout, isCollapsed, setIsCollapsed }) => {
  const { pendingClaimsCount } = useApp();
  const { pathname } = useLocation();

  const normalizedRole = role?.toLowerCase();


  const menuItems = [
    { id: 'Dashboard',      label: 'Dashboard',      icon: LayoutDashboard, path: '/dashboard' },
    { 
      id: 'Lost Items',     
      label: 'Lost Items',     
      icon: AlertTriangle,   
      path: normalizedRole === 'Moderator' ? '/dashboard/moderator' : '/dashboard/lost-items' 
    },
    { id: 'Found Items',    label: 'Found Items',    icon: CheckCircle,     path: '/dashboard/found-items' },
    { id: 'Claim Requests', label: 'Claim Requests', icon: Bell,            path: '/dashboard/claim-requests' },
    { id: 'Reports',        label: 'Reports',        icon: BarChart2,       path: '/dashboard/reports' },
    { id: 'Users',          label: 'Users',          icon: Users,           path: '/dashboard/users' },
  ];

  return (
    <aside className={`h-full bg-white border-r flex flex-col justify-between z-20 shadow-sm transition-all duration-300 ${isCollapsed ? 'w-[68px]' : 'w-64'}`}>
      
      <div className="py-7 flex-1 overflow-y-auto">
        {/* Logo */}
        <div className={`px-6 mb-8 transition-all duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 h-0 mb-0' : 'opacity-100'}`}>
          <h2 className="text-[#2D366D] font-black text-xl italic tracking-tighter uppercase leading-none">Seek &amp; Balik</h2>
          <div className="mt-2 inline-block px-2 py-1 bg-[#E8EFFF] rounded text-[9px] font-black text-[#2D366D] uppercase tracking-widest">
            {role} Panel
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            if (item.id === 'users' && normalizedRole !== 'admin') return null;
            const Icon = item.icon;
            const hasBadge = item.id === 'Claim Requests' && pendingClaimsCount > 0;
            const isActive = item.path === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center p-3 rounded-xl transition-all ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                } ${
                  isActive
                    ? 'bg-[#E8EFFF] text-[#2D366D] font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                {/* Icon with badge dot when collapsed */}
                <div className="relative flex-shrink-0">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {hasBadge && isCollapsed && (
                    <span className="absolute -top-1.5 -right-1.5 bg-orange-400 text-white text-[7px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                      {pendingClaimsCount > 9 ? '9+' : pendingClaimsCount}
                    </span>
                  )}
                </div>

                {/* Label + badge when expanded */}
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-semibold whitespace-nowrap flex-1 text-left">{item.label}</span>
                    {hasBadge && (
                      <span className="bg-orange-400 text-white text-[7px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {pendingClaimsCount > 9 ? '9+' : pendingClaimsCount}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom controls */}
      <div className="p-3 border-t space-y-1 flex-shrink-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center p-3 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-black transition-all"
        >
          {isCollapsed
            ? <ChevronRight size={20} />
            : <div className="flex items-center space-x-3"><ChevronLeft size={20} /><span className="text-sm font-bold tracking-widest">Collapse</span></div>
          }
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          {isCollapsed
            ? <LogOut size={20} />
            : <div className="flex items-center space-x-3"><LogOut size={20} /><span className="text-sm font-bold tracking-widest">Logout</span></div>
          }
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;