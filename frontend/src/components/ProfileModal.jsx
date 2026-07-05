import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Camera
} from "lucide-react";

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const profileImage =
    user?.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.full_name || "User"
    )}&background=0B6FA4&color=fff&size=256`;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-8">

      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_.2s_ease]">

        {/* Header */}

        <div className="relative h-60 bg-gradient-to-r from-[#0B6FA4] via-[#0F81BD] to-[#155F87]">

          <button
            onClick={onClose}
            className="absolute right-6 top-6 bg-white/20 hover:bg-white/30 transition w-11 h-11 rounded-full flex items-center justify-center text-white"
          >
            <X />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-68px]">

            <div className="relative">

              <img
                src={profileImage}
                alt=""
                className="w-36 h-36 rounded-full object-cover border-[6px] border-white shadow-xl"
              />

              <button
                className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#0B6FA4] text-white flex items-center justify-center shadow-lg hover:bg-[#095b86]"
              >
                <Camera size={18} />
              </button>

            </div>

          </div>

        </div>

        {/* BODY */}

        <div className="px-10 pt-24 pb-10">

          <h1 className="text-center text-4xl font-black text-slate-800">
            {user?.full_name || "Loading..."}
          </h1>

          <p className="text-center mt-2 text-slate-500 capitalize text-lg">
            {user?.role || ""}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            {/* Full Name */}

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">

              <div className="flex items-center gap-3 mb-3">

                <User className="text-[#0B6FA4]" />

                <span className="font-bold text-slate-700">
                  Full Name
                </span>

              </div>

              <input
                disabled
                value={user?.full_name || ""}
                className="w-full bg-white rounded-xl border px-4 py-3"
              />

            </div>

            {/* Username */}

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">

              <div className="flex items-center gap-3 mb-3">

                <User className="text-[#0B6FA4]" />

                <span className="font-bold text-slate-700">
                  Username
                </span>

              </div>

              <input
                disabled
                value={user?.username || ""}
                className="w-full bg-white rounded-xl border px-4 py-3"
              />

            </div>

            {/* Email */}

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">

              <div className="flex items-center gap-3 mb-3">

                <Mail className="text-[#0B6FA4]" />

                <span className="font-bold text-slate-700">
                  Email
                </span>

              </div>

              <input
                disabled
                value={user?.email || ""}
                className="w-full bg-white rounded-xl border px-4 py-3"
              />

            </div>

            {/* Contact */}

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">

              <div className="flex items-center gap-3 mb-3">

                <Phone className="text-[#0B6FA4]" />

                <span className="font-bold text-slate-700">
                  Contact Number
                </span>

              </div>

              <input
                disabled
                value={user?.contact || ""}
                className="w-full bg-white rounded-xl border px-4 py-3"
              />

            </div>

            {/* Role */}

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 md:col-span-2">

              <div className="flex items-center gap-3 mb-3">

                <Shield className="text-[#0B6FA4]" />

                <span className="font-bold text-slate-700">
                  Role
                </span>

              </div>

              <input
                disabled
                value={user?.role || ""}
                className="w-full bg-white rounded-xl border px-4 py-3 capitalize"
              />

            </div>

          </div>

          <div className="flex justify-end gap-4 mt-10">

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold"
            >
              Close
            </button>

            <button
              className="px-8 py-3 rounded-xl bg-[#0B6FA4] hover:bg-[#095b86] text-white font-semibold flex items-center gap-2"
            >
              <Lock size={18} />
              Change Password
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfileModal;