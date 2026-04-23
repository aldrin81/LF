import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const statusStyle = (s) =>
  s === 'Approved' ? 'bg-green-100 text-green-600'  :
  s === 'Rejected' ? 'bg-red-100 text-red-500'      :
  'bg-orange-100 text-orange-500';

const typeStyle = (t) =>
  t === 'Lost' ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500';

// ─── Detail / Review Modal ────────────────────────────────────────────────────
const ReviewModal = ({ claim, onApprove, onReject, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[92vh]">
      <div className="flex justify-between items-center px-7 py-5 border-b">
        <h3 className="font-black text-[#2D366D] uppercase text-xs tracking-widest italic">Review Claim</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
      </div>
      <div className="p-7 space-y-4 font-sans">

        {/* Item info */}
        <div className={`rounded-2xl p-4 border ${claim.itemType === 'Lost' ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${typeStyle(claim.itemType)}`}>{claim.itemType} Item</span>
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">#{claim.itemId}</span>
          </div>
          <p className="font-black text-[#2D366D] text-lg uppercase italic">{claim.itemName}</p>
        </div>

        {/* Claimant info */}
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-3">Claimant Information</p>
          <div className="grid grid-cols-2 gap-3 text-[10px]">
            {[
              ['Full Name',   claim.claimantName],
              ['Student ID',  claim.claimantId],
              ['Contact',     claim.claimantContact],
              ['Submitted',   claim.timestamp],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{l}</p>
                <p className="font-bold text-slate-700 mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Proof note */}
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Claimant's Description / Proof</p>
          <p className="text-[11px] text-slate-500 italic bg-blue-50/40 p-4 rounded-2xl border border-blue-50 leading-relaxed">"{claim.note}"</p>
        </div>

        {/* Resolution badge if already handled */}
        {claim.status !== 'Pending' && (
          <div className={`flex items-center gap-3 p-3 rounded-2xl ${claim.status === 'Approved' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            {claim.status === 'Approved'
              ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              : <XCircle    size={16} className="text-red-400 flex-shrink-0" />}
            <p className={`text-[10px] font-black uppercase tracking-widest ${claim.status === 'Approved' ? 'text-green-600' : 'text-red-500'}`}>
              Claim {claim.status}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {claim.status === 'Pending' && (
          <div className="flex gap-3 pt-1">
            <button onClick={() => { onApprove(claim.id); onClose(); }}
              className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-green-600 transition-all flex items-center justify-center gap-2">
              <CheckCircle size={14} /> Approve
            </button>
            <button onClick={() => { onReject(claim.id); onClose(); }}
              className="flex-1 bg-red-50 text-red-400 border border-red-100 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition-all flex items-center justify-center gap-2">
              <XCircle size={14} /> Reject
            </button>
          </div>
        )}

        <button onClick={onClose}
          className="w-full bg-slate-100 text-slate-500 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">
          Close
        </button>
      </div>
    </div>
  </div>
);

// ─── ClaimRequests Page ───────────────────────────────────────────────────────
const ClaimRequests = () => {
  const { claimRequests, updateClaimRequest } = useApp();
  const [filter,   setFilter]   = useState('All');
  const [selected, setSelected] = useState(null);

  const approve = (id) => updateClaimRequest(id, { status: 'Approved' });
  const reject  = (id) => updateClaimRequest(id, { status: 'Rejected' });

  const pendingCount = claimRequests.filter(c => c.status === 'Pending').length;
  const filtered     = filter === 'All' ? claimRequests : claimRequests.filter(c => c.status === filter);

  return (
    <div className="space-y-4 font-sans">

      {/* Alert banner when there are unreviewed claims */}
      {pendingCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-400 rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <p className="font-black text-orange-700 text-sm uppercase tracking-tight">
              {pendingCount} Pending Claim{pendingCount > 1 ? 's' : ''} Awaiting Review
            </p>
            <p className="text-orange-500/70 text-[10px] font-medium">
              Review each claim and approve or reject based on the claimant's description.
            </p>
          </div>
        </div>
      )}

      {claimRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-black text-slate-500 uppercase tracking-tight text-sm italic">No Claim Requests Yet</p>
          <p className="text-slate-400 text-xs font-sans mt-2">
            When a visitor submits a claim from the public board, it will appear here for review.
          </p>
        </div>
      )}

      {claimRequests.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-5 border-b flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50">
            <div>
              <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Claim Requests</h3>
              <p className="text-[10px] text-gray-400 italic mt-0.5">
                {claimRequests.length} total · {pendingCount} pending review
              </p>
            </div>
            {/* Filter tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {['All','Pending','Approved','Rejected'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-white text-[#2D366D] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}>
                  {f}
                  {f === 'Pending' && pendingCount > 0 && (
                    <span className="ml-1.5 bg-orange-400 text-white rounded-full px-1.5 py-0.5 text-[7px]">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] min-w-[620px]">
              <thead className="bg-gray-50 text-gray-400 font-black uppercase border-b text-[9px] tracking-widest">
                <tr>
                  <th className="p-4">Claim ID</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Claimant</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(claim => (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-400 font-bold font-mono text-[9px]">{claim.id}</td>
                    <td className="p-4 font-black text-gray-700">{claim.itemName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${typeStyle(claim.itemType)}`}>{claim.itemType}</span>
                    </td>
                    <td className="p-4 font-bold text-gray-600">{claim.claimantName}</td>
                    <td className="p-4 text-gray-400">{claim.claimantContact}</td>
                    <td className="p-4 text-gray-400 text-[9px]">{claim.timestamp}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${statusStyle(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2 text-[9px] font-black uppercase">
                        <button onClick={() => setSelected(claim)} className="text-blue-500 hover:underline">Review</button>
                        {claim.status === 'Pending' && (
                          <>
                            <button onClick={() => approve(claim.id)} className="text-green-500 hover:underline">Approve</button>
                            <button onClick={() => reject(claim.id)}  className="text-red-400 hover:underline">Reject</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-slate-300 italic text-xs">
                      No {filter.toLowerCase()} claims.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <ReviewModal
          claim={selected}
          onApprove={approve}
          onReject={reject}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default ClaimRequests;