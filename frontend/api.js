import axios from "axios";

// Base URL for backend API - change this in .env for production
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

/**
 * Get or create a session ID stored in localStorage.
 * No login needed - this just links a user's checks for history,
 * without collecting any personal information.
 */
export function getSessionId() {
  let sessionId = localStorage.getItem("symptomsafe_session");
  if (!sessionId) {
    sessionId =
      "sess_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("symptomsafe_session", sessionId);
  }
  return sessionId;
}

// === API calls ===

export async function fetchSymptomList() {
  const res = await api.get("/symptoms/list");
  return res.data.symptoms;
}

export async function submitSymptomCheck(payload) {
  const res = await api.post("/symptoms/check", payload);
  return res.data;
}

export async function fetchHospitals(city) {
  const res = await api.get("/hospitals", { params: { city } });
  return res.data.hospitals;
}

export async function fetchHistory(sessionId) {
  const res = await api.get(`/symptoms/history/${sessionId}`);
  return res.data.checks;
}
