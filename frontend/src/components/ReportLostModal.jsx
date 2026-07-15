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
    title: "", category: "", first_name: "", last_name: "", email: "",
    location: "",
    other_location: "",
    created_date: "", created_time: "", description: "", image: null,
  });

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
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.category ||
      !form.created_date ||
      !form.location ||
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <div
        className={`bg-white w-full ${
          submitted ? "max-w-sm" : "max-w-4xl"
        } max-h-[92vh] rounded-xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.18)] overflow-hidden flex flex-col`}
      >

        {submitted ? (
          /* SUCCESS SCREEN */
          <div className="p-4 sm:p-6 overflow-y-auto text-center py-10 flex flex-col items-center justify-center">
            <div className="text-5xl mb-3">✅</div>

            <h2 className="font-black text-slate-800 uppercase tracking-widest">
              Report Filed
            </h2>

            <p className="text-xs text-slate-400 mt-2 max-w-md">
              Your report is now in our registry. Updates will be sent to{" "}
              <b>{form.email}</b>.
            </p>

            <p className="text-xs text-slate-500 mt-4 max-w-md bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              Your ticket number is: <b className="text-slate-700">{ticketCode}</b>
            </p>

            <button
              onClick={onClose}
              className="mt-6 bg-[#2D366D] text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all"
            >
              Return to Board
            </button>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#0B648D] to-[#155F87] text-white px-4 sm:px-8 py-4 sm:py-6 border-b-4 flex justify-between items-start gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Report Lost Item
                </h2>
                <p className="text-blue-100 text-sm sm:text-lg mt-1">
                  Submit details of your lost item
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* BODY FORM */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Item Name</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                    name="title" value={form.title} onChange={handleChange} placeholder="e.g. Blue Hydroflask" required />
                </div>

                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Emai (Gsuite)</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                    type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@slc-sflu.edu.ph" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">First Name</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                      name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Last Name</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                      name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
                  </div>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Location Lost</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                    name="location" value={form.location} onChange={handleChange} required>
                    {!form.location && <option value="" disabled>Select Location</option>}
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {form.location === "Others" && (
                    <input
                      className="w-full mt-3 px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                      name="other_location"
                      value={form.other_location}
                      onChange={handleChange}
                      placeholder="Please specify location"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Category</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                    name="category" value={form.category} onChange={handleChange} required>
                    {!form.category && <option value="" disabled>Select Category</option>}
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Date Lost</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                    type="date" name="created_date" value={form.created_date} onChange={handleChange} max={maxDate} required />
                </div>
                <div>
                  <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Approx. Time</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20"
                    type="time" name="created_time" value={form.created_time} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-lg font-semibold text-slate-500 mb-2">Description *</label>
                <textarea className="w-full px-4 py-3 rounded-lg border border-slate-300 text-base sm:text-lg outline-none focus:border-[#2B3A74] focus:ring-2 focus:ring-[#2B3A74]/20 resize-none"
                  rows={4} name="description" value={form.description} onChange={handleChange}
                  placeholder="Mention unique marks, brand, stickers..." required />
              </div>

              <PhotoUpload name="image" value={form.image} onChange={handleChange} />

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 uppercase tracking-wide transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-[#2B3A74] text-white font-bold hover:bg-[#184C73] uppercase tracking-wide transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* CONFIRMATION OVERLAY */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.18)] p-4 sm:p-6 text-center">
            <div className="text-4xl mb-4">❓</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Confirm Report?</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Please double check the details. Once submitted, this record will be verified by the SAO.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Go Back
              </button>
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-lg bg-[#2B3A74] text-white font-bold hover:bg-[#184C73] disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportLostModal;