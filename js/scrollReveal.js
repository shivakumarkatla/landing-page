/* =========================================================
   SCROLLREVEAL.JS
   Uses IntersectionObserver to add `.is-visible` to any
   element with [data-reveal] once it scrolls into view.
   The actual animation (opacity/transform) lives in
   animations.css — this module only toggles the class.
========================================================= */

const ScrollReveal = (() => {
  const SELECTOR = '[data-reveal]';
  const ROOT_MARGIN = '0px 0px -10% 0px'; // trigger slightly before element fully enters viewport
  const THRESHOLD = 0.15;

  let observer = null;

  /**
   * Callback fired for each observed entry. Once an element is visible,
   * it's marked and unobserved — the reveal is a one-time effect, not
   * something that should re-trigger when scrolling back up.
   */
  function handleIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Fallback for browsers without IntersectionObserver support:
   * just reveal everything immediately rather than leaving content
   * permanently hidden.
   */
  function revealAllImmediately(elements) {
    elements.forEach((el) => el.classList.add('is-visible'));
  }

  function init() {
    const elements = document.querySelectorAll(SELECTOR);
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealAllImmediately(elements);
      return;
    }

    observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: ROOT_MARGIN,
      threshold: THRESHOLD,
    });

    elements.forEach((el) => observer.observe(el));
  }

  return { init };
})();
