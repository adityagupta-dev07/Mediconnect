/* ============================================================
   js/ui/tips.js — Health Tips Data & Renderer
   ============================================================ */

const HEALTH_TIPS = [
  {
    cat: "Nutrition",
    catColor: "#1D9E75",
    title: "Eat More Fruits & Vegetables Daily",
    text: "Aim for at least 5 portions of fruits and vegetables per day. A colorful plate ensures diverse vitamins and antioxidants that boost immunity and prevent chronic diseases.",
  },
  {
    cat: "Heart Health",
    catColor: "#185FA5",
    title: "Monitor Your Blood Pressure Regularly",
    text: "High blood pressure often has no symptoms. Regular monitoring helps detect it early. Keep sodium intake under 2g/day and exercise 30 minutes daily.",
  },
  {
    cat: "Mental Health",
    catColor: "#7F77DD",
    title: "Practice Mindfulness for Stress Relief",
    text: "Even 10 minutes of mindfulness or meditation daily can significantly reduce anxiety, improve focus, and lower cortisol levels.",
  },
  {
    cat: "Diabetes",
    catColor: "#BA7517",
    title: "Know Your Blood Sugar Numbers",
    text: "Diabetes affects over 77 million Indians. Fasting blood sugar above 126 mg/dL may indicate diabetes. Regular screening and diet control can prevent or delay onset.",
  },
  {
    cat: "Immunity",
    catColor: "#639922",
    title: "Stay Hydrated — Drink 8 Glasses Daily",
    text: "Water regulates body temperature, flushes toxins, and supports every organ. Dehydration causes fatigue and headaches. Carry a water bottle and sip throughout the day.",
  },
  {
    cat: "Sleep",
    catColor: "#D4537E",
    title: "7–9 Hours of Sleep Is Non-Negotiable",
    text: "Poor sleep is linked to obesity, diabetes, heart disease, and mental health issues. Create a consistent sleep schedule and avoid screens 1 hour before bed.",
  },
  {
    cat: "Hygiene",
    catColor: "#0F6E56",
    title: "Wash Hands Properly — 20 Seconds Minimum",
    text: "Handwashing with soap eliminates 99% of germs. Always wash before eating, after using the toilet, and after touching surfaces in public.",
  },
  {
    cat: "Exercise",
    catColor: "#D85A30",
    title: "30 Minutes of Movement Every Day",
    text: "Even a brisk 30-minute walk daily reduces risk of heart disease by 35%, diabetes by 50%, and depression by 48%. You don't need a gym — just consistency.",
  },
  {
    cat: "Eye Health",
    catColor: "#378ADD",
    title: "Follow the 20-20-20 Rule for Screens",
    text: "Every 20 minutes, look at something 20 feet away for 20 seconds. This reduces digital eye strain significantly, especially for those working long hours on screens.",
  },
];

/** Render all health tip cards into the grid */
function renderTips() {
  const grid = document.getElementById("tips-grid");

  grid.innerHTML = HEALTH_TIPS.map((tip) => `
    <div class="tip-card">
      <div class="tip-banner" style="background: ${tip.catColor};"></div>
      <div class="tip-body">
        <div class="tip-cat" style="color: ${tip.catColor};">${tip.cat}</div>
        <div class="tip-title">${tip.title}</div>
        <div class="tip-text">${tip.text}</div>
        <div class="tip-read">Read more →</div>
      </div>
    </div>
  `).join("");
}

/** Initialize on page load */
function initTips() {
  renderTips();
}
