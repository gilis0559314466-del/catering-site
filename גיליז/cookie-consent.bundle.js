/* cookie-consent.bundle.js (ES5 friendly, plug & play) */
(function () {
  var LS_KEY = 'cookie_consent_v1';

  // ------- helpers -------
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return document.querySelectorAll(sel); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  // ------- defaults (you can override via window.CookieConsentConfig) -------
  var defaults = {
    rtl: true,
    language: 'he',
    companyName: '[שם העסק/החברה]',
    contactEmail: '[אימייל]',
    contactPhone: '[טלפון]',
    updatedDate: '2026-02-12',
    bannerText: 'האתר משתמש בקוקיז לצורכי תפעול בסיסי, מדידה ושיפור השירות.',
    acceptText: 'אישור',
    privacyLinkText: 'למדיניות פרטיות',
    privacyBtnText: 'מדיניות פרטיות',
    showReject: false, // אם תרצי "דחייה" בעתיד – אשדרג
    theme: {
      primaryBg: 'rgba(20,20,20,0.92)',
      primaryText: '#ffffff',
      primaryBtnBg: '#22c1dc',
      primaryBtnText: '#0b1b20'
    }
  };

  function getConfig() {
    var cfg = defaults;
    if (window.CookieConsentConfig && typeof window.CookieConsentConfig === 'object') {
      // shallow merge
      for (var k in window.CookieConsentConfig) {
        if (window.CookieConsentConfig.hasOwnProperty(k)) {
          if (k === 'theme' && typeof window.CookieConsentConfig.theme === 'object') {
            for (var tk in window.CookieConsentConfig.theme) {
              if (window.CookieConsentConfig.theme.hasOwnProperty(tk)) {
                cfg.theme[tk] = window.CookieConsentConfig.theme[tk];
              }
            }
          } else {
            cfg[k] = window.CookieConsentConfig[k];
          }
        }
      }
    }
    return cfg;
  }

  function isAccepted() {
    return safeGet(LS_KEY) === 'accepted';
  }

  function injectStyles(cfg) {
    var css =
      '/* Cookie Consent (injected) */\n' +
      '.cc-banner{position:fixed;inset:auto 0 0 0;z-index:9999;padding:14px;direction:' + (cfg.rtl ? 'rtl' : 'ltr') + ';font-family:inherit;}\n' +
      '.cc-inner{max-width:1100px;margin:0 auto;background:' + cfg.theme.primaryBg + ';color:' + cfg.theme.primaryText + ';border-radius:14px;padding:14px 16px;display:flex;gap:12px;align-items:center;justify-content:space-between;box-shadow:0 10px 30px rgba(0,0,0,.25);}\n' +
      '.cc-text{font-size:14px;line-height:1.4;}\n' +
      '.cc-text a{color:' + cfg.theme.primaryText + ';text-decoration:underline;margin-' + (cfg.rtl ? 'right' : 'left') + ':6px;}\n' +
      '.cc-actions{display:flex;gap:10px;flex-shrink:0;}\n' +
      '.cc-btn{border:0;border-radius:999px;padding:10px 14px;cursor:pointer;font-size:14px;}\n' +
      '.cc-btn-primary{background:' + cfg.theme.primaryBtnBg + ';color:' + cfg.theme.primaryBtnText + ';font-weight:700;}\n' +
      '.cc-btn-ghost{background:transparent;color:' + cfg.theme.primaryText + ';border:1px solid rgba(255,255,255,0.4);}\n' +
      '@media (max-width:640px){.cc-inner{flex-direction:column;align-items:stretch;}.cc-actions{justify-content:flex-end;}}\n' +
      '.cc-modal{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:10000;display:none;direction:' + (cfg.rtl ? 'rtl' : 'ltr') + ';}\n' +
      '.cc-modal.is-open{display:block;}\n' +
      '.cc-panel{max-width:900px;margin:5vh auto;background:#fff;border-radius:16px;padding:18px 18px 22px;box-shadow:0 10px 40px rgba(0,0,0,.25);max-height:90vh;overflow:auto;}\n' +
      '.cc-panel h2{margin:0 0 8px;}\n' +
      '.cc-panel h3{margin-top:18px;}\n' +
      '.cc-close{position:sticky;top:0;float:' + (cfg.rtl ? 'left' : 'right') + ';border:0;background:#f2f2f2;border-radius:10px;padding:8px 10px;cursor:pointer;}\n';

    var styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'ccStyles';
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  function buildHtml(cfg) {
    var company = escHtml(cfg.companyName);
    var email = escHtml(cfg.contactEmail);
    var phone = escHtml(cfg.contactPhone);
    var date = escHtml(cfg.updatedDate);

    var banner =
      '<div id="ccBanner" class="cc-banner" hidden>' +
        '<div class="cc-inner" role="dialog" aria-live="polite" aria-label="הודעת קוקיז">' +
          '<div class="cc-text">' +
            escHtml(cfg.bannerText) + ' ' +
            '<a href="#" data-cc-open-privacy>' + escHtml(cfg.privacyLinkText) + '</a>' +
          '</div>' +
          '<div class="cc-actions">' +
            '<button id="ccAcceptBtn" class="cc-btn cc-btn-primary" type="button">' + escHtml(cfg.acceptText) + '</button>' +
            '<button class="cc-btn cc-btn-ghost" type="button" data-cc-open-privacy>' + escHtml(cfg.privacyBtnText) + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var modal =
      '<div id="ccModal" class="cc-modal" aria-hidden="true">' +
        '<div class="cc-panel" role="dialog" aria-modal="true" aria-label="מדיניות פרטיות">' +
          '<button id="ccCloseBtn" class="cc-close" type="button" aria-label="סגירה">✕</button>' +
          '<h2>מדיניות פרטיות</h2>' +
          '<p><small>עודכן לאחרונה: <span>' + date + '</span></small></p>' +

          '<h3>1. מי אנחנו</h3>' +
          '<p>אתר זה מופעל על ידי <strong>' + company + '</strong> ("אנחנו"). ' +
          'ליצירת קשר: <strong>' + email + '</strong> | <strong>' + phone + '</strong>.</p>' +

          '<h3>2. איזה מידע אנחנו אוספים</h3>' +
          '<ul>' +
            '<li><strong>מידע שתמסרו בטופס:</strong> לדוגמה שם, טלפון, אימייל ותוכן פנייה (לפי מה שקיים בטופס באתר).</li>' +
            '<li><strong>מידע טכני/סטטיסטי:</strong> נתוני שימוש כלליים (אם תופעל מדידה/פרסום כגון Google Analytics / Google Ads).</li>' +
          '</ul>' +

          '<h3>3. למה אנחנו משתמשים במידע</h3>' +
          '<ul>' +
            '<li>יצירת קשר בעקבות פנייה והשבת מענה.</li>' +
            '<li>תפעול האתר ושיפור חוויית המשתמש.</li>' +
            '<li>מדידה ושיווק (רק אם הופעלו כלי מדידה/פרסום).</li>' +
          '</ul>' +

          '<h3>4. שיתוף מידע עם צדדים שלישיים</h3>' +
          '<p>אנו עשויים להשתמש בספקי שירות לצורך תפעול האתר וטיפול בפניות, לדוגמה שירות אוטומציה (כגון Make), ' +
          'ושירותי מדידה/פרסום (כגון Google) ככל שהופעלו על ידינו.</p>' +

          '<h3>5. קוקיז וטכנולוגיות דומות</h3>' +
          '<p>קוקיז הם קבצים קטנים הנשמרים בדפדפן. אנו עשויים להשתמש בקוקיז הכרחיים לתפעול האתר, ' +
          'וקוקיז סטטיסטיים/שיווקיים רק אם הופעלו כלי מדידה/פרסום.</p>' +

          '<h3>6. אבטחת מידע</h3>' +
          '<p>אנו נוקטים אמצעים סבירים לאבטחת המידע (למשל שימוש ב-HTTPS והגנות בסיסיות על תהליכי שליחת טפסים). ' +
          'עם זאת, לא ניתן להבטיח אבטחה מוחלטת של המידע.</p>' +

          '<h3>7. שמירת מידע</h3>' +
          '<p>נשמור את המידע רק כל עוד נדרש לצורך הטיפול בפנייה/מתן שירות, או לפי דרישות הדין.</p>' +

   '<h3>8.  שינויים במדיניות</h3>' +
          '<p>מדיניות זו עשויה להשתנות מעת לעת בהתאם לעדכוני חוק וצרכים עסקיים.המועד האחרון לעדכון מופיע בראש המסמך. החברה תוכל לעדכן את מדיניות הפרטיות שלה מעת לעת ללא הודעה למשתמש. באפשרות המשתמש להיכנס לעמוד זה או לפנות אל החברה באמצעים המפורסמים על מנת לקבל מידע אודותיו ככל ויש.</p>' +


          '<h3>9. זכויות ופניות</h3>' +
          '<p>ניתן לפנות אלינו בבקשה לעיין/לתקן/למחוק מידע אישי, בכפוף לדין החל. יצירת קשר: <strong>' + email + '</strong>.</p>' +

          '<hr />' +
          '<p><small>לתשומת לבך, עצם השארת הפרטים שלך כמשתמש באתר דין מהווה הסכמה מפורשת לתנאי מדיניות הפרטיות של האתר. אנא קרא בעיון רב את התנאים החלים על פרטיותך.</small></p>' +
        '</div>' +
      '</div>';

    return banner + modal;
  }

  function openModal() {
    var m = qs('#ccModal');
    if (!m) return;
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    var closeBtn = qs('#ccCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var m = qs('#ccModal');
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
  }

  function showBanner() {
    var b = qs('#ccBanner');
    if (!b) return;
    b.hidden = false;
  }

  function hideBanner() {
    var b = qs('#ccBanner');
    if (!b) return;
    b.hidden = true;
  }

  function wireEvents() {
    var acceptBtn = qs('#ccAcceptBtn');
    var closeBtn = qs('#ccCloseBtn');
    var modal = qs('#ccModal');
    var links = qsa('[data-cc-open-privacy]');

    on(acceptBtn, 'click', function () {
      safeSet(LS_KEY, 'accepted');
      hideBanner();
    });

    for (var i = 0; i < links.length; i++) {
      (function (lnk) {
        on(lnk, 'click', function (e) {
          e.preventDefault();
          openModal();
        });
      })(links[i]);
    }

    on(closeBtn, 'click', function () { closeModal(); });

    on(modal, 'click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function init() {
    var cfg = getConfig();

    // Inject CSS once
    if (!qs('#ccStyles')) injectStyles(cfg);

    // Inject HTML once
    if (!qs('#ccBanner') && !qs('#ccModal')) {
      var wrap = document.createElement('div');
      wrap.id = 'ccRoot';
      wrap.innerHTML = buildHtml(cfg);
      document.body.appendChild(wrap);
    }

    // Wire events
    wireEvents();

    // Show/hide based on consent
    if (isAccepted()) hideBanner();
    else showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
