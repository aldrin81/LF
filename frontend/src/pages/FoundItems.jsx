import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AREAS    = ['Canteen','Library','Parking Lot','SAO Waiting Area','Main Building','Gym'];
const CATS     = ['Personal','Electronics','Accessories','Cash/Cards'];
const STATUSES = ['Available','Claimed'];

const statusColor = (s) =>
  s === 'Claimed'   ? 'bg-purple-100 text-purple-500' :
  s === 'Available' ? 'bg-green-100 text-green-500'   :
  'bg-slate-100 text-slate-400';

const EMPTY = { name:'', cat:'Personal', finder:'', area:'Canteen', date:'', desc:'' };

const ItemModal = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState(item || EMPTY);
  const isEdit = !!item;
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center px-7 py-5 border-b">
          <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">
            {isEdit ? 'Edit Found Item' : 'Add Found Item'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
        </div>
        <form onSubmit={e=>{e.preventDefault();onSave(form);onClose();}} className="p-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Item Name</label>
              <input className="inp" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Blue Umbrella" required />
            </div>
            <div>
              <label className="label">Found By</label>
              <input className="inp" value={form.finder} onChange={e=>set('finder',e.target.value)} placeholder="Full name" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="inp" value={form.cat} onChange={e=>set('cat',e.target.value)}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Area Found</label>
              <select className="inp" value={form.area} onChange={e=>set('area',e.target.value)}>
                {AREAS.map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Date Found</label>
              <input className="inp" type="date" value={form.date} onChange={e=>set('date',e.target.value)} required />
            </div>
            {isEdit && (
              <div>
                <label className="label">Status</label>
                <select className="inp" value={form.status} onChange={e=>set('status',e.target.value)}>
                  {STATUSES.map(s=><option key={s}>{s}</option>)}
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

const ViewModal = ({ item, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={(e)=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100">
      <div className="flex justify-between items-center px-7 py-5 border-b">
        <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">Item Details</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
      </div>
      <div className="p-7 space-y-4 font-sans">
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Item Name</p>
          <p className="font-black text-[#2D366D] text-xl uppercase italic">{item.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 text-[10px]">
          {[['ID',`#${item.id}`],['Category',item.cat],['Found By',item.finder],['Area Found',item.area],['Date',item.date],['Status',item.status]].map(([l,v])=>(
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
        <button onClick={onClose} className="w-full bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Close</button>
      </div>
    </div>
  </div>
);

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

const FoundItems = ({ role }) => {
  const { foundItems, addFoundItem, updateFoundItem, deleteFoundItem } = useApp();
  const [search,   setSearch]   = useState('');
  const [addOpen,  setAddOpen]  = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [delItem,  setDelItem]  = useState(null);

  const filtered = foundItems.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.finder.toLowerCase().includes(search.toLowerCase()) ||
    i.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden font-sans">
      <div className="p-5 border-b flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50">
        <div>
          <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Found Items</h3>
          <p className="text-[10px] text-gray-400 italic mt-0.5">Manage all found and turned-in items</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
            className="flex-1 sm:w-44 px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#2D366D]/20" />
          <button onClick={()=>setAddOpen(true)}
            className="bg-[#2D366D] hover:opacity-90 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap">
            + Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] min-w-[620px]">
          <thead className="bg-gray-50 text-gray-400 font-black uppercase border-b text-[9px] tracking-widest">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Item Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Found By</th>
              <th className="p-4">Area</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(item=>(
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-400 font-bold">#{item.id}</td>
                <td className="p-4 font-black text-gray-700">{item.name}</td>
                <td className="p-4 text-gray-500">{item.cat}</td>
                <td className="p-4 text-gray-500">{item.finder}</td>
                <td className="p-4 text-gray-500">{item.area}</td>
                <td className="p-4 text-gray-500">{item.date}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full font-bold text-[8px] uppercase ${statusColor(item.status)}`}>{item.status}</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2 text-[9px] font-black uppercase">
                    <button onClick={()=>setViewItem(item)} className="text-blue-500 hover:underline">View</button>
                    <button onClick={()=>setEditItem(item)} className="text-amber-500 hover:underline">Edit</button>
                    {role === 'Admin' && (
                      <button onClick={()=>setDelItem(item)} className="text-red-400 hover:underline">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center text-slate-300 italic text-xs">No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {addOpen  && <ItemModal onSave={addFoundItem} onClose={()=>setAddOpen(false)} />}
      {editItem && <ItemModal item={editItem} onSave={u=>updateFoundItem(editItem.id,u)} onClose={()=>setEditItem(null)} />}
      {viewItem && <ViewModal item={viewItem} onClose={()=>setViewItem(null)} />}
      {delItem  && (
        <ConfirmModal
          message={`This will permanently delete "${delItem.name}". This action cannot be undone.`}
          onConfirm={()=>{deleteFoundItem(delItem.id);setDelItem(null);}}
          onClose={()=>setDelItem(null)}
        />
      )}
    </div>
  );
};

export default FoundItems;