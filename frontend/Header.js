import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand-mark" style={{ textDecoration: "none" }}>
          <span className="pulse-dot" aria-hidden="true"></span>
          SymptomSafe
        </Link>
        <Link to="/history" style={{ fontSize: "14px", fontWeight: 500 }}>
          My checks
        </Link>
      </div>
    </header>
  );
}
