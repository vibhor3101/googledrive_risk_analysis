import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { DashboardProvider } from "../context/dashboardContext";
import LoginPage from "../pages/loginPage/loginPage";
import DashboardPage from "../pages/dashboardPage/dashboardPage";
import ChartsPage from "../pages/chartsPage/chartsPage";
import ReportPage from "../pages/reportPage/reportPage";
import FileManager from "../pages/fileManager/fileManager";
const AppRoutes = () => {
  return (
    <DashboardProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/file" element={<FileManager />} />
        </Routes>
      </Router>
    </DashboardProvider>
  );
};

export default AppRoutes;
