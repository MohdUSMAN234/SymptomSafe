import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import HospitalList from "../components/HospitalList";
import { fetchHospitals, api } from "../utils/api";

export default function Result() {
  const { id } = useParams();
  const location = useLocation();

  // Prefer state passed from navigation (avoids extra API call);
  // fall back to fetching by ID (e.g. if user opens a shared link directly)
  const [result, setResult] = useState(location.state?.result || null);
  const [detectedSymptoms, setDetectedSymptoms] = useState(
    location.state?.detectedSymptoms || []
  );
  const [city, setCity] = useState(location.state?.city || "");
  const [loadingResult, setLoadingResult] = useState(!location.state);

  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [searchedHospitals, setSearchedHospitals] = useState(false);

  // Fallback: fetch result by ID if not passed via navigation state
  useEffect(() => {
    if (location.state) return;

    api
      .get(`/symptoms/check/${id}`)
      .then((res) => {
        const check = res.data.check;
        setResult(check.result);
        setDetectedSymptoms(check.symptoms);
        setCity(check.city || "");
      })
      .catch(() => {
        setResult(null);
      })
      .finally(() => setLoadingResult(false));
  }, [id, location.state]);

  // If the result needs a doctor and a city was provided, fetch hospitals
  useEffect(() => {
    if (!result || !result.seeDoctor || !city) return;

    setLoadingHospitals(true);
    fetchHospitals(city)
      .then((data) => {
        setHospitals(data);
        setSearchedHospitals(true);
      })
      .catch(() => setSearchedHospitals(true))
      .finally(() => setLoadingHospitals(false));
  }, [result, city]);

  if (loadingResult) {
    return <p className="field-hint">Loading your result…</p>;
  }

  if (!result) {
    return (
      <div className="card" style={{ textAlign: "center" }}>
        <h2>We couldn't find this result</h2>
        <p style={{ marginTop: "8px", color: "var(--color-text-muted)" }}>
          The link may have expired. You can start a new symptom check below.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "16px" }}>
          Start new check
        </Link>
      </div>
    );
  }

  return (
    <>
      <ResultCard result={result} detectedSymptoms={detectedSymptoms} />

      {result.severity === "emergency" && (
        <div
          className="disclaimer"
          style={{
            background: "var(--color-emergency-bg)",
            borderColor: "var(--color-emergency-border)",
            color: "var(--color-emergency)",
            marginTop: "var(--space-5)",
          }}
        >
          <span aria-hidden="true">🚑</span>
          <span>
            Call <strong>108</strong> for an ambulance right now. Don't wait or
            drive yourself if you feel faint or breathless.
          </span>
        </div>
      )}

      {result.seeDoctor && (
        <div style={{ marginTop: "var(--space-6)" }}>
          <h3 style={{ marginBottom: "var(--space-3)" }}>
            {city ? `Hospitals near ${city}` : "Find nearby hospitals"}
          </h3>

          {!city && (
            <p className="field-hint">
              Add your city on the home page to see nearby hospitals.
            </p>
          )}

          <HospitalList
            hospitals={hospitals}
            loading={loadingHospitals}
            searched={searchedHospitals}
          />
        </div>
      )}

      <div style={{ marginTop: "var(--space-7)", display: "flex", gap: "var(--space-3)" }}>
        <Link to="/" className="btn btn-secondary btn-block">
          New check
        </Link>
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
          }}
        >
          Copy link to share
        </button>
      </div>
    </>
  );
}
