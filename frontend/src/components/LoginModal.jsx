import React, { useState } from 'react';

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

export default LoginModal;
