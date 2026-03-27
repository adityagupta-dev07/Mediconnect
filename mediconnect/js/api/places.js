/* ============================================================
   js/api/places.js — Google Places API
   Finds nearby clinics and doctors, sorted by rating.
   ============================================================ */

const PlacesAPI = (() => {

  const BASE_URL = "https://maps.googleapis.com/maps/api/place";

  /**
   * Search for nearby clinics/doctors matching a specialty.
   *
   * @param {number} lat          - User latitude
   * @param {number} lng          - User longitude
   * @param {string} searchQuery  - e.g. "cardiologist clinic"
   * @returns {Promise<Array>}    - Array of clinic objects sorted by rating
   */
  async function findNearbyClinics(lat, lng, searchQuery) {
    const query = encodeURIComponent(`${searchQuery} near me`);
    const url = `${BASE_URL}/textsearch/json?query=${query}&location=${lat},${lng}&radius=${CONFIG.SEARCH_RADIUS_METERS}&key=${CONFIG.GOOGLE_PLACES_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google Places error: ${response.status}`);

    const data = await response.json();
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Places API: ${data.status} — ${data.error_message || ""}`);
    }

    // Filter out results with no rating, sort highest first
    return (data.results || [])
      .filter((place) => place.rating && place.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, CONFIG.MAX_RESULTS)
      .map(normalizePlaceResult);
  }

  /**
   * Get detailed info for a single clinic (hours, phone, website).
   *
   * @param {string} placeId  - Google Place ID
   * @returns {Promise<Object>}
   */
  async function getClinicDetails(placeId) {
    const fields = "name,opening_hours,formatted_phone_number,website,formatted_address";
    const url = `${BASE_URL}/details/json?place_id=${placeId}&fields=${fields}&key=${CONFIG.GOOGLE_PLACES_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Place details error: ${response.status}`);

    const data = await response.json();
    return data.result || {};
  }

  /**
   * Normalize a raw Places result into a clean object for the UI.
   * @private
   */
  function normalizePlaceResult(place) {
    return {
      placeId:      place.place_id,
      name:         place.name,
      address:      place.vicinity || place.formatted_address || "Address not available",
      rating:       place.rating,
      totalRatings: place.user_ratings_total || 0,
      isOpenNow:    place.opening_hours?.open_now ?? null,
      lat:          place.geometry?.location?.lat,
      lng:          place.geometry?.location?.lng,
      // Initials for avatar fallback
      initials:     place.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase() || "")
                      .join(""),
    };
  }

  return { findNearbyClinics, getClinicDetails };
})();
