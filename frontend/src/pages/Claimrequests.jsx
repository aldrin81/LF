import React, { useEffect, useState } from "react";
import { getClaims, reviewClaim } from "../api/api";

const ClaimRequests = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmation, setConfirmation] = useState(null);
  const [remarkOpen, setRemarkOpen] = useState(false);

  useEffect(() => {
      load();
  
      const interval = setInterval(() => {
        load();
      }, 3000);
  
      return () => clearInterval(interval);
    }, []);

  const load = async () => {
  try {
    const data = await getClaims();
    console.log("Claims:", data);
    setClaims(data);
  } catch (err) {
    console.error(err.response?.data || err);
  } finally {
    setLoading(false);
  }
};


  const review = async (decision) => {
    if (decision === "DECLINED" && !remark.trim()) {
      alert("Please enter a reason for declining.");
      return;
    }

    try {
      setReviewing(true);

      await reviewClaim(selected.id, {
        decision,
        admin_remark: remark.trim(),
      });

      setSelected(null);
      setRemark("");
      await load();

      alert(
        decision === "APPROVED"
          ? "Appointment accepted and email sent."
          : "Appointment declined and email sent."
      );
    } catch (err) {
      console.error(err);
      alert("Failed to review the appointment.");
    } finally {
      setReviewing(false);
    }
  };

  const submitReview = async (decision) => {
    if (decision === "DECLINED" && !remark.trim()) {
      alert("Please enter a reason for declining.");
      return;
    }

    try {
      setReviewing(true);

      await reviewClaim(selected.id, {
        decision,
        admin_remark: remark.trim(),
      });

      setConfirmation(null);
      setRemarkOpen(false);
      setSelected(null);
      setRemark("");

      await load();

      alert(
        decision === "APPROVED"
          ? "Appointment accepted and email sent."
          : "Appointment declined and email sent."
      );
    } catch (error) {
      console.error(error);
      alert("Failed to review the appointment.");
    } finally {
      setReviewing(false);
    }
  };

const confirmDecision = async () => {
  const decision = confirmation;

  setConfirmation(null);

  if (decision === "DECLINED") {
    setRemarkOpen(true);
    return;
  }

  await submitReview("APPROVED");
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
                        onClick={() => {
                          setSelected(c);
                          setRemark("");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded bg-[#0B6B8A] px-3 py-1.5 text-[14px] font-semibold text-white transition hover:bg-[#095A74]"
                      >
                        Review
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

        {/* Review Claim Appointment Modal */}
          {selected && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelected(null);
                  setRemark("");
                }
              }}
            >
              <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-md bg-white shadow-2xl">
                <div className="flex items-start justify-between bg-gradient-to-r from-[#0B648D] to-[#155F87] px-6 py-3 text-white">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Claim Appointment Review
                    </h3>
                    <p className="mt-1 text-sm text-white/90">
                      Review the claimant's requested appointment before confirmation
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      setRemark("");
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl text-white transition hover:bg-white/25"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="max-h-[calc(92vh-88px)] overflow-y-auto px-6 py-5">
                  <div className="mx-auto max-w-3xl space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-sm font-bold uppercase text-slate-700">
                          Claimant Name
                        </p>
                        <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold text-slate-700">
                          {selected.claimant_name || "-"}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-bold uppercase text-slate-700">
                          Contact Number
                        </p>
                        <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                          {selected.claimant_contact || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-sm font-bold uppercase text-slate-700">
                          Email Address
                        </p>
                        <div className="min-h-14 break-all rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                          {selected.claimant_email || "No email provided"}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-bold uppercase text-slate-700">
                          Item ID
                        </p>
                        <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                          #{selected.item}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-sm font-bold uppercase text-slate-700">
                          Preferred Date
                        </p>
                        <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                          {selected.meeting_date || "-"}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-bold uppercase text-slate-700">
                          Preferred Time
                        </p>
                        <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                          {selected.meeting_time || "-"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-bold uppercase text-slate-700">
                        Proof / Claim Details
                      </p>
                      <div className="min-h-[110px] rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                        {selected.proof_description || "No details provided."}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <div className="rounded-xl bg-[#0B6B8A] p-2 text-white shadow-md">
                        ✓
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-[#0B6B8A]">
                          Confirm Appointment
                        </p>
                        <p className="text-xs font-bold uppercase text-blue-600">
                          An acceptance email will be sent to the claimant.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setConfirmation("DECLINED")}
                        disabled={reviewing}
                        className="h-12 rounded-xl bg-red-600 text-sm font-black uppercase tracking-wide text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Decline
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmation("APPROVED")}
                        disabled={reviewing}
                        className="rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] py-3 text-base font-semibold uppercase tracking-wide text-white disabled:opacity-50"
                      >
                        Confirm Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {confirmation && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-[28px] bg-white px-8 py-8 text-center shadow-2xl">
                <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4F8] text-3xl text-[#0B6B8A]">
                  !
                </div>

                <h5 className="mb-3 text-2xl font-black text-[#144B70]">
                  System Confirmation
                </h5>

                <p className="mx-auto mb-8 max-w-[280px] text-sm font-medium leading-6 text-[#5F6F8C]">
                  Are you sure you want to{" "}
                  {confirmation === "APPROVED" ? "accept" : "decline"} this claim
                  appointment?
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={confirmDecision}
                    className="h-12 w-full rounded-xl bg-[#0B6B8A] text-sm font-black uppercase tracking-wide text-white shadow-md hover:bg-[#095A74]"
                  >
                    Confirm
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmation(null)}
                    className="h-12 w-full rounded-xl border border-[#0B6B8A] bg-white text-sm font-black uppercase tracking-wide text-[#0B6B8A]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {remarkOpen && selected && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-[28px] bg-white px-8 py-8 shadow-2xl">
                <h3 className="text-xl font-black text-[#144B70]">
                  Decline Claim Appointment
                </h3>

                <p className="mt-2 text-sm text-[#5F6F8C]">
                  Provide a reason that will be emailed to {selected.claimant_name}.
                </p>

                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={5}
                  placeholder="Write the reason for declining..."
                  className="mt-5 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-[#0B6B8A]"
                />

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRemarkOpen(false);
                      setRemark("");
                    }}
                    disabled={reviewing}
                    className="h-12 rounded-xl border border-[#0B6B8A] text-sm font-black uppercase text-[#0B6B8A]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => submitReview("DECLINED")}
                    disabled={reviewing}
                    className="h-12 rounded-xl bg-red-600 text-sm font-black uppercase text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {reviewing ? "Sending..." : "Submit Decline"}
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ClaimRequests;