import React, { useEffect, useState } from "react";
import { X, User, Mail, Phone, Shield, Lock, Camera } from "lucide-react";
import { getCurrentUser } from "../api/api";

const ProfileModal = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchCurrentUser() {
      try {
        setLoading(true);

        const currentUser = await getCurrentUser();

        setProfileData({
          ...currentUser,
          full_name: `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim(),
        });
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, [isOpen]);

  if (!isOpen) return null;

  const profileImage =
    profileData?.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profileData?.full_name || "User"
    )}&background=0B6FA4&color=fff&size=256`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[514px] max-h-[calc(100dvh-32px)] overflow-hidden rounded-[18px] bg-white shadow-2xl">
        <div className="relative h-[115px] bg-gradient-to-r from-[#147daa] to-[#16678d]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X size={20} />
          </button>

          <div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2">
            <div className="relative">
              <img
                src={profileImage}
                alt=""
                className="h-[112px] w-[112px] rounded-full border-4 border-white object-cover shadow-xl"
              />

              <button
                type="button"
                className="absolute bottom-2 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#0B6FA4] text-white shadow-md"
              >
                <Camera size={13} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(100dvh-147px)] overflow-y-auto px-8 pb-8 pt-20">
          <h1 className="text-center text-[28px] font-black leading-tight text-slate-800">
            {loading ? "Loading..." : profileData?.first_name || "User"}
          </h1>

          <p className="mt-2 text-center text-sm capitalize text-slate-500">
            {profileData?.role || ""}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ProfileField icon={User} label="Full Name" value={profileData?.full_name || ""} />
            <ProfileField icon={Mail} label="Email" value={profileData?.email || ""} />
            <ProfileField icon={Phone} label="Contact Number" value={profileData?.contact || ""} />
            <ProfileField
              icon={Shield}
              label="Role"
              value={profileData?.role || ""}
              inputClassName="capitalize"
            />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0B7DB3] px-7 text-sm font-semibold text-white hover:bg-[#096892]"
            >
              <Lock size={15} />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value, inputClassName = "" }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
    <div className="mb-3 flex items-center gap-2">
      <Icon size={18} className="text-[#0B6FA4]" />
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </div>

    <input
      disabled
      value={value}
      className={`h-10 w-full rounded-[10px] border border-slate-800/80 bg-white px-3 text-sm text-slate-700 ${inputClassName}`}
    />
  </div>
);

export default ProfileModal;