/* ============================================================
   js/ui/booking.js — Calendar, Slot Selection & Confirmation
   ============================================================ */

const DAYS_HEADER = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Days in April that have available slots
const AVAILABLE_DAYS = [2,3,5,7,8,9,10,12,14,15,16,17,19,21,22,23,24,26,28,29,30];

// Time slots shown after picking a date
const TIME_SLOTS = ["9:00 AM","10:30 AM","12:00 PM","2:00 PM","3:30 PM","5:00 PM"];

/** Build the April calendar grid */
function buildCalendar() {
  const grid = document.getElementById("cal-grid");

  // Header row
  let html = DAYS_HEADER.map((d) => `<div class="cal-day header">${d}</div>`).join("");

  // 2 empty cells before April 1 (April 1 = Tuesday in 2025)
  html += `<div class="cal-day unavailable"></div>`.repeat(2);

  // Day cells
  for (let d = 1; d <= 30; d++) {
    const cls = AVAILABLE_DAYS.includes(d) ? "available" : "unavailable";
    html += `<div class="cal-day ${cls}" onclick="selectCalDay(this, ${d})">${d}</div>`;
  }

  grid.innerHTML = html;
}

/** Highlight selected date and populate time slots */
function selectCalDay(el, day) {
  if (!el.classList.contains("available")) return;

  // Clear previous selection
  document.querySelectorAll(".cal-day.selected").forEach((e) => e.classList.remove("selected"));
  el.classList.add("selected");

  // Populate time slots
  document.getElementById("time-slots").innerHTML = TIME_SLOTS.map((s) =>
    `<span class="slot" onclick="selectSlot(this)">${s}</span>`
  ).join("");

  // Advance step indicator
  document.getElementById("step2").className = "step done";
  document.getElementById("step3").className = "step current";
}

/** Highlight selected time slot */
function selectSlot(el) {
  document.querySelectorAll("#time-slots .slot.selected").forEach((e) => e.classList.remove("selected"));
  el.classList.add("selected");
}

/** Confirm the booking and show success message */
function confirmBooking() {
  const doctor = document.getElementById("bk-doctor").value;
  const day    = document.querySelector(".cal-day.selected");
  const slot   = document.querySelector("#time-slots .slot.selected");
  const type   = document.getElementById("consult-type").value;

  if (!doctor) { alert("Please select a doctor."); return; }
  if (!day)    { alert("Please select a date.");   return; }
  if (!slot)   { alert("Please select a time slot."); return; }

  const msg = document.getElementById("success-msg");
  document.getElementById("success-detail").textContent =
    `Confirmed: ${doctor} on April ${day.textContent} at ${slot.textContent} via ${type}. ` +
    `A confirmation link will be sent to your registered mobile number.`;

  msg.classList.add("show");
  document.getElementById("step3").className = "step done";
  msg.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/** Initialize on page load */
function initBooking() {
  buildCalendar();
}
