import React, { useState } from 'react';
import { loginUser, getCurrentUser } from './api/api';


const App = () => {
  // 1. Check LocalStorage immediately so the "view" persists after refresh
  // We use a function inside useState so it only runs once on initial load
  const [view, setView] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true' ? 'dashboard' : 'login';
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('userRole') || '';
  });

  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [error, setError] = useState('');

  // LOGIN LOGIC
  const handleLogin = async (e) => {
  e.preventDefault();

  const username = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  try {
    const loginData = await loginUser(username, password);
    console.log('Login data:', loginData);

    const currentUser = await getCurrentUser();
    console.log('Current user:', currentUser);

    const authenticatedRole =
      currentUser.role === 'admin' ? 'Admin' : 'Moderator';

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', authenticatedRole);

    setRole(authenticatedRole);
    setView('dashboard');
    setError('');
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    setError('Invalid username or password!');
  }
};


  // 3. LOGOUT LOGIC
  const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  setView('login');
  setRole('');
};


  if (view === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center bg-[#F4F7FE]">
        <div className="w-full h-64 bg-slc-blue flex flex-col items-center justify-center text-white relative">
          <h1 className="text-4xl font-serif italic font-bold z-10">Saint Louis College</h1>
          <p className="text-[10px] tracking-[0.4em] mt-2 opacity-80 uppercase z-10 font-bold">The Beacon of Wisdom in the North</p>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md -mt-20 z-20 border border-slate-100">
          <h2 className="text-center font-black text-slc-blue mb-8 uppercase tracking-widest text-xl text-balance">Seek & Balik Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
            <input name="email" type="text" placeholder="Username (admin/moderator)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slc-blue" required />
            <input name="password" type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slc-blue" required />
            <button type="submit" className="w-full bg-slc-blue text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition">Log in</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dashboard-bg overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between shadow-sm z-30">
        <div className="p-8">
          <div className="mb-10">
            <h2 className="text-slc-blue font-black text-xl leading-none uppercase italic tracking-tighter">Seek & Balik</h2>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1">{role} Panel</p>
          </div>
          <nav className="space-y-2">
            {['Dashboard', 'Lost Items', 'Found Items', 'Users'].map((item) => {
              if (item === 'Users' && role === 'Moderator') return null;

              return (
                <button 
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-sm font-bold transition-all ${
                    currentPage === item ? 'bg-blue-50 text-slc-blue shadow-sm' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item === 'Dashboard' ? '📊' : item === 'Users' ? '👤' : '📦'}</span>
                  <span>{item}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-8 border-t space-y-4">
          {/* 4. Updated Logout Button to use handleLogout */}
          <button onClick={handleLogout} className="flex items-center space-x-3 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition w-full text-left">
            <span>➔</span> <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA (Omitted for brevity, remains the same as your code) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ... (Your Header and Main content here) ... */}
         <header className="bg-white border-b px-10 py-5 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{currentPage}</h2>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest italic">Welcome, {role} Rivera</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slc-blue border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs italic">SLC</div>
        </header>

        <main className="p-8 overflow-y-auto">
          {currentPage === 'Dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Lost Items" count="69" color="text-red-500" bg="bg-red-50" icon="❗" />
              <StatCard label="Found Items" count="13" color="text-green-500" bg="bg-green-50" icon="✔️" />
              <StatCard label="Claimed" count="25" icon="📦" color="text-purple-500" bg="bg-purple-50" />
              <StatCard label="Total Users" count="1,424" icon="👤" color="text-blue-500" bg="bg-blue-50" />
            </div>
          ) : (
            <TableView title={currentPage} role={role} />
          )}
        </main>
      </div>
    </div>
  );
};

// HELPERS (Keep these exactly as you had them)
const StatCard = ({ label, count, color, bg, icon }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center transition-transform hover:scale-[1.02]">
      <div>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-slate-800 mt-1">{count}</h3>
      </div>
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center font-bold`}>{icon}</div>
    </div>
);

const TableView = ({ title, role }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">{title} Management</h3>
        <button className="bg-slc-blue text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md transition hover:brightness-110">+ Add New</button>
      </div>
      <table className="w-full text-left text-[11px]">
        <thead className="bg-slate-50 text-slate-400 font-black uppercase border-b">
          <tr>
            <th className="p-4">Item Name</th>
            <th className="p-4">Category</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="p-4 font-black text-slate-700">Sample Laptop</td>
            <td className="p-4 text-slate-500">Electronics</td>
            <td className="p-4 text-center"><span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-black text-[8px] uppercase">Pending</span></td>
            <td className="p-4 text-center space-x-2">
              <button className="text-blue-500 font-black uppercase text-[9px] hover:underline">View</button>
              {role === 'Admin' && <button className="text-red-400 font-black uppercase text-[9px] hover:underline">Delete</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
);

export default App;