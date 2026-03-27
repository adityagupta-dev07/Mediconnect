# MediConnect — Telemedicine Patient Portal

## Project Structure

```
mediconnect/
├── index.html                  ← Main HTML entry point
├── config.js                   ← API keys (never commit this to GitHub)
│
├── css/
│   ├── variables.css           ← Design tokens: colors, fonts, spacing
│   ├── base.css                ← Reset, body, typography
│   ├── navbar.css              ← Navigation bar styles
│   ├── hero.css                ← Hero section styles
│   ├── symptom-checker.css     ← Symptom checker panel
│   ├── doctors.css             ← Doctor cards & filter bar
│   ├── booking.css             ← Appointment booking & calendar
│   ├── tips.css                ← Health tips cards
│   └── modal.css               ← Modal/popup overlay
│
└── js/
    ├── config.js               ← API keys & global constants
    ├── api/
    │   ├── claude.js           ← Claude AI API calls (symptom analysis)
    │   ├── places.js           ← Google Places API (find clinics/doctors)
    │   └── location.js         ← Browser geolocation helper
    ├── ui/
    │   ├── tabs.js             ← Tab switching logic
    │   ├── symptom-checker.js  ← Symptom tag selection & form handling
    │   ├── doctors.js          ← Render & filter doctor cards
    │   ├── booking.js          ← Calendar, slot selection, confirmation
    │   ├── tips.js             ← Render health tips
    │   └── modal.js            ← Modal open/close
    └── main.js                 ← App entry point, wires everything together
```

## Setup Instructions

1. Get your API keys (see Step 2 in the guide)
2. Open `js/config.js` and paste your keys
3. Open `index.html` in a browser — done!

## API Keys Needed
- Claude API → https://console.anthropic.com
- Google Places API → https://console.cloud.google.com
