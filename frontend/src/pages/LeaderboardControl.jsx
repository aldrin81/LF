import React, { useEffect, useState } from "react";
import {
  getLeaderboardSettings,
  updateLeaderboardSettings,
  getPointsTracking,
  getLeaderboardHistory,
} from "../api/api";

const getSchoolYearAndSemFromDate = (dateString) => {
  const referenceDate = dateString ? new Date(dateString) : new Date();
  
  const finalDate = isNaN(referenceDate.getTime()) ? new Date() : referenceDate;
  
  const year = finalDate.getFullYear();
  const month = finalDate.getMonth(); // 0 = Jan, 11 = Dec

  let sem = "";
  let schoolYear = "";

  if (month >= 7 && month <= 11) {
    // August to December
    sem = "1st Semester";
    schoolYear = `${year}-${year + 1}`;
  } else if (month >= 0 && month <= 4) {
    // January to May
    sem = "2nd Semester";
    schoolYear = `${year - 1}-${year}`;
  } else {
    // June to July
    sem = "Short Term";
    schoolYear = `${year}`;
  }

  return { schoolYear, sem };
};

function LeaderboardControl() {
  const [settings, setSettings] = useState({
    is_active: false,
    auto_mode: false,
    open_date: "",
    close_date: "",
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [historyPeriods, setHistoryPeriods] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historySchoolYear, setHistorySchoolYear] = useState("");
  const [historySemester, setHistorySemester] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    fetchInitialData();

    const interval = setInterval(fetchRecords, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchHistoryPeriods();
  }, []);

useEffect(() => {
    fetchHistory();
  }, [historySchoolYear, historySemester]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchSettings(), fetchRecords()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await getLeaderboardSettings();

      setSettings({
        is_active: Boolean(data.is_active),
        auto_mode: Boolean(data.auto_mode),
        open_date: data.open_date || "",
        close_date: data.close_date || "",
      });
    } catch (error) {
      console.error("Failed to fetch leaderboard settings:", error);
    }
  };

  const fetchHistoryPeriods = async () => {
  try {
    const data = await getLeaderboardHistory();
    setHistoryPeriods(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to fetch leaderboard history periods:", error);
    setHistoryPeriods([]);
  }
};

const fetchHistory = async () => {
  setHistoryLoading(true);

  try {
    const data = await getLeaderboardHistory({
      school_year: historySchoolYear || undefined,
      semester: historySemester || undefined,
    });

    setHistory(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to fetch leaderboard history:", error);
    setHistory([]);
  } finally {
    setHistoryLoading(false);
  }
};

  const fetchRecords = async () => {
    try {
      const data = await getPointsTracking();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch points records:", error);
      setRecords([]);
    }
  };

  const set = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (saving) return;

    if (
      settings.auto_mode &&
      settings.open_date &&
      settings.close_date &&
      settings.open_date >= settings.close_date
    ) {
      window.alert("Open date cannot be later than close date.");
      return;
    }

    setSaving(true);

    try {
      await updateLeaderboardSettings({
        is_active: settings.is_active,
        auto_mode: settings.auto_mode,
        open_date: settings.open_date || null,
        close_date: settings.close_date || null,
      });

      window.alert("Leaderboard settings updated.");
      await fetchSettings();
    } catch (error) {
      console.error("Failed to update leaderboard settings:", error);
      window.alert("Failed to update leaderboard settings.");
    } finally {
      setSaving(false);
    }
  };

  const reasonLabel = (reason) => {
    if (reason === "SURRENDER_ITEM") return "Surrendered item";
    if (reason === "ITEM_CLAIMED") return "Item claimed by owner";
    return reason;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-400">
        Loading leaderboard control...
      </div>
    );
  }

  const { schoolYear, sem } = getSchoolYearAndSemFromDate(
    settings.auto_mode ? settings.open_date : null
  );

  const ITEMS_PER_PAGE = 10;

  const filteredRecords = records.filter((record) => {
    const searchText = search.toLowerCase();

    return (
      record.player_name?.toLowerCase().includes(searchText) ||
      reasonLabel(record.reason)?.toLowerCase().includes(searchText) ||
      String(record.item_id || "").toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#163B65]">
          Leaderboard Control
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage leaderboard visibility, scheduling, and point records.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-black text-[#163B65]">
              Visibility Settings
            </h3>
            <p className="text-sm text-slate-500">
              Choose manual control or automatic schedule.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-sm font-black ${
              settings.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {settings.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-slate-800">
                  Manual On / Off
                </h4>
                <p className="text-sm text-slate-500">
                  Turn leaderboard visibility on or off immediately.
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={settings.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                  disabled={settings.auto_mode}
                  className="peer sr-only"
                />
                <div className="h-7 w-12 rounded-full bg-slate-300 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-[#0B6FA4] peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-slate-800">
                  Automatic Mode
                </h4>
                <p className="text-sm text-slate-500">
                  Activate only between selected dates.
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={settings.auto_mode}
                  onChange={(e) => set("auto_mode", e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-7 w-12 rounded-full bg-slate-300 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-[#0B6FA4] peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black uppercase text-slate-600">
              Start Date
            </label>
            <input
              type="date"
              value={settings.open_date}
              min={today}
              onChange={(e) => set("open_date", e.target.value)}
              disabled={!settings.auto_mode}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#0B6FA4] disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase text-slate-600">
              Turn Off Date
            </label>
            <input
              type="date"
              value={settings.close_date}
              min={settings.open_date || today}
              onChange={(e) => set("close_date", e.target.value)}
              disabled={!settings.auto_mode}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#0B6FA4] disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`mt-5 w-full rounded-xl py-3 font-black uppercase tracking-wide text-white transition ${
            saving
              ? "cursor-not-allowed bg-slate-400"
              : "bg-[#2D366D] hover:bg-[#24305C]"
          }`}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-[#163B65]">
              Leaderboard History
            </h3>
            <p className="text-sm text-slate-500">
              View archived leaderboard results by school year and semester.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <select
            value={historySchoolYear}
            onChange={(e) => setHistorySchoolYear(e.target.value)}
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-[#0B6FA4]"
          >
            <option value="">All school years</option>

            {[...new Set(historyPeriods.map((item) => item.school_year))].map(
              (schoolYear) => (
                <option key={schoolYear} value={schoolYear}>
                  {schoolYear}
                </option>
              )
            )}
          </select>

          <select
            value={historySemester}
            onChange={(e) => setHistorySemester(e.target.value)}
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-[#0B6FA4]"
          >
            <option value="">All semesters</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="Short Term">Short Term</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                  School Year
                </th>
                <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                  Semester
                </th>
                <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                  Total Players
                </th>
                <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                  Archived On
                </th>
                <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {historyLoading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400">
                    Loading leaderboard history...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400">
                    No archived leaderboard history found.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F6FAFF]">
                    <td className="border border-slate-200 p-3 text-center">
                      {item.school_year}
                    </td>
                    <td className="border border-slate-200 p-3 text-center">
                      {item.semester}
                    </td>
                    <td className="border border-slate-200 p-3 text-center font-black text-[#0B6FA4]">
                      {item.total_players}
                    </td>
                    <td className="border border-slate-200 p-3 text-center">
                      {new Date(item.archived_at).toLocaleDateString()}
                    </td>
                    <td className="border border-slate-200 p-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedHistory(item)}
                        className="rounded-lg bg-[#2D366D] px-4 py-2 text-xs font-black uppercase text-white transition hover:bg-[#24305C]"
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

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
                    SY {schoolYear} ({sem})
                  </h3>
                  <p className="text-md sm:text-base text-[#7B8AA6] italic mt-1">
                    Manage leaderboard visibility, scheduling, and point records.
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
                  placeholder="Search point records..."
                  className="w-full pl-10 pr-4 py-3 border border-[#CBD8E8] rounded-full text-lg outline-none bg-white text-[#071E3D] placeholder:text-[#8A98B3] focus:ring-2 focus:ring-[#0B6B8A]/20 focus:border-[#0B6B8A] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full min-w-[1000px] table-fixed border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="w-[18%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Date</th>
                <th className="w-[20%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Student</th>
                <th className="w-[26%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Reason</th>
                <th className="w-[18%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Item ID</th>
                <th className="w-[18%] bg-[#0B6B8A] p-4 border border-gray-300 text-center text-[13px] font-black uppercase text-white">Points</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, index) => (
                  <tr key={record.id} className={`h-[70px] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F6FAFF]"} hover:bg-[#EAF4FF]`}>
                    <td className="border border-gray-300 p-4 text-center align-middle text-slate-600 text-[14px]">
                      {new Date(record.created_at).toLocaleString()}
                    </td>
                    <td className="truncate border border-gray-300 p-4 text-center align-middle font-bold text-[#071E3D]">
                      {record.player_name}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle text-slate-600 text-[14px]">
                      {reasonLabel(record.reason)}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle text-slate-600 text-[14px]">
                      {record.item_id || "-"}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle font-black text-[#0B6FA4]">
                      +{record.points}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="bg-white text-center py-32">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[#EEF4FA] flex items-center justify-center text-3xl">🏆
                      </div>
                      <span className="text-4xl opacity-20 font-black tracking-tighter text-[#071E3D]">EMPTY
                      </span>
                      <p className="text-xs font-sans tracking-[0.2em] uppercase font-bold text-[#7B8AA6]">
                        No point records yet
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredRecords.length > 0 && (
          <div className="border-t border-[#D8E2EF] bg-white px-6 py-4 flex items-center justify-between shrink-0">
            <p className="text-sm font-bold text-[#7B8AA6]">
              Showing {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredRecords.length)} of{" "}
              {filteredRecords.length}
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
    </div>
    {selectedHistory && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between bg-gradient-to-r from-[#0B648D] to-[#155F87] px-6 py-4 text-white">
            <div>
              <h3 className="text-xl font-black">
                {selectedHistory.school_year} — {selectedHistory.semester}
              </h3>
              <p className="mt-1 text-sm text-white/85">
                Total Players: {selectedHistory.total_players}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedHistory(null)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl hover:bg-white/25"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="max-h-[calc(90vh-92px)] overflow-auto p-6">
            <table className="w-full min-w-[650px] border-collapse">
              <thead>
                <tr>
                  <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                    Rank
                  </th>
                  <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                    Student ID
                  </th>
                  <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                    Player
                  </th>
                  <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                    Points
                  </th>
                  <th className="border border-slate-200 bg-[#0B6B8A] p-3 text-center text-xs font-black uppercase text-white">
                    Items Surrendered
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedHistory.players.map((player) => (
                  <tr key={player.id} className="hover:bg-[#F6FAFF]">
                    <td className="border border-slate-200 p-3 text-center font-black text-[#163B65]">
                      #{player.rank}
                    </td>
                    <td className="border border-slate-200 p-3 text-center text-slate-600">
                      {player.student_id || "-"}
                    </td>
                    <td className="border border-slate-200 p-3 text-center font-bold text-slate-700">
                      {player.player_name}
                    </td>
                    <td className="border border-slate-200 p-3 text-center font-black text-[#0B6FA4]">
                      {player.total_points}
                    </td>
                    <td className="border border-slate-200 p-3 text-center">
                      {player.surrendered_items}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
    </div>

    
  );
}

export default LeaderboardControl;