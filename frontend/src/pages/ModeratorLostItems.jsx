import React, { useState } from 'react';
import { Eye, X, CheckCircle, Clock } from 'lucide-react';

// Format a date string + time into readable display
const formatDateTime = (date, time) => {
  if (!date) return '—';
  return time ? `${date} · ${time}` : date;
};

const ModeratorLostItems = ({ currentFilter }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const lostData = [
    {
      id: '23100329',
      name: 'Pink na Tumbler',
      cat: 'Personal Items',
      date: '11-08-25',
      time: '08:42 AM',
      status: 'Pending',
      img: new URL('../assets/pinktumb.jpg', import.meta.url).href,
      contact: '09123456789',
      desc: 'Pink tumbler with holder and rubber case at the bottom',
      area: 'Canteen',
    },
    {
      id: '23100330',
      name: 'Luxury Watch',
      cat: 'Accessories',
      date: '11-08-25',
      time: '01:15 PM',
      status: 'Pending',
      img: new URL('../assets/luxurywatch.jfif', import.meta.url).href,
      contact: '09987654321',
      desc: 'Silver watch found near the gym entrance.',
      area: 'Gym Entrance',
    },
    {
      id: '23100450',
      name: 'Purse',
      cat: 'Personal Items',
      date: '11-09-25',
      time: '10:30 AM',
      status: 'Approved',
      img: new URL('../assets/purse.jfif', import.meta.url).href,
      contact: '09112223344',
      desc: 'small purse',
      area: 'Parking Lot',
      approvedBy: 'Moderator Marie',
      approvedDate: '11-10-25',
      approvedTime: '09:00 AM',
    },
  ];

  const filteredItems =
    currentFilter === 'All Items'
      ? lostData
      : lostData.filter((item) => item.status === currentFilter);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            {/* ── Image — taller on desktop ── */}
            <div className="relative mb-4 overflow-hidden rounded-2xl h-52 sm:h-64 bg-slate-100">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 right-3 text-white text-[8px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-lg ${
                  item.status === 'Approved' ? 'bg-[#22C55E]' : 'bg-orange-400'
                }`}
              >
                {item.status === 'Approved' && <CheckCircle size={10} />}
                {item.status}
              </span>

              {/* Time badge bottom-left */}
              <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock size={9} />
                {item.time}
              </span>
            </div>

            <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">{item.name}</h4>

            <div className="grid grid-cols-2 gap-2 mt-3 mb-1">
              <div>
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Category</p>
                <p className="text-[10px] font-bold text-slate-600">{item.cat}</p>
              </div>
              <div>
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Area</p>
                <p className="text-[10px] font-bold text-slate-600">{item.area}</p>
              </div>
              <div>
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Date</p>
                <p className="text-[10px] font-bold text-slate-600">{item.date}</p>
              </div>
              <div>
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Time</p>
                <p className="text-[10px] font-bold text-slate-600">{item.time}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedItem(item)}
                className="flex-1 bg-[#00BFFF] hover:bg-sky-400 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center space-x-1 transition-all active:scale-95"
              >
                <Eye size={14} strokeWidth={3} />
                <span>{item.status === 'Pending' ? 'View More' : 'View Details'}</span>
              </button>

              {item.status === 'Pending' && (
                <button className="flex-1 bg-[#FF6B6B] hover:bg-red-400 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95">
                  Decline
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-bold italic text-sm">
              No items found for &quot;{currentFilter}&quot;.
            </p>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="flex justify-between items-center px-8 py-5 border-b">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest italic">
                Item Details
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8 space-y-5 overflow-y-auto max-h-[80vh]">
              {/* Larger modal image */}
              <img
                src={selectedItem.img}
                className="w-full h-72 object-cover rounded-[2rem] shadow-md"
                alt="Preview"
              />

              <div>
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Item Name</p>
                <h4 className="font-black text-[#2D366D] text-xl uppercase tracking-tighter italic">
                  {selectedItem.name}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
                {[
                  ['Student ID',    selectedItem.id],
                  ['Date Reported', selectedItem.date],
                  ['Time Reported', selectedItem.time],
                  ['Category',      selectedItem.cat],
                  ['Area Found',    selectedItem.area],
                  ['Contact',       selectedItem.contact],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Description</p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium bg-blue-50/30 p-4 rounded-2xl italic border border-blue-50">
                  &quot;{selectedItem.desc}&quot;
                </p>
              </div>

              {selectedItem.status === 'Approved' && (
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center space-x-4">
                  <div className="bg-green-500 p-2 rounded-xl text-white shadow-sm">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-tight">
                      Item Approved &amp; Posted
                    </p>
                    <p className="text-[9px] text-green-600/70 font-bold uppercase tracking-tighter">
                      By: {selectedItem.approvedBy} · {selectedItem.approvedDate} {selectedItem.approvedTime && `· ${selectedItem.approvedTime}`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {selectedItem.status === 'Pending' ? (
                  <>
                    <button className="flex-1 bg-[#22C55E] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95">
                      Approve Item
                    </button>
                    <button className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-red-400 transition-all active:scale-95">
                      Decline
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 bg-[#00BFFF] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-sky-400 shadow-lg shadow-blue-100 transition-all active:scale-95">
                      Mark as Claimed
                    </button>
                    <button className="flex-1 bg-red-50 text-red-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-100 transition-all active:scale-95 border border-red-100">
                      Remove Item
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorLostItems;