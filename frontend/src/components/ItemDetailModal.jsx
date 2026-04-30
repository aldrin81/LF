import React from 'react';

const ItemDetailModal = ({ item, onClaim, onClose }) => {
  const imageUrl = item.image
    ? item.image.startsWith('http') ? item.image : `http://localhost:8000${item.image}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center px-7 py-5 border-b">
          <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">Item Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
        </div>
        <div className="p-7 space-y-4 font-sans">
          {imageUrl && (
            <img src={imageUrl} alt={item.name} className="w-full h-44 object-cover rounded-2xl" />
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
};

export default ItemDetailModal;
