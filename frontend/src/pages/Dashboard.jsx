import React from 'react';
import { AlertCircle, CheckCircle2, Package, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Dashboard = ({ role, onNavigate }) => {
  const { lostItems, foundItems, users } = useApp();

  const totalLost    = lostItems.length;
  const totalFound   = foundItems.length;
  const totalClaimed = lostItems.filter(i => i.status === 'Claimed').length +
                       foundItems.filter(i => i.status === 'Claimed').length;
  const totalUsers   = users.length;
  const recoveryPct  = totalLost === 0 ? 0 : Math.round((lostItems.filter(i=>i.status==='Claimed').length / totalLost) * 100);

  // Recent: merge lost + found, sort by date desc, take 5
  const recent = [
    ...lostItems.map(i => ({ ...i, itemType: 'Lost' })),
    ...foundItems.map(i => ({ ...i, itemType: 'Found' })),
  ].slice(0, 6);

  const statusColor = (s) =>
    s === 'Claimed'   ? 'bg-purple-100 text-purple-500' :
    s === 'Pending'   ? 'bg-orange-100 text-orange-500' :
    s === 'Available' ? 'bg-green-100 text-green-500'   :
    'bg-slate-100 text-slate-400';

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Lost Items"    count={totalLost}    icon={AlertCircle}  color="text-red-500"    bgColor="bg-red-50" />
        <StatCard label="Found Items"   count={totalFound}   icon={CheckCircle2} color="text-green-500"  bgColor="bg-green-50" />
        <StatCard label="Claimed Items" count={totalClaimed} icon={Package}      color="text-purple-500" bgColor="bg-purple-50" />
        <StatCard label="Total Users"   count={totalUsers}   icon={Users}        color="text-[#2D366D]"  bgColor="bg-blue-50" />
      </div>

      {/* Recovery rate banner */}
      <div className="bg-[#2D366D] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-white/60 text-[9px] font-black uppercase tracking-widest font-sans">Current Recovery Rate</p>
          <p className="text-white text-3xl font-black mt-1">{recoveryPct}%</p>
          <p className="text-white/50 text-[10px] font-sans italic mt-0.5">
            {lostItems.filter(i=>i.status==='Claimed').length} of {totalLost} lost items returned to owners
          </p>
        </div>
        <button
          onClick={() => onNavigate('Reports')}
          className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-sans flex items-center gap-2"
        >
          <TrendingUp size={14} />
          View Full Report
        </button>
      </div>

      {/* Recent items table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-sans">Recent Items</h3>
          <p className="text-[10px] text-gray-400 font-sans italic mt-0.5">Latest activity in the system</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-sans min-w-[480px]">
            <thead className="bg-gray-50 text-gray-400 font-black uppercase border-b text-[9px] tracking-widest">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4 text-center">Type</th>
                <th className="p-4">Reporter / Finder</th>
                <th className="p-4">Area</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {recent.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-black text-slate-700">{item.name}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${item.itemType === 'Lost' ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
                      {item.itemType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{item.reporter || item.finder}</td>
                  <td className="p-4 text-slate-500">{item.area}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${statusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-300 italic text-xs">No items yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, count, icon: Icon, color, bgColor }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
    <div>
      <p className="text-gray-400 text-[9px] font-black tracking-widest mb-1 uppercase font-sans">{label}</p>
      <h3 className="text-2xl font-black text-slate-800">{count}</h3>
    </div>
    <div className={`w-11 h-11 rounded-xl ${bgColor} ${color} flex items-center justify-center shadow-inner`}>
      <Icon size={22} strokeWidth={2.5} />
    </div>
  </div>
);

export default Dashboard;