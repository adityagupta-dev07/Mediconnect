/* ============================================================
   js/ui/tabs.js — Tab Switching Logic
   Manages which panel is visible and syncs tab + nav buttons.
   ============================================================ */

/**
 * Switch the active panel and highlight the correct tab button.
 *
 * @param {string} panelId  - e.g. "symptom", "doctors", "booking", "tips"
 * @param {Element} [btnEl] - The clicked tab/nav button (optional)
 */
function switchTab(panelId, btnEl) {
  // Hide all panels
  document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));

  // Deactivate all tab buttons
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));

  // Deactivate all nav links
  document.querySelectorAll(".nav-link").forEach((n) => n.classList.remove("active"));

  // Show the target panel
  const panel = document.getElementById(`panel-${panelId}`);
  if (panel) panel.classList.add("active");

  // Highlight the clicked button
  if (btnEl) btnEl.classList.add("active");
}
