/* =========================================================
   MAIN.JS
   Entry point. Initializes every module once the DOM is
   ready. Each module is self-contained (IIFE) and exposes
   only an `init()` method, keeping this file as the single
   place that wires the whole page together.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  Navbar.init();
  ScrollReveal.init();
  Accordion.init();
  PricingToggle.init();
  SmoothScroll.init();

  setFooterYear();
});

/**
 * Keeps the copyright year in the footer current automatically,
 * so it never needs a manual yearly update.
 */
function setFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
