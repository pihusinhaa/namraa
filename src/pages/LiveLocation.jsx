import React, { useState, useEffect } from "react";
import "./LiveLocation.css";
import { useNavigate } from "react-router-dom";

const LiveLocation = () => {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [shareTime, setShareTime] = useState(60); // Default 60 minutes
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock contacts data
  const contacts = [
    { id: 1, name: "Emma Williams", phone: "+1234567890", avatar: "👩" },
    { id: 2, name: "James Smith", phone: "+1987654321", avatar: "👨" },
    { id: 3, name: "Olivia Johnson", phone: "+1456789012", avatar: "👧" },
    { id: 4, name: "Michael Brown", phone: "+1345678901", avatar: "🧔" },
  ];

  useEffect(() => {
    // Initialize map when component mounts
    const mapElement = document.getElementById("map");
    
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setIsLoaded(true);
          
          // In a real implementation, you would initialize a map here
          // using Google Maps, Mapbox, Leaflet, etc.
          // For this demo, we're just adding a colored background
          if (mapElement) {
            mapElement.innerHTML = `
              <div class="mock-map">
                <div class="location-pin"></div>
                <div class="coordinates">
                  <p>Latitude: ${latitude.toFixed(6)}</p>
                  <p>Longitude: ${longitude.toFixed(6)}</p>
                </div>
              </div>
            `;
          }
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          setIsLoaded(true);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoaded(true);
    }
    
    // Track location updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        
        // Update map pin in a real implementation
      },
      (err) => {
        setError(`Error tracking location: ${err.message}`);
      }
    );
    
    // Clean up
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const toggleSharing = () => {
    if (!isSharing && selectedContacts.length === 0) {
      setShowContactsModal(true);
      return;
    }
    
    setIsSharing(!isSharing);
    
    if (!isSharing) {
      // Start sharing logic would go here
      // In a real app, you would send the location to the selected contacts
      console.log(`Started sharing location with ${selectedContacts.length} contacts for ${shareTime} minutes`);
    } else {
      // Stop sharing logic
      console.log("Stopped sharing location");
      setSelectedContacts([]);
    }
  };

  const toggleContact = (contactId) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const handleTimeChange = (e) => {
    setShareTime(parseInt(e.target.value, 10));
  };
  
  const handleSOS = () => {
    navigate("/sos");
  };

  return (
    <div className="live-location-page">
      <div className="location-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ←
        </button>
        <h1>Live Location</h1>
        <div className="header-spacer"></div>
      </div>
      
      <div className="location-status">
        {isSharing ? (
          <div className="sharing-active">
            <div className="pulse-animation"></div>
            <p>Location sharing active</p>
            <span className="share-time">{shareTime} min remaining</span>
          </div>
        ) : (
          <p>Share your real-time location with trusted contacts</p>
        )}
      </div>
      
      <div className="map-container">
        {!isLoaded ? (
          <div className="loading-map">Loading map...</div>
        ) : error ? (
          <div className="map-error">{error}</div>
        ) : (
          <div id="map" className="map"></div>
        )}
      </div>
      
      {isSharing && (
        <div className="sharing-info">
          <h3>Sharing with:</h3>
          <div className="contact-avatars">
            {selectedContacts.map(contactId => {
              const contact = contacts.find(c => c.id === contactId);
              return (
                <div className="contact-avatar" key={contactId} title={contact.name}>
                  {contact.avatar}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="location-actions">
        <button 
          className={`share-button ${isSharing ? 'stop-sharing' : ''}`} 
          onClick={toggleSharing}
        >
          {isSharing ? "Stop Sharing" : "Share Location"}
        </button>
        <button className="sos-button" onClick={handleSOS}>EMERGENCY SOS</button>
      </div>
      
      {showContactsModal && (
        <div className="modal-overlay">
          <div className="contacts-modal">
            <div className="modal-header">
              <h2>Share with</h2>
              <button className="close-modal" onClick={() => setShowContactsModal(false)}>×</button>
            </div>
            
            <div className="share-duration">
              <label>Share for:</label>
              <select value={shareTime} onChange={handleTimeChange}>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
                <option value="1440">24 hours</option>
              </select>
            </div>
            
            <div className="contacts-list">
              {contacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`contact-item ${selectedContacts.includes(contact.id) ? 'selected' : ''}`}
                  onClick={() => toggleContact(contact.id)}
                >
                  <div className="contact-avatar">{contact.avatar}</div>
                  <div className="contact-info">
                    <h3>{contact.name}</h3>
                    <p>{contact.phone}</p>
                  </div>
                  <div className="contact-checkbox">
                    {selectedContacts.includes(contact.id) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button 
                className="share-button"
                disabled={selectedContacts.length === 0}
                onClick={() => {
                  setShowContactsModal(false);
                  toggleSharing();
                }}
              >
                Share Location
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="safety-tip">
        <p>
          <strong>Safety Tip:</strong> Always let someone know where you're going when traveling to unfamiliar areas.
        </p>
      </div>
    </div>
  );
};

export default LiveLocation;
