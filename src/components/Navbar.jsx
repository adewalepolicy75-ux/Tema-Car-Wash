import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <h2>WashTrack</h2>

        <div className="links">
          <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
          <Link to="/applications" className={isActive("/applications") ? "active" : ""}>Applied</Link>
          <Link to="/interviews" className={isActive("/interviews") ? "active" : ""}>Interviews</Link>
          <Link to="/offers" className={isActive("/offers") ? "active" : ""}>Offers</Link>
          <Link to="/rejections" className={isActive("/rejections") ? "active" : ""}>Rejections</Link>
        </div>

        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="mobile-menu" onClick={() => setIsMenuOpen(false)}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/applications" onClick={() => setIsMenuOpen(false)}>Applied</Link>
          <Link to="/interviews" onClick={() => setIsMenuOpen(false)}>Interviews</Link>
          <Link to="/offers" onClick={() => setIsMenuOpen(false)}>Offers</Link>
          <Link to="/rejections" onClick={() => setIsMenuOpen(false)}>Rejections</Link>
        </div>
      )}
    </>
  );
}
