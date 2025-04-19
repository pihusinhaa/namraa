import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewReports.css";

const ViewReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load reports from localStorage
    const loadReports = () => {
      try {
        setLoading(true);
        const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
        setReports(savedReports);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const openReportDetails = (report) => {
    setSelectedReport(report);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFB800";
      case "investigating":
        return "#3E80FF";
      case "resolved":
        return "#37B864";
      default:
        return "#888888";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredReports = reports.filter((report) => {
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesSearch = 
      searchQuery === "" || 
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.incidentLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.locationDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const renderReportDetails = () => {
    if (!selectedReport) return null;

    return (
      <div className="report-detail-overlay">
        <div className="report-detail-container">
          <div className="report-detail-header">
            <div className="report-detail-title">
              <div 
                className="report-icon" 
                style={{ backgroundColor: getStatusColor(selectedReport.status) }}
              >
                {selectedReport.incidentIcon}
              </div>
              <div>
                <h3>{selectedReport.incidentLabel}</h3>
                <p className="report-id">{selectedReport.id}</p>
              </div>
            </div>
            <button className="close-button" onClick={closeReportDetails}>×</button>
          </div>
          
          <div className="report-detail-content">
            <div className="report-detail-section">
              <h4>Status</h4>
              <div 
                className="report-status-tag" 
                style={{ backgroundColor: getStatusColor(selectedReport.status) }}
              >
                {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
              </div>
            </div>
            
            <div className="report-detail-section">
              <h4>Description</h4>
              <p>{selectedReport.description}</p>
            </div>
            
            <div className="report-detail-section">
              <h4>Location</h4>
              <p>{selectedReport.locationDescription || "No location details provided"}</p>
              {selectedReport.location && (
                <div className="report-location-coordinates">
                  <p>Latitude: {selectedReport.location.latitude}</p>
                  <p>Longitude: {selectedReport.location.longitude}</p>
                </div>
              )}
            </div>
            
            <div className="report-detail-section">
              <h4>Additional Information</h4>
              <div className="report-detail-info-grid">
                <div>
                  <p className="info-label">Date Submitted</p>
                  <p>{formatDate(selectedReport.dateSubmitted)}</p>
                </div>
                <div>
                  <p className="info-label">Time</p>
                  <p>{formatTime(selectedReport.dateSubmitted)}</p>
                </div>
                <div>
                  <p className="info-label">Urgency</p>
                  <p>{selectedReport.urgencyLabel}</p>
                </div>
                <div>
                  <p className="info-label">Media Attached</p>
                  <p>{selectedReport.hasPhotos ? `${selectedReport.photoCount} photo(s)` : "None"}</p>
                </div>
                <div>
                  <p className="info-label">Submitted As</p>
                  <p>{selectedReport.anonymous ? "Anonymous" : "Identified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="view-reports-container">
      <div className="view-reports-header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-icon">←</span>
        </button>
        <h1>My Reports</h1>
      </div>

      <div className="reports-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <button
            className={filterStatus === "all" ? "active" : ""}
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>
          <button
            className={filterStatus === "pending" ? "active" : ""}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={filterStatus === "investigating" ? "active" : ""}
            onClick={() => setFilterStatus("investigating")}
          >
            Investigating
          </button>
          <button
            className={filterStatus === "resolved" ? "active" : ""}
            onClick={() => setFilterStatus("resolved")}
          >
            Resolved
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="no-reports">
          <div className="no-reports-icon">📋</div>
          <h3>No reports found</h3>
          {reports.length === 0 ? (
            <p>You haven't submitted any reports yet.</p>
          ) : (
            <p>No reports match your current filters.</p>
          )}
          <button 
            className="report-button" 
            onClick={() => navigate("/report-incident")}
          >
            Report an Incident
          </button>
        </div>
      ) : (
        <div className="reports-list">
          {filteredReports.map((report) => (
            <div 
              key={report.id} 
              className="report-card"
              onClick={() => openReportDetails(report)}
            >
              <div className="report-header">
                <div 
                  className="report-icon" 
                  style={{ backgroundColor: getStatusColor(report.status) }}
                >
                  {report.incidentIcon}
                </div>
                <div className="report-title">
                  <h3>{report.incidentLabel}</h3>
                  <p className="report-id">{report.id}</p>
                </div>
                <div 
                  className="report-status" 
                  style={{ backgroundColor: getStatusColor(report.status) }}
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </div>
              </div>
              <div className="report-body">
                <p className="report-description">
                  {report.description.length > 100 
                    ? `${report.description.substring(0, 100)}...` 
                    : report.description}
                </p>
              </div>
              <div className="report-footer">
                <div className="report-location">
                  <span className="location-icon">📍</span>
                  <span>{report.locationDescription || "Location not specified"}</span>
                </div>
                <div className="report-date">
                  {formatDate(report.dateSubmitted)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderReportDetails()}
    </div>
  );
};

export default ViewReports; 