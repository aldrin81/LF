import React, { useEffect, useState, useRef } from "react";
import { X, User, Mail, Phone, Shield, Lock, Camera } from "lucide-react";
import { getCurrentUser } from "../api/api";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileModal = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [localImage, setLocalImage] = useState(null); // DITO ITATABI ANG BAGONG IMAGE (FRONTEND ONLY)
  const fileInputRef = useRef(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setProfileData(currentUser);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchCurrentUser();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // PURE FRONTEND IMAGE PREVIEW LOGIC
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select a valid image file.");
      return;
    }

    // Basahin ang file at gawing Data URL para maipakita agad sa UI
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalImage(reader.result); // I-save sa local state
      window.alert("Profile picture updated in view (Frontend only).");
    };
    reader.readAsDataURL(file);
  };

  // Gamitin ang localImage kung meron, kung wala yung galing sa DB, kung wala pa rin, yung UI Avatars
  const profileImage =
    localImage ||
    profileData?.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      (profileData?.first_name || "User") + " " + (profileData?.last_name || "")
    )}&background=0B6FA4&color=fff&size=256`;

    function toTitleCase(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <div className="w-full max-w-[514px] max-h-[calc(100dvh-32px)] overflow-hidden rounded-[24px] bg-white shadow-2xl">
          {/* HEADER SECTION */}
          <div className="relative h-[120px] bg-gradient-to-r from-[#147daa] to-[#16678d]">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-[112px] w-[112px] rounded-full border-4 border-white object-cover shadow-lg bg-white"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0B6FA4] text-white shadow-md hover:bg-[#095d8a] transition-colors"
                >
                  <Camera size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="max-h-[calc(100dvh-147px)] overflow-y-auto px-8 pb-8 pt-20">
            <h1 className="text-center text-[24px] font-black text-slate-800">
              {loading ? "Loading..." : `${profileData?.first_name || ""} ${profileData?.last_name || ""}`}
            </h1>
            <p className="mt-1 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
              {profileData?.role || "No Position"}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileField icon={User} label="First Name" value={profileData?.first_name || "-"} />
              <ProfileField icon={User} label="Last Name" value={profileData?.last_name || "-"} />
              <ProfileField icon={Mail} label="Email" value={profileData?.email || "-"} />
              <ProfileField icon={Phone} label="Contact Number" value={profileData?.contact || "-"} />
              <div className="sm:col-span-2">
                <ProfileField icon={Shield} label="Position" value={toTitleCase(profileData?.role) || "-"} />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setIsChangePassOpen(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B7DB3] px-6 text-sm font-bold text-white hover:bg-[#096892] transition-colors w-full sm:w-auto"
              >
                <Lock size={16} />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {isChangePassOpen && (
        <ChangePasswordModal
          isOpen={isChangePassOpen}
          mustChangePassword={false}
          onSuccess={() => setIsChangePassOpen(false)}
          onCancel={() => setIsChangePassOpen(false)}
        />
      )}
    </>
  );
};

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
    <div className="mb-2 flex items-center gap-2">
      <Icon size={16} className="text-[#0B6FA4]" />
      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">{label}</span>
    </div>
    <input
      disabled
      value={value}
      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
    />
  </div>
);

export default ProfileModal;