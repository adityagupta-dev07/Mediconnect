/* ============================================================
   js/api/claude.js — Claude AI API
   Sends patient symptoms to Claude and gets back a structured
   JSON diagnosis with severity, condition, and specialist type.
   ============================================================ */

const ClaudeAPI = (() => {

  const API_URL = "https://api.anthropic.com/v1/messages";

  /**
   * Analyze symptoms using Claude AI.
   *
   * @param {string} symptoms   - Free-text description of symptoms
   * @param {string} age        - Patient age
   * @param {string} gender     - Patient gender
   * @param {string[]} tags     - Array of selected symptom tags
   * @returns {Promise<Object>} - Structured diagnosis object
   */
  async function analyzeSymptoms(symptoms, age, gender, tags = []) {
    const allSymptoms = [
      tags.length ? `Selected symptoms: ${tags.join(", ")}.` : "",
      symptoms ? `Patient description: ${symptoms}` : "",
    ].filter(Boolean).join(" ");

    if (!allSymptoms.trim()) {
      throw new Error("Please describe your symptoms before analyzing.");
    }

    const prompt = `
You are a medical triage assistant. A patient has described their symptoms.
Analyze and respond ONLY with a valid JSON object — no extra text, no markdown.

Patient details:
- Age: ${age || "unknown"}
- Gender: ${gender || "unknown"}
- ${allSymptoms}

Return this exact JSON structure:
{
  "likely_condition": "name of the most likely condition",
  "severity": "mild" or "moderate" or "severe",
  "specialist_needed": "exact specialty name e.g. General Physician, Cardiologist, Neurologist, Dermatologist, Psychiatrist, Gastroenterologist, Orthopedist, Pulmonologist, Gynecologist, Pediatrician",
  "search_query": "short Google Places search phrase e.g. cardiologist clinic",
  "urgency": "Not urgent — book within a week" or "Book within 24 hours" or "Seek immediate attention",
  "advice": "one brief, actionable sentence of general self-care advice"
}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CONFIG.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        // Required for browser-side calls:
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: CONFIG.CLAUDE_MODEL,
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || "";

    // Strip any accidental markdown fences before parsing
    const clean = raw.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(clean);
    } catch {
      throw new Error("AI returned an unexpected format. Please try again.");
    }
  }

  return { analyzeSymptoms };
})();
