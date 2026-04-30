import React, { useState, useEffect, use } from 'react';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import { getItems } from '../api/api';

// Components
import ReportLostModal from '../components/ReportLostModal';
import ItemDetailModal from '../components/ItemDetailModal';
import ClaimModal from '../components/ClaimModal';

const statusStyle = (s) =>
  s === 'Pending'   ? 'bg-orange-100 text-orange-500' :
  s === 'Approved'  ? 'bg-green-100 text-green-600'   :
  s === 'Available' ? 'bg-blue-100 text-blue-500'     :
  s === 'Claimed'   ? 'bg-purple-100 text-purple-500' :
  'bg-slate-100 text-slate-400';

const PublicBoard = ({ onOpenLogin }) => {
  const [reportedItems, setReportedItems] = useState([]);
  const [filter,      setFilter]      = useState('All');
  const [claimItem,   setClaimItem]   = useState(null);
  const [detailItem,  setDetailItem]  = useState(null);
  const [showReport,  setShowReport]  = useState(false);

  useEffect(() => {
      fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const response = await getItems();
      setReportedItems(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  const filteredItems = reportedItems.filter(item => {
    if (filter === 'All') return true;
    return item.type?.toLowerCase() === filter.toLowerCase();
  });

  function toTitleCase(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

  const approvedItems = filteredItems.filter(item => item.status === 'Approved');

  return (
    <div className="min-h-screen bg-[#F4F7FE]">
      {/* Header */}
      <header className="w-full bg-[#2D366D] px-4 sm:px-8 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-white font-serif italic font-bold text-lg xl:text-xl tracking-tight">Saint Louis College</h1>
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
                {approvedItems.length > 0 ? (
                approvedItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-400 font-bold">L{item.id}</td>
                    <td className="p-4 font-black text-slate-700 flex items-center gap-2">
                      {toTitleCase(item.title)}
                    </td>
                    <td className="p-4 text-slate-500">{toTitleCase(item.category)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${item.type?.toLowerCase() === 'lost' ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
                        {toTitleCase(item.type)}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{toTitleCase(item.location)}</td>
                    <td className="p-4 text-slate-400 text-center">
                      <span className="block">{item.created_date}</span>
                      <span className="block">{item.created_time}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${toTitleCase(statusStyle(item.status))}`}>{item.status}</span>
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
                ))) : (
                  <tr><td colSpan={8} className="py-16 text-center text-slate-300 italic text-sm">No items found.</td></tr>
                )}
                {filteredItems.length === 0 && (
                  <tr><td colSpan={8} className="py-16 text-center text-slate-300 italic text-sm">No items found.</td></tr>
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

export default PublicBoard;
