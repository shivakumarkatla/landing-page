/* =========================================================
   PRICINGTOGGLE.JS
   Controls the monthly/yearly billing switch. Updates the
   switch's aria-checked state and swaps the displayed price
   on every pricing card by reading data-price-monthly /
   data-price-yearly attributes already present in the HTML.
   Cards with no numeric price (e.g. "Custom") are skipped
   automatically since they simply lack those data attributes.
========================================================= */

const PricingToggle = (() => {
  let toggleBtn = null;
  let priceAmounts = [];
  let isYearly = false;

  /**
   * Updates every pricing card's displayed amount based on the
   * current billing period. Falls back to leaving the original
   * text untouched if a card has no price data attributes
   * (covers the "Custom" Enterprise tier).
   */
  function updatePrices() {
    priceAmounts.forEach((amountEl) => {
      const monthly = amountEl.getAttribute('data-price-monthly');
      const yearly = amountEl.getAttribute('data-price-yearly');

      if (!monthly || !yearly) return; // e.g. "Custom" tier — nothing to swap

      const value = isYearly ? yearly : monthly;
      amountEl.textContent = `$${value}`;
    });
  }

  function setToggleState(yearly) {
    isYearly = yearly;
    toggleBtn.setAttribute('aria-checked', String(isYearly));
    updatePrices();
  }

  function handleToggleClick() {
    setToggleState(!isYearly);
  }

  /**
   * Allow Enter/Space activation explicitly for the custom
   * role="switch" button, matching native checkbox behavior
   * (native <button> elements already fire click on Space/Enter,
   * this is a safety net for consistency across browsers).
   */
  function handleToggleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleClick();
    }
  }

  function init() {
    toggleBtn = document.getElementById('billingToggle');
    priceAmounts = Array.from(document.querySelectorAll('.pricing-card__amount'));

    if (!toggleBtn || !priceAmounts.length) return;

    toggleBtn.addEventListener('click', handleToggleClick);
    toggleBtn.addEventListener('keydown', handleToggleKeydown);

    // Initialize to monthly (matches default aria-checked="false" in HTML)
    setToggleState(false);
  }

  return { init };
})();
