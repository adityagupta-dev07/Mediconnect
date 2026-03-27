/* ============================================================
   js/ui/doctors.js — Doctor Cards Render & Filter
   On page load shows sample doctors.
   "Use My Location" button fetches live results from Places API.
   ============================================================ */

// ── Static fallback data (shown before location is used) ──────
const SAMPLE_DOCTORS = [
  { name: "Dr. Priya Sharma",  initials: "PS", spec: "General Physician",   exp: "12 yrs", fee: "₹300", rating: 4.9, reviews: 412, slots: ["9:00 AM","10:30 AM","2:00 PM","4:00 PM"], avail: "today",    address: "Ranchi, Jharkhand" },
  { name: "Dr. Rajesh Mehta",  initials: "RM", spec: "Cardiologist",        exp: "18 yrs", fee: "₹600", rating: 4.8, reviews: 289, slots: ["11:00 AM","3:30 PM","5:00 PM"],            avail: "today",    address: "Ranchi, Jharkhand" },
  { name: "Dr. Ananya Singh",  initials: "AS", spec: "Dermatologist",       exp: "9 yrs",  fee: "₹450", rating: 4.7, reviews: 376, slots: ["10:00 AM","1:00 PM","4:30 PM"],            avail: "today",    address: "Ranchi, Jharkhand" },
  { name: "Dr. Vikram Patel",  initials: "VP", spec: "Neurologist",         exp: "15 yrs", fee: "₹700", rating: 4.9, reviews: 201, slots: ["9:30 AM","12:00 PM","3:00 PM"],           avail: "tomorrow", address: "Ranchi, Jharkhand" },
  { name: "Dr. Meera Joshi",   initials: "MJ", spec: "Psychiatrist",        exp: "11 yrs", fee: "₹500", rating: 4.8, reviews: 334, slots: ["11:30 AM","2:30 PM","5:30 PM"],           avail: "today",    address: "Ranchi, Jharkhand" },
  { name: "Dr. Arjun Rao",     initials: "AR", spec: "Gastroenterologist",  exp: "14 yrs", fee: "₹550", rating: 4.6, reviews: 178, slots: ["10:00 AM","1:30 PM","4:00 PM"],           avail: "tomorrow", address: "Ranchi, Jharkhand" },
  { name: "Dr. Sunita Das",    initials: "SD", spec: "Gynecologist",        exp: "16 yrs", fee: "₹500", rating: 4.9, reviews: 449, slots: ["9:00 AM","11:00 AM","3:00 PM"],            avail: "today",    address: "Ranchi, Jharkhand" },
  { name: "Dr. Kiran Bose",    initials: "KB", spec: "Pediatrician",        exp: "10 yrs", fee: "₹400", rating: 4.8, reviews: 522, slots: ["10:30 AM","12:30 PM","3:30 PM"],          avail: "today",    address: "Ranchi, Jharkhand" },
  { name: "Dr. Amit Verma",    initials: "AV", spec: "Orthopedist",         exp: "13 yrs", fee: "₹600", rating: 4.7, reviews: 265, slots: ["9:00 AM","11:30 AM","2:00 PM"],           avail: "tomorrow", address: "Ranchi, Jharkhand" },
  { name: "Dr. Neha Kapoor",   initials: "NK", spec: "Pulmonologist",       exp: "8 yrs",  fee: "₹480", rating: 4.6, reviews: 192, slots: ["10:00 AM","1:00 PM","4:00 PM"],           avail: "today",    address: "Ranchi, Jharkhand" },
];

let _currentDoctors = [...SAMPLE_DOCTORS];

/** Render an array of doctor objects into the grid */
function renderDoctors(doctors) {
  const grid = document.getElementById("doctors-grid");

  if (!doctors.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No doctors found</h3>
        <p>Try a different specialty or broader search.</p>
      </div>`;
    return;
  }

  grid.innerHTML = doctors.map((d) => `
    <div class="full-doc-card">
      <div class="doc-header">
        <div class="doc-avatar-lg">${d.initials}</div>
        <div>
          <div class="doc-name">${d.name}</div>
          <div class="doc-spec">${d.spec}</div>
          <div class="doc-available">
            <div class="avail-dot"></div>
            ${d.avail === "today" ? "Available Today" : d.isOpenNow === false ? "Closed" : "Available"}
          </div>
        </div>
      </div>
      <div class="rating">
        ★★★★★ <span>${d.rating} (${d.reviews ?? d.totalRatings ?? 0} reviews)</span>
      </div>
      <div style="margin-top:8px;font-size:0.8rem;color:var(--gray-600);">
        ${d.exp ? `Experience: <b>${d.exp}</b> &nbsp;|&nbsp; Fee: <b style="color:var(--blue-800)">${d.fee}</b>` : `📍 ${d.address}`}
      </div>
      <div style="font-size:0.78rem;color:var(--gray-600);margin-top:6px;margin-bottom:4px;font-weight:500;">Today's slots:</div>
      <div class="slots">
        ${(d.slots || ["10:00 AM","12:00 PM","3:00 PM"]).map((s) =>
          `<span class="slot" onclick="selectSlot(this)">${s}</span>`
        ).join("")}
      </div>
      <button class="book-btn" onclick="quickBook('${d.name}')">Book Consultation</button>
    </div>
  `).join("");
}

/** Filter doctors by search text, specialty, and availability */
function filterDoctors() {
  const q     = document.getElementById("doc-search").value.toLowerCase();
  const spec  = document.getElementById("spec-filter").value;
  const avail = document.getElementById("avail-filter").value;

  const filtered = _currentDoctors.filter((d) =>
    (d.name.toLowerCase().includes(q) || (d.spec || "").toLowerCase().includes(q)) &&
    (!spec  || d.spec === spec) &&
    (!avail || d.avail === avail)
  );

  renderDoctors(filtered);
}

/** Use GPS to load real nearby clinics from Google Places */
async function loadNearbyDoctors() {
  const btn = document.querySelector(".locate-btn");
  btn.textContent = "📍 Locating...";
  btn.disabled = true;

  try {
    const coords = await LocationService.getCoords();
    const spec   = document.getElementById("spec-filter").value || "doctor clinic";
    const clinics = await PlacesAPI.findNearbyClinics(coords.lat, coords.lng, spec);

    // Map Places results to the same shape as sample doctors
    _currentDoctors = clinics.map((c) => ({
      name:         c.name,
      initials:     c.initials,
      spec:         spec || "Clinic",
      rating:       c.rating,
      reviews:      c.totalRatings,
      isOpenNow:    c.isOpenNow,
      address:      c.address,
      avail:        c.isOpenNow ? "today" : "tomorrow",
      slots:        ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"],
    }));

    renderDoctors(_currentDoctors);
  } catch (err) {
    alert(err.message);
  } finally {
    btn.textContent = "📍 Use My Location";
    btn.disabled = false;
  }
}

/** Book a specific doctor by name — switches to booking tab */
function quickBook(doctorName) {
  const sel = document.getElementById("bk-doctor");
  for (const opt of sel.options) {
    if (opt.text.toLowerCase().includes(doctorName.split(" ")[1]?.toLowerCase() || "")) {
      sel.value = opt.value;
      break;
    }
  }
  switchTab("booking", document.querySelector(".tab:nth-child(3)"));
  document.getElementById("panel-booking").scrollIntoView({ behavior: "smooth" });
}

/** Initialize on page load */
function initDoctors() {
  renderDoctors(SAMPLE_DOCTORS);
}
