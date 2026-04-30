import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getItems, getItemById, API_URL } from "../api/api";
import ItemDetailModal from '../components/ItemDetailModal';


const AREAS = ['Canteen','Library','Parking Lot','SAO Waiting Area','Main Building','Gym'];
const CATS  = ['Personal','Electronics','Accessories','Cash/Cards'];
const STATUSES = ['Pending','Claimed'];

const statusColor = (s) =>
  s === 'Claimed'  ? 'bg-purple-100 text-purple-500' :
  s === 'Pending'  ? 'bg-orange-100 text-orange-500' :
  'bg-green-100 text-green-500';

const EMPTY = { title:'', category:'Personal', poster_name:'', location:'Canteen', date:'', description:'' };

// ─── Modal ────────────────────────────────────────────────────────────────────
const ItemModal = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState(item || EMPTY);
  const isEdit = !!item;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.reporter.trim() || !form.date.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center px-7 py-5 border-b">
          <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">
            {isEdit ? 'Edit Lost Item' : 'Add Lost Item'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
        </div>
        <form onSubmit={handleSave} className="p-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Item Name</label>
              <input className="inp" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Black Wallet" required />
            </div>
            <div>
              <label className="label">Reported By</label>
              <input className="inp" value={form.reporter} onChange={e=>set('reporter',e.target.value)} placeholder="Full name" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="inp" value={form.cat} onChange={e=>set('cat',e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Area Lost</label>
              <select className="inp" value={form.area} onChange={e=>set('area',e.target.value)}>
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Date Reported</label>
              <input className="inp" type="date" value={form.date} onChange={e=>set('date',e.target.value)} required />
            </div>
            {isEdit && (
              <div>
                <label className="label">Status</label>
                <select className="inp" value={form.status} onChange={e=>set('status',e.target.value)}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="inp resize-none" rows={3} value={form.desc} onChange={e=>set('desc',e.target.value)} placeholder="Describe the item..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all">
              {isEdit ? 'Save Changes' : 'Add Item'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function toTitleCase(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ─── Confirm Delete ───────────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
      <div className="text-3xl mb-3">🗑️</div>
      <h3 className="font-black text-slate-800 text-base uppercase italic mb-2">Are you sure?</h3>
      <p className="text-slate-400 text-xs font-sans mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all">Delete</button>
        <button onClick={onClose}   className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Cancel</button>
      </div>
    </div>
  </div>
);

// ─── LostItems Page ───────────────────────────────────────────────────────────
const LostItems = ({ role }) => {
  const { lostItems, addLostItem, updateLostItem, deleteLostItem } = useApp();
  const [search,   setSearch]   = useState('');
  const [addOpen,  setAddOpen]  = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(false);
  const [delItem,  setDelItem]  = useState(null);
  const [items, setItems] = useState([]);


  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const response = await getItems();
      setItems(response);
    } catch (error){
      console.error('Error fetching items:', error);
    }
  }

  const filtered = lostItems.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.poster_name.toLowerCase().includes(search.toLowerCase()) ||
    i.location.toLowerCase().includes(search.toLowerCase())
  );

  function toTitleCase(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function handleView(item) {
  try {
    const response = await getItemById(item.id);
    
    // 1. Extract the data correctly
    let data = response;
    if (Array.isArray(response)) data = response[0];
    else if (response && response.results) data = response.results[0];

    // 2. Debug: Check if 'image' or 'images' exists in 'data'
    console.log("Full Item Data from API:", data);

    // 3. Set the state
    setViewItem(data);
  } catch (error) {
    console.error("Error fetching item details:", error);
    // Fallback to the list item if API call fails
    setViewItem(item);
  }
}



const filteredLost = items.filter(item => item.type.toUpperCase() === 'LOST');


  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden font-sans">

      {/* header */}
      <div className="p-5 border-b flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50">
        <div>
          <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Lost Items</h3>
          <p className="text-[10px] text-gray-400 italic mt-0.5">Manage all reported lost items</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 sm:w-44 px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#2D366D]/20"
          />
          <button onClick={() => setAddOpen(true)}
            className="bg-[#2D366D] hover:opacity-90 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap">
            + Add
          </button>
        </div>
      </div>

      {/* table — scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] min-w-[600px]">
          <thead className="bg-gray-50 text-gray-400 font-black uppercase border-b text-[9px] tracking-widest">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Item Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Reported By</th>
              <th className="p-4">Area</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLost.length > 0 ? (
              filteredLost.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400 font-bold">L{item.id}</td>
                  <td className="p-4 font-black text-gray-700">{toTitleCase(item.title)}</td>
                  <td className="p-4 text-gray-500">{toTitleCase(item.category)}</td>
                  <td className="p-4 text-gray-500">{toTitleCase(item.poster_name)}</td>
                <td className="p-4 text-gray-500">{toTitleCase(item.location)}</td>
                <td className="p-4 text-gray-500">
                  <span>{item.created_date}</span>    |   
                  
                    <span>    {item.created_time}</span>
                  </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full font-bold text-[8px] uppercase ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2 text-[9px] font-black uppercase">
                    <button onClick={() =>handleView(item)} className="text-blue-500 hover:underline">View</button>
                    <button onClick={() => setEditItem(item)} className="text-amber-500 hover:underline">Edit</button>
                    {role === 'Admin' && (
                      <button onClick={() => setDelItem(item)} className="text-red-400 hover:underline">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))) : (
                <tr><td colSpan={9} className="p-10 text-center text-gray-300 italic text-xs">No lost items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {addOpen  && <ItemModal onSave={addLostItem}              onClose={() => setAddOpen(false)} />}
      {editItem && <ItemModal item={editItem} onSave={u => updateLostItem(editItem.id, u)} onClose={() => setEditItem(false)} />}
      {viewItem && <ItemDetailModal item={viewItem} onClose={() => setViewItem(false)} onClaim={(item) => console.log('Claiming:', item)} />}
      {delItem  && (
        <ConfirmModal
          message={`This will permanently delete "${delItem.name}". This action cannot be undone.`}
          onConfirm={() => { deleteLostItem(delItem.id); setDelItem(null); }}
          onClose={() => setDelItem(null)}
        />
      )}
    </div>
  );
};

export default LostItems;