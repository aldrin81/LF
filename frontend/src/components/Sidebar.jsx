import React, { useState, useEffect } from 'react';
import { getCurrentUser } from "../api/api";
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
  BarChart2,
  Flag,
  CircleQuestionMark,
  Search,
  HandHelping,
  Handshake
} from 'lucide-react';

const Sidebar = ({ role, onLogout, isCollapsed, setIsCollapsed }) => {
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const normalizedRole = role?.toLowerCase();
  const formattedRole = role?.charAt(0).toUpperCase() + role?.slice(1).toLowerCase();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
  async function fetchCurrentUser() {
    try {
      const data = await getCurrentUser();

      setCurrentUser({
        ...data,
        full_name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      });
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  }

  fetchCurrentUser();
}, []);

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
      icon: Search,
      path:
        normalizedRole === 'moderator'
          ? '/dashboard/moderator-lost'
          : '/dashboard/lost-items'
    },
    {
      id: 'Surrendered Items',
      label: 'Surrendered Items',
      icon: Flag,
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
      icon: Handshake,
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

  <h2 className="mt-1 text-xl font-extrabold text-[#0B6FA4] leading-tight">

    {currentUser?.first_name} {currentUser?.last_name}

  </h2>

  <h2 className="mt-1 text-lg font-extrabold text-[#0B6FA4] leading-tight">

    {formattedRole || "User"}

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-md p-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,.25)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F4FA] text-[#0B648D]">
              <LogOut size={30} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-[#154B70]">
              Confirm Logout
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              You are about to end your current session. You will need to log in again to access the system.
            </p>

            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-xl bg-[#0B648D] py-3 text-base font-bold uppercase text-white transition hover:bg-[#094f70] active:scale-[.98]"
              >
                Logout
              </button>

              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full rounded-xl border border-[#0B648D] py-3 font-semibold uppercase text-[#0B648D] transition hover:bg-blue-50"
              >
                Cancel
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