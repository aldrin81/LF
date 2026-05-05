import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppInner from './pages/AppInner';
import DashboardMain from './components/DashboardMain';
import ModeratorLostItems from './pages/ModeratorLostItems';

const App = () => (
  <AppProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AppInner />} />
        <Route path="/dashboard/*" element={<DashboardMain />} />
      </Routes>
    </Router>
  </AppProvider>
);

export default App;