import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./Layout.css"; // optional if you want to add layout styles

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when screen is resized above tablet breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    
    // Toggle body scroll when sidebar is open on mobile
    if (!isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      document.body.style.overflow = "auto";
    }
  };

  return (
    <div className="layout-container">
      {/* Hamburger icon for mobile */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <span>☰</span>
      </div>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} 
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
