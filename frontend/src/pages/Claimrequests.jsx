import React, { useEffect, useState } from "react";
import { getClaims, scheduleMeeting } from "../api/api";

const ClaimRequests = () => {
  const [claims, setClaims] = useState([]);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getClaims();
      setClaims(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const send = async () => {
    if (!date) return alert("Select a schedule first");

    try {
      setLoading(true);
      await scheduleMeeting(selected.id, date);

      setSelected(null);
      setDate("");
      await load();

      alert("Meeting scheduled successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(109vh-260px)]">

      {/* HEADER */}
      <div className="bg-white p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">

        <div>
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-800">
            Claim Requests
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Manage and schedule verification meetings
          </p>
        </div>

      </div>

      {/* LIST */}
      <div className="overflow-auto flex-grow bg-slate-50 p-6 space-y-3">

        {claims.length === 0 && (
          <div className="text-center text-slate-400 font-black uppercase tracking-widest text-sm py-20">
            No Claim Requests Found
          </div>
        )}

        {claims.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex justify-between items-center hover:shadow-md transition-all"
          >

            {/* LEFT */}
            <div>
              <h4 className="font-black text-slate-700 uppercase tracking-wider text-sm">
                {c.claimant_name}
              </h4>

              <p className="text-xs text-slate-400 mt-1">
                {c.claimant_email}
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                {c.claimant_contact}
              </p>
            </div>

            {/* RIGHT */}
            <button
              onClick={() => setSelected(c)}
              className="bg-[#2D366D] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90"
            >
              Schedule
            </button>

          </div>
        ))}

      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D366D]/20 backdrop-blur-md p-4">

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-[#2D366D] font-black uppercase tracking-widest text-sm">
                Schedule Meeting
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {selected.claimant_name}
              </p>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-4">

              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2D366D]/20 outline-none"
              />

              <div className="flex gap-3">

                <button
                  onClick={() => {
                    setSelected(null);
                    setDate("");
                  }}
                  className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  onClick={send}
                  disabled={loading}
                  className="flex-1 bg-[#2D366D] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send"}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ClaimRequests;