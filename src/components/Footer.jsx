// Footer.jsx

import "./Footer.css";
import { Link } from "react-router-dom";

import {
  CarFront,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">
            <CarFront size={30} />
          </div>

          <h2>WashTrack</h2>

          <p>
            The modern platform for tracking car wash job applications,
            interviews, offers, and career growth.
          </p>

          <div className="socials">
            <div className="social-icon">
              f
            </div>

            <div className="social-icon">
              in
            </div>

            <div className="social-icon">
              X
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/applied">Applied</Link>
          <Link to="/interviews">Interviews</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/rejections">Rejections</Link>
        </div>

        {/* FEATURES */}
        <div className="footer-links">
          <h3>Features</h3>

          <Link to="/">Application Tracking</Link>
          <Link to="/">Interview Scheduler</Link>
          <Link to="/">Progress Dashboard</Link>
          <Link to="/">Job Analytics</Link>
          <Link to="/">Notifications</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <h3>Contact</h3>

          <div className="contact-item">
            <Mail size={18} />
            <span>support@washtrack.com</span>
          </div>

          <div className="contact-item">
            <Phone size={18} />
            <span>+234 800 000 0000</span>
          </div>

          <div className="contact-item">
            <MapPin size={18} />
            <span>Lagos, Nigeria</span>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 WashTrack. All rights reserved.</p>

        <div className="bottom-links">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
