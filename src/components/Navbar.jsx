import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Namra</span>
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <div className={`menu-icon ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/location" className={location.pathname === '/location' ? 'nav-link active' : 'nav-link'}>
              Location
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/sos" className={location.pathname === '/sos' ? 'nav-link active' : 'nav-link'}>
              SOS
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/report" className={location.pathname === '/report' ? 'nav-link active' : 'nav-link'}>
              Report
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/heatmap" className={location.pathname === '/heatmap' ? 'nav-link active' : 'nav-link'}>
              Heatmap
            </Link>
          </li>
        </ul>
        
        <div className="nav-auth">
          <Link to="/login" className="nav-login-btn">Login</Link>
          <Link to="/signup" className="nav-signup-btn">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 