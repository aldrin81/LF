import React, { useEffect, useState } from "react";
import { getLeaderboard, getLeaderboardSettings } from "../api/api";

const getSchoolYearAndSemFromDate = (dateString) => {
  const referenceDate = dateString ? new Date(dateString) : new Date();
  const finalDate = isNaN(referenceDate.getTime()) ? new Date() : referenceDate;
  
  const year = finalDate.getFullYear();
  const month = finalDate.getMonth();

  let sem = "";
  let schoolYear = "";

  if (month >= 7 && month <= 11) {
    sem = "1st Semester";
    schoolYear = `${year}-${year + 1}`;
  } else if (month >= 0 && month <= 4) {
    sem = "2nd Semester";
    schoolYear = `${year - 1}-${year}`;
  } else {
    sem = "Short Term";
    schoolYear = `${year}`;
  }

  return { schoolYear, sem };
};

const getDaysLeftFromDate = (dateString) => {
  if (!dateString) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closeDate = new Date(`${dateString}T00:00:00`);

  return Math.max(
    Math.ceil((closeDate - today) / (1000 * 60 * 60 * 24)),
    0
  );
};  

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardActive, setLeaderboardActive] = useState(true);
  const [daysLeft, setDaysLeft] = useState(null);
  
  const [config, setConfig] = useState({
    auto_mode: false,
    open_date: "",
    close_date: "",
  });

  useEffect(() => {
    fetchLeaderboardData();

    const interval = setInterval(fetchLeaderboardData, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const [data, settingsData] = await Promise.all([
        getLeaderboard(),
        getLeaderboardSettings(),
      ]);

      setConfig({
        auto_mode: Boolean(settingsData?.auto_mode),
        open_date: settingsData?.open_date || "",
        close_date: settingsData?.close_date || "",
      });

      if (Array.isArray(data)) {
        setLeaderboardActive(true);
        setLeaders(data);
        setDaysLeft(null);
      } else {
        setLeaderboardActive(Boolean(data.active));
        setLeaders(Array.isArray(data.leaders) ? data.leaders : []);
        setDaysLeft(
          data.days_left === null || data.days_left === undefined
            ? null
            : data.days_left
        );
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLeaders([]);
      setLeaderboardActive(false);
      setDaysLeft(null);
    } finally {
      setLoading(false);
    }
  };

  const safeLeaders = Array.isArray(leaders) ? leaders : [];
  const topLeaders = safeLeaders.slice(0, 3);
  const otherLeaders = safeLeaders.slice(3);

  const { schoolYear, sem } = getSchoolYearAndSemFromDate(
    config.auto_mode ? config.open_date : null
  );

  const displayDaysLeft =
  daysLeft ??
  (config.auto_mode
    ? getDaysLeftFromDate(config.close_date)
    : null);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-[#163B65]">
          Honest Finders Leaderboard for SY {schoolYear} ({sem})
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Ranked by earned surrender and claim points
        </p>

        {daysLeft !== null && daysLeft <= 30 && (
          <p className="mt-2 text-sm font-black text-[#0B6B8A]">
            {displayDaysLeft === 0
              ? "Leaderboard ends today"
              : `${displayDaysLeft} ${
                  displayDaysLeft === 1 ? "day" : "days"
                } left`}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D8E2EE] bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            Loading leaderboard...
          </div>
        ) : !leaderboardActive ? (
          <div className="px-4 py-20 text-center">
            <h3 className="text-lg font-bold text-slate-600">
              Leaderboard is currently closed.
            </h3>
            <p className="mt-2 text-slate-400">
              The leaderboard for SY {schoolYear} ({sem}) is inactive.
              Please wait for the administrator to open the scoring window.
            </p>
          </div>
        ) : safeLeaders.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <h3 className="text-lg font-bold text-slate-600">
              No leaderboard scores yet.
            </h3>
            <p className="mt-2 text-slate-400">
              This leaderboard is active. Rankings will appear once students earn points.
            </p>
          </div>
        ) : (
          <div className="space-y-8 p-4 sm:p-6">
            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-black text-[#0B6FA4]">
                  Top {Math.min(safeLeaders.length, 3)}
                </h3>
                <span className="w-fit rounded-full bg-[#EAF6FC] px-3 py-1 text-sm font-bold text-[#0B6FA4]">
                  {safeLeaders.length} ranked
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
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 sm:block sm:min-w-[112px] sm:text-right">
                          <span className="text-xs text-center font-black uppercase tracking-wide text-slate-400 sm:block">
                            Points
                          </span>
                          <div className="flex items-center justify-center">
                            <span className="text-xl font-black text-[#0B6FA4]">
                              {leader.points}
                            </span>
                          </div>
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