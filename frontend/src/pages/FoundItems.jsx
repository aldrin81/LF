  import React, { useEffect, useState, useRef } from 'react';
  import { useApp } from '../context/AppContext';
  import { getItems, createLostItem, editLostItem, getItemById } from '../api/api';
  import ItemDetailModal from '../components/ItemDetailModal';
  import PhotoUpload from '../components/PhotoUpload';
  import { Eye, X, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
  const AREAS = ['Canteen','Gym','Highschool Grounds','Basement','Main Building','Sao Lobby','Parking Area', 'Others'];
  const CATS  = ['Personal','Accessories','Id','Electronics','Keys', 'Valuables'];
  const STATUSES = ['Pending','Claimed', 'Approved'];

  const statusColor = (s) =>
    s === 'Claimed'  ? 'bg-purple-100 text-purple-500' :
    s === 'Pending'  ? 'bg-orange-100 text-orange-500' :
    s === 'Archived' ? 'bg-gray-400 text-white' :
    'bg-green-100 text-green-500';

  const EMPTY = { 
    title: '', 
    category: 'Personal', 
    first_name: '',
    last_name: '',
    student_id: '',
    location: 'Canteen', 
    created_date: '', 
    created_time: '', 
    description: '', 
    status: 'Approved', 
    image: null 
  };

  // ─── Item Modal (Add / Edit) ─────────────────────────────────────────────────
  const ItemModal = ({ item, onSave, onClose }) => {
    const [saving, setSaving] = useState(false);

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

    if (saving) return;

    const today = new Date().toLocaleDateString("en-CA");

    if (form.created_date && form.created_date > today) {
      window.alert("Date reported cannot be in the future.");
      return;
    }

    if (
      !form.title?.trim() ||
      !form.first_name?.trim() ||
      !form.last_name?.trim(),
      !form.student_id?.trim() ||
      !form.created_date?.trim() ||
      (form.location === "Others" && !form.other_location?.trim())
    ) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        location:
          form.location === "Others"
            ? form.other_location.trim()
            : form.location,
      };

      delete payload.other_location;

      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (e) => {
    const { name, value, files } = e.target;
    set(name, files ? files[0] : value);
  };

  const inputClass =
    "h-14 w-full rounded-xl border border-slate-300 px-4 text-lg text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#1478a7] disabled:bg-slate-100";

  const labelClass =
    "mb-2 block text-sm font-bold uppercase text-slate-700";

        const today = new Date().toLocaleDateString("en-CA");

  return (
    <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
  onClick={(e) => {
    if (e.target === e.currentTarget) onClose();
  }}
>
  <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-md bg-white shadow-2xl">
    <div className="flex items-start justify-between bg-gradient-to-r from-[#0B648D] to-[#155F87] px-6 py-3 text-white">
      <div>
        <h3 className="text-2xl font-bold">
          {isEdit ? "Edit Surrendered Item" : "Add Surrendered Item"}
        </h3>
        <p className="mt-1 text-sm text-white/90">
          {isEdit
            ? "Update surrendered item details"
            : "Submit details for a surrendered item"}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <label className={labelClass}>Student ID *</label>
                <input
                  className={inputClass}
                  value={form.student_id || ""}
                  onChange={(e) => set("student_id", e.target.value)}
                  placeholder="Student ID number"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>First Name *</label>
                <input
                  className={inputClass}
                  value={form.first_name || ""}
                  onChange={(e) => set("first_name", e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Last Name *</label>
                <input
                  className={inputClass}
                  value={form.last_name || ""}
                  onChange={(e) => set("last_name", e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
              
            </div>
            

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Area Found</label>

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
                  className={`${inputClass} w-full mt-3 disabled:cursor-not-allowed disabled:text-slate-400`}
                  value={form.other_location || ""}
                  onChange={(e) => set("other_location", e.target.value)}
                  placeholder="Please specify location"
                  disabled={form.location !== "Others"}
                  required={form.location === "Others"}
                />
              </div>

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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Date Reported *</label>
                <input
                  className={inputClass}
                  type="date"
                  value={form.created_date || ""}
                  onChange={(e) => set("created_date", e.target.value)}
                  max={today}
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
                className="min-h-[96px] w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#1478a7]"
                rows={3}
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
                type="button"
                onClick={onClose}
                className="h-12 rounded-xl bg-slate-200 text-sm font-black uppercase tracking-wide text-slate-500 transition hover:bg-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`flex-1 py-3 rounded-xl text-white text-base font-semibold uppercase tracking-wide shadow-md transition-all duration-200 ${
                  saving
                    ? "bg-slate-400 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-b from-[#384388] to-[#2D366D] hover:from-[#44509B] hover:to-[#2D366D] hover:shadow-lg active:scale-[0.98]"
                }`}
              >
                {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

  // ─── Confirm Delete Modal ───────────────────────────────────────────────────
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

  // ─── Main FoundItems Module ───────────────────────────────────────────────────
  const FoundItems = ({ currentFilter, role }) => {
    const { foundItems, addFoundItem, updateFoundItem, deleteFoundItem } = useApp();
    const [search, setSearch] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [viewItem, setViewItem] = useState(null);
    const [delItem, setDelItem] = useState(null);
    const [foundItem, setFoundItem] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeConfirmation, setActiveConfirmation] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState(null);

    const isFetchingRef = useRef(false);

    const tableContainerRef = useRef(null);

    useEffect(() => {
      fetchItems();
      const interval = setInterval(() => {
        fetchItems();
      }, 3000); // Poll server records safely

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
      }, [currentFilter]);
    
      const goToPage = (page) => {
        setCurrentPage(page);
    
        tableContainerRef.current?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      };

    async function fetchItems() {
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
        let data = response;
        if (Array.isArray(response)) data = response[0];
        else if (response && response.results) data = response.results[0];
        
        setViewItem(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
        setViewItem(item);
      }
    }

    const getImageUrl = (img) => {
        if (!img) return null;
        const first = Array.isArray(img) ? img[0] : img;
        if (!first) return null;
        const path = typeof first === 'string' ? first : (first.image || first.file || first.url);
        if (!path) return null;
        return path.startsWith('http') ? path : `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
      };

    const handleUpdateStatus = async (item, status = 'Approved') => {
        try {
          await editLostItem(item.id, { status: status });
    
          setNotificationMessage("Item approved.");
          setSelectedItem(null);
          await fetchData({ showLoading: false });
        } catch (error) {
          console.error(`Error updating status to ${status}:`, error.response?.data || error.message);
          const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
          setNotificationMessage(`Update failed: ${msg}`);
        }
      };

      const fetchData = async ({ showLoading = false } = {}) => {
              if (isFetchingRef.current) return;
          
              try {
                isFetchingRef.current = true;
                if (showLoading) setLoading(true);
                const data = await getItems();
                const actualData = Array.isArray(data) ? data : (data.results || []);
                const pendingLostItems = actualData.filter((item) => {
                  return item.status === 'Pending' && item.type === 'Lost';
                });
          
                const nextSnapshot = JSON.stringify(
                  pendingLostItems.map((item) => ({
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    location: item.location,
                    created_date: item.created_date,
                    created_time: item.created_time,
                    status: item.status,
                    description: item.description,
                    image: item.image,
                    images: item.images,
                    file: item.file,
                  }))
                );
          
                if (nextSnapshot !== lastItemsSnapshotRef.current) {
                  lastItemsSnapshotRef.current = nextSnapshot;
                  setItems(pendingLostItems);
                }
              } catch (error) {
                console.error("Error fetching items:", error);
              } finally {
                if (showLoading) setLoading(false);
                isFetchingRef.current = false;
              }
            };

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

    const handleDelete = async (id) => {
        try {
          await editLostItem(id, { status: 'Archived' });
          setNotificationMessage("Item declined.");
          setSelectedItem(null);
          fetchData({ showLoading: false });
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      };

    async function handleSaveEdit(updatedForm) {
      try {
        const updatedItem = { ...editItem, ...updatedForm };
        const formData = new FormData();

        formData.append('title', updatedItem.title || '');
        formData.append('first_name', updatedItem.first_name || '');
        formData.append('last_name', updatedItem.last_name || '');
        formData.append('student_id', updatedItem.student_id || '');
        formData.append('category', updatedItem.category || '');
        formData.append('location', updatedItem.location || '');
        formData.append('created_date', updatedItem.created_date || '');
        formData.append('created_time', updatedItem.created_time || '');
        formData.append('description', updatedItem.description || '');
        formData.append('status', updatedItem.status || '');
        formData.append('type', 'Surrendered');

        await editLostItem(editItem.id, formData);

        window.alert('Item updated successfully!');
        await fetchItems();
        setEditItem(null);
      } catch (error) {
        console.error('Error updating item:', error);
        window.alert('Failed to update item. Please try again.');
      }
    }

    async function handleAddItem(form) {
      try {
        const formData = new FormData();

        formData.append('title', form.title || '');
        formData.append('category', form.category || 'Personal');
        formData.append('first_name', form.first_name || '');
        formData.append('last_name', form.last_name || '');
        formData.append('student_id', form.student_id || '');
        formData.append('location', form.location || '');
        formData.append('created_date', form.created_date || '');
        formData.append('created_time', form.created_time || '');
        formData.append('description', form.description || '');
        formData.append('status', 'Approved');
        formData.append('type', 'Surrendered');

        if (form.image) {
          formData.append('image', form.image);
        }

        await createLostItem(formData);

        window.alert('Item added successfully!');
        await fetchItems();
        setAddOpen(false);
      } catch (error) {
        console.error('Error adding item:', error.response?.data || error);
        window.alert(JSON.stringify(error.response?.data || 'Failed to add item. Please try again.'));
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
        formData.append('first_name', item.first_name || '');
        formData.append('last_name', item.last_name || '');
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
        window.alert('Failed to claim item. Please try again.');
      }
    }

    const filteredFound = foundItem.filter((item) => {
      const searchText = search.toLowerCase();

      return (
        item.type === 'Surrendered' &&
        item.status?.toUpperCase() !== 'CLAIMED' &&
        (
          item.title?.toLowerCase().includes(searchText) ||
          item.category?.toLowerCase().includes(searchText) ||
          `${item.first_name || ''} ${item.last_name || ''}`
            .toLowerCase()
            .includes(searchText) ||
          item.location?.toLowerCase().includes(searchText) ||
          item.status?.toLowerCase().includes(searchText)
        )
      );
    }).sort((a, b) => b.id - a.id);

  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(filteredFound.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredFound.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getVisiblePages = () => {
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let startPage = currentPage < maxVisiblePages ? 1 : currentPage - 3;
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxVisiblePages + 1;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

const visiblePages = getVisiblePages();

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
                <h3 className="text-[22px] sm:text-xl font-black uppercase tracking-[0.18em] text-[#071E3D]">
                  Surrendered Items
                </h3>
                <p className="text-md sm:text-base text-[#7B8AA6] italic mt-1">
                  Manage all surrendered items within the campus
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
                placeholder="Search surrendered items..."
                className="w-full pl-10 pr-4 py-3 border border-[#CBD8E8] rounded-full text-lg outline-none bg-white text-[#071E3D] placeholder:text-[#8A98B3] focus:ring-2 focus:ring-[#0B6B8A]/20 focus:border-[#0B6B8A] transition-all"
              />
            </div>

            <button
              onClick={() => setAddOpen(true)}
              className="px-6 py-3 rounded-full bg-[#2D366D] text-white font-black uppercase tracking-[0.12em] text-m shadow-[0_6px_14px_rgba(45,54,109,0.25)] hover:bg-[#24305C] transition-all whitespace-nowrap"
            >
              📋 Add Surrendered Item
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={tableContainerRef} className="flex-1 overflow-auto bg-white">
        <table className="w-full min-w-[1000px] table-fixed border-collapse">
          <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-[12%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Ticket</th>
                  <th className="w-[15%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Item Name</th>
                  <th className="w-[12%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Category</th>
                  <th className="w-[16%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Reported By</th>
                  <th className="w-[16%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Area</th>
                  <th className="w-[12%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Date</th>
                  <th className="w-[10%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Status</th>
                  <th className="w-[10%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item, index) => (
                    <tr key={item.id} className={`h-[70px] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F6FAFF]"} hover:bg-[#EAF4FF]`}>
                    <td className="border border-gray-300 p-2 text-center align-middle font-bold text-[#0B6B8A] text-sm">{item.ticket_code}</td>

                    <td className="truncate border-b border-[#D8E2EF] p-4 text-center align-middle font-bold text-[#071E3D]">{toTitleCase(item.title)}</td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-[14px] uppercase text-[#2D366D]">
                          {toTitleCase(item.category) || '-'}
                        </span>
                      </div>
                    </td>

                    <td className="border border-gray-300 p-4 text-center align-middle text-slate-600 text-[14px]">{`${toTitleCase(item.first_name)} ${toTitleCase(item.last_name)}`.trim() || '-'}</td>
                    <td className="border border-gray-300 p-4 text-center align-middle text-slate-700 text-[14px]">
                      <div className="flex items-center justify-center whitespace-normal leading-tight">
                        <span>{toTitleCase(item.location) || '-'}</span>
                      </div>
                    </td>

                    <td className="border border-gray-300 p-4 text-center align-middle text-slate-700 text-[14px]">
                      <span className="block">
                        {item.created_date || '-'}
                      </span>
                      <span className="block">
                        {item.created_time || '-'}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <span className={`rounded px-3 py-1 text-[11px] font-black uppercase ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div> 
                    </td>

                      <td className="p-4 text-center align-middle border-b border-[#D8E2EF]">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="inline-flex items-center justify-center gap-2 rounded bg-[#0B6B8A] px-3 py-1.5 text-[14px] font-semibold text-white transition hover:bg-[#095A74]"
                          >
                            <Eye size={12} strokeWidth={4} />
                            Review
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="bg-white text-center py-32">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-[#EEF4FA] flex items-center justify-center text-3xl">📦
                        </div>
                        <span className="text-4xl opacity-20 font-black tracking-tighter text-[#071E3D]">EMPTY
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
          {filteredFound.length > 0 && (
            <div className="border-t border-[#D8E2EF] bg-white px-6 py-4 flex items-center justify-between shrink-0">
              <p className="text-sm font-bold text-[#7B8AA6]">
                Showing {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredFound.length)} of{" "}
                {filteredFound.length}
              </p>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 rounded-lg border border-[#D8E2EF] px-4 text-xs font-black uppercase tracking-wide text-[#0B6B8A] transition hover:bg-[#EAF4FF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-black transition ${
                      currentPage === page
                        ? "bg-[#0B6B8A] text-white shadow-md"
                        : "border border-[#D8E2EF] bg-white text-[#0B6B8A] hover:bg-[#EAF4FF]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-10 rounded-lg border border-[#D8E2EF] px-4 text-xs font-black uppercase tracking-wide text-[#0B6B8A] transition hover:bg-[#EAF4FF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedItem(null);
          }}
        >
          <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-md bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-gradient-to-r from-[#0B648D] to-[#155F87] px-6 py-3 text-white">
              <div>
                <h3 className="text-2xl font-bold">Item Review</h3>
                <p className="mt-1 text-sm text-white/90">
                  Review lost item details before approval
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(92vh-88px)] overflow-y-auto px-6 py-5">
              <div className="mx-auto max-w-3xl space-y-4">
                <img
                  src={getImageUrl(selectedItem.image || selectedItem.images || selectedItem.file) || "https://via.placeholder.com/900x500?text=No+Image"}
                  className="h-72 w-full rounded-xl border border-slate-200 bg-slate-100 object-cover"
                  alt="Item Preview"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Item Name</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold text-slate-700">
                      {toTitleCase(selectedItem.title) || '-'}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Email</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold text-slate-700">
                      {toTitleCase(selectedItem.email) || '-'}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">First Name</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {toTitleCase(selectedItem.first_name) || "-"}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Last Name</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {toTitleCase(selectedItem.last_name) || '-'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Category</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {toTitleCase(selectedItem.category) || '-'}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Area Lost</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {toTitleCase(selectedItem.location) || '-'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Date Reported</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {selectedItem.created_date || '-'}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Status</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      <span className={`rounded-full px-3 py-1 text-[13px] font-black uppercase tracking-wider ${statusColor(selectedItem.status)}`}>
                        {selectedItem.status || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Description</p>
                  <div className="min-h-[96px] rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                    {selectedItem.description || 'No description provided.'}
                  </div>
                </div>

                {selectedItem.status === 'Approved' && (
                  <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="rounded-xl bg-green-500 p-2 text-white shadow-md">
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-green-700">Item Publicly Visible</p>
                      <p className="text-xs font-bold uppercase text-green-600">
                        This item has been approved and is now visible to users.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  {selectedItem.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => setActiveConfirmation({
                          text: "Are you sure you want to approve this item?",
                          action: () => handleUpdateStatus(selectedItem, 'Approved')
                        })}
                        className="rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] py-3 text-base font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:from-[#44509B] hover:to-[#2D366D] hover:shadow-lg active:scale-[0.98]"
                      >
                        Approve Item
                      </button>
                      <button
                        onClick={() => setActiveConfirmation({
                          text: "Are you sure you want to decline this item?",
                          action: () => handleDelete(selectedItem.id)
                        })}
                        className="h-12 rounded-xl bg-slate-200 text-sm font-black uppercase tracking-wide text-slate-500 transition hover:bg-slate-300"
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
                          className="rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] py-3 text-base font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:from-[#44509B] hover:to-[#2D366D]"
                        >
                          Mark Claimed
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="h-12 rounded-xl bg-slate-200 text-sm font-black uppercase tracking-wide text-slate-500 transition hover:bg-slate-300"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeConfirmation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[28px] bg-white px-8 py-8 text-center shadow-2xl">
            <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4F8] text-[#0B6B8A]">
              <AlertCircle size={30} strokeWidth={2.5} />
            </div>

            <h5 className="mb-3 text-2xl font-black text-[#144B70]">
              System Confirmation
            </h5>

            <p className="mx-auto mb-8 max-w-[280px] text-sm font-medium leading-6 text-[#5F6F8C]">
              {activeConfirmation.text}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  activeConfirmation.action();
                  setActiveConfirmation(null);
                }}
                className="h-12 w-full rounded-xl bg-[#0B6B8A] text-sm font-black uppercase tracking-wide text-white shadow-md transition hover:bg-[#095A74] active:scale-[0.98]"
              >
                Confirm
              </button>

              <button
                onClick={() => setActiveConfirmation(null)}
                className="h-12 w-full rounded-xl border border-[#0B6B8A] bg-white text-sm font-black uppercase tracking-wide text-[#0B6B8A] transition hover:bg-[#EAF4F8]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

      {addOpen && (
        <ItemModal
          item={null}
          onSave={handleAddItem}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  </div>
);
};

  export default FoundItems;