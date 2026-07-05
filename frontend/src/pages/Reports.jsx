import React, { useState, useEffect } from 'react';
import { Award, AlertTriangle, CheckCircle2, MapPin, Sparkles, Activity } from 'lucide-react';

// ─── Pure Helpers ─────────────────────────────────────────────────────────────
const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));

const riskLevel = (lost) =>
  lost >= 15 ? 'High Risk' : lost >= 8 ? 'Medium Risk' : 'Low Risk';

const riskColor = (risk) =>
  risk.startsWith('High')   ? 'bg-rose-50 text-rose-600 border border-rose-100'
  : risk.startsWith('Medium') ? 'bg-amber-50 text-amber-600 border border-amber-100'
  : 'bg-emerald-50 text-emerald-600 border border-emerald-100';

const pctColor = (p) =>
  p >= 70 ? 'text-emerald-600' : p >= 50 ? 'text-amber-600' : 'text-rose-500';

const CAT_COLORS = { Personal: '#2D366D', Electronics: '#87CEEB', Accessories: '#22C55E', 'Cash/Cards': '#F59E0B' };

// ─── Stat Card Component ──────────────────────────────────────────────────────
const StatCard = ({ label, count, icon: Icon, color, bgColor, description }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group relative flex flex-col justify-between overflow-hidden">
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 text-slate-900">
      <Icon size={120} />
    </div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">{label}</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight font-sans truncate max-w-[140px] md:max-w-none">{count}</h3>
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

// ─── Animated Donut ───────────────────────────────────────────────────────────
const Donut = ({ segments, cx=90, cy=90, r=68, strokeW=20, label, sublabel }) => {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 120); return () => clearTimeout(t); }, []);

  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  let off = circ / 4;

  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
      <circle fill="none" stroke="#F8FAFC" strokeWidth={strokeW} cx={cx} cy={cy} r={r} />
      {segments.map((seg, i) => {
        const dash = go ? (seg.value / total) * circ : 0;
        const gap  = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-off + circ / 4}
            strokeLinecap="butt"
            style={{ transition: `stroke-dasharray 1s ease ${i * 0.12}s` }}
          />
        );
        off += (seg.value / total) * circ;
        return el;
      })}
      {label    && <text x={cx} y={cy - 4}  textAnchor="middle" fontSize="24" fontWeight="900" fill="#2D366D" fontFamily="sans-serif" className="tracking-tighter">{label}</text>}
      {sublabel && <text x={cx} y={cy + 14} textAnchor="middle" fontSize="8"  fontWeight="900" fill="#94A3B8" fontFamily="sans-serif" letterSpacing="2">{sublabel}</text>}
    </svg>
  );
};

// ─── Horizontal Bar ───────────────────────────────────────────────────────────
const HBar = ({ value, max, color='#2D366D', delay=0 }) => {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200 + delay); return () => clearTimeout(t); }, []);
  return (
    <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden w-full">
      <div className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: go ? `${(value/max)*100}%` : '0%', background: color, transitionDelay: `${delay}ms` }} />
    </div>
  );
};

// ─── Vertical Bar ─────────────────────────────────────────────────────────────
const VBarGroup = ({ data, max }) => {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200); return () => clearTimeout(t); }, []);
  return (
    <div className="flex items-end justify-between gap-2 h-32 px-2 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-end gap-1 w-full justify-center" style={{ height: '96px' }}>
            <div className="flex-1 flex flex-col justify-end max-w-[14px]">
              <div className="rounded-t-md bg-[#BFCBF7] transition-all duration-700 ease-out"
                style={{ height: go ? `${(d.lost/max)*88}px` : '0px', transitionDelay: `${i*50}ms` }} />
            </div>
            <div className="flex-1 flex flex-col justify-end max-w-[14px]">
              <div className="rounded-t-md bg-[#2D366D] transition-all duration-700 ease-out"
                style={{ height: go ? `${(d.found/max)*88}px` : '0px', transitionDelay: `${i*50+25}ms` }} />
            </div>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Preview Shell ────────────────────────────────────────────────────────────
const ReportsDesignPreview = () => {
  // Hardcoded mock properties to test layout and interface nodes directly
  const totalLost = 24;
  const totalClaimed = 16;
  const totalFound = 19;
  const recoveryRate = pct(totalClaimed, totalLost);

  const areaStats = [
    { area: 'Canteen', lost: 18, recovered: 12 },
    { area: 'Library', lost: 9, recovered: 5 },
    { area: 'Parking Lot', lost: 4, recovered: 2 },
    { area: 'Main Building', lost: 2, recovered: 1 },
  ];
  const maxAreaLost = 18;

  const catStats = [
    { cat: 'Personal', count: 10, color: CAT_COLORS['Personal'] },
    { cat: 'Electronics', count: 7, color: CAT_COLORS['Electronics'] },
    { cat: 'Accessories', count: 5, color: CAT_COLORS['Accessories'] },
    { cat: 'Cash/Cards', count: 2, color: CAT_COLORS['Cash/Cards'] },
  ];
  const totalCat = 24;

  const monthlyData = [
    { month: 'Oct', lost: 4, found: 3 },
    { month: 'Nov', lost: 6, found: 5 },
    { month: 'Dec', lost: 2, found: 4 },
    { month: 'Jan', lost: 8, found: 7 },
    { month: 'Feb', lost: 5, found: 3 },
    { month: 'Mar', lost: 9, found: 8 },
  ];
  const maxMonthly = 9;

  const recoverySegs = [
    { value: totalClaimed,             color: '#2D366D' },
    { value: totalLost - totalClaimed, color: '#E2E8F0' },
  ];
  const catSegs = catStats.map(c => ({ value: c.count, color: c.color }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-10 max-w-[100%] mx-auto p-4 bg-slate-50/50 rounded-[40px]">
      
      {/* ─── Hero Module ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2D366D] via-[#354082] to-[#1E254E] rounded-[32px] p-8 md:p-10 text-white shadow-xl border border-slate-800/10">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-4">
              <Sparkles size={12} className="text-orange-400 fill-orange-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-300">Analytical Intel</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase text-white drop-shadow-sm">
              Statistical Reports
            </h2>
            <p className="text-white/70 text-xs font-medium mt-2 max-w-xl leading-relaxed uppercase tracking-wider">
              Comprehensive turnover and spatial density diagnostics. Current campus accountability status is operating at <span className="text-white font-black underline underline-offset-4 decoration-orange-400 bg-white/5 px-1.5 py-0.5 rounded">{recoveryRate}% resolution effectiveness</span>.
            </p>
          </div>
        </div>
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ─── Metric Dash-Cards Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Recovery Rate" count={`${recoveryRate}%`} icon={Award} color="text-indigo-500" bgColor="bg-indigo-50" description={`${totalClaimed} of ${totalLost} cases resolved`} />
        <StatCard label="Total Lost" count={totalLost} icon={AlertTriangle} color="text-rose-500" bgColor="bg-rose-50" description="Cumulative lost log items" />
        <StatCard label="Total Found" count={totalFound} icon={CheckCircle2} color="text-emerald-500" bgColor="bg-emerald-50" description="Surrendered campus items" />
        <StatCard label="Top Hotspot" count={areaStats[0].area} icon={MapPin} color="text-amber-500" bgColor="bg-amber-50" description={`${areaStats[0].lost} incidents registered`} />
      </div>

      {/* ─── Row 1: Recovery donut + Category donut ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recovery rate donut */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] italic">Item Recovery Rate</h3>
            <p className="text-[11px] text-slate-400 font-sans italic mt-0.5 mb-6">Percentage of lost items successfully returned to verified owners</p>
          </div>
          <div className="py-2">
            <Donut segments={recoverySegs} label={`${recoveryRate}%`} sublabel="RECOVERED" />
          </div>
          <div className="flex justify-center gap-6 mt-6 border-t border-slate-50 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2D366D]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Claimed ({totalClaimed})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Unclaimed ({totalLost - totalClaimed})</span>
            </div>
          </div>
        </div>

        {/* Category donut */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] italic">Item Categories</h3>
          <p className="text-[11px] text-slate-400 font-sans italic mt-0.5 mb-6">High-density classifications of logs recorded in the system</p>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Donut segments={catSegs} r={55} strokeW={20} label={totalCat} sublabel="TOTAL LOGS" />
            </div>
            <div className="space-y-3.5 flex-1 w-full">
              {catStats.map((c, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between mb-1.5 items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                      <span className="text-[11px] font-bold text-slate-600 tracking-tight">{c.cat}</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800 font-mono bg-slate-50 px-1.5 py-0.5 rounded">{c.count}</span>
                  </div>
                  <HBar value={c.count} max={totalCat} color={c.color} delay={i * 80} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Area hotspots + Monthly trend ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Hotspot bars */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] italic">Area Hotspots</h3>
          <p className="text-[11px] text-slate-400 font-sans italic mt-0.5 mb-6">Structural locations exhibiting elevated asset displacement</p>
          <div className="space-y-4">
            {areaStats.map((d, i) => {
              const recPct = pct(d.recovered, d.lost);
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide truncate mr-4">{d.area}</span>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{d.lost} missing</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        recPct >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        recPct >= 50 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {recPct}% resolved
                      </span>
                    </div>
                  </div>
                  <HBar value={d.recovered} max={maxAreaLost} color="#2D366D" delay={i * 70} />
                </div>
              );
            })}
            <div className="flex gap-4 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#2D366D]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Turned Over</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Unresolved Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly trend */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] italic">Monthly Volatility Trend</h3>
            <p className="text-[11px] text-slate-400 font-sans italic mt-0.5 mb-4">Comparative timeline tracking lost versus found operations</p>
          </div>
          <VBarGroup data={monthlyData} max={maxMonthly} />
          <div className="flex gap-4 mt-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#2D366D]" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Found Items</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#BFCBF7]" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Reported Lost</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Hotspot detail table ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] italic">Hotspot Matrix Breakdown</h3>
          <p className="text-[11px] text-slate-400 font-sans italic mt-0.5">Granular regional risk indexing across institutional parameters</p>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[650px] table-fixed border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-black uppercase border-b border-slate-100 text-[9px] tracking-[0.15em]">
                <th className="p-4 pl-6 w-[28%]">Campus Area Sector</th>
                <th className="p-4 text-center w-[12%]">Lost Logged</th>
                <th className="p-4 text-center w-[15%]">Recovered Cases</th>
                <th className="p-4 text-center w-[15%]">Outstanding</th>
                <th className="p-4 text-center w-[15%]">Success Rate</th>
                <th className="p-4 text-center w-[15%]">Risk Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {areaStats.map((d, i) => {
                const p = pct(d.recovered, d.lost);
                const risk = riskLevel(d.lost);
                return (
                  <tr key={i} className="hover:bg-blue-50/30 transition-all duration-200 group h-[64px]">
                    <td className="p-4 pl-6 align-middle truncate">
                      <p className="font-black text-slate-800 capitalize tracking-tight text-[13px] group-hover:text-[#2D366D] transition-colors">{d.area}</p>
                    </td>
                    <td className="p-4 text-center align-middle font-bold text-slate-500 font-mono">{d.lost}</td>
                    <td className="p-4 text-center align-middle font-black text-emerald-600 font-mono">{d.recovered}</td>
                    <td className="p-4 text-center align-middle font-black text-rose-400 font-mono">{d.lost - d.recovered}</td>
                    <td className={`p-4 text-center align-middle font-black text-[13px] font-mono ${pctColor(p)}`}>{p}%</td>
                    <td className="p-4 text-center align-middle">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${riskColor(risk)}`}>
                        {risk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsDesignPreview;