/* cookie-consent.js (ES5 friendly) */
(function () {
  var LS_KEY = 'cookie_consent_v1';

  function qs(sel) { return document.querySelector(sel); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  function isAccepted() {
    try { return localStorage.getItem(LS_KEY) === 'accepted'; }
    catch (e) { return false; }
  }

  function setAccepted() {
    try { localStorage.setItem(LS_KEY, 'accepted'); } catch (e) {}
  }

  function openModal() {
    var modal = qs('#privacyModal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // focus trap-lite: focus close btn
    var closeBtn = qs('#privacyCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var modal = qs('#privacyModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function showBanner() {
    var banner = qs('#cookieBanner');
    if (!banner) return;
    banner.hidden = false;
    banner.classList.add('is-open');
  }

  function hideBanner() {
    var banner = qs('#cookieBanner');
    if (!banner) return;
    banner.classList.remove('is-open');
    banner.hidden = true;
  }

  function init() {
    var acceptBtn = qs('#cookieAcceptBtn');
    var privacyLinks = document.querySelectorAll('[data-open-privacy]');
    var closeBtn = qs('#privacyCloseBtn');
    var modal = qs('#privacyModal');

    // If already accepted, keep banner hidden
    if (isAccepted()) {
      hideBanner();
    } else {
      showBanner();
    }

    on(acceptBtn, 'click', function () {
      setAccepted();
      hideBanner();
    });

    // Open privacy modal from anywhere
    for (var i = 0; i < privacyLinks.length; i++) {
      (function (link) {
        on(link, 'click', function (e) {
          e.preventDefault();
          openModal();
        });
      })(privacyLinks[i]);
    }

    on(closeBtn, 'click', function () { closeModal(); });

    // Close modal on backdrop click
    on(modal, 'click', function (e) {
      if (e.target === modal) closeModal();
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
