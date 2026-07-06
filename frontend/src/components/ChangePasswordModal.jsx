import React, { useState } from "react";
import { changePassword } from "../api/api";

const ChangePasswordModal = ({ onSuccess, onCancel, mustChangePassword }) => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (form.new_password !== form.confirm_password) {
    setError("New password password do not match.");
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

  try {
    await changePassword(form.current_password, form.new_password);
    alert("Password changed successfully.");
    onSuccess();
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.error ||
        "Failed to change password. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

console.log("mustChangePassword prop:", mustChangePassword);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md overflow-hidden rounded-md bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        >
        <div className="bg-[#1478a7] px-6 py-4 text-white">
          <h3 className="text-2xl font-bold">Change Password</h3>
          <p className="mt-1 text-sm text-white/90">
            Please change your temporary password before continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
            </div>
            )}

          {!mustChangePassword && (
            <input
                type="password"
                placeholder="Current password"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1478a7]"
                value={form.current_password}
                onChange={(e) =>
                setForm({ ...form, current_password: e.target.value })
                }
                required
            />
            )}

          <input
            type="password"
            placeholder="New password"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1478a7]"
            value={form.new_password}
            onChange={(e) =>
              setForm({ ...form, new_password: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1478a7]"
            value={form.confirm_password}
            onChange={(e) =>
              setForm({ ...form, confirm_password: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 rounded-xl bg-[#343d86] text-sm font-black uppercase tracking-wide text-white shadow-md hover:bg-[#2c3476] disabled:opacity-70"
                >
                    {loading ? "Saving..." : "Save Password"}
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onCancel();
                    }}
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