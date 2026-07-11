import React, { useEffect, useState } from "react";
import {
  getLeaderboardSettings,
  updateLeaderboardSettings,
  getPointsTracking,
} from "../api/api";

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

  useEffect(() => {
    fetchInitialData();

    const interval = setInterval(fetchRecords, 3000);
    return () => clearInterval(interval);
  }, []);

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
      settings.open_date > settings.close_date
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

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h3 className="font-black text-[#163B65]">
            Points Records
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Chronological record of leaderboard point transactions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[#0B6FA4] text-white">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Item ID</th>
                <th className="p-3 text-right">Points</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-slate-400"
                  >
                    No point records yet.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b last:border-b-0 hover:bg-[#F8FBFD]"
                  >
                    <td className="p-3 text-sm text-slate-600">
                      {new Date(record.created_at).toLocaleString()}
                    </td>

                    <td className="p-3 font-bold text-slate-800">
                      {record.player_name}
                    </td>

                    <td className="p-3 text-slate-600">
                      {reasonLabel(record.reason)}
                    </td>

                    <td className="p-3 text-slate-600">
                      {record.item_id || "-"}
                    </td>

                    <td className="p-3 text-right font-black text-[#0B6FA4]">
                      +{record.points}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default LeaderboardControl;