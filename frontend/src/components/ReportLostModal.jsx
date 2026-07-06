import React, { useState } from 'react';
import PhotoUpload from './PhotoUpload';
import { createLostItem } from '../api/api';

const AREAS = ['Canteen', 'Gym', 'Highschool Grounds', 'Basement', 'Main Building', 'Sao Lobby', 'Parking Area', 'Others'];
const CATS = ['Personal', 'Accessories', 'Id', 'Electronics', 'Keys', 'Valuables'];

const ReportLostModal = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [form, setForm] = useState({
  title: "", category: "Personal", poster_name: "", email: "",
  location: AREAS[0],
  other_location: "",
  created_date: "", created_time: "", description: "", image: null,
});

  const finalLocation = form.location === "Others" ? form.other_location.trim() : form.location;

  const maxDate = new Date().toLocaleDateString('en-CA');

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm(prev => ({
    ...prev,
    [name]: value,
    ...(name === "location" && value !== "Others" ? { other_location: "" } : {}),
  }));
};

  const handleSubmit = (e) => {
  e.preventDefault();

  if (
    !form.title ||
    !form.poster_name ||
    !form.email ||
    !form.created_date ||
    (form.location === "Others" && !form.other_location.trim())
  ) {
    return;
  }

  setShowConfirm(true);
};

  const confirmSubmit = async () => {
  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    const formData = new FormData();

    const finalLocation =
      form.location === "Others"
        ? form.other_location.trim()
        : form.location;

    Object.keys(form).forEach(key => {
      if (key === "other_location") return;
      if (key === "location") return;

      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    formData.append("location", finalLocation);

    const response = await createLostItem(formData);

    setTicketCode(response.ticket_code);
    setSubmitted(true);
    setShowConfirm(false);
  } catch (err) {
    console.error(err);
    alert("Failed to submit report.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <div
          className={`bg-white w-full ${
            submitted ? "max-w-lg" : "max-w-4xl"
          } rounded-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
        >

        {submitted ? (
          <div className="w-full px-12 py-12 text-center flex flex-col items-center justify-center">
            <div className="text-6xl mb-8 animate-bounce">✅</div>

            <h3 className="font-black text-[#2D366D] text-2xl uppercase tracking-tighter italic">
              Report Filed
            </h3>

            <p className="text-slate-500 text-md font-sans mt-7 leading-relaxed max-w-md">
              Your report is now in our registry. Updates will be sent to{" "}
              <b>{form.email}</b>.
            </p>

            <p className="text-slate-500 text-md font-sans mt-5 leading-relaxed max-w-md">
              Your ticket number is: <b>{ticketCode}</b>
            </p>

            <button
              onClick={onClose}
              className="mt-10 w-72 bg-[#2D366D] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all"
            >
              Return to Board
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-[#0B6FA4] text-white px-5 py-4 flex justify-between items-start">

  <div>
    <h2 className="text-3xl font-bold">
      Report Lost Item
    </h2>

    <p className="text-blue-100 text-lg mt-1">
      Submit details of your lost item
    </p>
  </div>

  <button
    onClick={onClose}
    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
  >
    ✕
  </button>

</div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Item Name *</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                    name="title" value={form.title} onChange={handleChange} placeholder="e.g. Blue Hydroflask" required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Owner Name *</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                    name="poster_name" value={form.poster_name} onChange={handleChange} placeholder="Full Name" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Contact Email *</label>
                <input className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                  type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@slc.edu.ph" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Category *</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                    name="category" value={form.category} onChange={handleChange}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Location Lost *</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                    name="location" value={form.location} onChange={handleChange}>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <input
                    className="w-full mt-3 px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    name="other_location"
                    value={form.other_location}
                    onChange={handleChange}
                    placeholder="Please specify location"
                    disabled={form.location !== "Others"}
                    required={form.location === "Others"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Date Lost *</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                    type="date" name="created_date" value={form.created_date} onChange={handleChange} max={maxDate} required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Approx. Time</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                    type="time" name="created_time" value={form.created_time} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Description *</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xl text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#2D366D] focus:ring-4 focus:ring-slate-200"
                  rows={3} name="description" value={form.description} onChange={handleChange}
                  placeholder="Mention unique marks, brand, stickers..." required />
              </div>

              <PhotoUpload name="image" value={form.image} onChange={handleChange} />

              <div className="flex gap-4 pt-4">

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-[#E3E8F0] text-[#64748B] text-base font-bold uppercase tracking-wide transition duration-200 hover:bg-[#D5DDE8]"
                >
                  Cancel
                </button>
                              <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] text-white text-base font-semibold uppercase tracking-wide shadow-md transition-all duration-200 hover:from-[#44509B] hover:to-[#2D366D] hover:shadow-lg active:scale-[0.98]"
                >
                  Submit 
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* REFINED CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] bg-[#2D366D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[32px] w-full max-w-xs text-center shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-blue-50 text-[#2D366D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📁</div>
            <h3 className="font-black text-[#2D366D] uppercase tracking-tight italic text-lg">Confirm Report?</h3>
            <p className="text-[11px] mt-3 text-slate-500 leading-relaxed font-medium">
              Please double check the details. Once submitted, this record will be verified by the SAO.
            </p>
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#2D366D] disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#1a214d] transition-all"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Now"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all disabled:cursor-not-allowed disabled:opacity-60"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportLostModal;