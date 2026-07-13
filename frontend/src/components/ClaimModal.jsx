import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ClaimModal = ({ item, onClose }) => {
  const { submitClaimRequest } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false); // State para sa confirmation

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
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

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await submitClaimRequest({
        item: item.id,
        claimant_name: `${form.first_name} ${form.last_name}`,
        claimant_contact: `+63${form.claimant_contact}`,
        claimant_email: form.claimant_email,
        meeting_date: form.meeting_date,
        meeting_time: form.meeting_time,
        proof_description: form.proof_description
      });
      setSubmitted(true);
      setIsConfirming(false);
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
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        className={`bg-white w-full ${
          submitted || isConfirming ? "max-w-sm" : "max-w-4xl"
        } max-h-[92vh] rounded-xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.18)] overflow-hidden flex flex-col`}
      >

        {/* HEADER */}
        {!submitted && !isConfirming && (
          <div className="bg-gradient-to-r from-[#0B648D] to-[#155F87] text-white px-4 sm:px-8 py-4 sm:py-6 border-b-4 flex justify-between items-start gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Claim Item</h2>
              <p className="text-blue-100 text-sm sm:text-lg mt-1">Submit your ownership request</p>
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
        <div className="p-4 sm:p-6 overflow-y-auto">
          
          {/* CONFIRMATION SCREEN */}
          {isConfirming ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">❓</div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h2>
              <p className="text-slate-600 mb-6">Do you want to submit this claim request?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsConfirming(false)} 
                  className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  No
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="flex-1 py-2 rounded-lg bg-[#2B3A74] text-white font-bold hover:bg-[#184C73]"
                >
                  {loading ? "Submitting..." : "Yes"}
                </button>
              </div>
            </div>
          ) : submitted ? (
            /* SUCCESS SCREEN */
            <div className="text-center py-10">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="font-black text-slate-800 uppercase tracking-widest">Claim Submitted</h2>
              <p className="text-xs text-slate-400 mt-2">Your request is now under review</p>
              <button
                onClick={onClose}
                className="mt-6 bg-[#2D366D] text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:opacity-90"
              >
                Done
              </button>
            </div>
          ) : (
            /* FORM SCREEN */
            <form onSubmit={(e) => { e.preventDefault(); setIsConfirming(true); }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">First Name</label>
                  <input type="text" placeholder="Juan" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20" required />
                </div>
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Last Name</label>
                  <input type="text" placeholder="Dela Cruz" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20" required />
                </div>
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Contact Number</label>
                  <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden focus-within:border-[#2B3A74] focus-within:ring-2 focus-within:ring-[#2B3A74]/20">
                    <span className="px-4 py-3 bg-slate-100 text-base sm:text-lg text-slate-600 border-r border-slate-300">+63</span>
                    <input type="tel" placeholder="9942512578" value={form.claimant_contact} onChange={(e) => set("claimant_contact", e.target.value.replace(/\D/g, "").slice(0, 10))} className="w-full px-4 py-3 text-base sm:text-lg outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Email</label>
                  <input type="email" placeholder="juandelacruz@slc-sflu.edu.ph" value={form.claimant_email} onChange={(e) => set("claimant_email", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20" required />
                </div>
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Claim Date</label>
                  <input type="date" min={today} value={form.meeting_date} onChange={(e) => set("meeting_date", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20" required />
                </div>
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Claim Time</label>
                  <select value={form.meeting_time} onChange={(e) => set("meeting_time", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20" required>
                    <option value="">Select time</option>
                    {claimTimeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Reason / Details</label>
                <textarea rows={4} value={form.proof_description} onChange={(e) => set("proof_description", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20 resize-none" required />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 uppercase tracking-wide">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-[#2B3A74] text-white font-bold hover:bg-[#184C73] uppercase tracking-wide">Submit</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;