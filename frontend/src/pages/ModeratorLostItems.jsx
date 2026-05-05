import React, { useState, useEffect } from 'react';
import { Eye, X, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { getItems, API_URL, editLostItem } from '../api/api';

const ModeratorLostItems = ({ currentFilter = 'All Items' }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleUpdateStatus = async (item, status = 'Approved') => {
    if (!window.confirm("Are you sure you want to approve this item?")) return;
    try {
      // Since the backend now supports partial=True, we only send what changed
      await editLostItem(item.id, { status: status });
      
      window.alert("Item approved.")
      setSelectedItem(null);
      await fetchData(); 

    } catch (error) {
      console.error(`Error updating status to ${status}:`, error.response?.data || error.message);
      const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      alert(`Update failed: ${msg}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete/decline this item?")) return;
    try {
      // Assuming updateLostItem can be used for declining by setting status to 'Archived' or similar
      await editLostItem(id, { status: 'Archived' }); 
      window.alert("Item declined.")
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

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase italic">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const imageUrl = getImageUrl(item.image || item.images || item.file);
          
          return (
            <div
              key={item.id}
              className="group bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative mb-4 overflow-hidden rounded-2xl h-52 sm:h-64 bg-slate-100">
                <img
                  src={imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                  alt="Item Picture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-3 right-3 text-white text-[12px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-lg ${
                    item.status === 'Approved' ? 'bg-emerald-500' : 'bg-orange-500'
                  }`}
                >
                  {item.status === 'Approved' && <CheckCircle size={12} />}
                  {item.status}
                </span>

                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[12px] font-bold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Clock size={12} />
                  {item.created_time || '—'}
                </span>
              </div>

              <h4 className="font-black text-slate-800 uppercase text-md tracking-tight mb-3 truncate">{item.title}</h4>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
                {[
                  { label: 'Category', val: item.category },
                  { label: 'Area', val: item.location },
                  { label: 'Date', val: item.created_date },
                ].map((info, idx) => (
                  <div key={idx}>
                    <p className="text-[13px] text-slate-400 font-black uppercase tracking-widest">{info.label}</p>
                    <p className="text-[12px] font-bold text-slate-600 truncate">{info.val || '—'}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex-[2] bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-sky-100"
                >
                  <Eye size={14} strokeWidth={3} />
                  {item.status === 'Pending' ? 'Review' : 'Details'}
                </button>

                <button 
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />
          
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-8 py-6 border-b">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest italic">
                Moderator Review
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-rose-500 bg-slate-100 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
              <img
                src={getImageUrl(selectedItem.image || selectedItem.file) || "https://via.placeholder.com/400x300?text=No+Image"}
                className="w-full h-64 object-cover rounded-[2rem] shadow-inner bg-slate-100"
                alt="Item Preview"
              />

              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Item Name</p>
                <h4 className="font-black text-slate-900 text-2xl uppercase tracking-tighter italic">
                  {selectedItem.title}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                {[
                  ['Student ID', selectedItem.id],
                  ['Contact', selectedItem.poster_contact],
                  ['Area Found', selectedItem.location],
                  ['Category', selectedItem.category],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{value || '—'}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">Description</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-sky-50/50 p-5 rounded-2xl italic border border-sky-100">
                  "{selectedItem.description || 'No description provided.'}"
                </p>
              </div>

              {/* Approval Info Banner */}
              {selectedItem.status === 'Approved' && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-md">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-700 uppercase">Item Publicly Visible</p>
                    <p className="text-[9px] text-emerald-600/80 font-bold uppercase">
                      This item has been approved and is now visible to users.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {selectedItem.status === 'Pending' ? (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(selectedItem, 'Approved')}
                      className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                    >
                      Approve Item
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedItem.id)}
                      className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <>
                    {selectedItem.status === 'Approved' && (
                       <button 
                        onClick={() => handleUpdateStatus(selectedItem, 'Claimed')} 
                        className="flex-1 bg-sky-500 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-blue-100"
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
    </div>
  );
};

export default ModeratorLostItems;