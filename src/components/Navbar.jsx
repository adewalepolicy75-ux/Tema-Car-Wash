import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>WashTrack</h2>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/applied">Applied</Link>
        <Link to="/interviews">Interviews</Link>
        <Link to="/offers">Offers</Link>
        <Link to="/rejections">Rejections</Link>
      </div>
    </nav>
  );
}
