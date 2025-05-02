import React from "react";
import "../styles/footer.css"; // Import the footer styles

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} TeamTasker. All rights reserved.</p>
    </footer>
  );
}