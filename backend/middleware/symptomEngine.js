const symptomData = require("../data/symptoms.json");

/**
 * Parse free-text input into matched symptom IDs
 * Supports English + Hinglish keywords
 */
function parseSymptoms(inputText) {
  const text = inputText.toLowerCase();
  const matched = [];

  for (const symptom of symptomData.symptoms) {
    const found = symptom.keywords.some((kw) => text.includes(kw.toLowerCase()));
    if (found) matched.push(symptom.id);
  }

  return [...new Set(matched)]; // remove duplicates
}

/**
 * Given a list of symptom IDs, return the best matching rule
 * Priority: emergency > see_doctor > monitor
 */
function assessSymptoms(symptomIds) {
  const severityOrder = { emergency: 3, see_doctor: 2, monitor: 1 };
  let bestMatch = null;
  let bestScore = 0;
  let bestSeverityRank = 0;

  for (const rule of symptomData.rules) {
    // Check exclude symptoms — if any are present, skip this rule
    const hasExcluded = rule.excludeSymptoms.some((s) => symptomIds.includes(s));
    if (hasExcluded) continue;

    // Count how many match symptoms are present
    const matchCount = rule.matchSymptoms.filter((s) => symptomIds.includes(s)).length;
    if (matchCount < rule.minMatch) continue;

    const severityRank = severityOrder[rule.severity] || 0;

    // Prefer higher severity, then higher match count
    if (
      severityRank > bestSeverityRank ||
      (severityRank === bestSeverityRank && matchCount > bestScore)
    ) {
      bestMatch = rule;
      bestScore = matchCount;
      bestSeverityRank = severityRank;
    }
  }

  // Default fallback if nothing matched
  if (!bestMatch) {
    return {
      severity: "monitor",
      conditionName: "Unrecognised Symptoms",
      message: "We couldn't identify a specific condition from your symptoms.",
      advice:
        "If you feel significantly unwell or symptoms worsen, please visit a nearby clinic or government hospital.",
      seeDoctor: false,
    };
  }

  return {
    severity: bestMatch.severity,
    conditionName: bestMatch.name,
    message: bestMatch.message,
    advice: bestMatch.advice,
    seeDoctor: bestMatch.seeDoctor,
  };
}

/**
 * Get all available symptom labels (for frontend checklist)
 */
function getAllSymptoms() {
  return symptomData.symptoms.map((s) => ({ id: s.id, label: s.label }));
}

module.exports = { parseSymptoms, assessSymptoms, getAllSymptoms };
