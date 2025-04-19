import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);
  
  const features = [
    "Personal Safety Tracking",
    "Emergency SOS Alerts",
    "Safety Heatmap Visualization", 
    "Incident Reporting System"
  ];
  
  useEffect(() => {
    setIsVisible(true);
    
    // Rotate through features
    const featureInterval = setInterval(() => {
      setFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(featureInterval);
  }, []);
  
  const handleGetStarted = () => {
    navigate("/signup");
  };
  
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <div className={`landing-content ${isVisible ? 'visible' : ''}`}>
        <h1 className="landing-title">Namra</h1>
        <p className="landing-subtitle">Your Safe Space, Always.</p>
        
        <div className="feature-slider">
          <p className="feature-text">{features[featureIndex]}</p>
        </div>
        
        <div className="landing-buttons">
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
          <button className="login-btn" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>
      
      <div className="landing-info">
        <div className="info-card">
          <h3>About Namra</h3>
          <p>A comprehensive safety platform designed to protect and empower users with real-time tracking and emergency assistance.</p>
        </div>
        <div className="info-card">
          <h3>How It Works</h3>
          <p>Namra uses location services to keep you connected with emergency contacts while providing safety insights for your area.</p>
        </div>
        <div className="info-card">
          <h3>Safety First</h3>
          <p>Your data is encrypted and secure. We prioritize your privacy while ensuring help is available when needed.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
