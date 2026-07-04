/* =========================================================
   NAVBAR.JS
   Handles two responsibilities:
   1. Adds/removes `.is-scrolled` on the navbar once the
      page scrolls past a threshold (for the blur/bg effect).
   2. Controls the mobile menu: opens/closes, manages
      aria-expanded, traps focus while open, and closes on
      Escape or outside click for accessibility.
========================================================= */

const Navbar = (() => {
  const SCROLL_THRESHOLD = 12;

  let navbarEl = null;
  let toggleBtn = null;
  let mobileMenu = null;
  let focusableEls = [];
  let lastFocusedElement = null;

  /**
   * Toggles the `.is-scrolled` class based on scroll position.
   * Uses a simple boolean check to avoid unnecessary DOM writes.
   */
  function handleScroll() {
    if (!navbarEl) return;
    const shouldBeScrolled = window.scrollY > SCROLL_THRESHOLD;
    const isCurrentlyScrolled = navbarEl.classList.contains('is-scrolled');

    if (shouldBeScrolled && !isCurrentlyScrolled) {
      navbarEl.classList.add('is-scrolled');
    } else if (!shouldBeScrolled && isCurrentlyScrolled) {
      navbarEl.classList.remove('is-scrolled');
    }
  }

  /**
   * Opens the mobile menu: shows panel, updates ARIA state,
   * locks body scroll, and moves focus into the menu.
   */
  function openMenu() {
    lastFocusedElement = document.activeElement;

    mobileMenu.hidden = false;
    // Force a reflow so the transform transition runs from the start state
    void mobileMenu.offsetHeight;
    mobileMenu.classList.add('is-open');

    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close main menu');
    document.body.style.overflow = 'hidden';

    focusableEls = mobileMenu.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    if (focusableEls.length) {
      focusableEls[0].focus();
    }

    document.addEventListener('keydown', handleKeydown);
  }

  /**
   * Closes the mobile menu and restores focus to the toggle button.
   */
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open main menu');
    document.body.style.overflow = '';

    // Wait for the close transition before hiding from the accessibility tree
    const onTransitionEnd = () => {
      mobileMenu.hidden = true;
      mobileMenu.removeEventListener('transitionend', onTransitionEnd);
    };
    mobileMenu.addEventListener('transitionend', onTransitionEnd);

    document.removeEventListener('keydown', handleKeydown);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function toggleMenu() {
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  /**
   * Handles Escape-to-close and basic focus trapping (Tab cycling)
   * while the mobile menu is open.
   */
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (event.key === 'Tab' && focusableEls.length) {
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  /**
   * Closes the menu automatically when a nav link inside it is clicked,
   * so navigating to a section doesn't leave the overlay open.
   */
  function handleMenuLinkClick(event) {
    if (event.target.closest('a')) {
      closeMenu();
    }
  }

  function init() {
    navbarEl = document.querySelector('[data-navbar]');
    toggleBtn = document.getElementById('navToggle');
    mobileMenu = document.querySelector('[data-mobile-menu]');

    if (!navbarEl || !toggleBtn || !mobileMenu) {
      return;
    }

    // Set initial scroll state on load (in case page loads mid-scroll on refresh)
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    toggleBtn.addEventListener('click', toggleMenu);
    mobileMenu.addEventListener('click', handleMenuLinkClick);
  }

  return { init };
})();
