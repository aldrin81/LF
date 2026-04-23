import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));

const riskLevel = (lost) =>
  lost >= 15 ? 'High' : lost >= 8 ? 'Medium' : 'Low';

const riskColor = (risk) =>
  risk === 'High'   ? 'bg-red-100 text-red-500'
  : risk === 'Medium' ? 'bg-amber-100 text-amber-600'
  : 'bg-green-100 text-green-600';

const pctColor = (p) =>
  p >= 70 ? 'text-green-600' : p >= 50 ? 'text-amber-600' : 'text-red-500';

const AREAS = ['Canteen','Library','Parking Lot','SAO Waiting Area','Main Building','Gym'];
const CATS  = ['Personal','Electronics','Accessories','Cash/Cards'];
const CAT_COLORS = { Personal:'#2D366D', Electronics:'#87CEEB', Accessories:'#22C55E', 'Cash/Cards':'#F59E0B' };

// ─── Animated Donut ───────────────────────────────────────────────────────────
const Donut = ({ segments, cx=90, cy=90, r=68, strokeW=20, label, sublabel }) => {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 120); return () => clearTimeout(t); }, []);

  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s,d)=>s+d.value,0);
  let off = circ / 4;

  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={strokeW} />
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
      {label    && <text x={cx} y={cy - 8}  textAnchor="middle" fontSize="22" fontWeight="900" fill="#2D366D" fontFamily="sans-serif">{label}</text>}
      {sublabel && <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8"  fontWeight="700" fill="#94A3B8" fontFamily="sans-serif" letterSpacing="1.5">{sublabel}</text>}
    </svg>
  );
};

// ─── Horizontal Bar ───────────────────────────────────────────────────────────
const HBar = ({ value, max, color='#2D366D', delay=0 }) => {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200 + delay); return () => clearTimeout(t); }, []);
  return (
    <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden">
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
    <div className="flex items-end justify-between gap-1 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: '96px' }}>
            <div className="flex-1 flex flex-col justify-end" style={{ maxWidth: 14 }}>
              <div className="rounded-t-sm bg-[#BFCBF7] transition-all duration-700 ease-out"
                style={{ height: go ? `${(d.lost/max)*88}px` : '0px', transitionDelay: `${i*50}ms` }} />
            </div>
            <div className="flex-1 flex flex-col justify-end" style={{ maxWidth: 14 }}>
              <div className="rounded-t-sm bg-[#2D366D] transition-all duration-700 ease-out"
                style={{ height: go ? `${(d.found/max)*88}px` : '0px', transitionDelay: `${i*50+25}ms` }} />
            </div>
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Reports Page ─────────────────────────────────────────────────────────────
const Reports = () => {
  const { lostItems, foundItems } = useApp();

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalLost     = lostItems.length;
  const totalClaimed  = lostItems.filter(i => i.status === 'Claimed').length;
  const totalFound    = foundItems.length;
  const recoveryRate  = pct(totalClaimed, totalLost);

  // Area breakdown
  const areaStats = AREAS.map(area => {
    const lost      = lostItems.filter(i => i.area === area).length;
    const recovered = lostItems.filter(i => i.area === area && i.status === 'Claimed').length;
    return { area, lost, recovered };
  }).filter(a => a.lost > 0).sort((a,b) => b.lost - a.lost);

  const maxAreaLost = Math.max(...areaStats.map(a => a.lost), 1);

  // Category breakdown (lost)
  const catStats = CATS.map(cat => ({
    cat,
    count: lostItems.filter(i => i.cat === cat).length,
    color: CAT_COLORS[cat],
  })).filter(c => c.count > 0);

  const totalCat = catStats.reduce((s,c)=>s+c.count,0) || 1;

  // Monthly (last 6 months — using date field MM-DD-YY)
  const months = ['Oct','Nov','Dec','Jan','Feb','Mar'];
  const monthMap = { Oct:'10', Nov:'11', Dec:'12', Jan:'01', Feb:'02', Mar:'03' };
  const monthlyData = months.map(m => ({
    month: m,
    lost:  lostItems.filter(i  => i.date?.startsWith(monthMap[m])).length,
    found: foundItems.filter(i => i.date?.startsWith(monthMap[m])).length,
  }));
  const maxMonthly = Math.max(...monthlyData.flatMap(d=>[d.lost,d.found]), 1);

  // Top hotspot & worst recovery
  const topHotspot    = areaStats[0] || { area: 'N/A', lost: 0 };
  const worstRec      = [...areaStats].sort((a,b) => pct(a.recovered,a.lost) - pct(b.recovered,b.lost))[0] || { area: 'N/A', recovered:0, lost:1 };

  // Donut segments
  const recoverySegs = [
    { value: totalClaimed,             color: '#2D366D' },
    { value: totalLost - totalClaimed, color: '#E2E8F0' },
  ];
  const catSegs = catStats.map(c => ({ value: c.count, color: c.color }));

  return (
    <div className="space-y-5 font-sans">

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Recovery Rate',   value:`${recoveryRate}%`,      sub:`${totalClaimed} of ${totalLost} returned`,       textC:'text-[#2D366D]', bg:'bg-blue-50' },
          { label:'Total Lost',      value:totalLost,                sub:'reports logged',                                 textC:'text-red-500',   bg:'bg-red-50'  },
          { label:'Total Found',     value:totalFound,               sub:'items turned in',                                textC:'text-green-600', bg:'bg-green-50'},
          { label:'Top Hotspot',     value:topHotspot.area,          sub:`${topHotspot.lost} items lost here`,             textC:'text-amber-600', bg:'bg-amber-50'},
        ].map((s,i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 lg:p-5">
            <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
            <p className={`text-lg lg:text-xl font-black ${s.textC} leading-tight truncate`}>{s.value}</p>
            <p className="text-[8px] lg:text-[9px] text-slate-400 mt-1 italic">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Row 1: Recovery donut + Category donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recovery rate donut */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-0.5">Item Recovery Rate</h3>
          <p className="text-[9px] text-slate-400 italic mb-4">% of lost items successfully returned to owner</p>
          <Donut segments={recoverySegs} label={`${recoveryRate}%`} sublabel="RECOVERED" />
          <div className="flex justify-center gap-5 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2D366D]" />
              <span className="text-[9px] font-bold text-slate-500">Claimed ({totalClaimed})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="text-[9px] font-bold text-slate-500">Unclaimed ({totalLost - totalClaimed})</span>
            </div>
          </div>
        </div>

        {/* Category donut */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-0.5">Item Categories</h3>
          <p className="text-[9px] text-slate-400 italic mb-4">What types of items get lost the most</p>
          {catStats.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Donut segments={catSegs} r={55} strokeW={20} label={totalCat} sublabel="TOTAL" />
              <div className="space-y-2.5 flex-1 w-full">
                {catStats.map((c,i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                        <span className="text-[9px] font-bold text-slate-600">{c.cat}</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-700">{c.count}</span>
                    </div>
                    <HBar value={c.count} max={totalCat} color={c.color} delay={i*80} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-300 italic text-xs text-center py-10">No data yet</p>
          )}
        </div>
      </div>

      {/* ── Row 2: Area hotspots + Monthly trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Hotspot bars */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-0.5">Area Hotspots</h3>
          <p className="text-[9px] text-slate-400 italic mb-4">Where items are most frequently lost on campus</p>
          {areaStats.length > 0 ? (
            <div className="space-y-3">
              {areaStats.map((d,i) => {
                const recPct = pct(d.recovered, d.lost);
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black text-slate-700 uppercase tracking-wide truncate mr-2">{d.area}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[8px] font-bold text-slate-400">{d.lost} lost</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${pct(d.recovered,d.lost) >= 70 ? 'bg-green-100 text-green-600' : pct(d.recovered,d.lost) >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-500'}`}>
                          {recPct}% back
                        </span>
                      </div>
                    </div>
                    <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <HBar value={d.recovered} max={maxAreaLost} color="#2D366D" delay={i*70} />
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-4 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#2D366D]" />
                  <span className="text-[8px] font-bold text-slate-400">Recovered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
                  <span className="text-[8px] font-bold text-slate-400">Not Recovered</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-300 italic text-xs text-center py-10">No area data yet</p>
          )}
        </div>

        {/* Monthly trend */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-0.5">Monthly Trend</h3>
          <p className="text-[9px] text-slate-400 italic mb-4">Lost vs. found items per month</p>
          <VBarGroup data={monthlyData} max={maxMonthly} />
          <div className="flex gap-4 mt-3 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#2D366D]" />
              <span className="text-[8px] font-bold text-slate-400">Found / Returned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#BFCBF7]" />
              <span className="text-[8px] font-bold text-slate-400">Reported Lost</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hotspot detail table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Hotspot Breakdown</h3>
          <p className="text-[9px] text-slate-400 italic mt-0.5">Full area-by-area recovery report</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans min-w-[520px]">
            <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[9px] tracking-widest border-b">
              <tr>
                <th className="p-4">Area</th>
                <th className="p-4 text-center">Lost</th>
                <th className="p-4 text-center">Recovered</th>
                <th className="p-4 text-center">Not Recovered</th>
                <th className="p-4 text-center">Recovery %</th>
                <th className="p-4 text-center">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {areaStats.length > 0 ? areaStats.map((d,i) => {
                const p = pct(d.recovered, d.lost);
                const risk = riskLevel(d.lost);
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-700">{d.area}</td>
                    <td className="p-4 text-center text-slate-500">{d.lost}</td>
                    <td className="p-4 text-center text-green-600 font-bold">{d.recovered}</td>
                    <td className="p-4 text-center text-red-400 font-bold">{d.lost - d.recovered}</td>
                    <td className={`p-4 text-center font-black ${pctColor(p)}`}>{p}%</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${riskColor(risk)}`}>{risk}</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="p-8 text-center text-slate-300 italic text-xs">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;