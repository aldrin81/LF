import React from 'react';

const Users = () => {
  const users = [
    { id: '2022-001', name: 'Daphne Rivera', role: 'Admin', email: 'daphne@slc.edu.ph' },
    { id: '2022-045', name: 'Aldrin Suarez Jr', role: 'Student', email: 'aldrin@slc.edu.ph' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b">
        <h2 className="font-black text-[#2D366D] uppercase tracking-tighter text-xl">System Users</h2>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">
          <tr>
            <th className="p-6">ID Number</th>
            <th className="p-6">Full Name</th>
            <th className="p-6">Email Address</th>
            <th className="p-6">Account Role</th>
            <th className="p-6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-center">
          {users.map((u) => (
            <tr key={u.id} className="text-sm hover:bg-slate-50 transition">
              <td className="p-6 font-mono text-slate-400">{u.id}</td>
              <td className="p-6 font-bold text-slate-700">{u.name}</td>
              <td className="p-6 text-slate-500">{u.email}</td>
              <td className="p-6">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'Admin' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {u.role}
                </span>
              </td>
              <td className="p-6 flex justify-center space-x-4">
                <button className="text-blue-500 font-bold text-xs uppercase underline">Edit</button>
                <button className="text-red-400 font-bold text-xs uppercase underline">Ban</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;