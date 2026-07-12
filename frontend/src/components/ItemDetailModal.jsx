import React from 'react';
import { API_URL } from '../api/api';

const ItemDetailModal = ({ item, onClose }) => {
  console.log("ItemDetailModal received item:", item);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.18)] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B648D] to-[#155F87] text-white px-4 sm:px-8 py-4 sm:py-6 border-b-4 flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Item Details
            </h2>

            <p className="text-blue-100 text-sm sm:text-lg mt-1">
              View complete information about the selected item
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 sm:p-6 font-sans">

          {/* Details */}
          <div className="flex-1">

            <p className="text-sm sm:text-lg font-semibold text-slate-500">
              Item Name
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold uppercase text-[#184C73] tracking-wide mb-5 break-words">
              {item.title || item.name || "Unnamed Item"}
            </h1>

            <hr className="mb-5 border-slate-300 shadow-sm" />

            {/* Changed grid to 2 columns on mobile and 3 columns on tablet/desktop for better spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-x-10 gap-y-6">
              <div>
                <p className="text-sm sm:text-lg font-semibold text-slate-500">ID</p>
                <p className="text-base sm:text-xl font-semibold break-words">
                  {item.id || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm sm:text-lg font-semibold text-slate-500">Type</p>
                <p className="text-base sm:text-xl font-semibold break-words">
                  {(item.type || "—").toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-sm sm:text-lg font-semibold text-slate-500">Category</p>
                <p className="text-base sm:text-xl font-semibold break-words">
                  {(item.category || item.cat || "—").toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-sm sm:text-lg font-semibold text-slate-500">Location</p>
                <p className="text-base sm:text-xl font-semibold break-words">
                  {(item.location || item.area || "—").toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-sm sm:text-lg font-semibold text-slate-500">Date</p>
                <p className="text-base sm:text-xl font-semibold break-words">
                  {item.created_date || item.date || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm sm:text-lg font-semibold text-slate-500">Status</p>
                <p className="text-base sm:text-xl font-semibold break-words">
                  {(item.status || "—").toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <hr className="my-6 border-slate-200" />

          {/* Description */}
          <div>
            <p className="text-base sm:text-lg font-semibold text-[#184C73] mb-3">
              Description
            </p>

            <div className="min-h-[100px] rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 sm:p-5 text-base sm:text-lg leading-7 text-slate-700 break-words">
              {item.description || item.desc || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;