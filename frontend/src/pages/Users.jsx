import React, { useState, useEffect } from 'react';
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
  id: '', 
  username: '', 
  first_name: '', 
  last_name: '', 
  email: '', 
  role: 'moderator', 
  is_active: null, 
  created_at: '', 
  updated_at: '', 
  is_archived: false, 
};

// ─── User Modal (Add / Edit / View) ──────────────────────────────────────────
const UserModal = ({ user, onSave, onClose, mode = 'edit' }) => {
  const [form, setForm] = useState(user || EMPTY);
  const isEdit = !!user && mode !== 'view';
  const isView = mode === 'view';
  
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center px-7 py-5 border-b">
          <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">
            {isView ? 'View User' : isEdit ? 'Edit User' : 'Add User'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isView) await onSave(form);
          }}
          className="p-7 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                className="inp"
                value={form.first_name || ''}
                onChange={(e) => set('first_name', e.target.value)}
                placeholder="First name"
                disabled={isView}
              />
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                className="inp"
                value={form.last_name || ''}
                onChange={(e) => set('last_name', e.target.value)}
                placeholder="Last name"
                disabled={isView}
              />
            </div>
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              className="inp"
              type="email"
              value={form.email || ''}
              onChange={(e) => set('email', e.target.value)}
              placeholder="email@example.com"
              disabled={isView}
            />
          </div>

          <div>
            <label className="label">Username</label>
            <input
              className="inp"
              value={form.username || ''}
              onChange={(e) => set('username', e.target.value)}
              placeholder="Username"
              required
              disabled={isView}
            />
          </div>

          {!isEdit && !isView && (
            <div>
              <label className="label">Password</label>
              <input
                className="inp"
                type="password"
                value={form.password || ''}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Password"
                required
                disabled={isView}
              />
            </div>
          )}

          <div>
            <label className="label">Role</label>
            <select
              className="inp"
              value={form.role || 'moderator'}
              onChange={(e) => set('role', e.target.value)}
              disabled={isView}
            >
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          {isEdit && (
            <div>
              <label className="label">Status</label>
              <select
                className="inp"
                value={form.is_active ? 'Active' : 'Inactive'}
                onChange={(e) => set('is_active', e.target.value === 'Active')}
                disabled={isView}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {isView ? (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="flex-1 bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all"
                >
                  {isEdit ? 'Save Changes' : 'Add User'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Archive Confirmation Modal ──────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
      <div className="text-3xl mb-3">⚠️</div>
      <h3 className="font-black text-slate-800 text-base uppercase italic mb-2">Are you sure?</h3>
      <p className="text-slate-400 text-xs font-sans mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all">Confirm</button>
        <button onClick={onClose}   className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Cancel</button>
      </div>
    </div>
  </div>
);

// ─── Main Users Module ───────────────────────────────────────────────────────
const Users = () => {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [archiveUser, setArchiveUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUsers();

    const interval = setInterval(() => {
      fetchUsers();
    }, 5000); // Polling safely every 5 seconds

    return () => clearInterval(interval);
  }, []);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUser(data);
    } catch (error) {
      console.log("Fetching error: ", error);
    }
  }

  async function handleEdit(user) {
    try {
      const data = await getUserById(user.id);
      setEditUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error.response?.data || error);
      setEditUser(user);
    }
  }

  async function handleSaveEdit(updatedUser) {
    try {
      await updateUserById(editUser.id, {
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
        is_active: updatedUser.is_active,
      });
      await fetchUsers();
      window.alert('User updated successfully!');
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error);
      alert('Failed to update user.');
    }
  }

  async function handleAddUser(newUser) {
    try {
      await createUser({
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role || 'moderator',
        password: newUser.password,
        is_active: true,
      });

      const refreshedUsers = await getUsers();
      setUser(refreshedUsers);

      setAddOpen(false);
      window.alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error.response?.data || error);
      alert(JSON.stringify(error.response?.data || 'Failed to add user.'));
    }
  }

  async function handleView(user) {
    try {
      const data = await getUserById(user.id);
      setViewUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error.response?.data || error);
      setViewUser(user);
    }
  }

  async function handleArchiveUser(user) {
    try {
      await updateUserById(user.id, {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        is_archived: true,
      });

      await fetchUsers();
      setArchiveUser(null);
      window.alert('User archived successfully!');
    } catch (error) {
      console.error('Error archiving user:', error.response?.data || error);
      alert(JSON.stringify(error.response?.data || 'Failed to archive user.'));
    }
  }

  const filtered = user.filter((u) => {
    const searchText = search.toLowerCase();
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username;

    return (
      u.is_archived === false && (
        fullName.toLowerCase().includes(searchText) ||
        String(u.id).includes(searchText) ||
        u.username?.toLowerCase().includes(searchText) ||
        u.email?.toLowerCase().includes(searchText) ||
        u.role?.toLowerCase().includes(searchText)
      )
    );
  });

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
      
      {/* Control Header */}
      {/* Header */}
  <div className="bg-white px-6 sm:px-8 py-6 border-b border-[#D8E2EF] shrink-0">
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

      <div className="flex items-center gap-3">
        <div className="w-1.5 h-10 rounded-full " />

        <div>
          <h3 className="text-[22px] sm:text-2xl font-black uppercase tracking-[0.18em] text-[#071E3D]">
            Registered Users
          </h3>

          <p className="text-base text-[#7B8AA6] italic mt-1">
            Manage all registered system user accounts
          </p>
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
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-3 border border-[#CBD8E8] rounded-full text-lg outline-none bg-white text-[#071E3D] placeholder:text-[#8A98B3] focus:ring-2 focus:ring-[#0B6B8A]/20 focus:border-[#0B6B8A] transition-all"
          />
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="px-14 py-3 rounded-full bg-[#2D366D] text-white font-black uppercase tracking-[0.12em] text-m shadow-[0_6px_14px_rgba(45,54,109,0.25)] hover:bg-[#24305C] transition-all whitespace-nowrap"
        >
          📋 Add User
        </button>

      </div>

    </div>
  </div>

  {/* TABLE WRAPPER START */}
  <div className="flex-1 overflow-y-auto bg-white">
  <table className="w-full min-w-[1000px] table-fixed border-separate border-spacing-0">
  <thead className="sticky top-0 z-10">
    <tr>
      <th className="bg-[#0B6B8A] p-2 text-white font-black uppercase text-[16px] text-center">ID</th>
      <th className="bg-[#0B6B8A] p-4 text-white font-black uppercase text-[16px] text-center">Username</th>
      <th className="bg-[#0B6B8A] p-4 text-white font-black uppercase text-[16px] text-center">Name</th>
      <th className="bg-[#0B6B8A] p-4 text-white font-black uppercase text-[16px] text-center">Email</th>
      <th className="bg-[#0B6B8A] p-4 text-white font-black uppercase text-[16px] text-center">Role</th>
      <th className="bg-[#0B6B8A] p-4 text-white font-black uppercase text-[16px] text-center">Status</th>
      <th className="bg-[#0B6B8A] p-4 text-white font-black uppercase text-[16px] text-center">Actions</th>
    </tr>
  </thead>
          
          <tbody className="divide-y divide-slate-100 bg-white">
            {filtered.length > 0 ? (
              filtered.map(u => (
                <tr key={u.id} className="hover:bg-blue-50/40 transition-colors h-[80px]">
                  
                  <td className="bg-white p-5 text-center align-middle">
                    <span className="font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-500 font-bold inline-block"> #U-{String(u.id).padStart(3, '0')}
                    </span>
                  </td>
                  
                  <td className="bg-white p-5 font-bold text-slate-700 text-center align-middle truncate px-4">{u.username}
                  </td>
                  
                  <td className="bg-white p-5 text-slate-500 text-center align-middle px-4 truncate">
                    {toTitleCase(u.first_name)} {toTitleCase(u.last_name)}
                  </td>
                  
                  <td className="bg-white p-5 text-slate-500 text-center align-middle px-4 truncate">
                    {toTitleCase(u.email)}
                  </td>
                  
                  <td className="bg-white p-5 text-center align-middle">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${roleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  
                  <td className="bg-white p-5 text-center align-middle">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusColor(u)}`}>
                      {statusText(u)}
                    </span>
                  </td>
                  
                  <td className="bg-white p-5 text-center align-middle">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleView(u)}
                        className="bg-[#0B6B8A] text-white hover:bg-[#095A74] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEdit(u)} 
                        className="bg-white border border-[#C79A2B] text-[#9A741C] hover:bg-[#FFF8E8] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setArchiveUser(u)}
                        className="bg-white border border-red-300 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
            
                      >
                        Archive
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="bg-white text-center py-40">
                  <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                    <span className="text-6xl opacity-10 font-black tracking-tighter">
                      EMPTY
                    </span>
                    <p className="text-sm font-sans tracking-[0.2em] uppercase font-bold text-slate-400">
                      No active users discovered
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-slate-50 p-5 border-t border-slate-100 shrink-0 text-center z-20">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
          SLC Seek &amp; Balik Centralized Account Services
        </p>
      </div>

      {/* Popups Layer */}
      {addOpen && (
        <UserModal 
          onSave={handleAddUser} 
          onClose={() => setAddOpen(false)} 
        />
      )}
      
      {editUser && (
        <UserModal
          user={editUser}
          onSave={handleSaveEdit}
          onClose={() => setEditUser(null)}
        />
      )}

      {viewUser && (
        <UserModal
          user={viewUser}
          mode="view"
          onClose={() => setViewUser(null)}
        />
      )}

      {archiveUser && (
        <ConfirmModal
          message={`Archive user profile "${archiveUser.username}"? This operator account will instantly lose system access pathways.`}
          onConfirm={() => handleArchiveUser(archiveUser)}
          onClose={() => setArchiveUser(null)}
        />
      )}

    </div>
  );
};

export default Users;