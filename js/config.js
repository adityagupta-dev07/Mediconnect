/* ============================================================
   js/config.js — API Keys & Global Configuration
   ⚠️  NEVER commit this file to GitHub or share publicly.
       Add "config.js" to your .gitignore file.
   ============================================================ */

const CONFIG = {
  // Get yours at: https://console.anthropic.com
  CLAUDE_API_KEY: "YOUR_CLAUDE_API_KEY_HERE",

  // Get yours at: https://console.cloud.google.com
  // Enable: Places API + Maps JavaScript API
  GOOGLE_PLACES_KEY: "YOUR_GOOGLE_PLACES_API_KEY_HERE",

  // Claude model to use for AI diagnosis
  CLAUDE_MODEL: "claude-sonnet-4-20250514",

  // Radius in metres for searching nearby clinics
  SEARCH_RADIUS_METERS: 5000,

  // Max clinic/doctor results to show
  MAX_RESULTS: 8,
};
