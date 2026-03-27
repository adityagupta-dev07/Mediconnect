/* ============================================================
   js/main.js — App Entry Point
   Runs after all other scripts are loaded.
   Initializes every UI module in order.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ── Initialize UI modules ──────────────────────────────────
  initDoctors();   // render sample doctor cards
  initBooking();   // build the calendar
  initTips();      // render health tips

  // ── Guard: warn if API keys are not set ───────────────────
  if (
    CONFIG.CLAUDE_API_KEY === "YOUR_CLAUDE_API_KEY_HERE" ||
    CONFIG.GOOGLE_PLACES_KEY === "YOUR_GOOGLE_PLACES_API_KEY_HERE"
  ) {
    console.warn(
      "⚠️  MediConnect: API keys are not configured.\n" +
      "Open js/config.js and paste your Claude and Google Places API keys.\n" +
      "The symptom checker and location search will not work until this is done."
    );
  }

  // ── Keyboard: close modal on Escape ───────────────────────
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  console.log("✅ MediConnect initialized successfully.");
});
