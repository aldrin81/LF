import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileModal from "./ProfileModal";
import {
  LayoutDashboard,
  AlertTriangle,
  CheckCircle,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart2
} from 'lucide-react';

const Sidebar = ({ role, onLogout, isCollapsed, setIsCollapsed }) => {
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const normalizedRole = role?.toLowerCase();
  const formattedRole = role?.charAt(0).toUpperCase() + role?.slice(1).toLowerCase();

  const currentUser = {
  id: null,
  full_name: "",
  username: "",
  email: "",
  contact: "",
  role: role,
  profile_picture: ""
}

  const menuItems = [
    {
      id: 'Dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      id: 'Lost Items',
      label: 'Lost Items',
      icon: AlertTriangle,
      path:
        normalizedRole === 'moderator'
          ? '/dashboard/moderator-lost'
          : '/dashboard/lost-items'
    },
    {
      id: 'Surrendered Items',
      label: 'Surrendered Items',
      icon: CheckCircle,
      path: '/dashboard/surrendered-items'
    },
    {
      id: 'Reports',
      label: 'Reports',
      icon: BarChart2,
      path: '/dashboard/reports'
    },
    {
      id: 'Claims',
      label: 'Claims',
      icon: CheckCircle,
      path: '/dashboard/claim-requests'
    },
    ...(normalizedRole === 'admin'
      ? [
          {
            id: 'Users',
            label: 'Users',
            icon: Users,
            path: '/dashboard/users'
          }
        ]
      : [])
  ];

  return (
    <>
      <aside
        className={`h-full bg-gradient-to-b from-white to-[#F8FBFD] border-r border-slate-200 shadow-md flex flex-col justify-between transition-all duration-300 ${
          isCollapsed ? 'w-[95px]' : 'w-[330px]'
        }`}
      >
        {/* TOP */}
        <div className="py-7 flex-1 overflow-y-auto select-none">

          {/* Welcome */}
          <div
  className={`px-8 mb-8 transition-all duration-300 ${
    isCollapsed
      ? "opacity-0 h-0 mb-0 overflow-hidden"
      : "opacity-100"
  }`}
>

  <p className="text-lg font-medium text-slate-400">
    Welcome back,
  </p>

  <h2 className="mt-1 text-3xl font-extrabold text-[#0B6FA4] leading-tight">

    {currentUser.full_name || `${formattedRole} Marie`}

  </h2>

  <button
    onClick={() => setShowProfileModal(true)}
    className="mt-2 text-[15px] font-semibold text-[#0B6FA4] hover:underline transition"
  >
    View Profile
  </button>

</div>


          {/* Navigation */}
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.path === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center rounded-xl px-5 py-4 transition-all duration-200 ${
                    isCollapsed ? 'justify-center' : 'gap-4'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0B6FA4] to-[#155F87] text-white shadow-lg'
                      : 'text-slate-500 hover:bg-[#EEF6FA] hover:text-[#0B6FA4]'
                  }`}
                >
                  <Icon size={25} strokeWidth={2.2} />

                  {!isCollapsed && (
                    <span className="text-[17px] font-semibold">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 p-4 space-y-2">

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center rounded-xl px-5 py-4 text-slate-500 hover:bg-[#EEF6FA] hover:text-[#0B6FA4] transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight size={22} />
            ) : (
              <div className="flex items-center gap-4">
                <ChevronLeft size={22} />
                <span className="text-[17px] font-semibold">
                  Collapse
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center rounded-xl px-5 py-4 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            {isCollapsed ? (
              <LogOut size={22} />
            ) : (
              <div className="flex items-center gap-4">
                <LogOut size={22} />
                <span className="text-[17px] font-semibold">
                  Logout
                </span>
              </div>
            )}
          </button>

        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold text-slate-800">
              Confirm Logout
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={onLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
              >
                Logout
              </button>
              
            </div>
          </div>
        </div>
        
      )}
      <ProfileModal
  isOpen={showProfileModal}
  onClose={() => setShowProfileModal(false)}
  user={currentUser}
/>
    </>
  );
};

export default Sidebar;