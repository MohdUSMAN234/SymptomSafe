import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SymptomChecklist from "../components/SymptomChecklist";
import {
  fetchSymptomList,
  submitSymptomCheck,
  getSessionId,
} from "../utils/api";

export default function Home() {
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [rawInput, setRawInput] = useState("");
  const [duration, setDuration] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the symptom list once on mount
  useEffect(() => {
    fetchSymptomList()
      .then(setSymptoms)
      .catch(() => setError("Could not load symptoms. Is the backend running?"));
  }, []);

  function toggleSymptom(id) {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (selectedSymptoms.length === 0 && !rawInput.trim()) {
      setError("Please select at least one symptom or describe how you feel.");
      return;
    }

    setLoading(true);
    try {
      const data = await submitSymptomCheck({
        symptoms: selectedSymptoms,
        rawInput,
        duration: duration || undefined,
        age: age ? Number(age) : undefined,
        city,
        sessionId: getSessionId(),
      });

      if (!data.success) {
        setError(data.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Pass result + city via navigation state so Result page
      // doesn't need a second round trip for the hospital search
      navigate(`/result/${data.checkId}`, {
        state: { result: data.result, detectedSymptoms: data.detectedSymptoms, city },
      });
    } catch (err) {
      setError("Could not reach the server. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="hero">
        <h1>How are you feeling today?</h1>
        <p>
          Select your symptoms and we'll tell you whether to monitor at home,
          see a doctor, or seek emergency care — free, no login needed.
        </p>
      </div>

      <div className="disclaimer">
        <span aria-hidden="true">ℹ️</span>
        <span>
          This tool gives general guidance only and does not replace a doctor's
          diagnosis. In a medical emergency, call <strong>108</strong> immediately.
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label">What are you feeling? (select all that apply)</label>
          <SymptomChecklist
            symptoms={symptoms}
            selected={selectedSymptoms}
            onToggle={toggleSymptom}
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="rawInput">
            Describe in your own words (optional)
          </label>
          <p className="field-hint">
            English or Hindi works — e.g. "mujhe 2 din se bukhar aur sir dard hai"
          </p>
          <textarea
            id="rawInput"
            className="textarea-input"
            placeholder="Tell us more about how you're feeling..."
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
          />
        </div>

        <div className="row-2">
          <div className="field-group" style={{ marginBottom: 0 }}>
            <label className="field-label" htmlFor="duration">
              How long has this been going on?
            </label>
            <select
              id="duration"
              className="select-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="">Select duration</option>
              <option value="Less than a day">Less than a day</option>
              <option value="1-2 days">1–2 days</option>
              <option value="3-5 days">3–5 days</option>
              <option value="More than a week">More than a week</option>
            </select>
          </div>

          <div className="field-group" style={{ marginBottom: 0 }}>
            <label className="field-label" htmlFor="age">
              Your age (optional)
            </label>
            <input
              id="age"
              type="number"
              min="0"
              max="120"
              className="text-input"
              placeholder="e.g. 28"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="city">
            Your city (so we can find nearby hospitals if needed)
          </label>
          <input
            id="city"
            type="text"
            className="text-input"
            placeholder="e.g. Prayagraj"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {error && (
          <div className="disclaimer" style={{ background: "var(--color-emergency-bg)", borderColor: "var(--color-emergency-border)", color: "var(--color-emergency)" }}>
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Checking…" : "Check my symptoms"}
        </button>
      </form>
    </>
  );
}
