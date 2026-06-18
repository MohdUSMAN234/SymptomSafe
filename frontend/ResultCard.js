import React from "react";

const SEVERITY_CONFIG = {
  monitor: {
    label: "Monitor at home",
    icon: "🏠",
  },
  see_doctor: {
    label: "See a doctor",
    icon: "🩺",
  },
  emergency: {
    label: "Emergency — act now",
    icon: "🚨",
  },
};

// Maps internal symptom IDs to friendly display labels for the result screen
const SYMPTOM_LABELS = {
  fever: "Fever",
  headache: "Headache",
  cough: "Cough",
  cold: "Cold / runny nose",
  sore_throat: "Sore throat",
  body_ache: "Body ache",
  vomiting: "Vomiting / nausea",
  diarrhea: "Diarrhea",
  chest_pain: "Chest pain",
  breathlessness: "Breathlessness",
  dizziness: "Dizziness",
  rash: "Skin rash",
  stomach_pain: "Stomach pain",
  weakness: "Weakness / fatigue",
  high_fever: "High fever",
  unconscious: "Unconsciousness",
  bleeding: "Heavy bleeding",
  seizure: "Seizure / fits",
};

export default function ResultCard({ result, detectedSymptoms = [] }) {
  const config = SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.monitor;

  return (
    <div className={`result-card ${result.severity}`} role="status">
      <div className="result-icon" aria-hidden="true">
        {config.icon}
      </div>
      <p className="result-label">{config.label}</p>
      <h2>{result.conditionName}</h2>
      <p style={{ marginTop: "8px", color: "var(--color-text-muted)" }}>
        {result.message}
      </p>
      <p className="result-advice">{result.advice}</p>

      {detectedSymptoms.length > 0 && (
        <div className="detected-tags">
          {detectedSymptoms.map((id) => (
            <span key={id} className="detected-tag">
              {SYMPTOM_LABELS[id] || id}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
