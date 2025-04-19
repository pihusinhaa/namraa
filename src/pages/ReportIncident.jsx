import React, { useState, useEffect } from "react";
import "./ReportIncident.css";
import { useNavigate } from "react-router-dom";

const ReportIncident = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    incidentType: "",
    location: null,
    locationDescription: "",
    description: "",
    photos: [],
    anonymous: true,
    urgency: "medium"
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState(null);
  
  const incidentTypes = [
    { id: "unsafe_area", label: "Unsafe Area", icon: "⚠️" },
    { id: "harassment", label: "Harassment", icon: "🚫" },
    { id: "suspicious", label: "Suspicious Activity", icon: "👁️" },
    { id: "theft", label: "Theft", icon: "💰" },
    { id: "violence", label: "Violence", icon: "⚔️" },
    { id: "infrastructure", label: "Infrastructure Issue", icon: "🏗️" },
    { id: "other", label: "Other", icon: "❓" }
  ];
  
  const urgencyLevels = [
    { id: "low", label: "Low", description: "Not time-sensitive, for information only" },
    { id: "medium", label: "Medium", description: "Attention needed, but not immediate" },
    { id: "high", label: "High", description: "Requires prompt attention" }
  ];
  
  useEffect(() => {
    // Get user's current location on component mount
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setLocationLoading(false);
        },
        (error) => {
          setLocationError(error.message);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Process each file to get preview URLs
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos]
    });
  };
  
  const removePhoto = (index) => {
    const updatedPhotos = [...formData.photos];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPhotos[index].preview);
    
    updatedPhotos.splice(index, 1);
    setFormData({
      ...formData,
      photos: updatedPhotos
    });
  };
  
  const useCurrentLocation = () => {
    setFormData({
      ...formData,
      location: currentLocation
    });
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Generate a unique report ID
    const generatedReportId = `RP-${Math.floor(100000 + Math.random() * 900000)}`;
    setReportId(generatedReportId);
    
    // Prepare report data to save
    const reportData = {
      id: generatedReportId,
      incidentType: formData.incidentType,
      incidentLabel: incidentTypes.find(type => type.id === formData.incidentType)?.label || "Unknown",
      incidentIcon: incidentTypes.find(type => type.id === formData.incidentType)?.icon || "❓",
      location: formData.location,
      locationDescription: formData.locationDescription,
      description: formData.description,
      // We don't store actual photo data in localStorage, just a placeholder
      hasPhotos: formData.photos.length > 0,
      photoCount: formData.photos.length,
      anonymous: formData.anonymous,
      urgency: formData.urgency,
      urgencyLabel: urgencyLevels.find(level => level.id === formData.urgency)?.label || "Medium",
      status: "pending", // pending, investigating, resolved
      dateSubmitted: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    try {
      // Get existing reports
      const existingReports = JSON.parse(localStorage.getItem('reports')) || [];
      
      // Add new report to the beginning
      const updatedReports = [reportData, ...existingReports];
      
      // Save back to localStorage
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      
      // Update submission state after a delay to simulate a server call
      setTimeout(() => {
        console.log("Submitted report data:", reportData);
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    } catch (error) {
      console.error("Error saving report:", error);
      alert("There was an error saving your report. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="step-indicator">
        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
      </div>
    );
  };
  
  const renderIncidentTypeStep = () => {
    return (
      <div className="form-step">
        <h2>What are you reporting?</h2>
        <p className="step-description">Select the type of incident you want to report</p>
        
        <div className="incident-types">
          {incidentTypes.map((type) => (
            <div 
              key={type.id}
              className={`incident-type ${formData.incidentType === type.id ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, incidentType: type.id})}
            >
              <div className="incident-icon">{type.icon}</div>
              <div className="incident-label">{type.label}</div>
            </div>
          ))}
        </div>
        
        <div className="step-actions">
          <button 
            className="next-button" 
            onClick={nextStep}
            disabled={!formData.incidentType}
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  const renderLocationStep = () => {
    return (
      <div className="form-step">
        <h2>Where did it happen?</h2>
        <p className="step-description">Provide location details of the incident</p>
        
        <div className="location-section">
          {locationLoading ? (
            <div className="location-loading">Getting your current location...</div>
          ) : locationError ? (
            <div className="location-error">{locationError}</div>
          ) : (
            <div className="current-location">
              <button 
                className={`use-location-button ${formData.location ? 'selected' : ''}`}
                onClick={useCurrentLocation}
                type="button"
              >
                📍 Use my current location
              </button>
              {formData.location && (
                <div className="location-preview">
                  <p>Latitude: {formData.location.latitude.toFixed(6)}</p>
                  <p>Longitude: {formData.location.longitude.toFixed(6)}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="location-description">
            <label htmlFor="locationDescription">Location description (street, landmarks, etc.)</label>
            <textarea
              id="locationDescription"
              name="locationDescription"
              value={formData.locationDescription}
              onChange={handleChange}
              placeholder="E.g. Near Central Park, corner of 5th Ave and 59th St"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="step-actions double-buttons">
          <button className="back-button" onClick={prevStep}>
            Back
          </button>
          <button 
            className="next-button" 
            onClick={nextStep}
            disabled={!formData.location && !formData.locationDescription}
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  const renderDetailsStep = () => {
    return (
      <div className="form-step">
        <h2>Incident Details</h2>
        <p className="step-description">Provide more information about what happened</p>
        
        <div className="details-section">
          <div className="detail-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what happened in detail..."
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="detail-field">
            <label htmlFor="photos">Add Photos (optional)</label>
            <div className="photo-upload">
              <input
                type="file"
                id="photos"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="photo-input"
              />
              <label htmlFor="photos" className="photo-upload-label">
                📷 Select Photos
              </label>
              
              {formData.photos.length > 0 && (
                <div className="photo-previews">
                  {formData.photos.map((photo, index) => (
                    <div className="photo-preview" key={index}>
                      <img src={photo.preview} alt="Preview" />
                      <button 
                        type="button" 
                        className="remove-photo" 
                        onClick={() => removePhoto(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-field">
            <label>Urgency Level</label>
            <div className="urgency-options">
              {urgencyLevels.map((level) => (
                <div 
                  key={level.id}
                  className={`urgency-option ${formData.urgency === level.id ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, urgency: level.id})}
                >
                  <div className="urgency-label">{level.label}</div>
                  <div className="urgency-description">{level.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="detail-field checkbox-field">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
              />
              <span className="checkbox-text">Submit this report anonymously</span>
            </label>
          </div>
        </div>
        
        <div className="step-actions double-buttons">
          <button className="back-button" onClick={prevStep}>
            Back
          </button>
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={!formData.description || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    );
  };
  
  const renderThankYouScreen = () => {
    return (
      <div className="thank-you-screen">
        <div className="thank-you-icon">✅</div>
        <h2>Report Submitted!</h2>
        <p>Thank you for making your community safer. Your report has been received.</p>
        <p className="report-id">Report ID: {reportId}</p>
        <div className="thank-you-actions">
          <button 
            className="dashboard-button" 
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>
          <button 
            className="view-reports-button" 
            onClick={() => navigate("/view-reports")}
          >
            View My Reports
          </button>
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    if (isSubmitted) {
      return renderThankYouScreen();
    }
    
    switch (step) {
      case 1:
        return renderIncidentTypeStep();
      case 2:
        return renderLocationStep();
      case 3:
        return renderDetailsStep();
      default:
        return renderIncidentTypeStep();
    }
  };
  
  return (
    <div className="report-incident-page">
      <div className="report-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ←
        </button>
        <h1>Report Incident</h1>
        <div className="header-spacer"></div>
      </div>
      
      {!isSubmitted && renderStepIndicator()}
      
      <div className="report-content">
        {renderContent()}
      </div>
      
      {!isSubmitted && (
        <div className="safety-tip">
          <p>
            <strong>Safety Tip:</strong> Your report helps keep the community safe. Thank you for contributing!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportIncident;
