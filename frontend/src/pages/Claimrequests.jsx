import React, { useEffect, useState } from "react";
import { getClaims, scheduleMeeting } from "../api/api";

const ClaimRequests = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getClaims();
      setClaims(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!date) return alert("Select a schedule first");

    try {
      setSending(true);
      await scheduleMeeting(selected.id, date);

      setSelected(null);
      setDate("");
      await load();

      alert("Meeting scheduled successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule meeting");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-400">
        Loading claim requests...
      </div>
    );
  }

  const ITEMS_PER_PAGE = 10;

  const filteredClaims = claims.filter((c) => {
    const searchText = search.toLowerCase();

    return (
      c.claimant_name?.toLowerCase().includes(searchText) ||
      c.claimant_email?.toLowerCase().includes(searchText) ||
      String(c.claimant_contact || "").toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredClaims.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => setCurrentPage(page);

  const getVisiblePages = () => {
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let startPage = currentPage < maxVisiblePages ? 1 : currentPage - 3;
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxVisiblePages + 1;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(109vh-260px)]">
      <div className="bg-white rounded-[18px] border border-[#D8E2EF] shadow-[0_8px_24px_rgba(45,54,109,0.08)] overflow-hidden flex flex-col h-[calc(100vh-130px)]">

        {/* Header */}
        <div className="bg-white px-6 sm:px-8 py-6 border-b border-[#D8E2EF] shrink-0">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 rounded-full" />
                <div>
                  <h3 className="text-[22px] sm:text-xl font-black uppercase tracking-[0.18em] text-[#071E3D]">
                    Claim Requests
                  </h3>
                  <p className="text-md sm:text-base text-[#7B8AA6] italic mt-1">
                    Manage and schedule verification meetings.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-[330px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B6B8A] text-lg">
                  🔍
                </span>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search claim requests..."
                  className="w-full pl-10 pr-4 py-3 border border-[#CBD8E8] rounded-full text-lg outline-none bg-white text-[#071E3D] placeholder:text-[#8A98B3] focus:ring-2 focus:ring-[#0B6B8A]/20 focus:border-[#0B6B8A] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full min-w-[900px] table-fixed border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="w-[28%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Claimant</th>
                <th className="w-[32%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Email</th>
                <th className="w-[22%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Contact</th>
                <th className="w-[18%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {paginatedClaims.length > 0 ? (
                paginatedClaims.map((c, index) => (
                  <tr key={c.id} className={`h-[70px] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F6FAFF]"} hover:bg-[#EAF4FF]`}>
                    <td className="truncate border border-gray-300 p-4 text-center align-middle font-bold text-[#071E3D]">
                      {c.claimant_name}
                    </td>
                    <td className="truncate border border-gray-300 p-4 text-center align-middle text-slate-600 text-[14px]">
                      {c.claimant_email}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle text-slate-600 text-[14px]">
                      {c.claimant_contact || "-"}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                      <button
                        onClick={() => setSelected(c)}
                        className="inline-flex items-center justify-center gap-2 rounded bg-[#0B6B8A] px-3 py-1.5 text-[14px] font-semibold text-white transition hover:bg-[#095A74]"
                      >
                        Schedule
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="bg-white text-center py-32">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[#EEF4FA] flex items-center justify-center text-3xl">📋
                      </div>
                      <span className="text-4xl opacity-20 font-black tracking-tighter text-[#071E3D]">EMPTY
                      </span>
                      <p className="text-xs font-sans tracking-[0.2em] uppercase font-bold text-[#7B8AA6]">
                        No claim requests found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredClaims.length > 0 && (
          <div className="border-t border-[#D8E2EF] bg-white px-6 py-4 flex items-center justify-between shrink-0">
            <p className="text-sm font-bold text-[#7B8AA6]">
              Showing {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredClaims.length)} of{" "}
              {filteredClaims.length}
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="h-10 rounded-lg border border-[#D8E2EF] px-4 text-xs font-black uppercase tracking-wide text-[#0B6B8A] transition hover:bg-[#EAF4FF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`h-10 min-w-10 rounded-lg px-3 text-sm font-black transition ${
                    currentPage === page
                      ? "bg-[#0B6B8A] text-white shadow-md"
                      : "border border-[#D8E2EF] bg-white text-[#0B6B8A] hover:bg-[#EAF4FF]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-10 rounded-lg border border-[#D8E2EF] px-4 text-xs font-black uppercase tracking-wide text-[#0B6B8A] transition hover:bg-[#EAF4FF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Schedule Meeting Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071E3D]/30 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded shadow-2xl border border-[#D8E2EF] overflow-hidden">

              <div className="px-6 py-4 bg-[#0B6B8A]">
                <h2 className="text-white font-semibold text-[15px]">
                  Schedule Meeting
                </h2>
                <p className="text-[13px] text-white/80 mt-1">
                  {selected.claimant_name}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-[#CBD8E8] rounded text-sm focus:ring-2 focus:ring-[#0B6B8A]/20 focus:border-[#0B6B8A] outline-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelected(null);
                      setDate("");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded bg-slate-100 px-3 py-2 text-[14px] font-semibold text-slate-500 transition hover:bg-slate-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={send}
                    disabled={sending}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded bg-[#0B6B8A] px-3 py-2 text-[14px] font-semibold text-white transition hover:bg-[#095A74] disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimRequests;