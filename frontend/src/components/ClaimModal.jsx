import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ClaimModal = ({ item, onClose }) => {
  const { submitClaimRequest } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ claimantName: '', claimantId: '', claimantContact: '', note: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    submitClaimRequest({
      itemId:    item.id,
      itemType:  item.type,
      itemName:  item.name,
      ...form,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 border border-slate-100 overflow-y-auto max-h-[92vh]">
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-black text-[#2D366D] text-lg uppercase tracking-tight italic">Claim Submitted!</h3>
            <p className="text-slate-400 text-xs font-sans mt-3 leading-relaxed">
              Your claim for <span className="font-bold text-slate-600">{item.name}</span> has been sent to a moderator. They'll verify your details and contact you shortly.
            </p>
            <button onClick={onClose}
              className="mt-6 w-full bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-xs font-sans hover:opacity-90 transition-all">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h3 className="font-black text-[#2D366D] text-lg uppercase tracking-tight italic">Claim Item</h3>
              <p className="text-slate-400 text-[10px] font-sans mt-1 uppercase tracking-widest font-bold">{item.name} · {item.id}</p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5">
              <p className="text-amber-700 text-[10px] font-black uppercase tracking-wide font-sans mb-1">Verification Required</p>
              <p className="text-amber-600 text-[10px] font-sans leading-relaxed">
                A moderator will review your claim before releasing the item. Describe details only the real owner would know.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input type="text" className="inp" value={form.claimantName} onChange={e=>set('claimantName',e.target.value)} placeholder="Juan Dela Cruz" required />
                </div>
                <div>
                  <label className="label">Student ID *</label>
                  <input type="text" className="inp" value={form.claimantId} onChange={e=>set('claimantId',e.target.value)} placeholder="23100329" required />
                </div>
              </div>
              <div>
                <label className="label">Contact Number *</label>
                <input type="text" className="inp" value={form.claimantContact} onChange={e=>set('claimantContact',e.target.value)} placeholder="09123456789" required />
              </div>
              <div>
                <label className="label">Describe the Item in Detail *</label>
                <textarea rows={4} className="inp resize-none" value={form.note}
                  onChange={e=>set('note',e.target.value)}
                  placeholder="Describe specific details only the real owner would know — color, brand, contents, markings..."
                  required />
              </div>
              <button type="submit"
                className="w-full bg-[#2D366D] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:opacity-90 transition-all font-sans">
                Submit Claim
              </button>
            </form>
            <button onClick={onClose}
              className="w-full text-center mt-3 text-slate-400 text-[11px] font-bold font-sans hover:text-slate-600 transition-colors">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClaimModal;
