import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import LiveLocation from "./pages/LiveLocation";
import SOS from "./pages/SOS";
import ReportIncident from "./pages/ReportIncident";
import ViewReports from "./pages/ViewReports";
import Heatmap from "./pages/Heatmap";
import Navbar from "./components/Navbar";

// Demo page to view all components side by side
const SafetyComponentsDemo = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        padding: "20px",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div>
        <h3>Live Location</h3>
        <LiveLocation />
      </div>
      <div>
        <h3>Emergency Contacts</h3>
        <ReportIncident />
      </div>
      <div>
        <h3>Report Incident</h3>
        <SOS />
      </div>
      <div>
        <h3>Safety Heatmap</h3>
        <Heatmap />
      </div>
    </div>
  );
};

// Wrapper component to conditionally render Navbar
const AppWrapper = () => {
  const location = useLocation();
  // Only show navbar on homepage
  const showNavbarPaths = ['/'];
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Demo Route to view all safety components at once */}
        <Route path="/safety-demo" element={<SafetyComponentsDemo />} />

        {/* Individual Component Routes */}
        <Route path="/live-location" element={<LiveLocation />} />
        <Route path="/emergency-contacts" element={<ReportIncident />} />
        <Route path="/report-incident" element={<SOS />} />
        <Route path="/safety-heatmap" element={<Heatmap />} />

        {/* Protected Routes with Sidebar Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/location" element={<LiveLocation />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/view-reports" element={<ViewReports />} />
          <Route path="/heatmap" element={<Heatmap />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
