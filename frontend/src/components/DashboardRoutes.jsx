import { Routes, Route } from "react-router-dom";

import DashboardHome from "../pages/Dashboard";
import LostItems from "../pages/LostItems";
import FoundItems from "../pages/FoundItems";
import Reports from "../pages/Reports";
import Users from "../pages/Users";
import ModeratorLostItems from "../pages/ModeratorLostItems";
import ClaimRequests from "../pages/ClaimRequests";
import Leaderboard from "../pages/Leaderboards";

import RequireRole from "../components/RequireRole";
import LeaderboardControl from "../pages/LeaderboardControl";

const DashboardRoutes = () => {
  return (
    <Routes>

      {/* COMMON */}
      <Route path="/" element={<DashboardHome />} />
      <Route path="lost-items" element={<LostItems />} />
      <Route path="surrendered-items" element={<FoundItems />} />
      <Route path="reports" element={<Reports />} />
      <Route path="claim-requests" element={<ClaimRequests />} />
      <Route
        path="leaderboard"
        element={
            <LeaderboardControl />
        }
      />

      {/* MODERATOR ONLY */}
      <Route
        path="moderator-lost"
        element={
          <RequireRole allowedRoles={["moderator"]}>
            <ModeratorLostItems />
          </RequireRole>
        }
      />

      {/* ADMIN ONLY */}
      <Route
        path="users"
        element={
          <RequireRole allowedRoles={["admin"]}>
            <Users />
          </RequireRole>
        }
      />

    </Routes>
  );
};

export default DashboardRoutes;