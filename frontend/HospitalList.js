import React from "react";

export default function HospitalList({ hospitals, loading, searched }) {
  if (loading) {
    return <p className="field-hint">Looking for hospitals near you…</p>;
  }

  if (searched && hospitals.length === 0) {
    return (
      <p className="field-hint">
        No hospitals found for this city. In an emergency, call{" "}
        <strong>108</strong> for an ambulance.
      </p>
    );
  }

  if (hospitals.length === 0) {
    return null;
  }

  return (
    <div className="hospital-list">
      {hospitals.map((h) => (
        <div className="hospital-card" key={h._id || h.name}>
          <p className="hospital-name">{h.name}</p>
          <p className="hospital-meta">{h.address}</p>
          <p className="hospital-meta">
            {h.type} hospital{h.emergency ? " · 24x7 emergency" : ""}
          </p>
          <div className="hospital-actions">
            {h.phone && <a href={`tel:${h.phone}`}>Call hospital</a>}
            {h.lat && h.lng && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Directions
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
