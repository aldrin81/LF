import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Package, Users, ShieldAlert, Sparkles, Activity, MapPin, Award } from 'lucide-react';
import { getItems, getUsers } from '../api/api';

const statusColor = (s) =>
  s === 'Claimed'  ? 'bg-purple-50 text-purple-600 border border-purple-100' :
  s === 'Pending'  ? 'bg-orange-50 text-orange-600 border border-orange-100' :
  s === 'Approved' ? 'bg-green-50 text-green-600 border border-green-100'  :
  'bg-slate-100 text-slate-500 border border-slate-200';

const StatCard = ({
  label,
  count,
  icon: Icon,
  color,
  bgColor,
  description,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group relative flex flex-col justify-between overflow-hidden ${
        onClick ? "cursor-pointer" : ""
    }`}
>
    <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 text-slate-900`}>
      <Icon size={120} />
    </div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">{label}</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight font-sans">{count}</h3>
      </div>
      <div className={`${bgColor} ${color} p-3 rounded-2xl shadow-sm border border-white/50 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={20} className="stroke-[2.5]" />
      </div>
    </div>

    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between relative z-10">
      <span className="text-[11px] font-medium text-slate-400 tracking-wide w-full">{description}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
    fetchUsers();

    const interval = setInterval(() => {
      fetchItems();
      fetchUsers();
    }, 5000); // Safely keeps analytics synchronized

    return () => clearInterval(interval);
  }, []);

  async function fetchItems() {
    try {
      const data = await getItems();
      setItems(data || []);
    } catch (error) {
      console.error('Fetching of items error: ', error);
    }
  }

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Fetching of users error: ', error);
    }
  }

  const totalLost = items.filter(i => i.type === 'Lost').length;
  const totalSurrendered = items.filter(i => i.type === 'Surrendered').length;
  const totalClaimed = items.filter(i => i.status === 'Claimed').length;
  const totalUsers = users.length;
  const recoveryPct = totalLost === 0 ? 0 : Math.round((totalClaimed / totalLost) * 100);
  const pendingCount = items.filter(i => i.status === 'Pending').length;
  const recoveryRate =
    totalLost === 0
    ? 0
    : Math.round((totalClaimed / totalLost) * 100);


  const locations = {};

  items.forEach(item => {
    if(item.type === "Lost"){
      locations[item.location] =
        (locations[item.location] || 0) + 1;
    }
  });


  const hotspot =
    Object.keys(locations).length > 0
    ? Object.keys(locations).reduce((a,b)=>
        locations[a] > locations[b] ? a : b
      )
    : "None";
    const recent = [...items]
      .map((item) => ({ ...item, itemType: item.type }))
      .sort((a, b) => b.id - a.id)
      .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-10">
      
      {/* ─── Hero Module ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2D366D] via-[#354082] to-[#1E254E] rounded-[32px] p-8 md:p-10 text-white shadow-xl border border-slate-800/10">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-4">
              <Sparkles size={12} className="text-orange-400 fill-orange-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-300">Live Campus Pulse</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase text-white drop-shadow-sm">
              Dashboard Overview
            </h2>
            <p className="text-white/70 text-xs font-medium mt-2 max-w-xl leading-relaxed uppercase tracking-wider">
              Centralized monitoring desk. You have <span className="text-white font-black underline underline-offset-4 decoration-orange-400 bg-white/5 px-1.5 py-0.5 rounded">{pendingCount} verification cycles</span> pending operational approval today.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex items-center gap-6 w-full lg:w-auto justify-around lg:justify-start">
            <div className="text-center pr-6 lg:border-r border-white/10">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-50 mb-1">Global Recovery</p>
              <p className="text-3xl font-black text-orange-400 tracking-tight">{recoveryPct}%</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-50 mb-1">System Capacity</p>
              <p className="text-3xl font-black text-white tracking-tight">{totalUsers} <span className="text-xs text-white/40 font-normal">ops</span></p>
            </div>
          </div>
        </div>
        {/* Abstract Geometry overlays */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

<div>

          <h3 className="
          text-xs
          font-black
          uppercase
          tracking-[0.2em]
          text-slate-800
          mb-4
          ">
          Reports Overview
          </h3>


          <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
          ">


        <StatCard
          label="Recovery Rate"
          count={`${recoveryRate}%`}
          icon={Award}
          color="text-indigo-500"
          bgColor="bg-indigo-50"
          description="Successfully resolved cases"
          onClick={() => navigate("/dashboard/reports#recovery")}
          />

          <StatCard
label="Lost Items"
count={totalLost}
icon={AlertCircle}
color="text-rose-500"
bgColor="bg-rose-50"
description="Reported missing items"
onClick={() => navigate("/dashboard/lost-items")}
/>


          <StatCard
label="Surrendered"
count={totalSurrendered}
icon={CheckCircle2}
color="text-emerald-500"
bgColor="bg-emerald-50"
description="Items turned over"
onClick={() => navigate("/dashboard/surrendered-items")}
/>


          <StatCard
label="Top Hotspot"
count={hotspot}
icon={MapPin}
color="text-orange-500"
bgColor="bg-orange-50"
description="Most reported location"
onClick={() => navigate("/dashboard/reports#hotspot")}
/>


          </div>

          </div>
      {/* ─── Metric Dash-Cards Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Resolved Matches" count={totalClaimed} icon={Package} color="text-purple-500" bgColor="bg-purple-50" description="Successfully turned over" />
        <StatCard
  label="System Operators"
  count={totalUsers}
  icon={Users}
  color="text-indigo-500"
  bgColor="bg-indigo-50"
  description="Authorized active roles"
  onClick={() => {
    navigate("/dashboard/users");
  }}
/>
<StatCard
  label="Claim Requests"
  count={pendingCount}
  icon={AlertCircle}
  color="text-orange-500"
  bgColor="bg-orange-50"
  description="Pending verification requests"
  onClick={() => navigate("/dashboard/claim-requests")}
/>
      </div>
          {/* ─── Reports Overview ─── */}
          
      {/* ─── Main Content Layers ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Recent Items Table Layer */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Recent Registry Stream</h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Real-time telemetry from institutional platforms</p>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[750px] table-fixed border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 font-black uppercase border-b border-slate-100 text-[9px] tracking-[0.15em]">
                  <th className="p-4 pl-6 w-[32%]">Item Core Detail</th>
                  <th className="p-4 text-center w-[13%]">Classification</th>
                  <th className="p-4 w-[25%]">Discovery Location</th>
                  <th className="p-4 w-[18%]">Timestamp</th>
                  <th className="p-4 text-center w-[12%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {recent.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-blue-50/30 transition-all duration-200 group h-[74px]">
                    
                    <td className="p-4 pl-6 truncate align-middle">
                      <p className="font-black text-slate-800 capitalize tracking-tight text-[13px] group-hover:text-[#2D366D] transition-colors truncate">{item.title}</p>
                      <span className="inline-block text-[10px] text-slate-400 font-mono mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded">
                        #ID-{String(item.id || idx).padStart(4, '0')}
                      </span>
                    </td>
                    
                    <td className="p-4 text-center align-middle">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.itemType === 'Lost' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {item.itemType}
                      </span>
                    </td>
                    
                    <td className="p-4 text-slate-500 font-bold tracking-tight truncate align-middle">
                      📍 {item.location}
                    </td>
                    
                    <td className="p-4 text-slate-400 text-[11px] font-medium align-middle">
                      <p className="text-slate-700 font-bold">{item.created_date || item.date}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.created_time || '00:00 AM'}</p>
                    </td>
                    
                    <td className="p-4 text-center align-middle">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                  </tr>
                ))}
                
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                        <Activity size={32} className="opacity-20 animate-pulse text-slate-400" />
                        <p className="text-xs font-black tracking-[0.15em] uppercase text-slate-400">
                          No active telemetry detected
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Operational Insights Sidebar */}
        <div className="space-y-6">
          
          {/* Insights Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-4 border-b pb-4">Quick Analytics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-orange-100">
                  <ShieldAlert size={18} className="stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Unverified Logs</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">{pendingCount} workflows awaiting validation</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                  <Activity size={18} className="stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Turnover Rate</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Optimized resolution acceleration</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden">
                <p className="text-[10px] font-black text-[#2D366D] uppercase tracking-[0.15em] mb-1.5">System Pro-Tip</p>
                <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">
                  "Encourage digital imagery uploads. Clear item captures directly decrease verification processing delays by approximately 40%."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 bg-gradient-to-bl from-orange-500/20 to-transparent w-24 h-24 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] italic">System Architecture Notice</h4>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Database layer consolidation with SAO student registries is slated for <span className="text-white font-bold">12:00 AM PHT</span>. Short system access latencies may occur.
            </p>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Dashboard;