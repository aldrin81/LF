import React from 'react';
import { API_URL } from '../api/api';

const ItemDetailModal = ({ item, onClaim, onClose }) => {
  console.log("ItemDetailModal received item:", item);

  // Helper to find the image in various possible data structures
  const findImageUrl = (obj) => {
    if (!obj) return null;
    
    // 1. If it's a string, it's likely the path
    if (typeof obj === 'string') return obj;
    
    // 2. If it's an array, look at the first element
    if (Array.isArray(obj)) return findImageUrl(obj[0]);
    
    // 3. If it's an object, check common field names
    const fields = ['image', 'file', 'url', 'image_url', 'photo', 'picture', 'thumbnail', 'src'];
    for (const f of fields) {
      if (obj[f]) return findImageUrl(obj[f]);
    }
    
    return null;
  };

  // Aggressive search for image data
  const rawPath = findImageUrl(item.image || item.images || item.photo || item.picture || item.file || item.image_url || item.url || item);
  
  // Construct the full URL
  const cleanBase = API_URL.replace(/\/$/, '');
  const imageUrl = rawPath 
    ? (rawPath.startsWith('http') ? rawPath : `${cleanBase}/${rawPath.replace(/^\//, '')}`)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center px-7 py-5 border-b">
          <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">Item Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
        </div>
        <div className="p-7 space-y-4 font-sans text-center">
          
          {/* IMAGE AREA */}
          <div className="relative group">
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt={item.title || item.name} 
                  className="w-full h-48 object-cover rounded-2xl border border-slate-100 shadow-sm"
                  onError={(e) => {
                    console.error("Image failed to load:", imageUrl);
                    e.target.src = "https://via.placeholder.com/400x200?text=Image+Load+Error";
                  }}
                />
                <p className="text-[6px] text-slate-300 mt-1 truncate">{imageUrl}</p>
              </>
            ) : (
              <div className="w-full h-48 bg-slate-50 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-[10px] italic">No image data found</p>
                <p className="text-[6px] text-slate-300 mt-1 uppercase">Checked: image, photo, file, url, etc.</p>
              </div>
            )}
          </div>

          <div className="text-left">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Item Name</p>
            <p className="font-black text-[#2D366D] text-xl uppercase italic">{item.title || item.name || "Unnamed Item"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-4 text-[10px] text-left">
            {[
              ['ID', item.id],
              ['Type', item.type],
              ['Category', item.category || item.cat],
              ['Location', item.location || item.area],
              ['Date', item.created_date || item.date],
              ['Status', item.status],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{l}</p>
                <p className="font-bold text-slate-700 mt-0.5">{v || '—'}</p>
              </div>
            ))}
          </div>

          {item.description || item.desc ? (
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Description</p>
              <p className="text-[11px] text-slate-500 italic bg-blue-50/40 p-4 rounded-2xl border border-blue-50">
                "{item.description || item.desc}"
              </p>
            </div>
          ) : null}

          <div className="flex gap-3 pt-1">
            {item.status !== 'Claimed' ? (
              <button onClick={() => onClaim(item)}
              className="flex-1 bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all">
                Claim this item
              </button>
            ) : (
              <button disabled className="opacity-50 cursor-not-allowed">
                Already Claimed
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
