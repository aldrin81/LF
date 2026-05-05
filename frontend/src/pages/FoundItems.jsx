import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getItems, createLostItem, editLostItem, getItemById} from '../api/api';
import ItemDetailModal from '../components/ItemDetailModal';
import PhotoUpload from '../components/PhotoUpload';

const AREAS = ['Canteen','Gym','Highschool Grounds','Basement','Main Building','Sao Lobby','Parking Area'];
const CATS  = ['Personal','Accessories','Id','Electronics','Keys', 'Valuables'];
const STATUSES = ['Pending','Claimed', 'Approved'];

const statusColor = (s) =>
    s === 'Claimed'  ? 'bg-purple-100 text-purple-500' :
    s === 'Pending'  ? 'bg-orange-100 text-orange-500' :
    s === 'Archived' ? 'bg-gray-400 text-white' :
    'bg-green-100 text-green-500';

const EMPTY = { title:'', category:'Personal', poster_name:'', location:'Canteen', created_date:'', created_time: '', description:'', status: 'Pending', image: null };

const ItemModal = ({ item, onSave, onClose }) => {
    const [form, setForm] = useState(item || EMPTY);
    const isEdit = !!item;

    useEffect(() => {
      setForm(item || EMPTY);
    }, [item]);

    const set = (key, value) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e) => {
  e.preventDefault();

  if (
    !form.title?.trim() ||
    !form.poster_name?.trim() ||
    !form.created_date?.trim()
  ) {
    return;
  }

  await onSave(form);
};


  const handlePhotoChange = (e) => {
  const { name, value, files } = e.target;

  set(name, files ? files[0] : value);
};


    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center px-7 py-5 border-b">
            <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">
              {isEdit ? 'Edit Found Item' : 'Add Found Item'}
            </h3>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} className="p-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Item Name</label>
                <input
                  className="inp"
                  value={form.title || ''}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Black Wallet"
                  required
                />
              </div>

              <div>
                <label className="label">Reported By</label>
                <input
                  className="inp"
                  value={form.poster_name || ''}
                  onChange={(e) => set('poster_name', e.target.value)}
                  placeholder="Full name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select
                  className="inp"
                  value={form.category || 'Personal'}
                  onChange={(e) => set('category', e.target.value)}
                >
                  {CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Area Lost</label>
                <select
                  className="inp"
                  value={form.location || 'Canteen'}
                  onChange={(e) => set('location', e.target.value)}
                >
                  {AREAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Date Reported</label>
                <input
                  className="inp"
                  type="date"
                  value={form.created_date || ''}
                  onChange={(e) => set('created_date', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {!isEdit && (
                  <div>
                    <label className="label">Time Reported</label>
                    <input
                      className="inp"
                      type="time"
                      value={form.created_time || ''}
                      onChange={(e) => set('created_time', e.target.value)}
                    />
                  </div>
                )}

              {isEdit && (
                <div>
                  <label className="label">Status</label>
                  <select
                    className="inp"
                    value={form.status || 'Pending'}
                    onChange={(e) => set('status', e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                className="inp resize-none"
                rows={3}
                value={form.description || ''}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe the item..."
              />
            </div>

            {!isEdit && (
              <PhotoUpload
                name="image"
                value={form.image}
                onChange={handlePhotoChange}
              />
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all"
              >
                {isEdit ? 'Save Changes' : 'Add Item'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
              >
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
  const [foundItem, setFoundItem] = useState([]);

  useEffect(() => {
    fetchItems();

    const interval = setInterval(() => {
    fetchItems();
  }, 3000); // fetch every 1 seconds

  return () => clearInterval(interval);
  }, []);

  async function fetchItems(){
    try {
      const response = await getItems();
      setFoundItem(response);
    } catch (error) {
       console.error('Error fetching items:', error);
    }
  }

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


    async function handleEdit(item) {
        try {
          const response = await getItemById(item.id);
    
          let data = response;
          if (Array.isArray(response)) data = response[0];
          else if (response && response.results) data = response.results[0];
    
          setEditItem({
            ...data,
            created_date: data.created_date || '',
          });
    
        } catch (error) {
          console.error('Error fetching item for edit:', error);
    
          setEditItem({
            ...item,
            created_date: item.created_date || '',
          });
    
        }
      }
    
    
      async function handleSaveEdit(updatedForm) {
      try {
        const updatedItem = {
          ...editItem,
          ...updatedForm,
        };
    
        const formData = new FormData();
    
        formData.append('title', updatedItem.title || '');
        formData.append('poster_name', updatedItem.poster_name || '');
        formData.append('category', updatedItem.category || '');
        formData.append('location', updatedItem.location || '');
        formData.append('created_date', updatedItem.created_date || '');
        formData.append('created_time', updatedItem.created_time || '');
        formData.append('description', updatedItem.description || '');
        formData.append('status', updatedItem.status || '');
        formData.append('type', 'Found');

        await editLostItem(editItem.id, formData);

    
        window.alert('Item updated successfully!');
        await fetchItems();
        setEditItem(null);
      } catch (error) {
        console.error('Error updating item:', error);
        console.error('Response data:', error.response?.data);
        window.alert('Failed to update item. Please try again.');
      }
    }
    
    
    
      async function handleAddItem(form) {
      try {
        const formData = new FormData();
    
        formData.append('title', form.title);
        formData.append('category', form.category);
        formData.append('poster_name', form.poster_name);
        formData.append('location', form.location);
        formData.append('created_date', form.created_date);
        formData.append('created_time', form.created_time || '');
        formData.append('description', form.description || '');
        formData.append('type', 'Found');

    
        if (form.image) {
          formData.append('image', form.image);
        }
    
        await createLostItem(formData);
    
        window.alert('Item added successfully!');
        await fetchItems();
        setAddOpen(false);
      } catch (error) {
        console.error('Error adding item:', error);
        console.error('Response data:', error.response?.data);
        window.alert('Failed to add item. Please try again.');
      }
    }
    
    async function handleClaimItem(item) {
      if (item.status === 'Claimed') {
        window.alert('This item is already claimed.');
        return;
      }
    
      try {
        const formData = new FormData();
    
        formData.append('title', item.title || '');
        formData.append('poster_name', item.poster_name || '');
        formData.append('category', item.category || '');
        formData.append('location', item.location || '');
        formData.append('created_date', item.created_date || '');
        formData.append('created_time', item.created_time || '');
        formData.append('description', item.description || '');
        formData.append('status', 'Claimed');
    
        await editLostItem(item.id, formData);
    
        window.alert('Item marked as claimed!');
        await fetchItems();
        setViewItem(null);
      } catch (error) {
        console.error('Error claiming item:', error);
        console.error('Response data:', error.response?.data);
        window.alert('Failed to claim item. Please try again.');
      }
    }

  const filteredFound = foundItem.filter((item) => {
  const searchText = search.toLowerCase();

  return (
    item.type?.toUpperCase() === 'FOUND' &&
    item.status?.toUpperCase() !== 'CLAIMED' &&
    (
      item.title?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText) ||
      item.poster_name?.toLowerCase().includes(searchText) ||
      item.location?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText)
    )
  );
});

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden font-sans">
      <div className="p-5 border-b flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50">
        <div>
          <h3 className="text-[15px] font-black text-gray-800 uppercase tracking-widest">Found Items</h3>
          <p className="text-[12px] text-gray-400 italic mt-0.5">Manage all found and turned-in items</p>
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
          <thead className="block bg-gray-50 text-gray-400 font-black uppercase border-b text-[9px] tracking-widest">
            <tr className="table w-full table-fixed">
              <th className="p-4 text-[12px]">ID</th>
              <th className="p-4 text-[12px]">Item Name</th>
              <th className="p-4 text-[12px]">Category</th>
              <th className="p-4 text-[12px]">Found By</th>
              <th className="p-4 text-[12px]">Area</th>
              <th className="p-4 text-[12px]">Date and Time</th>
              <th className="p-4 text-center text-[12px]">Status</th>
              <th className="p-4 text-center text-[12px]">Actions</th>
            </tr>
          </thead>

          <tbody className="block max-h-[420px] overflow-y-auto divide-y divide-gray-100">
            {filteredFound.length > 0 ? (
              filteredFound.map((item) => (
                <tr key={item.id} className="table w-full table-fixed hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400 font-bold text-[12px]">F{item.id}</td>
                  <td className="p-4 font-black text-gray-700 text-[12px]">{toTitleCase(item.title)}</td>
                  <td className="p-4 text-gray-500 text-[12px]">{toTitleCase(item.category)}</td>
                  <td className="p-4 text-gray-500 text-[12px]">{toTitleCase(item.poster_name)}</td>
                  <td className="p-4 text-gray-500 text-[12px]">{toTitleCase(item.location)}</td>
                  <td className="p-4 text-gray-500 text-[12px]">
                    <span>{item.created_date}</span> <br /> <span>{item.created_time}</span>
                  </td>
                  <td className="p-4 text-center text-[12px]">
                    <span className={`px-3 py-1 rounded-full font-bold text-[9px] uppercase ${statusColor(item.status)}`}>
                      {toTitleCase(item.status)}
                    </span>
                  </td>
                  <td className="p-4 text-center text-[12px]">
                    <div className="flex justify-center gap-2 text-[12px] font-black uppercase">
                      <button onClick={() => handleView(item)} className="text-blue-500 hover:underline">
                        View
                      </button>

                      <button onClick={() => handleEdit(item)} className="text-amber-500 hover:underline">
                        Edit
                      </button>

                      {role === 'Admin' && (
                        <button onClick={() => setDelItem(item)} className="text-red-400 hover:underline">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="table w-full table-fixed">
                <td colSpan={8} className="p-10 text-center text-slate-300 italic text-xs">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {addOpen  && <ItemModal onSave={handleAddItem} onClose={()=>setAddOpen(false)} />}
      {editItem && <ItemModal item={editItem} onSave={handleSaveEdit} onClose={()=>setEditItem(null)} />}
      {viewItem && <ItemDetailModal item={viewItem} onClose={()=>setViewItem(null)} />}
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