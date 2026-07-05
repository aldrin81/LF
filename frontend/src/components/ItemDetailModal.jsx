import React from 'react';
import { API_URL } from '../api/api';

const ItemDetailModal = ({ item, onClose }) => {
  console.log("ItemDetailModal received item:", item);

  // Helper to find the image in various possible data structures
  const findImageUrl = (obj) => {
    if (!obj) return null;

    // 1. If it's a string, it's likely the path
    if (typeof obj === 'string') return obj;

    // 2. If it's an array, look at the first element
    if (Array.isArray(obj)) return findImageUrl(obj[0]);

    // 3. If it's an object, check common field names
    const fields = ['image', 'file', 'url', 'image_url', 'photo', 'picture', 'thumbnail', 'src'];

    for (const f of fields) {
      if (obj[f]) return findImageUrl(obj[f]);
    }

    return null;
  };

  // Aggressive search for image data
  const rawPath = findImageUrl(
    item.image ||
    item.images ||
    item.photo ||
    item.picture ||
    item.file ||
    item.image_url ||
    item.url ||
    item
  );

  // Construct the full URL
  const cleanBase = API_URL.replace(/\/$/, '');

  const imageUrl = rawPath
    ? (
      rawPath.startsWith('http')
        ? rawPath
        : `${cleanBase}/${rawPath.replace(/^\//, '')}`
    )
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
  <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.18)] overflow-hidden flex flex-col">

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

      <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-stretch md:items-start">

        {/* Image */}
        <div className="w-full md:w-56 flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title || item.name}
              className="w-full h-64 sm:h-80 md:h-[340px] object-cover rounded-lg md:rounded-none border-2 border-[#2B3A74]"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x400?text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-64 sm:h-80 md:h-[340px] rounded-lg border border-slate-200 shadow-sm bg-gray-100 flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">

          <p className="text-sm sm:text-lg font-semibold text-slate-500">
            Item Name
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold uppercase text-[#184C73] tracking-wide mb-5 break-words">
            {item.title || item.name || "Unnamed Item"}
          </h1>

          <hr className="mb-5 border-slate-300 shadow-sm" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-10">
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
      </div>

      <hr className="my-5 border-slate-200" />

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