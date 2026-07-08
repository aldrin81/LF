import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../api/api";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    const interval = setInterval(fetchLeaderboard, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaders(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const topLeaders = leaders.slice(0, 3);
  const otherLeaders = leaders.slice(3);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-[#163B65]">
          Honest Finders Leaderboard
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Ranked by earned surrender and claim points
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D8E2EE] bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            Loading leaderboard...
          </div>
        ) : leaders.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <h3 className="text-lg font-bold text-slate-600">
              No Rankings Available Yet
            </h3>
            <p className="mt-2 text-slate-400">
              Rankings will appear once surrendered items earn points.
            </p>
          </div>
        ) : (
          <div className="space-y-8 p-4 sm:p-6">
            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-black text-[#0B6FA4]">
                  Top {Math.min(leaders.length, 3)}
                </h3>

                <span className="w-fit rounded-full bg-[#EAF6FC] px-3 py-1 text-sm font-bold text-[#0B6FA4]">
                  {leaders.length} ranked
                </span>
              </div>

              <div className="mx-auto w-full max-w-4xl">
  <div className="grid grid-cols-[0.8fr_1fr_0.8fr] items-end gap-1.5 sm:gap-4">
    {/* 2nd */}
    <div className="min-w-0">
      {topLeaders[1] ? (
        <div className="min-h-[115px] sm:min-h-[210px] rounded-t-2xl sm:rounded-t-3xl border border-slate-300 bg-slate-100 p-2 sm:p-5 text-center flex flex-col justify-between">
          <div className="min-w-0">
            <div className="mx-auto flex h-8 w-8 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-slate-300 text-xs sm:text-xl font-black text-slate-800">
              2
            </div>

            <h4 className="mt-2 sm:mt-4 text-[10px] sm:text-base font-black text-slate-900 leading-tight break-words line-clamp-2">
              {topLeaders[1].full_name}
            </h4>
          </div>

          <div className="mt-2 rounded-lg sm:rounded-xl bg-white py-1.5 sm:py-3 text-[10px] sm:text-base font-black text-[#0B6FA4]">
            {topLeaders[1].points} pts
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>

    {/* 1st */}
    <div className="min-w-0">
      {topLeaders[0] ? (
        <div className="min-h-[145px] sm:min-h-[260px] rounded-t-2xl sm:rounded-t-3xl border-2 border-yellow-400 bg-yellow-50 p-2 sm:p-5 text-center shadow-md flex flex-col justify-between">
          <div className="min-w-0">
            <div className="mx-auto flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-yellow-400 text-sm sm:text-2xl font-black text-yellow-950">
              1
            </div>

            <h4 className="mt-2 sm:mt-4 text-[10px] sm:text-lg font-black text-slate-900 leading-tight break-words line-clamp-2">
              {topLeaders[0].full_name}
            </h4>
          </div>

          <div className="mt-2 rounded-lg sm:rounded-xl bg-white py-1.5 sm:py-3 text-[10px] sm:text-base font-black text-[#0B6FA4]">
            {topLeaders[0].points} pts
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>

    {/* 3rd */}
    <div className="min-w-0">
      {topLeaders[2] ? (
        <div className="min-h-[105px] sm:min-h-[185px] rounded-t-2xl sm:rounded-t-3xl border border-orange-300 bg-orange-50 p-2 sm:p-5 text-center flex flex-col justify-between">
          <div className="min-w-0">
            <div className="mx-auto flex h-8 w-8 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-orange-300 text-xs sm:text-xl font-black text-orange-950">
              3
            </div>

            <h4 className="mt-2 sm:mt-4 text-[10px] sm:text-base font-black text-slate-900 leading-tight break-words line-clamp-2">
              {topLeaders[2].full_name}
            </h4>
          </div>

          <div className="mt-2 rounded-lg sm:rounded-xl bg-white py-1.5 sm:py-3 text-[10px] sm:text-base font-black text-[#0B6FA4]">
            {topLeaders[2].points} pts
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  </div>
</div>
            </section>

            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-black text-[#0B6FA4]">
                  Other Rankings
                </h3>

                {otherLeaders.length > 0 && (
                  <span className="w-fit rounded-full bg-[#EAF6FC] px-3 py-1 text-sm font-bold text-[#0B6FA4]">
                    Rank 4+
                  </span>
                )}
              </div>

              {otherLeaders.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-400">
                  No other rankings yet
                </div>
              ) : (
                <div className="space-y-3">
                  {otherLeaders.map((leader, index) => {
                    const rank = index + 4;

                    return (
                      <div
                        key={leader.id}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:bg-[#F8FBFD] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-300 text-lg font-black text-slate-800">
                            {rank}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-base font-black text-slate-900 leading-tight break-words line-clamp-2">
                              {leader.full_name}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                              <span>Honest Finder</span>

                              {leader.student_id && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <span>ID: {leader.student_id}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 sm:block sm:min-w-[112px] sm:text-right">
                          <span className="text-xs font-black uppercase tracking-wide text-slate-400 sm:block">
                            Points
                          </span>

                          <span className="text-xl font-black text-[#0B6FA4]">
                            {leader.points}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;