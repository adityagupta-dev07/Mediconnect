/* ============================================================
   js/ui/symptom-checker.js
   Handles symptom tag selection, form submission,
   calls Claude + Places APIs, and renders the result.
   ============================================================ */

/** Toggle a symptom tag on/off */
function toggleTag(el) {
  el.classList.toggle("selected");
}

/** Get all currently selected symptom tag labels */
function getSelectedTags() {
  return [...document.querySelectorAll(".symptom-tag.selected")]
    .map((el) => el.textContent.trim());
}

/** Main handler — triggered when user clicks "Analyze Symptoms" */
async function handleSymptomSubmit() {
  const symptoms = document.getElementById("pt-desc").value.trim();
  const age      = document.getElementById("pt-age").value.trim();
  const gender   = document.getElementById("pt-gender").value;
  const tags     = getSelectedTags();

  if (!symptoms && !tags.length) {
    alert("Please select at least one symptom or describe your condition.");
    return;
  }

  const btn = document.getElementById("analyze-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Analyzing...`;

  try {
    // 1. AI diagnosis
    const diagnosis = await ClaudeAPI.analyzeSymptoms(symptoms, age, gender, tags);

    // 2. Get user location
    const coords = await LocationService.getCoords().catch(() => null);

    // 3. Find nearby doctors
    let clinics = [];
    if (coords) {
      clinics = await PlacesAPI.findNearbyClinics(
        coords.lat, coords.lng, diagnosis.search_query || diagnosis.specialist_needed
      ).catch(() => []);
    }

    // 4. Render results
    renderDiagnosisResult(diagnosis, clinics);

  } catch (err) {
    alert(err.message || "Something went wrong. Please try again.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "🔍 Analyze Symptoms & Find Local Doctors";
  }
}

/** Render the AI result + clinic cards */
function renderDiagnosisResult(diagnosis, clinics) {
  const box     = document.getElementById("result-box");
  const sevEl   = document.getElementById("result-severity");
  const sevText = document.getElementById("severity-text");
  const desc    = document.getElementById("result-desc");

  // Severity bar
  sevEl.className = `result-severity ${diagnosis.severity || "mild"}`;
  const sevLabels = {
    mild:     "🟢 Mild — Non-urgent consultation recommended",
    moderate: "🟡 Moderate — Consultation within 24 hours advised",
    severe:   "🔴 Severe — Seek immediate medical attention",
  };
  sevText.textContent = sevLabels[diagnosis.severity] || sevLabels.mild;

  // Description
  desc.textContent =
    `Likely condition: ${diagnosis.likely_condition}. ${diagnosis.urgency}. ${diagnosis.advice}`;

  // Doctor cards
  const docsEl = document.getElementById("suggested-docs");
  if (clinics.length) {
    docsEl.innerHTML = clinics.slice(0, 3).map((c, i) => `
      <div class="doc-card ${i === 0 ? "recommended" : ""}">
        ${i === 0 ? '<div class="rec-badge">Best Match</div>' : ""}
        <div class="doc-avatar">${c.initials}</div>
        <div class="doc-name">${c.name}</div>
        <div class="doc-spec">${diagnosis.specialist_needed}</div>
        <div class="doc-meta">
          <div class="doc-meta-row"><span>Rating</span>★ ${c.rating} (${c.totalRatings})</div>
          <div class="doc-meta-row"><span>Address</span>${c.address}</div>
          <div class="doc-meta-row"><span>Status</span>${
            c.isOpenNow === true  ? "🟢 Open Now" :
            c.isOpenNow === false ? "🔴 Closed"   : "Hours unknown"
          }</div>
        </div>
        <button class="book-doc-btn" onclick="switchTab('booking', document.querySelector('.tab:nth-child(3)'))">
          Book Appointment →
        </button>
      </div>
    `).join("");
  } else {
    docsEl.innerHTML = `
      <p style="font-size:0.85rem;color:var(--gray-600);">
        Could not load nearby clinics automatically.
        <a href="https://www.google.com/search?q=${encodeURIComponent(diagnosis.specialist_needed + ' near me')}"
           target="_blank" style="color:var(--blue-600);">Search on Google →</a>
      </p>`;
  }

  // Show the result box
  box.classList.add("show");
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
