import React, { useState, useEffect } from 'react';
import { Eye, X, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { getItems, API_URL, editLostItem } from '../api/api';

const ModeratorLostItems = ({ currentFilter = 'All Items' }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Added only the absolute necessary states to control the new modals safely
  const [activeConfirmation, setActiveConfirmation] = useState(null); 
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      const actualData = Array.isArray(data) ? data : (data.results || []);
      const pendingLostItems = actualData.filter((item) => {
        return item.status === 'Pending' && item.type === 'Lost';
      });

      setItems(pendingLostItems);

    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Main status function body remains functionally unmodified
  const handleUpdateStatus = async (item, status = 'Approved') => {
    try {
      // Since the backend now supports partial=True, we only send what changed
      await editLostItem(item.id, { status: status });
      
      setNotificationMessage("Item approved.");
      setSelectedItem(null);
      await fetchData(); 

    } catch (error) {
      console.error(`Error updating status to ${status}:`, error.response?.data || error.message);
      const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      setNotificationMessage(`Update failed: ${msg}`);
    }
  };

  // Main delete function body remains functionally unmodified
  const handleDelete = async (id) => {
    try {
      // Assuming updateLostItem can be used for declining by setting status to 'Archived' or similar
      await editLostItem(id, { status: 'Archived' }); 
      setNotificationMessage("Item declined.");
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    const first = Array.isArray(img) ? img[0] : img;
    if (!first) return null;
    const path = typeof first === 'string' ? first : (first.image || first.file || first.url);
    if (!path) return null;
    return path.startsWith('http') ? path : `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  const filteredItems = items.filter(item => {
    if (currentFilter === 'All Items') return true;
    return item.status === currentFilter;
  });

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase italic tracking-widest">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const imageUrl = getImageUrl(item.image || item.images || item.file);
          
          return (
            <div
              key={item.id}
              className="group bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative mb-4 overflow-hidden rounded-2xl h-52 sm:h-64 bg-slate-50">
                <img
                  src={imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                  alt="Item Picture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-3 right-3 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md ${
                    item.status === 'Approved' ? 'bg-[#2c3e75]' : 'bg-amber-500'
                  }`}
                >
                  {item.status === 'Approved' && <CheckCircle size={12} />}
                  {item.status}
                </span>

                <span className="absolute bottom-3 left-3 bg-[#2c3e75]/80 backdrop-blur-md text-white text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Clock size={12} />
                  {item.created_time || '—'}
                </span>
              </div>

              <h4 className="font-black text-[#2c3e75] uppercase text-md tracking-tight mb-3 truncate">{item.title}</h4>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
                {[
                  { label: 'Category', val: item.category },
                  { label: 'Area', val: item.location },
                  { label: 'Date', val: item.created_date },
                ].map((info, idx) => (
                  <div key={idx}>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{info.label}</p>
                    <p className="text-[13px] font-bold text-slate-600 truncate">{info.val || '—'}</p>
                  </div>
                ))}
              </div>

              {/* Fixed equal size distribution button row */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex-1 bg-[#2c3e75] hover:bg-[#1e2b54] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-slate-100"
                >
                  <Eye size={14} strokeWidth={3} />
                  {item.status === 'Pending' ? 'Review' : 'Details'}
                </button>

                <button 
                  onClick={() => setActiveConfirmation({
                    text: "Are you sure you want to decline this item listing?",
                    action: () => handleDelete(item.id)
                  })}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest transition-all rounded-xl py-3"
                >
                  Decline
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic text-sm">
            No items found for "{currentFilter}".
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#2c3e75]/40 backdrop-blur-xs"
            onClick={() => setSelectedItem(null)}
          />
          
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-[#2c3e75] uppercase text-xs tracking-widest italic">
                Moderator Review
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-[#2c3e75] bg-white shadow-xs p-2 rounded-full transition-all border border-slate-200/60"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
              <img
                src={getImageUrl(selectedItem.image || selectedItem.file) || "https://via.placeholder.com/400x300?text=No+Image"}
                className="w-full h-64 object-cover rounded-[2rem] border border-slate-100 shadow-inner bg-slate-50"
                alt="Item Preview"
              />

              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Item Name</p>
                <h4 className="font-black text-[#2c3e75] text-2xl uppercase tracking-tighter italic">
                  {selectedItem.title}
                </h4>
              </div>

              {/* Banner color blocks matching theme */}
              <div className="grid grid-cols-2 gap-4 bg-[#2c3e75]/5 p-6 rounded-[2rem] border border-[#2c3e75]/10">
                {[
                  ['Student ID', selectedItem.id],
                  ['Contact', selectedItem.poster_contact],
                  ['Area Found', selectedItem.location],
                  ['Category', selectedItem.category],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
                    <p className="text-xs font-bold text-[#2c3e75] mt-0.5">{value || '—'}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Description</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl italic border border-slate-200/60">
                  "{selectedItem.description || 'No description provided.'}"
                </p>
              </div>

              {/* Approval Info Banner */}
              {selectedItem.status === 'Approved' && (
                <div className="bg-[#2c3e75]/10 border border-[#2c3e75]/20 p-4 rounded-2xl flex items-center gap-4">
                  <div className="bg-[#2c3e75] p-2 rounded-xl text-white shadow-md">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#2c3e75] uppercase">Item Publicly Visible</p>
                    <p className="text-[10px] text-[#2c3e75]/80 font-bold uppercase">
                      This item has been approved and is now visible to users.
                    </p>
                  </div>
                </div>
              )}

              {/* Inner Modal Button sizing fixed to match */}
              <div className="flex gap-3 pt-2 w-full">
                {selectedItem.status === 'Pending' ? (
                  <>
                    <button 
                      onClick={() => setActiveConfirmation({
                        text: "Are you sure you want to approve this item?",
                        action: () => handleUpdateStatus(selectedItem, 'Approved')
                      })}
                      className="flex-1 bg-[#2c3e75] text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#1e2b54] transition-all shadow-lg shadow-slate-100"
                    >
                      Approve Item
                    </button>
                    <button 
                      onClick={() => setActiveConfirmation({
                        text: "Are you sure you want to decline this item?",
                        action: () => handleDelete(selectedItem.id)
                      })}
                      className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <>
                    {selectedItem.status === 'Approved' && (
                       <button 
                        onClick={() => setActiveConfirmation({
                          text: "Are you sure you want to change this item's status to Claimed?",
                          action: () => handleUpdateStatus(selectedItem, 'Claimed')
                        })}
                        className="flex-1 bg-[#2c3e75] text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#1e2b54] transition-all"
                      >
                        Mark Claimed
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW SYSTEM: Confirmation Overlay matching your exact branding */}
      {activeConfirmation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#2c3e75]/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-slate-100 text-center">
            <h5 className="font-black text-[#2c3e75] uppercase text-xs tracking-widest mb-2">System Confirmation</h5>
            <p className="text-xs text-slate-500 font-medium px-2 mb-6 leading-relaxed">{activeConfirmation.text}</p>
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => setActiveConfirmation(null)} 
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold py-3 rounded-xl text-[11px] uppercase tracking-wider transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  activeConfirmation.action();
                  setActiveConfirmation(null);
                }} 
                className="flex-1 bg-[#2c3e75] hover:bg-[#1e2b54] text-white font-extrabold py-3 rounded-xl text-[11px] uppercase tracking-wider transition shadow-md shadow-slate-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW SYSTEM: Status Alert Overlay matching your exact branding */}
      {notificationMessage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#2c3e75]/20">
          <div className="bg-[#2c3e75] text-white w-full max-w-xs rounded-2xl p-5 shadow-2xl border border-[#1e2b54] text-center">
            <p className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-100">{notificationMessage}</p>
            <button 
              onClick={() => setNotificationMessage(null)} 
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorLostItems;