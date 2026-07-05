import { useState } from "react";
import { trackItem } from "../api/api";

export default function TrackItemPage() {
    const [ticketCode, setTicketCode] = useState("");
    const [item, setItem] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTrack = async () => {
        if (!ticketCode) return;

        setLoading(true);
        setError("");
        setItem(null);

        try {
            const res = await trackItem(ticketCode);

            if (res.found) {
                setItem(res.item);
            } else {
                setError("No record found for this ticket code.");
            }

        } catch (err) {
            setError("Unable to find ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
       <div className="flex-grow p-8">

    <div className="w-full max-w-3xl mx-auto">
               

                {/* CARD */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">

                    {/* INPUT */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                            placeholder="Enter ticket code (e.g. TKT-1-1234)"
                            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#2D366D]"
                        />

                        <button
                            onClick={handleTrack}
                            className="bg-[#2D366D] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
                        >
                            {loading ? "Searching..." : "Track"}
                        </button>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mt-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* RESULT */}
                    {item && (
                        <div className="mt-6 border border-slate-200 rounded-xl p-5 bg-slate-50">

                            {/* HEADER */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-black text-[#2D366D]">
                                    Item Found
                                </h2>

                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${item.status === "Approved"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {item.status}
                                </span>
                            </div>

                            {/* DETAILS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">

                                <div>
                                    <p className="text-slate-400 text-xs uppercase">Title</p>
                                    <p className="font-semibold">{item.title}</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs uppercase">Category</p>
                                    <p className="font-semibold">{item.category}</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs uppercase">Location</p>
                                    <p className="font-semibold">{item.location}</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs uppercase">Type</p>
                                    <p className="font-semibold">{item.type}</p>
                                </div>

                            </div>

                            {/* DATE + TIME */}
                            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between text-sm">

                                <div>
                                    <p className="text-slate-400 text-xs uppercase">Date Logged</p>
                                    <p className="font-semibold text-slate-700">
                                        {item.created_date || "—"}
                                    </p>
                                </div>

                                <div className="mt-3 sm:mt-0">
                                    <p className="text-slate-400 text-xs uppercase">Time Logged</p>
                                    <p className="font-semibold text-slate-700">
                                        {item.created_time || "—"}
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}

                </div>

                
            </div>
        </div>
    );
}