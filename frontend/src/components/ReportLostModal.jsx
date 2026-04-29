import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PhotoUpload from './PhotoUpload';
import axios from 'axios';
import { createLostItem } from '../api/api';

const AREAS = ['Canteen','Library','Parking Lot','SAO Waiting Area','Main Building','Gym'];
const CATS  = ['Personal','Electronics','Accessories','Cash/Cards'];

const ReportLostModal = ({ onClose }) => {
  const [report, setReport] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "", category: "", poster_name: "", location: "",
    created_date: "", created_time: "", description: "", image: null,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await createLostItem(form);
      window.alert(`Item ${data.title} reported successfully!`);
    } catch (error) {
      console.error(error);
      window.alert('Failed to report item. Please try again.');
    }
  }

  function handleChange(e) {
    const {name, value} = e.target;

    setForm({...form, [name]: value});

  }
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[92vh]">

        {submitted ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-black text-[#2D366D] text-xl uppercase tracking-tight italic">Item Reported!</h3>
            <p className="text-slate-400 text-xs font-sans mt-3 leading-relaxed max-w-xs mx-auto">
              Your lost item has been posted to the board. Our staff will look for it. You'll be contacted if it's found.
            </p>
            <button onClick={onClose}
              className="mt-6 w-full bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all font-sans">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center px-7 py-5 border-b">
              <div>
                <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">Report a Lost Item</h3>
                <p className="text-[9px] text-slate-400 font-sans mt-0.5">Fill in as much detail as possible</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
            </div>

            <div className="mx-7 mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-blue-700 text-[10px] font-black uppercase tracking-wide font-sans mb-1">ℹ How This Works</p>
              <p className="text-blue-600 text-[10px] font-sans leading-relaxed">
                Once submitted, your report appears on the public board. If someone finds it, they can turn it in to the SAO. Staff will contact you using the details you provide.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Item Name *</label>
                  <input className="inp" value={form.title} onChange={handleChange}
                    placeholder="e.g. Black Wallet" required />
                </div>
                <div>
                  <label className="label">Your Full Name *</label>
                  <input className="inp" value={form.poster_name} onChange={handleChange}
                    placeholder="e.g. Juan Dela Cruz" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select className="inp" value={form.category} onChange={handleChange}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Where Was It Lost? *</label>
                  <select className="inp" value={form.location} onChange={handleChange}>
                    {AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Date Lost *</label>
                  <input className="inp" type="date" value={form.created_date} onChange={handleChange} required />
                </div>
                <div>
                  <label className="label">Approximate Time</label>
                  <input className="inp" type="time" value={form.created_time} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea className="inp resize-none" rows={3} value={form.description} onChange={handleChange}
                  placeholder="Color, brand, distinguishing marks, what was inside... the more detail the better."
                  required />
              </div>

              <PhotoUpload value={form.image} onChange={handleChange} />

              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all font-sans shadow-lg">
                  Submit Report
                </button>
                <button type="button" onClick={onClose}
                  className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all font-sans">
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportLostModal;
