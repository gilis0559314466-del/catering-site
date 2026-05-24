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

  var lastFocus = null;

  function getFocusable(root) {
    if (!root) return [];
    return root.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var modal = qs('#privacyModal');
    var items = getFocusable(modal);
    if (!items || !items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openModal() {
    var modal = qs('#privacyModal');
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var closeBtn = qs('#privacyCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var modal = qs('#privacyModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
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

    document.addEventListener('keydown', function (e) {
      if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Escape') closeModal();
      trapFocus(e);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
