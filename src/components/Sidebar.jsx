import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "📊"
    },
    {
      path: "/location",
      name: "Live Location",
      icon: "📍"
    },
    {
      path: "/sos",
      name: "SOS Emergency",
      icon: "🚨"
    },
    {
      path: "/report",
      name: "Report Incident",
      icon: "📝"
    },
    {
      path: "/heatmap",
      name: "Safety Heatmap",
      icon: "🔥"
    }
  ];
  
  const handleLogout = () => {
    // You would handle actual logout logic here
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container" onClick={() => navigate("/dashboard")}>
          <h2 className="sidebar-title">Namra</h2>
          <span className="sidebar-subtitle">Safety App</span>
        </div>
        <div className="close-sidebar" onClick={toggleSidebar}>
          &times;
        </div>
      </div>
      
      <div className="sidebar-user">
        <div className="user-avatar">U</div>
        <div className="user-info">
          <h4>User</h4>
          <p>user@example.com</p>
        </div>
      </div>
      
      <div className="sidebar-divider"></div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-divider"></div>
        <NavLink to="/" className="sidebar-link">
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-text">Home</span>
        </NavLink>
        <div className="sidebar-link logout" onClick={handleLogout}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-text">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
