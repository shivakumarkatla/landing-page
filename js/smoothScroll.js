/* =========================================================
   SMOOTHSCROLL.JS
   Intercepts in-page anchor link clicks (#section) and scrolls
   to the target manually rather than relying solely on CSS
   `scroll-behavior: smooth`, because the sticky navbar would
   otherwise cover the top of each section. Also moves focus to
   the target for keyboard/screen-reader users, and respects
   prefers-reduced-motion by skipping the smooth animation.
========================================================= */

const SmoothScroll = (() => {
  /**
   * Reads the navbar's actual rendered height rather than hardcoding
   * a pixel value, so this stays correct if the navbar height ever
   * changes in CSS without needing a matching JS update.
   */
  function getNavbarOffset() {
    const navbar = document.querySelector('[data-navbar]');
    return navbar ? navbar.getBoundingClientRect().height : 0;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Scrolls to the given target element, offset by the navbar height
   * plus a small breathing-room gap, then moves keyboard focus to it
   * so screen reader users land in the right place in the document.
   */
  function scrollToTarget(target) {
    const offset = getNavbarOffset() + 16;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });

    // Make the target programmatically focusable, then focus it so
    // assistive tech announces the new section after the jump.
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  }

  function handleClick(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return; // let the browser handle it normally if no match

    event.preventDefault();
    scrollToTarget(target);

    // Update the URL hash without triggering an extra native jump.
    history.pushState(null, '', hash);
  }

  function init() {
    document.addEventListener('click', handleClick);
  }

  return { init };
})();
