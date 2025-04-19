import React, { useState, useEffect } from "react";
import "./SOS.css";
import { useNavigate } from "react-router-dom";

const SOS = () => {
  const navigate = useNavigate();
  const [isSosActive, setIsSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: "Emma Williams", relation: "Sister", phone: "+1234567890", avatar: "👩" },
    { id: 2, name: "James Smith", relation: "Father", phone: "+1987654321", avatar: "👨" },
    { id: 3, name: "Local Police", relation: "Emergency", phone: "911", avatar: "👮" }
  ]);
  const [selectedServices, setSelectedServices] = useState({
    police: true,
    ambulance: true,
    fire: false
  });
  
  useEffect(() => {
    let timer;
    
    if (isSosActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isSosActive && countdown === 0) {
      // When countdown reaches 0, send emergency alert
      sendEmergencyAlert();
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isSosActive, countdown]);
  
  const triggerSOS = () => {
    setIsSosActive(true);
    // Vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };
  
  const cancelSOS = () => {
    setIsSosActive(false);
    setCountdown(5);
    // Vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };
  
  const sendEmergencyAlert = () => {
    // In a real app, you would send emergency alerts
    // to the selected contacts and emergency services
    console.log("SOS alert sent to:", emergencyContacts);
    console.log("Emergency services alerted:", selectedServices);
    
    // Display confirmation/sent view
    // For this demo, we'll stay on the SOS active state
  };
  
  const toggleService = (service) => {
    setSelectedServices({
      ...selectedServices,
      [service]: !selectedServices[service]
    });
  };
  
  return (
    <div className="sos-page">
      <div className="sos-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ←
        </button>
        <h1>Emergency SOS</h1>
        <div className="header-spacer"></div>
      </div>
      
      {isSosActive ? (
        <div className="sos-active-container">
          <div className={`countdown-circle ${countdown <= 2 ? 'urgent' : ''}`}>
            <div className="countdown-number">{countdown}</div>
            <div className="countdown-text">Sending SOS in</div>
          </div>
          
          <p className="alert-warning">
            Emergency services and your emergency contacts will be notified of your situation and location.
          </p>
          
          <button className="cancel-sos-button" onClick={cancelSOS}>
            Cancel SOS
          </button>
        </div>
      ) : (
        <>
          <div className="sos-description">
            <p>In case of an emergency, press the SOS button to alert your emergency contacts and selected emergency services.</p>
          </div>
          
          <div className="emergency-services">
            <h2>Alert Emergency Services</h2>
            <div className="service-toggles">
              <div 
                className={`service-toggle ${selectedServices.police ? 'active' : ''}`}
                onClick={() => toggleService('police')}
              >
                <div className="service-icon">👮</div>
                <div className="service-name">Police</div>
              </div>
              <div 
                className={`service-toggle ${selectedServices.ambulance ? 'active' : ''}`}
                onClick={() => toggleService('ambulance')}
              >
                <div className="service-icon">🚑</div>
                <div className="service-name">Ambulance</div>
              </div>
              <div 
                className={`service-toggle ${selectedServices.fire ? 'active' : ''}`}
                onClick={() => toggleService('fire')}
              >
                <div className="service-icon">🚒</div>
                <div className="service-name">Fire Dept.</div>
              </div>
            </div>
          </div>
          
          <div className="emergency-contacts">
            <h2>Emergency Contacts</h2>
            <div className="contacts-list">
              {emergencyContacts.map(contact => (
                <div className="contact-item" key={contact.id}>
                  <div className="contact-avatar">{contact.avatar}</div>
                  <div className="contact-info">
                    <h3>{contact.name}</h3>
                    <p>{contact.relation} • {contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="add-contact-button" onClick={() => navigate("/contacts")}>
              + Add Emergency Contact
            </button>
          </div>
          
          <div className="sos-action">
            <button className="sos-button" onClick={triggerSOS}>
              SOS
            </button>
            <p className="sos-hint">Press and hold in emergency</p>
          </div>
        </>
      )}
      
      <div className="safety-tip">
        <p>
          <strong>Safety Tip:</strong> Only use SOS in genuine emergencies. False alarms may result in penalties.
        </p>
      </div>
    </div>
  );
};

export default SOS;
