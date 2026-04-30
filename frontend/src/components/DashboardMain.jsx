import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import LostItems from "../pages/LostItems";
import FoundItems from "../pages/FoundItems";
import ClaimRequests from "../pages/ClaimRequests";
import Reports from "../pages/Reports";
import Users from "../pages/Users";
import DashboardLayout from "./DashboardLayout";
import ModeratorLostItems from "../pages/ModeratorLostItems";


function DashboardMain() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index                 element={<Dashboard />} />
        <Route path="lost-items"     element={<LostItems />} />
        <Route path="found-items"    element={<FoundItems />} />
        <Route path="claim-requests" element={<ClaimRequests />} />
        <Route path="reports"        element={<Reports />} />
        <Route path="users"          element={<Users />} />
        <Route path="moderator"          element={<ModeratorLostItems />} />
      </Route>
    </Routes>
  );
}

export default DashboardMain;
