import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Heatmap.css";
//import NavigationBar from "./NavigationBar";

const Heatmap = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.6);
  const [heatmapRadius, setHeatmapRadius] = useState(30);
  const [timeRange, setTimeRange] = useState("all");
  const [incidentTypes, setIncidentTypes] = useState({
    unsafe_area: true,
    harassment: true, 
    suspicious: true,
    theft: true,
    violence: true,
    infrastructure: true,
    other: true
  });

  useEffect(() => {
    // Load incident data from localStorage
    const loadIncidents = () => {
      try {
        setLoading(true);
        const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
        setIncidents(savedReports);
      } catch (error) {
        console.error("Error loading incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  useEffect(() => {
    // Initialize Google Maps and heatmap
    if (window.google && window.google.maps && incidents.length > 0 && !mapLoaded) {
      initializeMap();
    }
  }, [incidents, mapLoaded]);

  useEffect(() => {
    // Update heatmap when filters change
    if (mapInstance && heatmapLayer) {
      updateHeatmap();
    }
  }, [timeRange, incidentTypes, heatmapIntensity, heatmapRadius, mapInstance, heatmapLayer]);

  const initializeMap = () => {
    // Create map centered on a default location or first incident if available
    const center = incidents.length > 0 && incidents[0].location
      ? { lat: incidents[0].location.latitude, lng: incidents[0].location.longitude }
      : { lat: 40.7128, lng: -74.0060 }; // Default to NYC if no incidents

    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: center,
      mapTypeId: "roadmap",
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
      ]
    });

    // Create heatmap layer
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      map: map,
      opacity: 0.8,
      radius: heatmapRadius,
    });

    setMapInstance(map);
    setHeatmapLayer(heatmap);
    setMapLoaded(true);
    
    // Initial heatmap update
    updateHeatmapData(heatmap);
  };

  const updateHeatmap = () => {
    if (heatmapLayer) {
      // Update heatmap settings
      heatmapLayer.set('radius', heatmapRadius);
      heatmapLayer.set('opacity', heatmapIntensity);
      
      // Update heatmap data
      updateHeatmapData(heatmapLayer);
    }
  };

  const updateHeatmapData = (heatmap) => {
    // Filter incidents based on selected types and time range
    const filteredIncidents = incidents.filter(incident => {
      // Filter by incident type
      if (!incidentTypes[incident.incidentType]) {
        return false;
      }
      
      // Filter by time range
      if (timeRange !== "all") {
        const incidentDate = new Date(incident.dateSubmitted);
        const currentDate = new Date();
        
        switch (timeRange) {
          case "day":
            const oneDayAgo = new Date(currentDate.setDate(currentDate.getDate() - 1));
            return incidentDate >= oneDayAgo;
          case "week":
            const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
            return incidentDate >= oneWeekAgo;
          case "month":
            const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
            return incidentDate >= oneMonthAgo;
          default:
            return true;
        }
      }
      
      return true;
    });
    
    // Format incidents for heatmap
    const heatmapData = filteredIncidents
      .filter(incident => incident.location) // Only include incidents with location data
      .map(incident => {
        return {
          location: new window.google.maps.LatLng(
            incident.location.latitude,
            incident.location.longitude
          ),
          weight: getIncidentWeight(incident.urgency) // Weight by urgency
        };
      });
    
    // Update heatmap data
    heatmap.setData(heatmapData);
  };
  
  const getIncidentWeight = (urgency) => {
    // Weight incidents by urgency
    switch (urgency) {
      case "high":
        return 10;
      case "medium":
        return 5;
      case "low":
        return 2;
      default:
        return 5;
    }
  };

  const handleTypeToggle = (type) => {
    setIncidentTypes({
      ...incidentTypes,
      [type]: !incidentTypes[type]
    });
  };
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };
  
  // Check if we can render the map
  const canRenderMap = incidents.some(incident => incident.location);

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-icon">←</span>
        </button>
        <h1>Safety Heatmap</h1>
      </div>
      
      <div className="heatmap-filters">
        <div className="filter-section time-filter">
          <h3>Time Range</h3>
          <div className="time-range-buttons">
            <button 
              className={timeRange === "day" ? "active" : ""} 
              onClick={() => handleTimeRangeChange("day")}
            >
              24 Hours
            </button>
            <button 
              className={timeRange === "week" ? "active" : ""} 
              onClick={() => handleTimeRangeChange("week")}
            >
              Week
            </button>
            <button 
              className={timeRange === "month" ? "active" : ""} 
              onClick={() => handleTimeRangeChange("month")}
            >
              Month
            </button>
            <button 
              className={timeRange === "all" ? "active" : ""} 
              onClick={() => handleTimeRangeChange("all")}
            >
              All Time
            </button>
          </div>
        </div>
        
        <div className="filter-section type-filter">
          <h3>Incident Types</h3>
          <div className="incident-type-checkboxes">
            <label className={incidentTypes.unsafe_area ? "active" : ""}>
              <input 
                type="checkbox"
                checked={incidentTypes.unsafe_area}
                onChange={() => handleTypeToggle("unsafe_area")}
              />
              Unsafe Area
            </label>
            <label className={incidentTypes.harassment ? "active" : ""}>
              <input 
                type="checkbox"
                checked={incidentTypes.harassment}
                onChange={() => handleTypeToggle("harassment")}
              />
              Harassment
            </label>
            <label className={incidentTypes.suspicious ? "active" : ""}>
              <input 
                type="checkbox"
                checked={incidentTypes.suspicious}
                onChange={() => handleTypeToggle("suspicious")}
              />
              Suspicious Activity
            </label>
            <label className={incidentTypes.theft ? "active" : ""}>
              <input 
                type="checkbox"
                checked={incidentTypes.theft}
                onChange={() => handleTypeToggle("theft")}
              />
              Theft
            </label>
            <label className={incidentTypes.violence ? "active" : ""}>
              <input 
                type="checkbox"
                checked={incidentTypes.violence}
                onChange={() => handleTypeToggle("violence")}
              />
              Violence
            </label>
            <label className={incidentTypes.infrastructure ? "active" : ""}>
              <input 
                type="checkbox"
                checked={incidentTypes.infrastructure}
                onChange={() => handleTypeToggle("infrastructure")}
              />
              Infrastructure
            </label>
            <label className={incidentTypes.other ? "active" : ""}>
              <input 
                type="checkbox"
                checked={incidentTypes.other}
                onChange={() => handleTypeToggle("other")}
              />
              Other
            </label>
          </div>
        </div>
        
        <div className="filter-section heatmap-settings">
          <h3>Heatmap Settings</h3>
          <div className="setting-sliders">
            <div className="slider-container">
              <label>Intensity: {heatmapIntensity}</label>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1" 
                value={heatmapIntensity}
                onChange={(e) => setHeatmapIntensity(parseFloat(e.target.value))}
              />
            </div>
            <div className="slider-container">
              <label>Radius: {heatmapRadius}px</label>
              <input 
                type="range" 
                min="10" 
                max="50" 
                step="5" 
                value={heatmapRadius}
                onChange={(e) => setHeatmapRadius(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="map-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading map data...</p>
          </div>
        ) : !canRenderMap ? (
          <div className="no-data-container">
            <div className="no-data-icon">🗺️</div>
            <h3>No Map Data Available</h3>
            <p>There are no incidents with location data to display on the map.</p>
            <button 
              className="report-button" 
              onClick={() => navigate("/report-incident")}
            >
              Report an Incident
            </button>
          </div>
        ) : (
          <div id="map" className="map"></div>
        )}
      </div>
      
      <div className="heatmap-legend">
        <div className="legend-title">Safety Density</div>
        <div className="legend-gradient">
          <div className="legend-label">Low</div>
          <div className="gradient-bar">
            <div className="gradient"></div>
          </div>
          <div className="legend-label">High</div>
        </div>
        <div className="legend-note">
          <p>This heatmap shows reported safety incidents. Darker areas indicate higher concentration of reports.</p>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
