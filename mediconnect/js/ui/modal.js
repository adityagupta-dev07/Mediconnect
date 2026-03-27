/* ============================================================
   js/ui/modal.js — Login Modal Open / Close
   ============================================================ */

function openModal() {
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

/** Close modal when clicking the dark overlay (not the card itself) */
function closeModalOnBg(event) {
  if (event.target === document.getElementById("modal-overlay")) {
    closeModal();
  }
}

function sendOTP() {
  const phone = document.getElementById("login-phone").value.trim();
  if (!phone) {
    alert("Please enter your mobile number.");
    return;
  }
  alert(`OTP sent to ${phone}. (Demo mode — no real SMS sent)`);
  closeModal();
}
