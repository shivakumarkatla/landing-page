/* =========================================================
   ACCORDION.JS
   Accessible FAQ accordion. Each trigger button toggles its
   linked panel via aria-expanded + the .is-open class, and
   sets an inline max-height (from scrollHeight) so the CSS
   transition in animations.css can animate smoothly — pure
   CSS can't transition to/from `height: auto`.
   Only one panel is open at a time (standard FAQ pattern).
========================================================= */

const Accordion = (() => {
  let triggers = [];

  /**
   * Opens a single panel: sets ARIA state, removes [hidden] so
   * screen readers can reach it, and sets max-height to its real
   * scrollHeight so the CSS transition has a concrete value to animate to.
   */
  function openPanel(trigger, panel) {
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    // Read scrollHeight on the next frame so `hidden` removal has applied
    // and the browser has computed the panel's natural content height.
    requestAnimationFrame(() => {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      panel.classList.add('is-open');
    });
  }

  /**
   * Closes a single panel: animates max-height back to 0, updates ARIA
   * state immediately, and re-applies [hidden] once the transition ends
   * so closed panels are fully removed from the accessibility tree.
   */
  function closePanel(trigger, panel) {
    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    panel.style.maxHeight = '0px';

    const onTransitionEnd = (event) => {
      if (event.propertyName === 'max-height') {
        panel.hidden = true;
        panel.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    panel.addEventListener('transitionend', onTransitionEnd);
  }

  function getPanelFor(trigger) {
    const panelId = trigger.getAttribute('aria-controls');
    return document.getElementById(panelId);
  }

  function handleTriggerClick(event) {
    const trigger = event.currentTarget;
    const panel = getPanelFor(trigger);
    if (!panel) return;

    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    // Close any other open panel first (single-open accordion behavior)
    triggers.forEach((otherTrigger) => {
      if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
        const otherPanel = getPanelFor(otherTrigger);
        if (otherPanel) closePanel(otherTrigger, otherPanel);
      }
    });

    isOpen ? closePanel(trigger, panel) : openPanel(trigger, panel);
  }

  function init() {
    triggers = Array.from(document.querySelectorAll('.accordion-item__trigger'));
    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', handleTriggerClick);
    });
  }

  return { init };
})();
