import React, { useState, useEffect } from "react";

const ChangePasswordModal = ({ isOpen, onSuccess, onCancel, mustChangePassword }) => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // FRONTEND VALIDATIONS
    if (form.new_password !== form.confirm_password) {
      setError("New password inputs do not match.");
      return;
    }

    if (form.new_password.length < 12) {
      setError("Password is too short. It must be at least 12 characters long.");
      return;
    }

    if (form.new_password.length > 16) {
      setError("Password is too long. It must not exceed 16 characters.");
      return;
    }

    if (/\s/.test(form.new_password)) {
      setError("Password must not contain spaces.");
      return;
    }

    if (!mustChangePassword && form.new_password === form.current_password) {
      setError("New password must not be the same as the current password.");
      return;
    }

    setLoading(true);

    // MOCK TIMEOUT (PURE FRONTEND SUCCESS)
    setTimeout(() => {
      setLoading(false);
      window.alert("Password changed successfully (Frontend Mock).");
      onSuccess();
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1478a7] px-6 py-5 text-white">
          <h3 className="text-2xl font-black">Change Password</h3>
          <p className="mt-1 text-sm text-white/95">
            {mustChangePassword 
              ? "Please change your temporary password before continuing." 
              : "Update your security credentials below."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {!mustChangePassword && (
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1478a7] text-slate-700"
                value={form.current_password}
                onChange={(e) =>
                  setForm({ ...form, current_password: e.target.value })
                }
                required
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">New Password</label>
            <input
              type="password"
              placeholder="Enter new password (12-16 characters)"
              disabled={loading}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1478a7] text-slate-700"
              value={form.new_password}
              onChange={(e) =>
                setForm({ ...form, new_password: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Confirm New Password</label>
            <input
              type="password"
              placeholder="Re-type new password"
              disabled={loading}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1478a7] text-slate-700"
              value={form.confirm_password}
              onChange={(e) =>
                setForm({ ...form, confirm_password: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl bg-[#343d86] text-sm font-black uppercase tracking-wide text-white shadow-md hover:bg-[#2c3476] disabled:opacity-70 transition-colors"
            >
              {loading ? "Saving..." : "Save Password"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="h-12 rounded-xl bg-slate-200 text-sm font-black uppercase tracking-wide text-slate-500 transition hover:bg-slate-300 disabled:opacity-70"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;