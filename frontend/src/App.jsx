import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';

import Dashboard          from './pages/Dashboard';
import LostItems          from './pages/LostItems';
import FoundItems         from './pages/FoundItems';
import Users              from './pages/Users';
import Reports            from './pages/Reports';
import ModeratorLostItems from './pages/ModeratorLostItems';
import ClaimRequests      from './pages/ClaimRequests';

// ─── Global shared input/label styles ────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    .inp {
      width: 100%;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 13px;
      font-family: sans-serif;
      font-weight: 600;
      outline: none;
      color: #1e293b;
      transition: border-color 0.2s;
    }
    .inp:focus { border-color: #2D366D; }
    .label {
      display: block;
      font-size: 9px;
      font-family: sans-serif;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #94a3b8;
      margin-bottom: 5px;
    }
  `}</style>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const AREAS = ['Canteen','Library','Parking Lot','SAO Waiting Area','Main Building','Gym'];
const CATS  = ['Personal','Electronics','Accessories','Cash/Cards'];

const statusStyle = (s) =>
  s === 'Pending'   ? 'bg-orange-100 text-orange-500' :
  s === 'Approved'  ? 'bg-green-100 text-green-600'   :
  s === 'Available' ? 'bg-blue-100 text-blue-500'     :
  s === 'Claimed'   ? 'bg-purple-100 text-purple-500' :
  'bg-slate-100 text-slate-400';

// ─── Photo Upload helper (public forms) ──────────────────────────────────────
const PhotoUpload = ({ value, onChange }) => {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label className="label">Photo (optional)</label>
      {value ? (
        <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500 transition-all">✕</button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current.click()}
          className="w-full h-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-[#2D366D]/40 hover:text-[#2D366D] transition-all text-xs font-black uppercase tracking-widest font-sans">
          📷 Upload Photo
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

// ─── Report Lost Item Modal (public) ─────────────────────────────────────────
// Lets a visitor submit their own lost item report directly from the public board.
const ReportLostModal = ({ onClose }) => {
  const { addLostItem } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', cat: 'Personal', reporter: '', area: 'Canteen',
    date: '', time: '', desc: '', photo: null,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addLostItem(form);   // persists into AppContext — visible to admins immediately
    setSubmitted(true);
  };

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

            {/* Info banner */}
            <div className="mx-7 mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-blue-700 text-[10px] font-black uppercase tracking-wide font-sans mb-1">ℹ How This Works</p>
              <p className="text-blue-600 text-[10px] font-sans leading-relaxed">
                Once submitted, your report appears on the public board. If someone finds it, they can turn it in to the SAO. Staff will contact you using the details you provide.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-7 space-y-4">
              {/* Item name + reporter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Item Name *</label>
                  <input className="inp" value={form.name} onChange={e=>set('name',e.target.value)}
                    placeholder="e.g. Black Wallet" required />
                </div>
                <div>
                  <label className="label">Your Full Name *</label>
                  <input className="inp" value={form.reporter} onChange={e=>set('reporter',e.target.value)}
                    placeholder="e.g. Juan Dela Cruz" required />
                </div>
              </div>

              {/* Category + Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select className="inp" value={form.cat} onChange={e=>set('cat',e.target.value)}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Where Was It Lost? *</label>
                  <select className="inp" value={form.area} onChange={e=>set('area',e.target.value)}>
                    {AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Date Lost *</label>
                  <input className="inp" type="date" value={form.date} onChange={e=>set('date',e.target.value)} required />
                </div>
                <div>
                  <label className="label">Approximate Time</label>
                  <input className="inp" type="time" value={form.time} onChange={e=>set('time',e.target.value)} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label">Description *</label>
                <textarea className="inp resize-none" rows={3} value={form.desc} onChange={e=>set('desc',e.target.value)}
                  placeholder="Color, brand, distinguishing marks, what was inside... the more detail the better."
                  required />
              </div>

              {/* Photo */}
              <PhotoUpload value={form.photo} onChange={v => set('photo', v)} />

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

// ─── Claim Modal (public) ─────────────────────────────────────────────────────
// Submits a claim request that goes directly into AppContext claimRequests,
// making it immediately visible on the moderator's Claim Requests page.
const ClaimModal = ({ item, onClose }) => {
  const { submitClaimRequest } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ claimantName: '', claimantId: '', claimantContact: '', note: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    submitClaimRequest({
      itemId:    item.id,
      itemType:  item.type,   // 'Lost' or 'Found' from public board
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

// ─── Login Modal ──────────────────────────────────────────────────────────────
const LoginModal = ({ onLogin, onClose }) => {
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const u = e.target.username.value.trim();
    const p = e.target.password.value.trim();
    if (u === 'admin' && p === 'admin123') onLogin('Admin');
    else if (u === 'moderator' && p === 'moderator123') onLogin('Moderator');
    else setError('Invalid credentials. Please try again.');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="font-black text-3xl uppercase tracking-tighter italic text-[#2D366D]">Seek &amp; Balik</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 font-sans">Staff &amp; Moderator Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-xs text-center font-bold font-sans">{error}</p>}
          <div><label className="label">Username</label><input name="username" type="text" className="inp" placeholder="Username" required /></div>
          <div><label className="label">Password</label><input name="password" type="password" className="inp" placeholder="Password" required /></div>
          <button type="submit" className="w-full bg-[#2D366D] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all font-sans">Login</button>
        </form>
        <button onClick={onClose} className="w-full text-center mt-4 text-slate-400 text-[11px] font-bold font-sans hover:text-slate-600 transition-colors">Cancel</button>
      </div>
    </div>
  );
};

// ─── Item Detail Modal (public view) ─────────────────────────────────────────
const ItemDetailModal = ({ item, onClaim, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center px-7 py-5 border-b">
        <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">Item Details</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
      </div>
      <div className="p-7 space-y-4 font-sans">
        {item.photo && (
          <img src={item.photo} alt={item.name} className="w-full h-44 object-cover rounded-2xl" />
        )}
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Item Name</p>
          <p className="font-black text-[#2D366D] text-xl uppercase italic">{item.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-4 text-[10px]">
          {[
            ['ID', item.id],
            ['Type', item.type],
            ['Category', item.cat],
            ['Date', item.date],
            ['Time', item.time || '—'],
            ['Status', item.status],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{l}</p>
              <p className="font-bold text-slate-700 mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        {item.desc && (
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Description</p>
            <p className="text-[11px] text-slate-500 italic bg-blue-50/40 p-4 rounded-2xl border border-blue-50">"{item.desc}"</p>
          </div>
        )}
        <div className="flex gap-3 pt-1">
          {item.status !== 'Claimed' && (
            <button onClick={() => { onClose(); onClaim(item); }}
              className="flex-1 bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all">
              Claim This Item
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Public Landing Board ─────────────────────────────────────────────────────
const PublicBoard = ({ onOpenLogin }) => {
  const { lostItems, foundItems } = useApp();
  const [filter,      setFilter]      = useState('All');
  const [claimItem,   setClaimItem]   = useState(null);
  const [detailItem,  setDetailItem]  = useState(null);
  const [showReport,  setShowReport]  = useState(false);

  // Build the public listing from live AppContext data
  const allItems = [
    ...lostItems.map(i => ({
      id: i.id, name: i.name, cat: i.cat, type: 'Lost',
      date: i.date, time: i.time || '', status: i.status,
      desc: i.desc, photo: i.photo,
    })),
    ...foundItems.map(i => ({
      id: i.id, name: i.name, cat: i.cat, type: 'Found',
      date: i.date, time: i.time || '', status: i.status,
      desc: i.desc, photo: i.photo,
    })),
  ];

  const items = filter === 'All' ? allItems : allItems.filter(i => i.type === filter);

  return (
    <div className="min-h-screen bg-[#F4F7FE]">
      {/* Header */}
      <header className="w-full bg-[#2D366D] px-4 sm:px-8 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-white font-serif italic font-bold text-lg sm:text-xl tracking-tight">Saint Louis College</h1>
          <p className="text-white/50 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] mt-0.5 font-sans">Seek &amp; Balik — Lost &amp; Found</p>
        </div>
        <button onClick={onOpenLogin}
          className="bg-white/15 hover:bg-white/25 border border-white/30 text-white px-3 sm:px-5 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all font-sans">
          Staff Login
        </button>
      </header>

      {/* Hero */}
      <div className="bg-[#2D366D] pb-12 pt-6 text-center px-4">
        <h2 className="text-white font-black text-sm uppercase tracking-[0.25em] font-sans">Lost &amp; Found Board</h2>
        <p className="text-white/50 text-[10px] font-sans italic mt-1">Browse reported items · claim what's yours · report what you lost</p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">
          <button onClick={() => setShowReport(true)}
            className="bg-white text-[#2D366D] px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all shadow-lg font-sans">
            📋 Report a Lost Item
          </button>
          <button onClick={() => setFilter('Found')}
            className="bg-white/15 border border-white/30 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/25 transition-all font-sans">
            🔍 Browse Found Items
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="px-4 sm:px-8 -mt-5 pb-16">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 font-sans">Item Listings</h3>
              <p className="text-[10px] text-slate-400 font-sans italic mt-0.5">Find your lost item and submit a claim, or report a new one</p>
            </div>
            <div className="flex gap-2">
              {['All','Lost','Found'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest font-sans transition-all ${
                    filter === f ? 'bg-[#2D366D] text-white border-[#2D366D]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                  }`}>{f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-sans min-w-[540px]">
              <thead className="bg-slate-50 text-slate-400 font-black uppercase border-b text-[9px] tracking-widest">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Item Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-center">Date</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-400 font-bold">{item.id}</td>
                    <td className="p-4 font-black text-slate-700 flex items-center gap-2">
                      {item.photo && <img src={item.photo} alt="" className="w-7 h-7 rounded-md object-cover flex-shrink-0" />}
                      {item.name}
                    </td>
                    <td className="p-4 text-slate-500">{item.cat}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${item.type === 'Lost' ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-center">
                      <span className="block">{item.date}</span>
                      {item.time && <span className="text-[9px] text-slate-300">{item.time}</span>}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${statusStyle(item.status)}`}>{item.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => setDetailItem(item)}
                          className="border border-slate-200 text-slate-500 hover:border-[#2D366D] hover:text-[#2D366D] px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all font-sans">
                          View
                        </button>
                        {item.status === 'Claimed' ? (
                          <span className="text-[9px] font-black uppercase text-slate-300 font-sans px-3 py-1.5">Unavailable</span>
                        ) : (
                          <button onClick={() => setClaimItem(item)}
                            className="bg-[#2D366D] hover:opacity-80 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 font-sans">
                            Claim
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} className="py-16 text-center text-slate-300 italic text-sm">No items found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showReport  && <ReportLostModal onClose={() => setShowReport(false)} />}
      {detailItem  && <ItemDetailModal item={detailItem} onClaim={setClaimItem} onClose={() => setDetailItem(null)} />}
      {claimItem   && <ClaimModal item={claimItem} onClose={() => setClaimItem(null)} />}
    </div>
  );
};

// ─── Live Clock Hook ──────────────────────────────────────────────────────────
const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return {
    time: now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    date: `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
  };
};

// ─── Staff Mobile Nav ─────────────────────────────────────────────────────────
const MobileNav = ({ currentPage, setCurrentPage, role, onLogout }) => {
  const { pendingClaimsCount } = useApp();
  const items = [
    { id: 'Dashboard',      label: 'Home',   emoji: '◼' },
    { id: 'Lost Items',     label: 'Lost',   emoji: '◈' },
    { id: 'Found Items',    label: 'Found',  emoji: '◈' },
    { id: 'Claim Requests', label: 'Claims', emoji: '🔔' },
    ...(role === 'Admin' ? [{ id: 'Users', label: 'Users', emoji: '◉' }] : []),
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 flex sm:hidden">
      {items.map(item => (
        <button key={item.id} onClick={() => setCurrentPage(item.id)}
          className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-[8px] font-black uppercase tracking-wide transition-colors relative ${
            currentPage === item.id ? 'text-[#2D366D]' : 'text-slate-400'
          }`}>
          <span className="text-base leading-none">{item.emoji}</span>
          {item.label}
          {item.id === 'Claim Requests' && pendingClaimsCount > 0 && (
            <span className="absolute top-1.5 right-2 bg-orange-400 text-white text-[7px] rounded-full w-4 h-4 flex items-center justify-center font-black">
              {pendingClaimsCount > 9 ? '9+' : pendingClaimsCount}
            </span>
          )}
        </button>
      ))}
      <button onClick={onLogout} className="flex-1 flex flex-col items-center py-3 gap-0.5 text-[8px] font-black uppercase tracking-wide text-red-400">
        <span className="text-base leading-none">↩</span>
        Logout
      </button>
    </nav>
  );
};

// ─── Main App Inner ───────────────────────────────────────────────────────────
const AppInner = () => {
  const { time, date } = useClock();
  const { pendingClaimsCount } = useApp();
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [userRole,    setUserRole]    = useState('');
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modFilter,   setModFilter]   = useState('All Items');
  const [showLogin,   setShowLogin]   = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (page === 'Lost Items') setModFilter('All Items');
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setShowLogin(false);
    setCurrentPage('Dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setShowLogin(false);
  };

  // PUBLIC LANDING
  if (!isLoggedIn) {
    return (
      <>
        <PublicBoard onOpenLogin={() => setShowLogin(true)} />
        {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  // STAFF DASHBOARD
  const pageTitle =
    currentPage === 'Lost Items' && userRole === 'Moderator'
      ? (modFilter === 'All Items' ? 'All Lost Items' : `${modFilter} Lost Items`)
      : currentPage;

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans text-slate-700">

      {/* Top header */}
      <header className="w-full bg-[#2D366D] flex items-center justify-center text-center text-white z-30 shadow-md py-4 sm:py-0 sm:h-28 flex-shrink-0">
        <div>
          <h1 className="text-xl sm:text-3xl font-serif italic font-bold tracking-tight">Saint Louis College</h1>
          <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.5em] opacity-70 mt-1">San Fernando City, La Union</p>
          <p className="hidden sm:block text-[11px] italic mt-2 opacity-90 font-light">"The Beacon of Wisdom in the North"</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — desktop only */}
        <div className="hidden sm:block flex-shrink-0">
          <Sidebar
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
            role={userRole}
            onLogout={handleLogout}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>

        <div className="flex-1 flex flex-col bg-[#F4F7FE] overflow-hidden">

          {/* Sub-header */}
          <div className="bg-white border-b px-4 sm:px-10 py-4 sm:py-6 flex justify-between items-center shadow-sm flex-shrink-0">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tighter uppercase italic flex items-center gap-3">
                {pageTitle}
                {currentPage === 'Claim Requests' && pendingClaimsCount > 0 && (
                  <span className="bg-orange-400 text-white text-[9px] font-black rounded-full px-2 py-0.5">
                    {pendingClaimsCount} pending
                  </span>
                )}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold italic">Welcome back, {userRole} Marie</p>
              <div className="hidden sm:flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#2D366D]">{time}</span>
                <span className="text-slate-300 text-[9px]">·</span>
                <span className="text-[9px] font-bold text-slate-400">{date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block">
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 outline-none focus:ring-2 focus:ring-blue-100" />
                <span className="absolute left-3 top-2.5 opacity-30 text-xs">🔍</span>
              </div>
              {currentPage === 'Lost Items' && userRole === 'Moderator' && (
                <div className="relative">
                  <select value={modFilter} onChange={e => setModFilter(e.target.value)}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-[10px] font-black tracking-widest text-slate-600 outline-none cursor-pointer hover:bg-slate-50 shadow-sm appearance-none pr-7">
                    <option value="All Items">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                  </select>
                  <span className="absolute right-2 top-2.5 pointer-events-none text-[8px]">▼</span>
                </div>
              )}
              <div className="w-9 h-9 rounded-full bg-[#2D366D] border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs overflow-hidden flex-shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marie" alt="avatar" />
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 sm:p-8 overflow-y-auto flex-1 pb-20 sm:pb-8">
            <div className="max-w-7xl mx-auto">
              {currentPage === 'Dashboard'      && <Dashboard role={userRole} onNavigate={handlePageChange} />}
              {currentPage === 'Lost Items'     && (
                userRole === 'Moderator'
                  ? <ModeratorLostItems currentFilter={modFilter} />
                  : <LostItems role={userRole} />
              )}
              {currentPage === 'Found Items'    && <FoundItems role={userRole} />}
              {currentPage === 'Claim Requests' && <ClaimRequests />}
              {currentPage === 'Reports'        && <Reports />}
              {currentPage === 'Users'          && userRole === 'Admin' && <Users />}
            </div>
          </main>
        </div>
      </div>

      <MobileNav currentPage={currentPage} setCurrentPage={handlePageChange} role={userRole} onLogout={handleLogout} />
    </div>
  );
};

const App = () => (
  <AppProvider>
    <GlobalStyles />
    <AppInner />
  </AppProvider>
);

export default App;