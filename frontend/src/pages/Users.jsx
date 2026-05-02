import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getUsers, getUserById, updateUserById, createUser } from '../api/api';

const ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
];


const roleColor = (r) =>
  r === 'admin'     ? 'bg-green-100 text-green-600'  :
  r === 'moderator' ? 'bg-purple-100 text-purple-500':
  'bg-blue-100 text-blue-500';

const statusColor = (status) => {
  if (status === 'archived') return 'bg-gray-400 text-white';
  return status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500';
};

const statusText = (status) => {
  if (status === 'archived') return 'Archived';
  return status ? 'Active' : 'Inactive';
};

const EMPTY = { id:'', username:'', first_name:'', last_name:'', email:'', role: 'moderator', is_active: null, created_at: '', updated_at: '' };

const UserModal = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState(user || EMPTY);
  const isEdit = !!user;
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e)=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center px-7 py-5 border-b">
          <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">
            {isEdit ? 'Edit User' : 'Add User'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
        </div>
        <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSave(form);
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
              />
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                className="inp"
                value={form.last_name || ''}
                onChange={(e) => set('last_name', e.target.value)}
                placeholder="Last name"
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
            />
          </div>

          {!isEdit && (
            <div>
              <label className="label">Password</label>
              <input
                className="inp"
                type="password"
                value={form.password || ''}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          )}

          <div>
            <label className="label">Role</label>
            <select
              className="inp"
              value={form.role || 'moderator'}
              onChange={(e) => set('role', e.target.value)}
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
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
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
          </div>
        </form>
      </div>
    </div>
  );
};

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

const Users = () => {
  const [search,    setSearch]    = useState('');
  const [addOpen,   setAddOpen]   = useState(false);
  const [editUser,  setEditUser]  = useState(null);
  const [delUser,   setDelUser]   = useState(null);
  const [banUser,   setBanUser]   = useState(null);
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUsers();

    const interval = setInterval(() => {
    fetchItems();
  }, 1000); // fetch every 1 seconds

  return () => clearInterval(interval);
  }, [])

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUser(data);
    } catch (error) {
      console.log("Fetching error: ", error)
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
      window.alert('Item updated successfully!');
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



  const filtered = user.filter((u) => {
  const searchText = search.toLowerCase();
  const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username;

  return (
    fullName.toLowerCase().includes(searchText) ||
    String(u.id).includes(searchText) ||
    u.username?.toLowerCase().includes(searchText) ||
    u.email?.toLowerCase().includes(searchText) ||
    u.role?.toLowerCase().includes(searchText)
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
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden font-sans">
      <div className="p-5 border-b flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50">
        <div>
          <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Registered Users</h3>
          <p className="text-[10px] text-gray-400 italic mt-0.5">Manage all registered system users</p>
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
        <table className="w-full text-left text-[11px] min-w-[640px]">
          <thead className="bg-gray-50 text-gray-400 font-black uppercase border-b text-[9px] tracking-widest">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Username</th>
              <th className="p-4">First Name</th>
              <th className="p-4">Last Name</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(user=>(
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-400 font-bold">U{user.id}</td>
                <td className="p-6 font-bold text-slate-700">
                {toTitleCase(user.username)}
              </td>
              <td className="p-4 text-gray-500 ">{toTitleCase(user.first_name)}</td>
              <td className="p-4 text-gray-500">{toTitleCase(user.last_name)}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${roleColor(user.role)}`}>{user.role}</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${statusColor(user.is_active)}`}>
                    {statusText(user.is_active)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2 text-[9px] font-black uppercase">
                    <button onClick={() => handleEdit(user)} className="text-amber-500 hover:underline">
                      Edit
                    </button>

                    <button
                      onClick={()=>setBanUser(user)}
                      className={user.status === 'Active' ? 'text-orange-400 hover:underline' : 'text-green-500 hover:underline'}
                    >
                      {user.status === 'Active' ? 'Ban' : 'Unban'}
                    </button>
                    <button onClick={()=>setDelUser(user)} className="text-red-400 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-slate-300 italic text-xs">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {addOpen  && <UserModal onSave={handleAddUser} onClose={()=>setAddOpen(false)} />}
      {editUser && (
        <UserModal
          user={editUser}
          onSave={handleSaveEdit}
          onClose={() => setEditUser(null)}
        />
      )}

      {banUser  && (
        <ConfirmModal
          message={`${banUser.status === 'Active' ? 'Ban' : 'Unban'} "${banUser.name}"?`}
          onConfirm={()=>{updateUser(banUser.id,{status: banUser.status==='Active'?'Banned':'Active'});setBanUser(null);}}
          onClose={()=>setBanUser(null)}
        />
      )}
      {delUser  && (
        <ConfirmModal
          message={`Permanently delete "${delUser.name}"? This cannot be undone.`}
          onConfirm={()=>{deleteUser(delUser.id);setDelUser(null);}}
          onClose={()=>setDelUser(null)}
        />
      )}
    </div>
  );
};

export default Users;