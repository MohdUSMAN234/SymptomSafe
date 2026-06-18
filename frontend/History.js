import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchHistory, getSessionId } from "../utils/api";

const SEVERITY_LABELS = {
  monitor: "Monitor",
  see_doctor: "See doctor",
  emergency: "Emergency",
};

export default function History() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory(getSessionId())
      .then(setChecks)
      .catch(() => setError("Could not load your history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="hero" style={{ marginBottom: "var(--space-6)" }}>
        <h1>Your past checks</h1>
        <p>Stored only on this device — last 10 checks.</p>
      </div>

      {loading && <p className="field-hint">Loading…</p>}
      {error && <p className="field-hint">{error}</p>}

      {!loading && !error && checks.length === 0 && (
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
            You haven't done a symptom check yet.
          </p>
          <Link to="/" className="btn btn-primary">
            Check your symptoms
          </Link>
        </div>
      )}

      <div className="hospital-list">
        {checks.map((check) => (
          <Link
            to={`/result/${check._id}`}
            key={check._id}
            className="hospital-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <p className="hospital-name">{check.result.conditionName}</p>
            <p className="hospital-meta">
              {SEVERITY_LABELS[check.result.severity]} ·{" "}
              {new Date(check.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
