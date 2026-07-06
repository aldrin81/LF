import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getItems, getItemById, API_URL, editLostItem, createLostItem } from "../api/api";
import ItemDetailModal from '../components/ItemDetailModal';
import { Form } from 'react-router-dom';
import PhotoUpload from '../components/PhotoUpload';


const AREAS = ['Canteen','Gym','Highschool Grounds','Basement','Main Building','Sao Lobby','Parking Area', 'Others'];
const CATS  = ['Personal','Accessories','Id','Electronics','Keys', 'Valuables'];
const STATUSES = ['Pending','Claimed', 'Approved'];

const statusColor = (s) =>
  s === 'Claimed'  ? 'bg-purple-100 text-purple-500' :
  s === 'Pending'  ? 'bg-orange-100 text-orange-500' :
  'bg-green-100 text-green-500';

const EMPTY = {
  title: '',
  category: 'Personal',
  poster_name: '',
  location: 'Canteen',
  created_date: '',
  created_time: '',
  description: '',
  status: 'Pending',
  image: null
};


const ItemModal = ({ item, onSave, onClose }) => {
  const normalizeForm = (source) => {
    const base = source || EMPTY;
    const location = base.location || "Canteen";

    if (location && !AREAS.includes(location)) {
      return {
        ...base,
        location: "Others",
        other_location: location,
      };
    }

    return {
      ...base,
      location,
      other_location: base.other_location || "",
    };
  };

  const [form, setForm] = useState(normalizeForm(item));
  const isEdit = !!item;

  useEffect(() => {
    setForm(normalizeForm(item));
  }, [item]);

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "location" && value !== "Others"
        ? { other_location: "" }
        : {}),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !form.title?.trim() ||
      !form.poster_name?.trim() ||
      !form.created_date?.trim() ||
      (form.location === "Others" && !form.other_location?.trim())
    ) {
      return;
    }

    const payload = {
      ...form,
      location:
        form.location === "Others"
          ? form.other_location.trim()
          : form.location,
    };

    delete payload.other_location;

    await onSave(payload);
  };

  const handlePhotoChange = (e) => {
    const { name, value, files } = e.target;
    set(name, files ? files[0] : value);
  };

  const inputClass =
    "h-14 w-full rounded-xl border border-slate-300 px-4 text-lg text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#1478a7] disabled:bg-slate-100";

  const labelClass =
    "mb-2 block text-sm font-bold uppercase text-slate-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-md bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-[#1478a7] px-6 py-3 text-white">
          <div>
            <h3 className="text-2xl font-bold">
              {isEdit ? "Edit Lost Item" : "Add Lost Item"}
            </h3>
            <p className="mt-1 text-sm text-white/90">
              {isEdit ? "Update lost item details" : "Submit details for a lost item"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl text-white transition hover:bg-white/25"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="max-h-[calc(92vh-88px)] overflow-y-auto px-6 py-5"
        >
          <div className="mx-auto max-w-3xl space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Item Name *</label>
                <input
                  className={inputClass}
                  value={form.title || ""}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Black Wallet"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Reported By *</label>
                <input
                  className={inputClass}
                  value={form.poster_name || ""}
                  onChange={(e) => set("poster_name", e.target.value)}
                  placeholder="Full name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  className={inputClass}
                  value={form.category || "Personal"}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Area Lost</label>
                <select
                  className={inputClass}
                  value={form.location || "Canteen"}
                  onChange={(e) => set("location", e.target.value)}
                >
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>

                <input
                  className={`${inputClass} mt-2 disabled:cursor-not-allowed disabled:text-slate-400`}
                  value={form.other_location || ""}
                  onChange={(e) => set("other_location", e.target.value)}
                  placeholder="Please specify location"
                  disabled={form.location !== "Others"}
                  required={form.location === "Others"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Date Reported *</label>
                <input
                  className={inputClass}
                  type="date"
                  value={form.created_date || ""}
                  onChange={(e) => set("created_date", e.target.value)}
                  required
                />
              </div>

              {!isEdit ? (
                <div>
                  <label className={labelClass}>Time Reported</label>
                  <input
                    className={inputClass}
                    type="time"
                    value={form.created_time || ""}
                    onChange={(e) => set("created_time", e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={form.status || "Pending"}
                    onChange={(e) => set("status", e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className="min-h-[96px] w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-base text-lg text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#1478a7]"
                rows={2}
                value={form.description || ""}
                onChange={(e) => set("description", e.target.value)}
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

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] text-white text-base font-semibold uppercase tracking-wide shadow-md transition-all duration-200 hover:from-[#44509B] hover:to-[#2D366D] hover:shadow-lg active:scale-[0.98]"
              >
                {isEdit ? "Save Changes" : "Add Item"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-xl bg-slate-200 text-sm font-black uppercase tracking-wide text-slate-500 transition hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
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
  const [viewItem, setViewItem] = useState(false);
  const [delItem,  setDelItem]  = useState(null);
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);


  useEffect(() => {
    fetchItems();

    const interval = setInterval(() => {
      fetchItems();
    }, 3000); // fetch every 1 seconds

    return () => clearInterval(interval);
  }, []);

  //FETCHING DATA TO TABLE
  async function fetchItems() {
    try {
      const response = await getItems();
      setItems(response);
    } catch (error){
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

  const filteredLost = items.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.type?.toUpperCase() === 'LOST' &&
      item.status?.toUpperCase() !== 'CLAIMED' &&
      (
        item.title?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.poster_name?.toLowerCase().includes(searchText) ||
        item.location?.toLowerCase().includes(searchText) ||
        item.status?.toLowerCase().includes(searchText)
      )
    );
  })
  .sort((a, b) => b.id - a.id);

  return (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(109vh-260px)]">
    <div className="bg-white rounded-[18px] border border-[#D8E2EF] shadow-[0_8px_24px_rgba(45,54,109,0.08)] overflow-hidden flex flex-col h-[calc(100vh-130px)]">

      {/* Header */}
      <div className="bg-white px-6 sm:px-8 py-6 border-b border-[#D8E2EF] shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 rounded-full" />
              <div>
                <h3 className="text-[22px] sm:text-2xl font-black uppercase tracking-[0.18em] text-[#071E3D]">
                  Lost Items
                </h3>

                <p className="text-lg sm:text-base text-[#7B8AA6] italic mt-1">
                  Manage all reported lost items within the campus
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-[330px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B6B8A] text-lg">
                🔍
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lost items..."
                className="w-full pl-10 pr-4 py-3 border border-[#CBD8E8] rounded-full text-lg outline-none bg-white text-[#071E3D] placeholder:text-[#8A98B3] focus:ring-2 focus:ring-[#0B6B8A]/20 focus:border-[#0B6B8A] transition-all"
              />
            </div>

            <button
              onClick={() => setAddOpen(true)}
              className="px-8 py-3 rounded-full bg-[#2D366D] text-white font-black uppercase tracking-[0.12em] text-m shadow-[0_6px_14px_rgba(45,54,109,0.25)] hover:bg-[#24305C] transition-all whitespace-nowrap"
            >
              📋 Add Lost Item
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <table className="w-full min-w-[1000px] table-fixed border-separate border-spacing-0">
          <thead className="sticky top-0 z-10">
            <tr>
             <th className="bg-[#0B6B8A] p-4 w-[12%] border-b border-[#095A74] text-white font-black uppercase text-[15px] tracking-wide text-center">
                Item Id
              </th>

              <th className="bg-[#0B6B8A] p-4 w-[15%] border-b border-[#095A74] text-white font-black uppercase text-[15px] tracking-wide text-center">
                Item Name
              </th>

              <th className="bg-[#0B6B8A] p-4 w-[15%] border-b border-[#095A74] text-white font-black uppercase text-[15px] tracking-wide text-center">
                Category
              </th>

              <th className="bg-[#0B6B8A] p-4 w-[15%] border-b border-[#095A74] text-white font-black uppercase text-[15px] tracking-wide text-center">
                Reported By
              </th>

              <th className="bg-[#0B6B8A] p-4 w-[20%] border-b border-[#095A74] text-white font-black uppercase text-[15px] tracking-wide text-center">
                Area
              </th>

              <th className="bg-[#0B6B8A] p-4 w-[15%] border-b border-[#095A74] text-white font-black uppercase text-[15px] tracking-wide text-center">
                Estimation Date
              </th>

              <th className="bg-[#0B6B8A] p-4 w-[15%] border-b border-[#095A74] text-white font-black uppercase text-[15px] tracking-wide text-center">
                Status
              </th>

              <th className="bg-[#0B6B8A] p-4 w-[18%] border-b border-[#095A74] text-white font-black uppercase text-[15px] tracking-wide text-center">
                Action
              </th>

            </tr>
          </thead>

          <tbody className="bg-white">
              {filteredLost.length > 0 ? (
              filteredLost.map((item, index) => (
                <tr
                  key={item.id}
                  className={`h-[70px] transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F6FAFF]"
                  } hover:bg-[#EAF4FF]`}
                >
                  <td className="p-2 font-bold text-[#071E3D] text-center align-middle truncate border-b border-[#D8E2EF]">
                    L{index + 1}
                  </td>

                  <td className="p-4 font-bold text-[#071E3D] text-center align-middle truncate border-b border-[#D8E2EF]">
                    {toTitleCase(item.title)}
                  </td>

                  <td className="p-4 text-[#071E3D] text-center align-middle border-b border-[#D8E2EF]">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#EEF4FA] text-[#2D366D] font-bold text-[13px] uppercase tracking-wide">
                      {toTitleCase(item.category)}
                    </span>
                  </td>

                  <td className="p-4 text-[#52627A] text-center align-middle truncate border-b border-[#D8E2EF]">
                    {toTitleCase(item.poster_name)}
                  </td>

                  <td className="p-4 text-[#071E3D] text-center align-middle border-b border-[#D8E2EF]">
                    <div className="flex items-center justify-center gap-1.5 truncate">
                      <span className="text-[#C79A2B] text-xs">📍</span>
                      <span>{toTitleCase(item.location)}</span>
                    </div>
                  </td>

                  <td className="p-4 text-center align-middle border-b border-[#D8E2EF]">
                    <span className="block font-bold text-[#071E3D] text-[15px]">
                      {item.created_date}
                    </span>

                    <span className="block text-[15px] text-[#7B8AA6] uppercase font-black tracking-wide">
                      {item.created_time}
                    </span>
                  </td>

                  <td className="p-4 text-center align-middle border-b border-[#D8E2EF]">
                    <span
                      className={`px-3 py-1 rounded-full font-black text-[13px] uppercase tracking-wider ${statusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-center align-middle border-b border-[#D8E2EF]">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="bg-[#0B6B8A] text-white hover:bg-[#095A74] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-white border border-[#C79A2B] text-[#9A741C] hover:bg-[#FFF8E8] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Edit
                      </button>

                      {role === "Admin" && (
                        <button
                          onClick={() => setDelItem(item)}
                          className="bg-white border border-red-300 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="bg-white text-center py-32">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#EEF4FA] flex items-center justify-center text-3xl">
                      📦
                    </div>

                    <span className="text-4xl opacity-20 font-black tracking-tighter text-[#071E3D]">
                      EMPTY
                    </span>

                    <p className="text-xs font-sans tracking-[0.2em] uppercase font-bold text-[#7B8AA6]">
                      No active records found
                    </p>
                  </div>
                </td>
              </tr>
            )}
              
            
          </tbody>
        </table>
      </div>

      {/* Modal Interfaces */}
      {addOpen && (
        <ItemModal
          onSave={handleAddItem}
          onClose={() => setAddOpen(false)}
        />
      )}

      {editItem && (
        <ItemModal
          item={editItem}
          onSave={handleSaveEdit}
          onClose={() => setEditItem(null)}
        />
      )}

      {viewItem && (
        <ItemDetailModal
          item={viewItem}
          onClose={() => setViewItem(null)}
          onClaim={handleClaimItem}
        />
      )}

    </div>
    </div>
  );
};

export default LostItems;