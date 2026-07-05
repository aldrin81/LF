import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import AppInner from "./pages/AppInner";
import TrackItemPage from "./pages/TrackItemPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardRoutes from "./components/DashboardRoutes";
import Leaderboard from "./pages/Leaderboards";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<AppInner />} />
          <Route path="/track" element={<TrackItemPage />} />

          {/* 1. ADD THIS LINE FOR A DEDICATED PAGE */}
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* DASHBOARD */}
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route path="*" element={<DashboardRoutes />} />
          </Route>

        </Routes>
      </Router>
    </AppProvider>
  );
}