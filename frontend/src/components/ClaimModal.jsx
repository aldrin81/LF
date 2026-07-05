import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ClaimModal = ({ item, onClose }) => {
  const { submitClaimRequest } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    claimant_name: '',
    claimant_contact: '',
    claimant_email: '',
    meeting_date: '',
    meeting_time: '',
    proof_description: ''
  });

  const today = new Date().toLocaleDateString('en-CA');

  const claimTimeOptions = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
  ];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);

  try {
    await submitClaimRequest({
      item: item.id,
      claimant_name: form.claimant_name,
      claimant_contact: `+63${form.claimant_contact}`,
      claimant_email: form.claimant_email,
      meeting_date: form.meeting_date,
      meeting_time: form.meeting_time,
      proof_description: form.proof_description
    });

    setSubmitted(true);
  } catch (err) {
    console.error("Claim error:", err?.response?.data || err.message);
    alert(JSON.stringify(err?.response?.data || err.message));
  } finally {
    setLoading(false);
  }
};

  return (
    <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div
      className={`bg-white w-full ${
        submitted ? "max-w-sm" : "max-w-4xl"
      } max-h-[92vh] rounded-md shadow-2xl overflow-hidden flex flex-col`}
    >

      {/* HEADER */}
      {!submitted && (
          <div className="bg-[#0B6FA4] text-white px-4 sm:px-5 py-4 flex justify-between items-start gap-4">
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-bold">
                Claim Item
              </h2>

              <p className="text-blue-100 text-sm sm:text-lg mt-1">
                Submit your ownership request
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        )}

      {/* BODY */}
      <div className="p-4 sm:p-5 md:p-6 overflow-y-auto">

        {submitted ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">✅</div>

            <h2 className="font-black text-slate-800 uppercase tracking-widest">
              Claim Submitted
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Your request is now under review
            </p>

            <button
              onClick={onClose}
              className="mt-6 bg-[#2D366D] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

            {/* First Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              {/* Full Name */}
              <div className="min-w-0">
                <label className="block text-base sm:text-xl font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={form.claimant_name}
                  onChange={(e) => set("claimant_name", e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-base sm:text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                  required
                />
              </div>

              {/* Contact Number */}
             <div className="min-w-0">
                <label className="block text-base sm:text-xl font-semibold text-slate-700 mb-2">
                  Contact Number
                </label>

                <div className="w-full mt-1 flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden transition-all duration-200 focus-within:border-[#2D366D] focus-within:ring-4 focus-within:ring-slate-200">
                  <span className="h-[50px] sm:h-[58px] px-4 bg-slate-100 text-base sm:text-xl text-slate-600 font-semibold border-r border-slate-300 flex items-center">
                    +63
                  </span>

                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9123456789"
                    value={form.claimant_contact}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                      set("claimant_contact", digitsOnly);
                    }}
                    className="sm:h-[50px] w-full px-4 bg-white text-base sm:text-xl text-slate-700 placeholder:text-slate-400 outline-none"
                    required
                  />
                </div>
              </div>

            </div>

            {/* Email */}
            <div>
              <label className="block text-base sm:text-xl font-semibold text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter email"
                value={form.claimant_email}
                onChange={(e) => set("claimant_email", e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-base sm:text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                required
              />
            </div>

            {/* Claim Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-base sm:text-xl font-semibold text-slate-700 mb-2">
                    Claim Date
                  </label>

                  <input
                    type="date"
                    value={form.meeting_date}
                    onChange={(e) => set("meeting_date", e.target.value)}
                    min={today}
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-base sm:text-xl text-slate-700 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-xl font-semibold text-slate-700 mb-2">
                    Claim Time
                  </label>

                  <select
                    value={form.meeting_time}
                    onChange={(e) => set("meeting_time", e.target.value)}
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-base sm:text-xl text-slate-700 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                    required
                  >
                    <option value="">Select time</option>
                    {claimTimeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            {/* Reason */}
            <div>
              <label className="block text-base sm:text-xl font-semibold text-slate-700 mb-2">
                Reason / Details
              </label>

              <textarea
                rows={5}
                placeholder="Describe your claim..."
                value={form.proof_description}
                onChange={(e) => set("proof_description", e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-base sm:text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200 resize-none"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#E3E8F0] text-[#64748B] text-sm sm:text-base font-bold uppercase tracking-wide transition duration-200 hover:bg-[#D5DDE8] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] text-white text-sm sm:text-base font-semibold uppercase tracking-wide shadow-md transition-all duration-200 hover:from-[#44509B] hover:to-[#2D366D] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  </div>
    );
  };

export default ClaimModal;