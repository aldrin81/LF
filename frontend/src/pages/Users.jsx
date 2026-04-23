import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ROLES = ['Admin','Moderator','User'];

const roleColor = (r) =>
  r === 'Admin'     ? 'bg-green-100 text-green-600'  :
  r === 'Moderator' ? 'bg-purple-100 text-purple-500':
  'bg-blue-100 text-blue-500';

const EMPTY = { name:'', idNum:'', role:'User', email:'', status:'Active' };

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
        <form onSubmit={e=>{e.preventDefault();onSave(form);onClose();}} className="p-7 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="inp" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Juan Dela Cruz" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">ID Number</label>
              <input className="inp" value={form.idNum} onChange={e=>set('idNum',e.target.value)} placeholder="e.g. 23100101" required />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="inp" value={form.role} onChange={e=>set('role',e.target.value)}>
                {ROLES.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Email Address</label>
            <input className="inp" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="e.g. juan@slc.edu.ph" required />
          </div>
          {isEdit && (
            <div>
              <label className="label">Status</label>
              <select className="inp" value={form.status} onChange={e=>set('status',e.target.value)}>
                <option>Active</option>
                <option>Banned</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-[#2D366D] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all">
              {isEdit ? 'Save Changes' : 'Add User'}
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
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [search,    setSearch]    = useState('');
  const [addOpen,   setAddOpen]   = useState(false);
  const [editUser,  setEditUser]  = useState(null);
  const [delUser,   setDelUser]   = useState(null);
  const [banUser,   setBanUser]   = useState(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.idNum.includes(search) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

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
              <th className="p-4">Name</th>
              <th className="p-4">ID Number</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(user=>(
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-400 font-bold">#{user.id}</td>
                <td className="p-4 font-black text-gray-700">{user.name}</td>
                <td className="p-4 text-gray-500 font-mono">{user.idNum}</td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${roleColor(user.role)}`}>{user.role}</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2 text-[9px] font-black uppercase">
                    <button onClick={()=>setEditUser(user)} className="text-amber-500 hover:underline">Edit</button>
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

      {addOpen  && <UserModal onSave={addUser} onClose={()=>setAddOpen(false)} />}
      {editUser && <UserModal user={editUser} onSave={u=>updateUser(editUser.id,u)} onClose={()=>setEditUser(null)} />}
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