import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import "../styles/navbar.css"; // Import the custom CSS file

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Projects", href: "/projects" },
    { name: "Tasks", href: "/tasks" },
    { name: "Notifications", href: "/notifications" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="logo">TeamTasker</Link>
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`nav-link ${isActive(link.href) ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Profile Icon */}
        <div className="profile-icon">
          <Link to="/profile" className="profile-link">
            <User size={24} />
          </Link>
        </div>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`nav-link ${isActive(link.href) ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
}