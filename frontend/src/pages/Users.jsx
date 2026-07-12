import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { useApp } from '../context/AppContext';
import { getUsers, getUserById, updateUserById, createUser } from '../api/api';

const ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
];

const roleColor = (r) =>
  r === 'admin'     ? 'bg-green-100 text-green-600'  :
  r === 'moderator' ? 'bg-purple-100 text-purple-500' :
  'bg-blue-100 text-blue-500';

const statusColor = (user) => {
  if (user.is_archived) return 'bg-gray-400 text-white';
  return user.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500';
};

const statusText = (user) => {
  if (user.is_archived) return 'Archived';
  return user.is_active ? 'Active' : 'Inactive';
};

const EMPTY = { 
  first_name: '', 
  last_name: '', 
  email: '', 
  contact_number: '',
  role: 'moderator', 
  is_active: true, 
  created_at: '', 
  updated_at: '', 
  is_archived: false, 
};

// ─── Combined User Modal (Add / View & Edit) ─────────────────────────────────
const UserModal = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState(user || EMPTY);
  const isEditMode = !!user; 

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-md bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between bg-gradient-to-r from-[#0B648D] to-[#155F87] px-6 py-4 text-white shrink-0">
          <div>
            <h3 className="text-2xl font-bold">
              {isEditMode ? 'View User Profile' : 'Add New User'}
            </h3>
            <p className="mt-1 text-sm text-white/90">
              {isEditMode ? 'Review and update user account details directly' : 'Submit details for a new user account'}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center">✕</button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSave(form);
          }}
          className="p-6 overflow-y-auto space-y-6 flex-1"
        >
          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">First Name *</label>
                <input
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-700 outline-none focus:border-[#1478a7]"
                  value={form.first_name || ''}
                  onChange={(e) => set('first_name', e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Last Name *</label>
                <input
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-700 outline-none focus:border-[#1478a7]"
                  value={form.last_name || ''}
                  onChange={(e) => set('last_name', e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Email Address *</label>
                <input
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-700 outline-none focus:border-[#1478a7]"
                  type="email"
                  value={form.email || ''}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="email@slc-sflu.edu.ph"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Contact Number *</label>
                <input
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-700 outline-none focus:border-[#1478a7]"
                  type="text"
                  value={form.contact_number || ''}
                  onChange={(e) => set('contact_number', e.target.value)}
                  placeholder="09123456789"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Role *</label>
                <select
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-700 outline-none focus:border-[#1478a7]"
                  value={form.role || 'moderator'}
                  onChange={(e) => set('role', e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              {isEditMode && (
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Status *</label>
                  <select
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-700 outline-none focus:border-[#1478a7]"
                    value={form.is_active ? 'Active' : 'Inactive'}
                    onChange={(e) => set('is_active', e.target.value === 'Active')}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2 shrink-0">
            <button
              type="submit"
              className="h-12 rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] text-white text-sm font-black uppercase tracking-wide shadow-md transition hover:from-[#44509B]"
            >
              {isEditMode ? 'Save Changes' : 'Add User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-xl text-sm font-black uppercase tracking-wide transition bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Archive Confirmation Modal (Patterned after Logout Design) ─────────────
const ConfirmModal = ({ message, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-md p-6">
   <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,.25)]">  
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF2F2] text-[#DE350B]">
        <span className="text-2xl">⚠️</span>
      </div>

      <h3 className="mt-6 text-2xl font-bold text-[#154B70]">
        Confirm Archive
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        {message}
      </p>

      <div className="mt-7 space-y-3">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full rounded-xl bg-[#DE350B] py-3 text-base font-bold uppercase text-white transition hover:bg-[#bb2d09] active:scale-[.98]"
        >
          Confirm
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-[#0B648D] py-3 text-base font-semibold uppercase text-[#0B648D] transition hover:bg-blue-50 active:scale-[.98]"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Users Module ───────────────────────────────────────────────────────
const Users = () => {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [activeUserModal, setActiveUserModal] = useState(null); 
  const [archiveUser, setArchiveUser] = useState(null);
  const [user, setUser] = useState([]);

  // Pagination states (set to 10 items per page like found items)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUser(data);
    } catch (error) {
      console.log("Fetching error: ", error);
    }
  }

  async function handleOpenViewEdit(userItem) {
    try {
      const data = await getUserById(userItem.id);
      setActiveUserModal(data);
    } catch (error) {
      setActiveUserModal(userItem);
    }
  }

  async function handleSaveEdit(updatedUser) {
    try {
      await updateUserById(activeUserModal.id, {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        contact_number: updatedUser.contact_number,
        role: updatedUser.role,
        is_active: updatedUser.is_active,
      });
      await fetchUsers();
      window.alert('User updated successfully!');
      setActiveUserModal(null);
    } catch (error) {
      alert('Failed to update user.');
    }
  }

  async function handleAddUser(newUser) {
    try {
      await createUser({
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        contact_number: newUser.contact_number,
        role: newUser.role || 'moderator',
        is_active: true,
      });
      await fetchUsers();
      setAddOpen(false);
      window.alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async function handleArchiveUser(userItem) {
    try {
      await updateUserById(userItem.id, {
        first_name: userItem.first_name,
        last_name: userItem.last_name,
        email: userItem.email,
        contact_number: userItem.contact_number,
        role: userItem.role,
        is_active: userItem.is_active,
        is_archived: true,
      });
      await fetchUsers();
      setArchiveUser(null);
      window.alert('User archived successfully!');
    } catch (error) {
      alert('Failed to archive user.');
    }
  }

  // Filter computation
  const filtered = user.filter((u) => {
    const searchText = search.toLowerCase();
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email;
    return (
      u.is_archived === false && (
        fullName.toLowerCase().includes(searchText) ||
        String(u.id).includes(searchText) ||
        u.email?.toLowerCase().includes(searchText) ||
        u.contact_number?.toLowerCase().includes(searchText) ||
        u.role?.toLowerCase().includes(searchText)
      )
    );
  }).sort((a, b) => b.id - a.id);

  // Pagination calculations patterned exactly after FoundItems
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  const visiblePages = getVisiblePages();

  function toTitleCase(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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
                    Registered Users
                  </h3>
                  <p className="text-md sm:text-base text-[#7B8AA6] italic mt-1">
                    Manage all registered system user accounts
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-[330px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B6B8A] text-lg">🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-3 border border-[#CBD8E8] rounded-full text-lg outline-none bg-white text-[#071E3D] placeholder:text-[#8A98B3] focus:ring-2 focus:ring-[#0B6B8A]/20 focus:border-[#0B6B8A] transition-all"
                />
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="px-6 py-3 rounded-full bg-[#2D366D] text-white font-black uppercase tracking-[0.12em] text-m shadow-[0_6px_14px_rgba(45,54,109,0.25)] hover:bg-[#24305C] transition-all whitespace-nowrap"
              >
                📋 Add User
              </button>
            </div>
          </div>
        </div>

        {/* Content Table Wrapper */}
        <div className="flex-1 overflow-y-auto bg-white">
          <table className="w-full min-w-[1000px] table-fixed border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="bg-[#0B6B8A] p-3 w-[15%] border border-gray-300 text-white font-bold text-center uppercase w-[4%]">ID</th>
                <th className="bg-[#0B6B8A] p-3 w-[15%] border border-gray-300 text-white font-bold text-center uppercase w-[18%]">Name</th>
                <th className="bg-[#0B6B8A] p-3 w-[15%] border border-gray-300 text-white font-bold text-centeruppercase w-[20%]">Email</th>
                <th className="bg-[#0B6B8A] p-3 w-[15%] border border-gray-300 text-white font-bold text-center uppercase w-[18%]">Contact No.</th>
                <th className="bg-[#0B6B8A] p-3 w-[15%] border border-gray-300 text-white font-bold text-center uppercase w-[12%]">Role</th>
                <th className="bg-[#0B6B8A] p-3 w-[15%] border border-gray-300 text-white font-bold text-center uppercase w-[8%]">Status</th>
                <th className="bg-[#0B6B8A] p-3 w-[15%] border border-gray-300 text-white font-bold text-center uppercase w-[20%]">Action</th>
              </tr>
            </thead>
            
            <tbody className="bg-white">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((u, index) => {
                  return (
                    <tr key={u.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                      <td className="border border-gray-300 p-4 text-center font-semibold text-slate-700">
                        <span className="font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-500 font-bold inline-block"> 
                          #U-{String(u.id).padStart(3, '0')}
                        </span>
                      </td>
                      
                      <td className="border border-gray-300 p-4 text-center font-semibold text-slate-700">
                        {toTitleCase(u.first_name)} {toTitleCase(u.last_name)}
                      </td>
                      
                      <td className="border border-gray-300 p-4 text-center text-slate-600">
                        {u.email}
                      </td>

                     <td className="border border-gray-300 p-4 text-center text-slate-600">
                        {u.contact_number || '-'}
                      </td>
                      
                      <td className="border border-gray-300 p-4 text-center">
                       <span className={`px-3 py-1 rounded text-[12px] font-bold uppercase ${roleColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      
                      <td className="border border-gray-300 p-4 text-center">
                        <span className={`px-3 py-1 rounded text-[12px] font-bold uppercase ${statusColor(u)}`}>
                          {statusText(u)}
                        </span>
                      </td>
                      
                      <td className="border border-gray-300 p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleOpenViewEdit(u)}
                            className="bg-[#0B6C9C] text-white px-4 py-2 rounded hover:bg-[#09597F] transition text-[13px] font-bold"
                          >
                            View User
                          </button>
                          <button
                            onClick={() => setArchiveUser(u)}
                            className="bg-[#2D366D] text-white px-4 py-2 rounded hover:opacity-90 transition text-[13px] font-bold"
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="bg-white text-center py-32">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[#EEF4FA] flex items-center justify-center text-3xl">👥</div>
                      <span className="text-4xl opacity-20 font-black tracking-tighter text-[#071E3D]">EMPTY</span>
                      <p className="text-xs font-sans tracking-[0.2em] uppercase font-bold text-[#7B8AA6]">No active users discovered</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Block matching FoundItems layout */}
        {filtered.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-[#D8E2EF] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-[#7B8AA6]">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="h-10 rounded-lg border border-[#D8E2EF] px-4 text-xs font-black uppercase tracking-wide text-[#0B6B8A] transition hover:bg-[#EAF4FF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-10 rounded-lg border border-[#D8E2EF] px-4 text-xs font-black uppercase tracking-wide text-[#0B6B8A] transition hover:bg-[#EAF4FF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {archiveUser && (
          <ConfirmModal
            message={`Archive user profile "${archiveUser.email}"? This operator account will instantly lose system access pathways.`}
            onConfirm={() => handleArchiveUser(archiveUser)}
            onClose={() => setArchiveUser(null)}
          />
        )}

        {/* Popups Layer */}
        {addOpen && <UserModal onSave={handleAddUser} onClose={() => setAddOpen(false)} />}
        
        {activeUserModal && (
          <UserModal 
            user={activeUserModal} 
            onSave={handleSaveEdit} 
            onClose={() => setActiveUserModal(null)} 
          />
        )}

        {archiveUser && (
          <ConfirmModal
            message={`Archive user profile "${archiveUser.email}"? This operator account will instantly lose system access pathways.`}
            onConfirm={() => handleArchiveUser(archiveUser)}
            onClose={() => setArchiveUser(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Users;