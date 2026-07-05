import React, { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/leaderboard/"
      );

      setLeaders(response.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#163B65] text-center">
          🏆 Honest Finders Leaderboard
        </h2>
      </div>

      {/* Container */}
      <div className="bg-white rounded-[28px] border border-[#D8E2EE] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            Loading leaderboard...
          </div>
        ) : leaders.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-6xl opacity-20">🏆</div>

            <h3 className="mt-4 text-lg font-bold text-slate-600">
              No Rankings Available Yet
            </h3>

            <p className="text-slate-400 mt-2">
              Rankings will appear once approved item returns are recorded.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 p-6">

            {/* LEFT SIDE */}
            <div>
              <h3 className="text-xl font-bold text-[#0B6FA4] mb-5">
                Top 3
              </h3>

              <div className="space-y-4">
                {leaders.slice(0, 3).map((leader, index) => {
                  const colors = [
                    "border-yellow-400 bg-yellow-50",
                    "border-slate-300 bg-slate-50",
                    "border-orange-300 bg-orange-50",
                  ];

                  const medals = ["🥇", "🥈", "🥉"];

                  return (
                    <div
                      key={leader.id}
                      className={`border-2 rounded-2xl p-5 flex items-center gap-5 ${colors[index]}`}
                    >
                      <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center text-4xl">
                        👤
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{medals[index]}</span>

                          <h4 className="font-bold text-lg">
                            {leader.name}
                          </h4>
                        </div>

                        <p className="text-gray-500">
                          {leader.role}
                        </p>

                        <span className="inline-block mt-2 bg-white px-3 py-1 rounded-full text-[#0B6FA4] font-bold">
                          {leader.total_returns} Returned Items
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <h3 className="text-xl font-bold text-[#0B6FA4] mb-5">
                Other Rankings
              </h3>

              <div className="border rounded-2xl overflow-hidden">
                {leaders.slice(3).map((leader, index) => (
                  <div
                    key={leader.id}
                    className="flex justify-between items-center px-5 py-4 border-b last:border-0 hover:bg-[#F8FBFD]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-bold w-8">
                        #{index + 4}
                      </div>

                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                        👤
                      </div>

                      <div>
                        <div className="font-semibold">
                          {leader.name}
                        </div>

                        <div className="text-sm text-gray-500">
                          {leader.role}
                        </div>
                      </div>
                    </div>

                    <span className="bg-[#EAF6FC] text-[#0B6FA4] px-4 py-2 rounded-full font-bold">
                      {leader.total_returns}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;