import React, { useState, useEffect, useRef } from 'react';
import { Eye, X, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
import { getItems, API_URL, editLostItem } from '../api/api';

const statusColor = (status) =>
  status === 'Claimed' ? 'bg-purple-100 text-purple-500' :
  status === 'Pending' ? 'bg-orange-100 text-orange-500' :
  'bg-green-100 text-green-500';

function toTitleCase(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const ModeratorLostItems = ({ currentFilter = 'All Items' }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeConfirmation, setActiveConfirmation] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const lastItemsSnapshotRef = useRef('');
  const isFetchingRef = useRef(false);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    fetchData({ showLoading: true });

    const interval = setInterval(() => {
      fetchData({ showLoading: false });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilter]);

  const goToPage = (page) => {
    setCurrentPage(page);

    tableContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fetchData = async ({ showLoading = false } = {}) => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      if (showLoading) setLoading(true);
      const data = await getItems();
      const actualData = Array.isArray(data) ? data : (data.results || []);
      const pendingLostItems = actualData.filter((item) => {
        return item.status === 'Pending' && item.type === 'Lost';
      });

      const nextSnapshot = JSON.stringify(
        pendingLostItems.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          poster_name: item.poster_name,
          location: item.location,
          created_date: item.created_date,
          created_time: item.created_time,
          status: item.status,
          description: item.description,
          image: item.image,
          images: item.images,
          file: item.file,
        }))
      );

      if (nextSnapshot !== lastItemsSnapshotRef.current) {
        lastItemsSnapshotRef.current = nextSnapshot;
        setItems(pendingLostItems);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      if (showLoading) setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleUpdateStatus = async (item, status = 'Approved') => {
    try {
      await editLostItem(item.id, { status: status });

      setNotificationMessage("Item approved.");
      setSelectedItem(null);
      await fetchData({ showLoading: false });
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error.response?.data || error.message);
      const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      setNotificationMessage(`Update failed: ${msg}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await editLostItem(id, { status: 'Archived' });
      setNotificationMessage("Item declined.");
      setSelectedItem(null);
      fetchData({ showLoading: false });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    const first = Array.isArray(img) ? img[0] : img;
    if (!first) return null;
    const path = typeof first === 'string' ? first : (first.image || first.file || first.url);
    if (!path) return null;
    return path.startsWith('http') ? path : `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  const filteredItems = [...items].filter(item => {
    if (currentFilter === 'All Items') return true;
    return item.status === currentFilter;
  }).sort((a, b) => b.id - a.id);

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase italic tracking-widest">Loading...</div>;


  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[18px] border border-[#D8E2EF] bg-white shadow-[0_8px_24px_rgba(45,54,109,0.08)]">
        <div ref={tableContainerRef} className="max-h-[calc(100vh-260px)] overflow-auto bg-white">
          <table className="w-full min-w-[1000px] table-fixed border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="w-[10%] border-b border-[#095A74] bg-[#0B6B8A] p-4 text-center text-[15px] font-black uppercase tracking-wide text-white">
                  Item Id
                </th>
                <th className="w-[18%] border-b border-[#095A74] bg-[#0B6B8A] p-4 text-center text-[15px] font-black uppercase tracking-wide text-white">
                  Item Name
                </th>
                <th className="w-[15%] border-b border-[#095A74] bg-[#0B6B8A] p-4 text-center text-[15px] font-black uppercase tracking-wide text-white">
                  Category
                </th>
                <th className="w-[16%] border-b border-[#095A74] bg-[#0B6B8A] p-4 text-center text-[15px] font-black uppercase tracking-wide text-white">
                  Reported By
                </th>
                <th className="w-[17%] border-b border-[#095A74] bg-[#0B6B8A] p-4 text-center text-[15px] font-black uppercase tracking-wide text-white">
                  Area
                </th>
                <th className="w-[16%] border-b border-[#095A74] bg-[#0B6B8A] p-4 text-center text-[15px] font-black uppercase tracking-wide text-white">
                  Estimation Date
                </th>
                <th className="w-[13%] border-b border-[#095A74] bg-[#0B6B8A] p-4 text-center text-[15px] font-black uppercase tracking-wide text-white">
                  Status
                </th>
                <th className="w-[18%] border-b border-[#095A74] bg-[#0B6B8A] p-4 text-center text-[15px] font-black uppercase tracking-wide text-white">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`h-[70px] transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F6FAFF]"
                    } hover:bg-[#EAF4FF]`}
                  >
                    <td className="border-b border-[#D8E2EF] p-2 text-center align-middle font-bold text-[#071E3D]">
                      L{startIndex + index + 1}
                    </td>

                    <td className="truncate border-b border-[#D8E2EF] p-4 text-center align-middle font-bold text-[#071E3D]">
                      {toTitleCase(item.title)}
                    </td>

                    <td className="border-b border-[#D8E2EF] p-4 text-center align-middle text-[#071E3D]">
                      <span className="inline-flex items-center justify-center rounded-full bg-[#EEF4FA] px-3 py-1 text-[13px] font-bold uppercase tracking-wide text-[#2D366D]">
                        {toTitleCase(item.category) || '-'}
                      </span>
                    </td>

                    <td className="truncate border-b border-[#D8E2EF] p-4 text-center align-middle text-[#52627A]">
                      {toTitleCase(item.poster_name) || '-'}
                    </td>

                    <td className="border-b border-[#D8E2EF] p-4 text-center align-middle text-[#071E3D]">
                      <div className="flex items-center justify-center gap-1.5 truncate">
                        <span>{toTitleCase(item.location) || '-'}</span>
                      </div>
                    </td>

                    <td className="border-b border-[#D8E2EF] p-4 text-center align-middle">
                      <span className="block text-[15px] font-bold text-[#071E3D]">
                        {item.created_date || '-'}
                      </span>
                      <span className="block text-[15px] font-black uppercase tracking-wide text-[#7B8AA6]">
                        {item.created_time || '-'}
                      </span>
                    </td>

                    <td className="border-b border-[#D8E2EF] p-4 text-center align-middle">
                      <span
                        className={`rounded-full px-3 py-1 text-[13px] font-black uppercase tracking-wider ${statusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="border-b border-[#D8E2EF] p-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B6B8A] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#095A74]"
                        >
                          <Eye size={14} strokeWidth={3} />
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="bg-white py-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl font-black tracking-tighter text-[#071E3D] opacity-20">
                        EMPTY
                      </span>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B8AA6]">
                        No items found for "{currentFilter}"
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>
        {filteredItems.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-[#D8E2EF] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-[#7B8AA6]">
                Showing {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} of{" "}
                {filteredItems.length}
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
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedItem(null);
          }}
        >
          <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-md bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-[#1478a7] px-6 py-3 text-white">
              <div>
                <h3 className="text-2xl font-bold">Moderator Review</h3>
                <p className="mt-1 text-sm text-white/90">
                  Review lost item details before approval
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(92vh-88px)] overflow-y-auto px-6 py-5">
              <div className="mx-auto max-w-3xl space-y-4">
                <img
                  src={getImageUrl(selectedItem.image || selectedItem.images || selectedItem.file) || "https://via.placeholder.com/900x500?text=No+Image"}
                  className="h-72 w-full rounded-xl border border-slate-200 bg-slate-100 object-cover"
                  alt="Item Preview"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Item Name</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold text-slate-700">
                      {toTitleCase(selectedItem.title) || '-'}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Reported By</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {toTitleCase(selectedItem.poster_name) || '-'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Category</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {toTitleCase(selectedItem.category) || '-'}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Area Lost</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {toTitleCase(selectedItem.location) || '-'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Date Reported</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      {selectedItem.created_date || '-'}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Status</p>
                    <div className="min-h-14 rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                      <span className={`rounded-full px-3 py-1 text-[13px] font-black uppercase tracking-wider ${statusColor(selectedItem.status)}`}>
                        {selectedItem.status || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 block text-sm font-bold uppercase text-slate-700">Description</p>
                  <div className="min-h-[96px] rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-700">
                    {selectedItem.description || 'No description provided.'}
                  </div>
                </div>

                {selectedItem.status === 'Approved' && (
                  <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="rounded-xl bg-green-500 p-2 text-white shadow-md">
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-green-700">Item Publicly Visible</p>
                      <p className="text-xs font-bold uppercase text-green-600">
                        This item has been approved and is now visible to users.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  {selectedItem.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => setActiveConfirmation({
                          text: "Are you sure you want to approve this item?",
                          action: () => handleUpdateStatus(selectedItem, 'Approved')
                        })}
                        className="rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] py-3 text-base font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:from-[#44509B] hover:to-[#2D366D] hover:shadow-lg active:scale-[0.98]"
                      >
                        Approve Item
                      </button>
                      <button
                        onClick={() => setActiveConfirmation({
                          text: "Are you sure you want to decline this item?",
                          action: () => handleDelete(selectedItem.id)
                        })}
                        className="h-12 rounded-xl bg-slate-200 text-sm font-black uppercase tracking-wide text-slate-500 transition hover:bg-slate-300"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <>
                      {selectedItem.status === 'Approved' && (
                        <button
                          onClick={() => setActiveConfirmation({
                            text: "Are you sure you want to change this item's status to Claimed?",
                            action: () => handleUpdateStatus(selectedItem, 'Claimed')
                          })}
                          className="rounded-xl bg-gradient-to-b from-[#384388] to-[#2D366D] py-3 text-base font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:from-[#44509B] hover:to-[#2D366D]"
                        >
                          Mark Claimed
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="h-12 rounded-xl bg-slate-200 text-sm font-black uppercase tracking-wide text-slate-500 transition hover:bg-slate-300"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeConfirmation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[28px] bg-white px-8 py-8 text-center shadow-2xl">
            <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4F8] text-[#0B6B8A]">
              <AlertCircle size={30} strokeWidth={2.5} />
            </div>

            <h5 className="mb-3 text-2xl font-black text-[#144B70]">
              System Confirmation
            </h5>

            <p className="mx-auto mb-8 max-w-[280px] text-sm font-medium leading-6 text-[#5F6F8C]">
              {activeConfirmation.text}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  activeConfirmation.action();
                  setActiveConfirmation(null);
                }}
                className="h-12 w-full rounded-xl bg-[#0B6B8A] text-sm font-black uppercase tracking-wide text-white shadow-md transition hover:bg-[#095A74] active:scale-[0.98]"
              >
                Confirm
              </button>

              <button
                onClick={() => setActiveConfirmation(null)}
                className="h-12 w-full rounded-xl border border-[#0B6B8A] bg-white text-sm font-black uppercase tracking-wide text-[#0B6B8A] transition hover:bg-[#EAF4F8]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {notificationMessage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#2c3e75]/20">
          <div className="bg-[#2c3e75] text-white w-full max-w-xs rounded-2xl p-5 shadow-2xl border border-[#1e2b54] text-center">
            <p className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-100">{notificationMessage}</p>
            <button
              onClick={() => setNotificationMessage(null)}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorLostItems;