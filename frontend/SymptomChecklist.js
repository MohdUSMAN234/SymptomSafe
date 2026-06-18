import React from "react";

export default function SymptomChecklist({ symptoms, selected, onToggle }) {
  if (!symptoms || symptoms.length === 0) {
    return <p className="field-hint">Loading symptoms…</p>;
  }

  return (
    <div className="symptom-grid" role="group" aria-label="Select your symptoms">
      {symptoms.map((symptom) => {
        const isSelected = selected.includes(symptom.id);
        return (
          <button
            key={symptom.id}
            type="button"
            className={`symptom-chip ${isSelected ? "selected" : ""}`}
            onClick={() => onToggle(symptom.id)}
            aria-pressed={isSelected}
          >
            <span className="checkbox" aria-hidden="true">
              {isSelected ? "✓" : ""}
            </span>
            {symptom.label}
          </button>
        );
      })}
    </div>
  );
}
