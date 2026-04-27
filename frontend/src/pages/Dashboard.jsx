import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Package, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const statusColor = (s) =>
  s === 'Claimed'   ? 'bg-purple-100 text-purple-500' :
  s === 'Pending'   ? 'bg-orange-100 text-orange-500' :
  s === 'Available' ? 'bg-green-100 text-green-500'   :
  'bg-slate-100 text-slate-400';

const StatCard = ({ label, count, icon: Icon, color, bgColor, trend }) => (
  <div className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative`}>
    <div className={`absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110`}>
      <Icon size={80} />
    </div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-800">{count}</h3>
        {trend && (
          <p className="text-[9px] font-bold text-green-500 mt-1 flex items-center gap-1">
            <TrendingUp size={10} /> {trend}
          </p>
        )}
      </div>
      <div className={`${bgColor} ${color} p-2.5 rounded-xl shadow-inner`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const Dashboard = ({ role }) => {
  const { lostItems, foundItems, users } = useApp();
  const navigate = useNavigate();

  const totalLost    = lostItems.length;
  const totalFound   = foundItems.length;
  const totalClaimed = lostItems.filter(i => i.status === 'Claimed').length +
                       foundItems.filter(i => i.status === 'Claimed').length;
  const totalUsers   = users.length;
  const recoveryPct  = totalLost === 0 ? 0 : Math.round((lostItems.filter(i=>i.status==='Claimed').length / totalLost) * 100);

  const recent = [
    ...lostItems.map(i => ({ ...i, itemType: 'Lost' })),
    ...foundItems.map(i => ({ ...i, itemType: 'Found' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Welcome Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2D366D] to-[#3D498D] rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black italic tracking-tight uppercase">Dashboard Overview</h2>
            <p className="text-white/70 text-xs font-medium mt-2 max-w-md leading-relaxed uppercase tracking-wider">
              Monitoring the campus pulse. You have <span className="text-white font-bold underline underline-offset-4 decoration-orange-400">
              {lostItems.filter(i=>i.status==='Pending').length} pending reports</span> that require your attention today.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
            <div className="text-center px-4 border-r border-white/10">
              <p className="text-[9px] font-black uppercase tracking-tighter opacity-60">Recovery</p>
              <p className="text-2xl font-black">{recoveryPct}%</p>
            </div>
            <div className="text-center px-4">
              <p className="text-[9px] font-black uppercase tracking-tighter opacity-60">Active Users</p>
              <p className="text-2xl font-black">{totalUsers}</p>
            </div>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Lost Items"    count={totalLost}    icon={AlertCircle}  color="text-red-500"    bgColor="bg-red-50" trend="+12% this week" />
        <StatCard label="Found Items"   count={totalFound}   icon={CheckCircle2} color="text-green-500"  bgColor="bg-green-50" trend="+5% this week" />
        <StatCard label="Items Claimed" count={totalClaimed} icon={Package}      color="text-purple-500" bgColor="bg-purple-50" trend="+8% total" />
        <StatCard label="System Users"  count={totalUsers}   icon={Users}        color="text-blue-500"   bgColor="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Items Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-sans">Recent Activity Feed</h3>
              <p className="text-[10px] text-gray-400 font-sans italic mt-0.5">Real-time updates from the community</p>
            </div>
            <button 
              onClick={() => navigate('/lost-items')}
              className="text-[10px] font-black uppercase tracking-widest text-[#2D366D] hover:underline transition-all"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[11px] font-sans">
              <thead className="bg-slate-50 text-slate-400 font-black uppercase border-b text-[9px] tracking-widest">
                <tr>
                  <th className="p-4 pl-6">Item Detail</th>
                  <th className="p-4 text-center">Type</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${item.itemType === 'Lost' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                          {item.itemType === 'Lost' ? '◈' : '◉'}
                        </div>
                        <div>
                          <p className="font-black text-slate-700 uppercase tracking-tight">{item.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{item.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${item.itemType === 'Lost' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                        {item.itemType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-bold">{item.area}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${statusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-300 italic text-sm">No recent activity detected.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Center / Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-sans mb-4 border-b pb-4">Quick Insights</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-700 uppercase">Attention Needed</p>
                  <p className="text-[11px] text-slate-400 font-medium">{lostItems.filter(i=>i.status==='Pending').length} unapproved reports</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-700 uppercase">Success Rate</p>
                  <p className="text-[11px] text-slate-400 font-medium">Higher than last month</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[9px] font-black text-[#2D366D] uppercase tracking-widest mb-2">Pro Tip</p>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  "Encourage students to upload photos. Reports with images are resolved 40% faster."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
            <h4 className="text-sm font-black uppercase italic tracking-tighter">System Notice</h4>
            <p className="text-[10px] opacity-90 mt-2 font-medium leading-relaxed">
              Database synchronization with SAO records scheduled for 12:00 AM tonight. Expect brief downtime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;