import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;
  const isAdmin = userData?.role === 'admin';
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <>
      <nav className="navbar">
        <h2>WashTrack</h2>

        <div className="links">
          <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
          {!userData ? (
            <>
              <Link to="/login" className={isActive("/login") ? "active" : ""}>Login</Link>
              <Link to="/signup" className={isActive("/signup") ? "active" : ""}>Signup</Link>
            </>
          ) : (
            <>
              {!isAdmin ? (
                <>
                  <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>Jobs</Link>
                  <Link to="/applied" className={isActive("/applied") ? "active" : ""}>Applied</Link>
                  <Link to="/interviews" className={isActive("/interviews") ? "active" : ""}>Interviews</Link>
                  <Link to="/offers" className={isActive("/offers") ? "active" : ""}>Offers</Link>
                  <Link to="/rejections" className={isActive("/rejections") ? "active" : ""}>Rejections</Link>
                </>
              ) : (
                <Link to="/admin-dashboard" className={isActive("/admin-dashboard") ? "active" : ""}>Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          )}
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="mobile-menu" onClick={() => setIsMenuOpen(false)}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          {!userData ? (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Signup</Link>
            </>
          ) : (
            <>
              {!isAdmin ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Jobs</Link>
                  <Link to="/applied" onClick={() => setIsMenuOpen(false)}>Applied</Link>
                  <Link to="/interviews" onClick={() => setIsMenuOpen(false)}>Interviews</Link>
                  <Link to="/offers" onClick={() => setIsMenuOpen(false)}>Offers</Link>
                  <Link to="/rejections" onClick={() => setIsMenuOpen(false)}>Rejections</Link>
                </>
              ) : (
                <Link to="/admin-dashboard" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          )}
          <div className="mobile-theme-toggle" onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </div>
        </div>
      )}
    </>
  );
}
