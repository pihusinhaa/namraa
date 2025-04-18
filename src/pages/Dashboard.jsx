import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [currentUser, setCurrentUser] = useState("User");
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const [stats, setStats] = useState({
    daysActive: 14,
    safeTravelHours: 28,
    alertsSent: 0,
    reportsSubmitted: 2
  });

  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [65, 59, 80, 81, 56, 55, 40],
    maxValue: 100
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'High risk area reported near your saved location', time: '10 minutes ago', read: false },
    { id: 2, type: 'info', message: 'Safety tip: Share your location when traveling at night', time: '2 hours ago', read: false },
    { id: 3, type: 'success', message: 'Your emergency contacts have been updated', time: 'Yesterday', read: true },
  ]);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    
    // Load animation after a short delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Calculate unread notifications
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
    
    // Fetch user data here if you have authentication
    // For now just using static data
  }, [notifications]);

  useEffect(() => {
    // Reset scroll position when dashboard mounts
    window.scrollTo(0, 0);
    
    // Handle responsive layout
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Change chart data based on selected tab
    if (tab === 'today') {
      setChartData({
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm', '12am'],
        values: [10, 5, 20, 45, 60, 75, 30],
        maxValue: 100
      });
    } else if (tab === 'week') {
      setChartData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [65, 59, 80, 81, 56, 55, 40],
        maxValue: 100
      });
    } else {
      setChartData({
        labels: isMobile ? 
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => m.substring(0,1)) : 
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [28, 48, 40, 19, 86, 27, 90],
        maxValue: 100
      });
    }
  };

  const features = [
    {
      title: "Live Location",
      description: "Share your real-time location with trusted contacts.",
      action: () => navigate("/location"),
      icon: "📍",
      color: "#ff7e67",
      colorRgb: "255, 126, 103"
    },
    {
      title: "SOS Emergency",
      description: "Trigger an instant SOS alert with one click.",
      action: () => navigate("/sos"),
      icon: "🚨",
      color: "#ff5252",
      colorRgb: "255, 82, 82"
    },
    {
      title: "Report Incident",
      description: "Anonymously report incidents or unsafe areas.",
      action: () => navigate("/report"),
      icon: "📝",
      color: "#38b0de",
      colorRgb: "56, 176, 222"
    },
    {
      title: "Safety Heatmap",
      description: "Check high-risk areas around you.",
      action: () => navigate("/heatmap"),
      icon: "🔥",
      color: "#f76e11",
      colorRgb: "247, 110, 17"
    },
  ];

  const recentActivity = [
    { time: "2 hours ago", action: "Location shared with Emergency Contact" },
    { time: "Yesterday", action: "Report submitted for Central Park area" },
    { time: "3 days ago", action: "New trusted contact added" },
  ];

  const quickActions = [
    { name: "Share Location", icon: "📍", action: () => navigate("/location") },
    { name: "Emergency SOS", icon: "🚨", action: () => navigate("/sos") },
    { name: "Add Contact", icon: "👤", action: () => navigate("/contacts") },
    { name: "Incident Report", icon: "📝", action: () => navigate("/report") },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'alert': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '🔔';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const [safetyTips, setSafetyTips] = useState([
    "Always be aware of your surroundings, especially when traveling alone at night.",
    "Share your location with trusted contacts when going to unfamiliar places.",
    "Keep emergency contacts easily accessible on your device.",
    "Report suspicious activities to help keep others safe.",
    "Avoid using headphones in high-risk areas to stay alert.",
  ]);
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const showNextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % safetyTips.length);
  };

  // Format chart labels for mobile
  const getResponsiveLabels = (labels) => {
    if (isMobile && activeTab === 'month') {
      return labels.map(l => l.substring(0,1));
    }
    return labels;
  };

  return (
    <div className={`dashboard-page ${isLoaded ? 'loaded' : ''}`}>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-greeting">{greeting}, {currentUser} 👋</h1>
            <p className="dashboard-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="dashboard-actions">
            <div className="notification-bell" onClick={toggleNotifications}>
              🔔
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>
            <div className="dashboard-user">
              <div className="user-avatar" onClick={() => navigate("/profile")}>
                {currentUser.charAt(0)}
              </div>
            </div>
            
            {showNotifications && (
              <div className="notifications-panel">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <span className="close-notifications" onClick={toggleNotifications}>×</span>
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">No notifications</p>
                  )}
                </div>
                <div className="notifications-footer">
                  <button className="mark-all-read" onClick={markAllAsRead}>Mark all as read</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions-bar">
          {quickActions.map((action, index) => (
            <div className="quick-action-btn" key={index} onClick={action.action}>
              <span className="quick-action-icon">{action.icon}</span>
              <span className="quick-action-text">{action.name}</span>
            </div>
          ))}
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.daysActive}</h3>
            <p>Days Active</p>
            <div className="stat-trend">↑ 12%</div>
          </div>
          <div className="stat-card">
            <h3>{stats.safeTravelHours}</h3>
            <p>Safe Travel Hours</p>
            <div className="stat-trend">↑ 8%</div>
          </div>
          <div className="stat-card">
            <h3>{stats.alertsSent}</h3>
            <p>Alerts Sent</p>
            <div className="stat-trend">-</div>
          </div>
          <div className="stat-card">
            <h3>{stats.reportsSubmitted}</h3>
            <p>Reports Submitted</p>
            <div className="stat-trend">↑ 5%</div>
          </div>
        </div>

        <div className="dashboard-chart-section">
          <div className="section-header">
            <h2 className="section-title">Safety Activity</h2>
            <div className="tab-controls">
              <button 
                className={`tab-button ${activeTab === 'today' ? 'active-tab' : ''}`} 
                onClick={() => handleTabChange('today')}
              >
                Today
              </button>
              <button 
                className={`tab-button ${activeTab === 'week' ? 'active-tab' : ''}`} 
                onClick={() => handleTabChange('week')}
              >
                This Week
              </button>
              <button 
                className={`tab-button ${activeTab === 'month' ? 'active-tab' : ''}`} 
                onClick={() => handleTabChange('month')}
              >
                This Month
              </button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-y-axis">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            <div className="chart-content">
              {chartData.values.map((value, index) => (
                <div className="chart-bar-container" key={index}>
                  <div 
                    className="chart-bar" 
                    style={{height: `${(value / chartData.maxValue) * 100}%`}}
                    data-value={value}
                  ></div>
                  <div className="chart-label">{getResponsiveLabels(chartData.labels)[index]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="section-title">Quick Actions</h2>
        <div className="dashboard-cards">
          {features.map((feature, index) => (
            <div 
              className="dashboard-card" 
              key={index} 
              onClick={feature.action}
              style={{'--card-color': feature.color, '--card-color-rgb': feature.colorRgb}}
            >
              <div className="card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button className="card-action-btn">Access</button>
            </div>
          ))}
        </div>

        <div className="dashboard-bottom">
          <div className="dashboard-recent">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div className="activity-item" key={index}>
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-action">{activity.action}</div>
                </div>
              ))}
              <div className="view-all-activity">
                <button onClick={() => navigate("/activity")}>View All Activity</button>
              </div>
            </div>
          </div>
          
          <div className="dashboard-tips">
            <h2 className="section-title">Safety Tips</h2>
            <div className="tip-card">
              <h4>Stay Alert</h4>
              <p>{safetyTips[currentTipIndex]}</p>
              <div className="tip-actions">
                <button className="tip-action-btn" onClick={showNextTip}>Next Tip</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
