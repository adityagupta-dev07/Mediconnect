/* ============================================================
   js/api/location.js — Browser Geolocation Helper
   Asks the user for GPS coordinates once and caches them.
   ============================================================ */

const LocationService = (() => {

  // Cache so we don't ask the browser repeatedly
  let _cachedCoords = null;

  /**
   * Get the user's current latitude & longitude.
   * Returns: Promise<{ lat: number, lng: number }>
   */
  async function getCoords() {
    if (_cachedCoords) return _cachedCoords;

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          _cachedCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(_cachedCoords);
        },
        (error) => {
          let message = "Unable to get your location.";
          if (error.code === 1) message = "Location access denied. Please allow location in your browser.";
          if (error.code === 2) message = "Location unavailable. Try again.";
          if (error.code === 3) message = "Location request timed out.";
          reject(new Error(message));
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  }

  /** Clear cached coords (e.g., if user moves or denies) */
  function clearCache() {
    _cachedCoords = null;
  }

  return { getCoords, clearCache };
})();
