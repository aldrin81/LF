import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getItems } from '../api/api';
import Header from "../components/Header";
import Leaderboard from "./Leaderboards";

// Components
import ReportLostModal from '../components/ReportLostModal';
import ItemDetailModal from '../components/ItemDetailModal';
import ClaimModal from '../components/ClaimModal'; // 
import TrackItemPage from "./TrackItemPage";




const PublicBoard = ({ onOpenLogin }) => {
  const [reportedItems, setReportedItems] = useState([]);
  const [filter, setFilter] = useState('Lost');
  const [detailItem, setDetailItem] = useState(null);
  const [claimItem, setClaimItem] = useState(null); // 
  const [showReport, setShowReport] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState("items");

  const boardRef = useRef(null);

   function scrollToBoardTop() {
    setTimeout(() => {
    boardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 0);
} 

  useEffect(() => {
    fetchItems();

    const interval = setInterval(() => {
      fetchItems();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function fetchItems() {
    try {
      const response = await getItems();
      setReportedItems(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  const filteredItems = reportedItems.filter(item => {
    return item.type?.toLowerCase() === filter.toLowerCase();
  });

  function toTitleCase(text) {
    if (!text) return "";

    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const approvedItems = filteredItems
  .filter(item => item.status === 'Approved')
  .sort((a, b) => b.id - a.id);

const ITEMS_PER_PAGE = 10;
const totalPages = Math.max(1, Math.ceil(approvedItems.length / ITEMS_PER_PAGE));
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

const paginatedItems = approvedItems.slice(
  startIndex,
  startIndex + ITEMS_PER_PAGE
);

useEffect(() => {
  setCurrentPage(1);
}, [filter, activeView]);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FE]">

      <Header
        showLogin={true}
        onOpenLogin={onOpenLogin}
      />

      {/* Main Container */}
      <main className="flex-1 px-4 sm:px-8 mt-12 pb-16">

        <div
          ref={boardRef}
          className="scroll-mt-48 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[900px]"
        >

          {/* Top Controls */}
          <div className="bg-white p-6 sm:p-8 border-b border-slate-100 flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center shrink-0 z-20">

  <div className="min-w-0 flex-1">
    <h3 className="text-xl font-black tracking-widest text-slate-800 font-sans">
      {activeView === "leaderboard"
        ? "Leaderboards"
        : activeView === "track"
          ? "Track Item"
          : filter === "Lost"
            ? "Lost Items"
            : "Surrendered Items"}
    </h3>

    <p className="text-sm text-slate-500 font-sans italic mt-1 max-w-xl">
      {activeView === "leaderboard"
        ? "View the top honest finders based on claimed and surrendered items."
        : activeView === "track"
          ? "Track the current status of your reported item using your ticket code."
          : filter === "Lost"
            ? "Browse reported items missing within the campus."
            : "View items found and registered in the system."}
    </p>
  </div>

            {activeView === "items" ? (

             <div className="w-full lg:w-auto lg:ml-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:flex-wrap">

                {/* ACTION BUTTONS WRAPPER */}
               <div className="w-full sm:w-auto grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">

                  {/* REPORT BUTTON */}
                  <button
                    onClick={() => setShowReport(true)}
                    className="w-full col-span-2 sm:w-auto sm:col-span-1 bg-[#2D366D] text-white px-4 sm:px-6 py-4 sm:py-3 rounded-2xl sm:rounded-full font-black tracking-wide sm:tracking-widest text-sm sm:text-[16px] hover:shadow-lg transition-all shadow-md font-sans whitespace-nowrap"
                  >
                    <span className="sm:hidden block text-2xl mb-1">📋</span>
                    <span className="hidden sm:inline">📋 </span>
                    Report a Lost Item
                  </button>

                  {/* TRACK BUTTON */}
                  <button
                    onClick={() => setActiveView("track")}
                    className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 px-4 sm:px-6 py-4 sm:py-3 rounded-2xl sm:rounded-full font-black tracking-wide sm:tracking-widest text-sm sm:text-[16px] hover:shadow-lg transition-all shadow-md font-sans whitespace-nowrap"
                  >
                    <span className="sm:hidden block text-2xl mb-1">🔍</span>
                    <span className="hidden sm:inline">🔍 </span>
                    Track Item
                  </button>

                  {/* LEADERBOARD BUTTON */}
                  <button
                    onClick={() => setActiveView("leaderboard")}
                    className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 px-4 sm:px-6 py-4 sm:py-3 rounded-2xl sm:rounded-full font-black tracking-wide sm:tracking-widest text-sm sm:text-[16px] hover:shadow-lg transition-all shadow-md font-sans whitespace-nowrap"
                  >
                    <span className="sm:hidden block text-2xl mb-1">🏆</span>
                    <span className="hidden sm:inline">🏆 </span>
                    Leaderboards
                  </button>

                </div>

                {/* LOST / FOUND TOGGLE */}
                <div className="w-full sm:w-auto flex bg-slate-100 p-1 rounded-2xl sm:rounded-full shadow-inner sm:shadow-none">
                  {["Lost", "Surrendered"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 sm:flex-none px-4 sm:px-6 py-4 sm:py-3 rounded-xl sm:rounded-full text-sm sm:text-[16px] font-black uppercase tracking-wide sm:tracking-widest font-sans transition-all min-w-0 sm:min-w-[150px] text-center ${
                        filter === f
                          ? "bg-white text-[#2D366D] shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

              </div>

            ) : (

              <button
                onClick={() => setActiveView("items")}
                className="bg-[#2D366D] text-white px-6 py-3 rounded-full font-black tracking-widest text-[15px] hover:shadow-lg transition-all shadow-md font-sans"
              >
                ← Back
              </button>

            )}

          </div>

        
        {/* Desktop Table */}
        {activeView === "items" ? (
          <>
            <div className="hidden md:block overflow-y-scroll scrollbar-hide flex-grow bg-white relative">
              <table className="w-full text-[16px] min-w-[900px] table-fixed border-collapse font-sans">
                <thead className="sticky top-0 z-0">
                        <tr className="bg-[#0B6C9C] text-white">
                          <th className="border border-gray-300 px-4 py-3 font-semibold text-center">
                            Item Description
                          </th>

                          <th className="border border-gray-300 px-4 py-3 font-semibold text-center">
                            Category
                          </th>

                          <th className="border border-gray-300 px-4 py-3 font-semibold text-center">
                            Location
                          </th>

                          <th className="border border-gray-300 px-4 py-3 font-semibold text-center">
                            Date Logged
                          </th>

                          <th className="border border-gray-300 px-4 py-3 font-semibold text-center w-[180px]">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="w-full text-[16px] uppercase min-w-[900px]">
                        {paginatedItems.length > 0 ? (
                          paginatedItems.map((item, index) => (
                            <tr
                              key={item.id}
                              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-blue-50 transition`}
                            >
                              <td className="border border-gray-300 px-4 py-4 text-center font-semibold">
                                {toTitleCase(item.title)}
                              </td>

                              <td className="border border-gray-300 px-4 py-4 text-center">
                                {toTitleCase(item.category)}
                              </td>

                              <td className="border border-gray-300 px-4 py-4 text-center">
                                {toTitleCase(item.location)}
                              </td>

                              <td className="border border-gray-300 px-4 py-4 text-center">
                                <div>{item.created_date}</div>
                                <div>{item.created_time}</div>
                              </td>

                              <td className="border border-gray-300 px-4 py-4 w-[180px]">
                                <div className="flex justify-center items-center gap-2">

                                  <button
                                    onClick={() => setDetailItem(item)}
                                    className="bg-[#0B6C9C] text-white px-4 py-2 rounded hover:bg-[#09597F] transition w-[75px]"
                                  >
                                    View
                                  </button>

                                  {filter === "Surrendered" && (
                                    <button
                                      onClick={() => setClaimItem(item)}
                                      className="bg-[#2D366D] text-white px-4 py-2 rounded hover:opacity-90 transition w-[75px]"
                                    >
                                      Claim
                                    </button>
                                  )}

                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="bg-white text-center py-40">
                              <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                                <span className="text-6xl opacity-10 font-black tracking-tighter">
                                  EMPTY
                                </span>

                                <p className="text-sm font-sans tracking-[0.2em] uppercase font-bold text-slate-400">
                                  No active records found
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex-grow overflow-y-auto bg-slate-50 p-3 space-y-3">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-lg shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 leading-snug">
                          {toTitleCase(item.title)}
                        </h3>
                        <p className="text-xs font-semibold uppercase text-slate-400 mt-1">
                          {toTitleCase(item.category)}
                        </p>
                      </div>

                      <span className="text-[11px] font-bold uppercase text-[#0B6C9C] bg-blue-50 px-2 py-1 rounded">
                        {item.type}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between gap-3">
                        <span className="font-semibold text-slate-400">Location</span>
                        <span className="text-right">
                          {toTitleCase(item.location)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="font-semibold text-slate-400">Date</span>
                        <span className="text-right">
                          {item.created_date} {item.created_time}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setDetailItem(item)}
                        className="flex-1 bg-[#0B6C9C] text-white py-2 rounded font-semibold"
                      >
                        View
                      </button>

                      {filter === "Surrendered" && (
                        <button
                          onClick={() => setClaimItem(item)}
                          className="flex-1 bg-[#2D366D] text-white py-2 rounded font-semibold"
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white min-h-[320px] flex flex-col items-center justify-center text-slate-300 rounded-lg border border-slate-200">
                  <span className="text-5xl opacity-10 font-black tracking-tighter">
                    EMPTY
                  </span>

                  <p className="text-xs font-sans tracking-[0.2em] uppercase font-bold text-slate-400 mt-2">
                    No active records found
                  </p>
                </div>
              )}
            </div>

            {approvedItems.length > 0 && (
              <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + ITEMS_PER_PAGE, approvedItems.length)} of{" "}
                  {approvedItems.length} items
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage((page) => Math.max(page - 1, 1));
                      scrollToBoardTop();
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 rounded-lg bg-[#0B6C9C] text-white text-sm font-bold">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => {
                      setCurrentPage((page) => Math.min(page + 1, totalPages));
                      scrollToBoardTop();
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>

        ) : activeView === "leaderboard" ? (

          <div className="flex-grow relative">

            <Leaderboard />

          </div>

        ) : (

          <div className="flex-grow relative">
            <TrackItemPage />

          </div>

        )}
 </div>

      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-slate-50 border-t border-slate-200 py-4 z-50">
        <p className="text-right pr-4 sm:pr-8 text-[16px] text-slate-400 font-sans tracking-[0.2em]">
          © 2021 Saint Louis College, City of San Fernando, La Union. All rights reserved
        </p>
      </footer>

      {/* Modals Section */}
      {showReport && (
        <ReportLostModal
          onClose={() => setShowReport(false)}
        />
      )}

      {detailItem && (
        <ItemDetailModal
          item={detailItem}
          onClaim={setClaimItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      {claimItem && (
        <ClaimModal
          item={claimItem}
          onClose={() => setClaimItem(null)}
        />
      )}

    </div>
  );
};

export default PublicBoard;