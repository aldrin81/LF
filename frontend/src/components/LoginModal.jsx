import React, { useState } from "react";
import { loginUser, getCurrentUser } from "../api/api";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import slcLogo from "../assets/slc-logo.png";
import saoLogo from "../assets/sao.png";
import ChangePasswordModal from "./ChangePasswordModal";


const LoginModal = ({ onClose }) => {
  const { setLogin } = useApp();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleSubmit = async (e) => {
      e.preventDefault();

      const username = e.target.username.value.trim();
      const password = e.target.password.value.trim();

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        // login request
        await loginUser(username, password);

        // fake loading optional UI delay
        await new Promise((r) => setTimeout(r, 2000));

        // get user info
        const currentUser = await getCurrentUser();

        // If password is auto-generated, force user to change it first
        if (currentUser.must_change_password) {
          setPendingUser(currentUser);
          setMustChangePassword(true);
          return;
        }

        // update context + localStorage
        setLogin(currentUser.role);

        navigate("/dashboard", { replace: true });
        onClose();
      } catch (err) {
        console.error(err);
        setError("Invalid credentials. Please try again.");
      } finally {
        setLoading(false);
      }
  };
  return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-md p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading && !mustChangePassword) onClose();
      }}
  >

    {mustChangePassword && (
      <ChangePasswordModal
        mustChangePassword={pendingUser?.must_change_password}
        onSuccess={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          setMustChangePassword(false);
          setPendingUser(null);
          setSuccess("Password changed successfully. Please log in using your new password.");
        }}
        onCancel={() => {
          setMustChangePassword(false);
          setPendingUser(null);
        }}
      />
    )}

    <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,.25)]">

      <div className="grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-[#0B648D] to-[#155F87] text-white p-12 flex flex-col justify-center">

          <div className="flex justify-center gap-4 mb-8">
            <img
              src={slcLogo}
              alt="SLC Logo"
              className="w-16 h-16 object-contain bg-white rounded-full p-1"
            />

            <img
              src={saoLogo}
              alt="Seek & Balik Logo"
              className="w-16 h-16 object-contain bg-white rounded-full p-1"
            />
          </div>

          <h1 className="text-5xl font-old-english leading-tight">
            Saint Louis College
          </h1>

          <p className="italic text-blue-100 mt-2">
            City of San Fernando, La Union
          </p>

          <div className="w-104 h-[2px] bg-white/40 my-8"></div>

          <h2 className="text-3xl font-black tracking-widest">
            SEEK & BALIK
          </h2>

          <p className="text-blue-100 mt-3 text-lg">
            Lost and Found Management System
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-14 flex flex-col justify-center">

          <div className="flex justify-between items-center mb-8">

            <div>
              <h2 className="text-3xl font-bold text-[#154B70]">
                Welcome Back
              </h2>

              <p className="text-gray-500 mt-2">
                Log in to continue.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div>
              <label className="text-m font-semibold text-[#154B70]">
                Email
              </label>

              <input
                name="username"
                type="text"
                required
                disabled={loading}
                placeholder="Enter your email"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#0B648D] focus:ring-4 focus:ring-[#0B648D]/20 outline-none transition"
              />
            </div>

            <div>
              <label className="text-m font-semibold text-[#154B70]">
                Password
              </label>

              <input
                name="password"
                type="password"
                required
                disabled={loading}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#0B648D] focus:ring-4 focus:ring-[#0B648D]/20 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-xl bg-[#0B648D] py-3 text-lg font-semibold text-white transition hover:bg-[#094f70] active:scale-[.98] disabled:bg-slate-400 disabled:cursor-not-allowed disabled:hover:bg-slate-400"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Logging in...
                </span>
              ) : (
                "LOGIN"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-xl border border-[#0B648D] py-3 font-medium text-[#0B648D] transition hover:bg-blue-50"
            >
              CANCEL
            </button>

          </form>

        </div>

      </div>

    </div>
  </div>
);
}

export default LoginModal;