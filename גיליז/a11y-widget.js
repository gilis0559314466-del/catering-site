/* a11y-widget.js (ES5) - Drop-in */
(function () {
    function byId(id) { return document.getElementById(id); }
    function hasClass(el, c) { return el && el.classList && el.classList.contains(c); }
    function addClass(el, c) { if (el && el.classList && !hasClass(el, c)) el.classList.add(c); }
    function removeClass(el, c) { if (el && el.classList && hasClass(el, c)) el.classList.remove(c); }

    function safeGet(key, fallback) {
        try {
            var v = localStorage.getItem(key);
            return (v === null || v === undefined) ? fallback : v;
        } catch (e) { return fallback; }
    }
    function safeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { } }
    function safeDel(key) { try { localStorage.removeItem(key); } catch (e) { } }

    function onReady(fn) {
        // ---- MotionGate (soft stop for JS-driven motion) ----
        var MotionGate = (function () {
            var patched = false;
            var _setInterval, _setTimeout, _raf;
            var _clearInterval, _clearTimeout, _caf;

            function wrapCallback(fn) {
                return function () {
                    if (window.__A11Y_NO_MOTION__) return;
                    try { return fn.apply(this, arguments); } catch (e) { }
                };
            }

            function patchOnce() {
                if (patched) return;
                patched = true;

                _setInterval = window.setInterval;
                _clearInterval = window.clearInterval;
                _setTimeout = window.setTimeout;
                _clearTimeout = window.clearTimeout;

                _raf = window.requestAnimationFrame;
                _caf = window.cancelAnimationFrame;

                window.setInterval = function (fn, ms) {
                    if (typeof fn !== 'function') return _setInterval(fn, ms);
                    return _setInterval(wrapCallback(fn), ms);
                };

                window.setTimeout = function (fn, ms) {
                    if (typeof fn !== 'function') return _setTimeout(fn, ms);
                    return _setTimeout(wrapCallback(fn), ms);
                };

                if (typeof _raf === 'function') {
                    window.requestAnimationFrame = function (fn) {
                        if (typeof fn !== 'function') return _raf(fn);
                        return _raf(wrapCallback(fn));
                    };
                }

                if (typeof _caf === 'function') window.cancelAnimationFrame = _caf;
                window.clearInterval = _clearInterval;
                window.clearTimeout = _clearTimeout;
            }

            return { ensure: patchOnce };
        })();
        MotionGate.ensure();

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    // ---------- lang ----------
    function getLang() {
        var v = safeGet('a11yLang', '');
        if (v) return v;
        var docLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
        if (docLang.indexOf('en') === 0) return 'en';
        return 'he';
    }
    function setLang(v) { safeSet('a11yLang', v); }

    var I18N = {
        he: {
            title: 'נגישות',
            open: 'נגישות',
            close: 'סגור',

            secFont: 'טקסט',
            incFont: 'הגדלת כתב',
            decFont: 'הקטנת כתב',
            resetFont: 'איפוס כתב',
            fontStatusNormal: 'גודל כתב: רגיל',

            secZoom: 'מסך',
            zoomIn: 'זום +',
            zoomOut: 'זום -',
            zoomReset: 'איפוס זום',
            zoomStatusNormal: 'זום: רגיל',

            secTargets: 'לחצנים',
            targetsOn: 'הגדלת לחצנים',
            targetsOff: 'ביטול הגדלת לחצנים',
            targetsStatusOff: 'הגדלת לחצנים: כבוי',
            targetsStatusOn: 'הגדלת לחצנים: מופעל',

            secMotion: 'תנועה',
            motionOff: 'ביטול אנימציות',
            motionOn: 'הפעלת אנימציות',
            motionOnStatus: 'אנימציות: מופעלות',
            motionOffStatus: 'אנימציות: כבויות',

            secView: 'תצוגה',
            contrastOn: 'ניגודיות גבוהה',
            contrastOff: 'ביטול ניגודיות גבוהה',
            contrastStatusOff: 'ניגודיות: כבוי',
            contrastStatusOn: 'ניגודיות: מופעל',

            byOn: 'שחור-צהוב',
            byOff: 'ביטול שחור-צהוב',
            byStatusOff: 'שחור-צהוב: כבוי',
            byStatusOn: 'שחור-צהוב: מופעל',

            invertOn: 'היפוך צבעים',
            invertOff: 'ביטול היפוך צבעים',
            invertStatusOff: 'היפוך צבעים: כבוי',
            invertStatusOn: 'היפוך צבעים: מופעל',

            monoOn: 'שחור-לבן',
            monoOff: 'ביטול שחור-לבן',
            monoStatusOff: 'שחור-לבן: כבוי',
            monoStatusOn: 'שחור-לבן: מופעל',

            sepiaOn: 'ספיה',
            sepiaOff: 'ביטול ספיה',
            sepiaStatusOff: 'ספיה: כבוי',
            sepiaStatusOn: 'ספיה: מופעל',

            secSpacing: 'ריווח',
            spacing0: 'ריווח רגיל',
            spacing1: 'ריווח בינוני',
            spacing2: 'ריווח מוגבר',
            spacingStatus0: 'ריווח: רגיל',
            spacingStatus1: 'ריווח: בינוני',
            spacingStatus2: 'ריווח: מוגבר',

            secEmph: 'הדגשה',
            headingsOn: 'הדגש כותרות',
            headingsOff: 'ביטול הדגשת כותרות',
            headingsStatusOff: 'כותרות: רגיל',
            headingsStatusOn: 'כותרות: מודגש',

            linksOn: 'הדגש קישורים',
            linksOff: 'ביטול הדגשת קישורים',
            linksStatusOff: 'קישורים: רגיל',
            linksStatusOn: 'קישורים: מודגש',

            secImages: 'תמונות',
            altHoverOn: 'ALT בהצבעה',
            altHoverOff: 'ביטול ALT בהצבעה',
            altHoverStatusOff: 'ALT בהצבעה: כבוי',
            altHoverStatusOn: 'ALT בהצבעה: מופעל',

            altFixedOn: 'ALT קבוע מתחת לתמונה',
            altFixedOff: 'ביטול ALT קבוע',
            altFixedStatusOff: 'ALT קבוע: כבוי',
            altFixedStatusOn: 'ALT קבוע: מופעל',

            secFont2: 'קריאות',
            readableOn: 'פונט קריא',
            readableOff: 'ביטול פונט קריא',
            readableStatusOff: 'פונט קריא: כבוי',
            readableStatusOn: 'פונט קריא: מופעל',

            secCursor: 'סמן',
            cursorBig: 'סמן גדול',
            cursorBigBlack: 'סמן גדול שחור',
            cursorOff: 'איפוס סמן',
            cursorStatusOff: 'סמן: רגיל',
            cursorStatusOn: 'סמן: מוגדל',
            cursorStatusOnBlack: 'סמן: מוגדל שחור',

            secReading: 'קריאה',
            readingOn: 'מצב קריאת האתר',
            readingOff: 'ביטול מצב קריאה',
            readingStatusOff: 'מצב קריאה: כבוי',
            readingStatusOn: 'מצב קריאה: מופעל',

            secFocus: 'מיקוד קריאה',
            focusOn: 'הפעלת מיקוד קריאה',
            focusOff: 'ביטול מיקוד קריאה',
            focusBigger: 'הגדל חלון',
            focusSmaller: 'הקטן חלון',
            focusStatusOff: 'מיקוד קריאה: כבוי',
            focusStatusOn: 'מיקוד קריאה: מופעל',

            secMore: 'עוד',
            skipToContent: 'דילוג לתוכן',
            statement: 'הצהרת נגישות',
            feedback: 'שליחת משוב נגישות',
            resetAll: 'איפוס כל ההגדרות',

            secLang: 'שפה',
            langToggle: 'שינוי שפת הסרגל',
            langStatusHe: 'שפת סרגל: עברית',
            langStatusEn: 'שפת סרגל: English'
        },

        en: {
            title: 'Accessibility',
            open: 'A11y',
            close: 'Close',

            secFont: 'Text',
            incFont: 'Increase text',
            decFont: 'Decrease text',
            resetFont: 'Reset text',
            fontStatusNormal: 'Text size: normal',

            secZoom: 'Screen',
            zoomIn: 'Zoom +',
            zoomOut: 'Zoom -',
            zoomReset: 'Reset zoom',
            zoomStatusNormal: 'Zoom: normal',

            secTargets: 'Buttons',
            targetsOn: 'Larger buttons',
            targetsOff: 'Disable larger buttons',
            targetsStatusOff: 'Larger buttons: off',
            targetsStatusOn: 'Larger buttons: on',

            secMotion: 'Motion',
            motionOff: 'Disable animations',
            motionOn: 'Enable animations',
            motionOnStatus: 'Animations: on',
            motionOffStatus: 'Animations: off',

            secView: 'View',
            contrastOn: 'High contrast',
            contrastOff: 'Disable high contrast',
            contrastStatusOff: 'Contrast: off',
            contrastStatusOn: 'Contrast: on',

            byOn: 'Black/Yellow',
            byOff: 'Disable black/yellow',
            byStatusOff: 'Black/yellow: off',
            byStatusOn: 'Black/yellow: on',

            invertOn: 'Invert colors',
            invertOff: 'Disable invert',
            invertStatusOff: 'Invert: off',
            invertStatusOn: 'Invert: on',

            monoOn: 'Grayscale',
            monoOff: 'Disable grayscale',
            monoStatusOff: 'Grayscale: off',
            monoStatusOn: 'Grayscale: on',

            sepiaOn: 'Sepia',
            sepiaOff: 'Disable sepia',
            sepiaStatusOff: 'Sepia: off',
            sepiaStatusOn: 'Sepia: on',

            secSpacing: 'Spacing',
            spacing0: 'Default spacing',
            spacing1: 'Medium spacing',
            spacing2: 'Large spacing',
            spacingStatus0: 'Spacing: default',
            spacingStatus1: 'Spacing: medium',
            spacingStatus2: 'Spacing: large',

            secEmph: 'Emphasis',
            headingsOn: 'Highlight headings',
            headingsOff: 'Disable heading highlight',
            headingsStatusOff: 'Headings: normal',
            headingsStatusOn: 'Headings: highlighted',

            linksOn: 'Highlight links',
            linksOff: 'Disable link highlight',
            linksStatusOff: 'Links: normal',
            linksStatusOn: 'Links: highlighted',

            secImages: 'Images',
            altHoverOn: 'ALT on hover',
            altHoverOff: 'Disable ALT on hover',
            altHoverStatusOff: 'ALT hover: off',
            altHoverStatusOn: 'ALT hover: on',

            altFixedOn: 'ALT labels under images',
            altFixedOff: 'Disable ALT labels',
            altFixedStatusOff: 'ALT labels: off',
            altFixedStatusOn: 'ALT labels: on',

            secFont2: 'Readability',
            readableOn: 'Readable font',
            readableOff: 'Disable readable font',
            readableStatusOff: 'Readable font: off',
            readableStatusOn: 'Readable font: on',

            secCursor: 'Cursor',
            cursorBig: 'Big cursor',
            cursorBigBlack: 'Big black cursor',
            cursorOff: 'Reset cursor',
            cursorStatusOff: 'Cursor: normal',
            cursorStatusOn: 'Cursor: big',
            cursorStatusOnBlack: 'Cursor: big black',

            secReading: 'Reading mode',
            readingOn: 'Enable reading mode',
            readingOff: 'Disable reading mode',
            readingStatusOff: 'Reading mode: off',
            readingStatusOn: 'Reading mode: on',

            secFocus: 'Reading focus',
            focusOn: 'Enable reading focus',
            focusOff: 'Disable reading focus',
            focusBigger: 'Bigger window',
            focusSmaller: 'Smaller window',
            focusStatusOff: 'Reading focus: off',
            focusStatusOn: 'Reading focus: on',

            secMore: 'More',
            skipToContent: 'Skip to content',
            statement: 'Accessibility statement',
            feedback: 'Send accessibility feedback',
            resetAll: 'Reset all settings',

            secLang: 'Language',
            langToggle: 'Toggle toolbar language',
            langStatusHe: 'Toolbar: Hebrew',
            langStatusEn: 'Toolbar: English'
        }
    };

    function t(key) {
        var lang = getLang();
        var dict = I18N[lang] || I18N.he;
        return dict[key] || (I18N.he && I18N.he[key]) || key;
    }

    // ---------- markup ----------
    function ensureWidgetMarkup() {
        if (byId('fontOpenBtn')) return;

 var btn = document.createElement('button');
btn.id = 'fontOpenBtn';
btn.type = 'button';
btn.setAttribute('aria-haspopup', 'dialog');
btn.setAttribute('aria-controls', 'fontPanel');
btn.setAttribute('aria-label', t('open'));

btn.innerHTML =
  '<img data-uw-rm-ignore="" class="ui_w" role="presentation" alt="" ' +
  'src="https://cdn.userway.org/widgetapp/images/body_wh.svg">';


        var overlay = document.createElement('div');
        overlay.id = 'fontOverlay';
        overlay.hidden = true;

        var panel = document.createElement('aside');
        panel.id = 'fontPanel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', t('title'));
        panel.hidden = true;
overlay.hidden = true;
panel.hidden = true;

overlay.style.display = 'none';
panel.style.display = 'none';

        panel.innerHTML =
            '<div class="font-head">' +
            '  <h2 id="a11yTitle">' + t('title') + '</h2>' +
            '  <button id="fontCloseBtn" type="button" aria-label="' + t('close') + '">✕</button>' +
            '</div>' +
            '<div class="font-body">' +

            '  <div class="section-title" id="secFont">' + t('secFont') + '</div>' +
            '  <button type="button" id="fontIncBtn">' + t('incFont') + '</button>' +
            '  <button type="button" id="fontDecBtn">' + t('decFont') + '</button>' +
            '  <button type="button" id="fontResetBtn" class="a11y-primary">' + t('resetFont') + '</button>' +
            '  <div id="fontStatus" aria-live="polite">' + t('fontStatusNormal') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secZoom">' + t('secZoom') + '</div>' +
            '  <button type="button" id="zoomInBtn">' + t('zoomIn') + '</button>' +
            '  <button type="button" id="zoomOutBtn">' + t('zoomOut') + '</button>' +
            '  <button type="button" id="zoomResetBtn" class="a11y-primary">' + t('zoomReset') + '</button>' +
            '  <div id="zoomStatus" aria-live="polite">' + t('zoomStatusNormal') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secTargets">' + t('secTargets') + '</div>' +
            '  <button type="button" id="targetsToggleBtn" aria-pressed="false">' + t('targetsOn') + '</button>' +
            '  <div id="targetsStatus" aria-live="polite">' + t('targetsStatusOff') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secMotion">' + t('secMotion') + '</div>' +
            '  <button type="button" id="motionToggleBtn">' + t('motionOff') + '</button>' +
            '  <div id="motionStatus" aria-live="polite">' + t('motionOnStatus') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secView">' + t('secView') + '</div>' +
            '  <button type="button" id="contrastToggleBtn">' + t('contrastOn') + '</button>' +
            '  <div id="contrastStatus" aria-live="polite">' + t('contrastStatusOff') + '</div>' +

            '  <button type="button" id="byToggleBtn">' + t('byOn') + '</button>' +
            '  <div id="byStatus" aria-live="polite">' + t('byStatusOff') + '</div>' +

            '  <button type="button" id="invertToggleBtn">' + t('invertOn') + '</button>' +
            '  <div id="invertStatus" aria-live="polite">' + t('invertStatusOff') + '</div>' +

            '  <button type="button" id="monoToggleBtn">' + t('monoOn') + '</button>' +
            '  <div id="monoStatus" aria-live="polite">' + t('monoStatusOff') + '</div>' +

            '  <button type="button" id="sepiaToggleBtn">' + t('sepiaOn') + '</button>' +
            '  <div id="sepiaStatus" aria-live="polite">' + t('sepiaStatusOff') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secSpacing">' + t('secSpacing') + '</div>' +
            '  <button type="button" id="spacing0Btn">' + t('spacing0') + '</button>' +
            '  <button type="button" id="spacing1Btn">' + t('spacing1') + '</button>' +
            '  <button type="button" id="spacing2Btn">' + t('spacing2') + '</button>' +
            '  <div id="spacingStatus" aria-live="polite">' + t('spacingStatus0') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secEmph">' + t('secEmph') + '</div>' +
            '  <button type="button" id="headingsToggleBtn">' + t('headingsOn') + '</button>' +
            '  <div id="headingsStatus" aria-live="polite">' + t('headingsStatusOff') + '</div>' +
            '  <button type="button" id="linksToggleBtn">' + t('linksOn') + '</button>' +
            '  <div id="linksStatus" aria-live="polite">' + t('linksStatusOff') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secImages">' + t('secImages') + '</div>' +
            '  <button type="button" id="altHoverToggleBtn">' + t('altHoverOn') + '</button>' +
            '  <div id="altHoverStatus" aria-live="polite">' + t('altHoverStatusOff') + '</div>' +
            '  <button type="button" id="altFixedToggleBtn">' + t('altFixedOn') + '</button>' +
            '  <div id="altFixedStatus" aria-live="polite">' + t('altFixedStatusOff') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secFont2">' + t('secFont2') + '</div>' +
            '  <button type="button" id="readableFontToggleBtn">' + t('readableOn') + '</button>' +
            '  <div id="readableFontStatus" aria-live="polite">' + t('readableStatusOff') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secCursor">' + t('secCursor') + '</div>' +
            '  <button type="button" id="cursorBigBtn">' + t('cursorBig') + '</button>' +
            '  <button type="button" id="cursorBigBlackBtn">' + t('cursorBigBlack') + '</button>' +
            '  <button type="button" id="cursorResetBtn" class="a11y-primary">' + t('cursorOff') + '</button>' +
            '  <div id="cursorStatus" aria-live="polite">' + t('cursorStatusOff') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secReading">' + t('secReading') + '</div>' +
            '  <button type="button" id="readingToggleBtn">' + t('readingOn') + '</button>' +
            '  <div id="readingStatus" aria-live="polite">' + t('readingStatusOff') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secFocus">' + t('secFocus') + '</div>' +
            '  <button type="button" id="focusToggleBtn" aria-pressed="false">' + t('focusOn') + '</button>' +
            '  <div style="display:flex; gap:10px;">' +
            '    <button type="button" id="focusBiggerBtn" class="a11y-primary">' + t('focusBigger') + '</button>' +
            '    <button type="button" id="focusSmallerBtn" class="a11y-primary">' + t('focusSmaller') + '</button>' +
            '  </div>' +
            '  <div id="focusStatus" aria-live="polite">' + t('focusStatusOff') + '</div>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secMore">' + t('secMore') + '</div>' +
            '  <button type="button" id="skipBtn">' + t('skipToContent') + '</button>' +
            '  <button type="button" id="statementBtn">' + t('statement') + '</button>' +
            '  <button type="button" id="feedbackBtn">' + t('feedback') + '</button>' +
            '  <button type="button" id="resetAllBtn" class="a11y-danger">' + t('resetAll') + '</button>' +

            '  <hr class="sep">' +

            '  <div class="section-title" id="secLang">' + t('secLang') + '</div>' +
            '  <button type="button" id="langToggleBtn">' + t('langToggle') + '</button>' +
            '  <div id="langStatus" aria-live="polite">' + (getLang() === 'en' ? t('langStatusEn') : t('langStatusHe')) + '</div>' +

            '</div>';

        document.body.appendChild(btn);
        document.body.appendChild(overlay);
        document.body.appendChild(panel);
    }

    // ---------- Zoom wrap ----------
    function ensureZoomWrap() {
        var zoomWrap = byId('zoomWrap');
        if (zoomWrap) return zoomWrap;

        zoomWrap = document.createElement('div');
        zoomWrap.id = 'zoomWrap';

var keepIds = {
  fontOpenBtn: true,
  fontOverlay: true,
  fontPanel: true,
  a11ySkipLink: true,
  floatingBtn: true,
  floatingBtn2: true,

  /* חשוב: להשאיר מחוץ ל-zoomWrap כדי שלא יישבר fixed/מיקום/לחיצות */
  lightbox: true,
  "img-pop": true,
  "summary-popup": true,
  privacyModal: true,
  cookieBanner: true
};
        var nodes = [];
        for (var i = 0; i < document.body.childNodes.length; i++) {
            var n = document.body.childNodes[i];
            if (n.nodeType === 1 && keepIds[n.id]) continue;
            nodes.push(n);
        }

        var openBtn = byId('fontOpenBtn');
        document.body.insertBefore(zoomWrap, openBtn);

        for (i = 0; i < nodes.length; i++) zoomWrap.appendChild(nodes[i]);

        zoomWrap.style.transformOrigin = 'top center';
        return zoomWrap;
    }

    // ---------- Skip to content (auto target) ----------
    function findMainTarget() {
        var wrap = byId('zoomWrap') || document.body;
        var main = wrap.querySelector('main') || wrap.querySelector('[role="main"]') || wrap.querySelector('#main') || wrap.querySelector('#content');
        if (main) return main;

        // heuristic: pick the largest visible section-like element
        var candidates = wrap.querySelectorAll('main, section, article, [role="main"], [role="region"], .content, #content, #main');
        var best = null, bestArea = 0;
        for (var i = 0; i < candidates.length; i++) {
            var el = candidates[i];
            if (!el || el.closest && el.closest('#fontPanel')) continue;
            var r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
            if (!r) continue;
            var area = Math.max(0, r.width) * Math.max(0, r.height);
            if (area > bestArea) { best = el; bestArea = area; }
        }
        return best || wrap;
    }

    function ensureSkipLink() {
        if (byId('a11ySkipLink')) return;
        var a = document.createElement('a');
        a.id = 'a11ySkipLink';
        a.href = '#';
        a.textContent = (getLang() === 'en') ? 'Skip to content' : 'דילוג לתוכן';
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var target = findMainTarget();
            try { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } catch (_) { }
            try { target.scrollIntoView({ block: 'start' }); } catch (_) { try { target.scrollIntoView(true); } catch (__) { } }
        });
        document.body.insertBefore(a, document.body.firstChild);
    }

    // ---------- Panel open/close + focus trap + arrow navigation ----------
    function initPanel() {
        var openBtn = byId('fontOpenBtn');
        var panel = byId('fontPanel');
        var overlay = byId('fontOverlay');
        var closeBtn = byId('fontCloseBtn');
        if (!openBtn || !panel || !overlay || !closeBtn) return;

        function focusables() {
            return panel.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
        }

        function open() {
            panel.hidden = false;
            overlay.hidden = false;

            // fallback נגד CSS שמבטל hidden
            panel.style.display = 'block';
            overlay.style.display = 'block';

            closeBtn.focus();
        }

        function close() {
            panel.hidden = true;
            overlay.hidden = true;

            // fallback נגד CSS שמבטל hidden
            panel.style.display = 'none';
            overlay.style.display = 'none';

            openBtn.focus();
        }


       openBtn.addEventListener('click', open);

closeBtn.addEventListener('click', function(e){
  e.preventDefault();
  e.stopPropagation();
  close();
});

overlay.addEventListener('click', function(e){
  e.preventDefault();
  e.stopPropagation();
  close();
});


        document.addEventListener('keydown', function (e) {
            if (panel.hidden) return;

            if (e.key === 'Escape') { close(); return; }

            // Focus trap with Tab
            if (e.key === 'Tab') {
                var list = focusables();
                if (!list || !list.length) return;
                var first = list[0], last = list[list.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
                return;
            }

            // Arrow navigation between buttons
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                var f = focusables();
                if (!f || !f.length) return;
                var idx = -1;
                for (var i = 0; i < f.length; i++) if (f[i] === document.activeElement) { idx = i; break; }
                if (idx === -1) return;
                e.preventDefault();
                var next = (e.key === 'ArrowDown') ? (idx + 1) : (idx - 1);
                if (next < 0) next = f.length - 1;
                if (next >= f.length) next = 0;
                f[next].focus();
            }
        });
    }

    // ---------- Font size ----------
    function initFontSize() {
        var html = document.documentElement;
        function getBasePx() {
            var css = window.getComputedStyle(html).fontSize;
            var n = parseFloat(css);
            return isNaN(n) ? 16 : n;
        }

        var originalPx = (function () {
            var savedOriginal = parseFloat(safeGet('a11yOriginalFontPx', 'NaN'));
            if (!isNaN(savedOriginal)) return savedOriginal;
            var n = getBasePx();
            safeSet('a11yOriginalFontPx', String(n));
            return n;
        })();

        function getCurrentFontPx() {
            var saved = parseFloat(safeGet('a11yCurrentFontPx', 'NaN'));
            if (!isNaN(saved)) return saved;
            return getBasePx();
        }

        function updateFontStatus(px) {
            var el = byId('fontStatus');
            if (!el) return;
            var ratio = px / originalPx;
            if (Math.abs(ratio - 1) < 0.01) el.textContent = t('fontStatusNormal');
            else el.textContent = (getLang() === 'en')
                ? ('Font size: ' + Math.round(ratio * 100) + '%')
                : ('גודל כתב: ' + Math.round(ratio * 100) + '%');
        }

        function setCurrentFontPx(px) {
            if (px < 12) px = 12;
            if (px > 28) px = 28;
            html.style.fontSize = px + 'px';
            safeSet('a11yCurrentFontPx', String(px));
            updateFontStatus(px);
        }

        setCurrentFontPx(getCurrentFontPx());

        var inc = byId('fontIncBtn');
        var dec = byId('fontDecBtn');
        var reset = byId('fontResetBtn');

        if (inc) inc.addEventListener('click', function () { setCurrentFontPx(getCurrentFontPx() + 1); });
        if (dec) dec.addEventListener('click', function () { setCurrentFontPx(getCurrentFontPx() - 1); });
        if (reset) reset.addEventListener('click', function () {
            html.style.fontSize = originalPx + 'px';
            safeSet('a11yCurrentFontPx', String(originalPx));
            updateFontStatus(originalPx);
        });
    }

    // ---------- Screen zoom ----------
    function initScreenZoom() {
        var zoomWrap = ensureZoomWrap();

        function getZoom() {
            var z = parseFloat(safeGet('a11yScreenZoom', '1'));
            return isNaN(z) ? 1 : z;
        }

        function setZoom(z) {
            if (z < 0.7) z = 0.7;
            if (z > 2) z = 2;

            zoomWrap.style.transform = 'scale(' + z.toFixed(2) + ')';
            zoomWrap.style.width = (100 / z).toFixed(2) + '%';
            zoomWrap.style.minHeight = (100 / z).toFixed(2) + 'vh';

            safeSet('a11yScreenZoom', String(z.toFixed(2)));
            var el = byId('zoomStatus');
            if (el) el.textContent = (Math.abs(z - 1) < 0.01)
                ? t('zoomStatusNormal')
                : ((getLang() === 'en') ? ('Zoom: ' + Math.round(z * 100) + '%') : ('זום: ' + Math.round(z * 100) + '%'));
        }

        setZoom(getZoom());

        var inBtn = byId('zoomInBtn');
        var outBtn = byId('zoomOutBtn');
        var resetBtn = byId('zoomResetBtn');

        if (inBtn) inBtn.addEventListener('click', function () { setZoom(getZoom() + 0.1); });
        if (outBtn) outBtn.addEventListener('click', function () { setZoom(getZoom() - 0.1); });
        if (resetBtn) resetBtn.addEventListener('click', function () { setZoom(1); });
    }

    // ---------- No motion ----------
    function initNoMotion() {
        var html = document.documentElement;
        var btn = byId('motionToggleBtn');
        var status = byId('motionStatus');
        if (!btn) return;

        function apply(on) {
            window.__A11Y_NO_MOTION__ = !!on;
            if (on) addClass(html, 'a11y-no-motion');
            else removeClass(html, 'a11y-no-motion');

            safeSet('a11yNoMotion', on ? '1' : '0');
            btn.textContent = on ? t('motionOn') : t('motionOff');
            if (status) status.textContent = on ? t('motionOffStatus') : t('motionOnStatus');
        }

        apply(safeGet('a11yNoMotion', '0') === '1');
        btn.addEventListener('click', function () { apply(!hasClass(html, 'a11y-no-motion')); });
    }

    // ---------- View toggles (exclusive) ----------
    var VIEW_CLASSES = ['a11y-mono', 'a11y-sepia', 'a11y-hc', 'a11y-invert', 'a11y-blackyellow'];
function clearViewClasses(html) {
  for (var i = 0; i < VIEW_CLASSES.length; i++) removeClass(html, VIEW_CLASSES[i]);
}


    function clearViewModes(html) {
clearViewClasses(html);
        safeSet('a11yMono', '0'); safeSet('a11ySepia', '0'); safeSet('a11yContrast', '0'); safeSet('a11yInvert', '0'); safeSet('a11yBlackYellow', '0');
    }

    function initViewToggles() {
        var html = document.documentElement;

        function refresh() {
            var isContrast = hasClass(html, 'a11y-hc');
            var isBy = hasClass(html, 'a11y-blackyellow');
            var isInvert = hasClass(html, 'a11y-invert');
            var isMono = hasClass(html, 'a11y-mono');
            var isSepia = hasClass(html, 'a11y-sepia');

            var contrastBtn = byId('contrastToggleBtn');
            var contrastStatus = byId('contrastStatus');
            var byBtn = byId('byToggleBtn');
            var byStatus = byId('byStatus');
            var invertBtn = byId('invertToggleBtn');
            var invertStatus = byId('invertStatus');
            var monoBtn = byId('monoToggleBtn');
            var monoStatus = byId('monoStatus');
            var sepiaBtn = byId('sepiaToggleBtn');
            var sepiaStatus = byId('sepiaStatus');

            if (contrastBtn) contrastBtn.textContent = isContrast ? t('contrastOff') : t('contrastOn');
            if (contrastStatus) contrastStatus.textContent = isContrast ? t('contrastStatusOn') : t('contrastStatusOff');

            if (byBtn) byBtn.textContent = isBy ? t('byOff') : t('byOn');
            if (byStatus) byStatus.textContent = isBy ? t('byStatusOn') : t('byStatusOff');

            if (invertBtn) invertBtn.textContent = isInvert ? t('invertOff') : t('invertOn');
            if (invertStatus) invertStatus.textContent = isInvert ? t('invertStatusOn') : t('invertStatusOff');

            if (monoBtn) monoBtn.textContent = isMono ? t('monoOff') : t('monoOn');
            if (monoStatus) monoStatus.textContent = isMono ? t('monoStatusOn') : t('monoStatusOff');

            if (sepiaBtn) sepiaBtn.textContent = isSepia ? t('sepiaOff') : t('sepiaOn');
            if (sepiaStatus) sepiaStatus.textContent = isSepia ? t('sepiaStatusOn') : t('sepiaStatusOff');
        }

        // restore saved (priority can be handled by whichever is set last; we keep exclusive by clearing first)
     clearViewClasses(html);

        if (safeGet('a11yBlackYellow', '0') === '1') addClass(html, 'a11y-blackyellow');
        else if (safeGet('a11yInvert', '0') === '1') addClass(html, 'a11y-invert');
        else if (safeGet('a11yContrast', '0') === '1') addClass(html, 'a11y-hc');
        else if (safeGet('a11ySepia', '0') === '1') addClass(html, 'a11y-sepia');
        else if (safeGet('a11yMono', '0') === '1') addClass(html, 'a11y-mono');

        refresh();

        function toggle(mode) {
            var on = hasClass(html, mode);
            clearViewModes(html);
            if (!on) {
                addClass(html, mode);
                if (mode === 'a11y-mono') safeSet('a11yMono', '1');
                if (mode === 'a11y-sepia') safeSet('a11ySepia', '1');
                if (mode === 'a11y-hc') safeSet('a11yContrast', '1');
                if (mode === 'a11y-invert') safeSet('a11yInvert', '1');
                if (mode === 'a11y-blackyellow') safeSet('a11yBlackYellow', '1');
            }
            refresh();
        }

        var contrastBtn = byId('contrastToggleBtn');
        var byBtn = byId('byToggleBtn');
        var invertBtn = byId('invertToggleBtn');
        var monoBtn = byId('monoToggleBtn');
        var sepiaBtn = byId('sepiaToggleBtn');

        if (contrastBtn) contrastBtn.addEventListener('click', function () { toggle('a11y-hc'); });
        if (byBtn) byBtn.addEventListener('click', function () { toggle('a11y-blackyellow'); });
        if (invertBtn) invertBtn.addEventListener('click', function () { toggle('a11y-invert'); });
        if (monoBtn) monoBtn.addEventListener('click', function () { toggle('a11y-mono'); });
        if (sepiaBtn) sepiaBtn.addEventListener('click', function () { toggle('a11y-sepia'); });
    }

    // ---------- Spacing ----------
    function initSpacing() {
        var html = document.documentElement;
        var s = byId('spacingStatus');

        function apply(level) {
            removeClass(html, 'a11y-spacing-1');
            removeClass(html, 'a11y-spacing-2');
            if (level === 1) addClass(html, 'a11y-spacing-1');
            if (level === 2) addClass(html, 'a11y-spacing-2');

            safeSet('a11ySpacing', String(level));

            if (!s) return;
            if (level === 1) s.textContent = t('spacingStatus1');
            else if (level === 2) s.textContent = t('spacingStatus2');
            else s.textContent = t('spacingStatus0');
        }

        apply(parseInt(safeGet('a11ySpacing', '0'), 10) || 0);

        var b0 = byId('spacing0Btn');
        var b1 = byId('spacing1Btn');
        var b2 = byId('spacing2Btn');
        if (b0) b0.addEventListener('click', function () { apply(0); });
        if (b1) b1.addEventListener('click', function () { apply(1); });
        if (b2) b2.addEventListener('click', function () { apply(2); });
    }

    // ---------- Highlights ----------
    function initHighlights() {
        var html = document.documentElement;

        function applyHeadings(on) {
            if (on) addClass(html, 'a11y-hl-headings'); else removeClass(html, 'a11y-hl-headings');
            safeSet('a11yHlHeadings', on ? '1' : '0');
            var b = byId('headingsToggleBtn');
            var st = byId('headingsStatus');
            if (b) b.textContent = on ? t('headingsOff') : t('headingsOn');
            if (st) st.textContent = on ? t('headingsStatusOn') : t('headingsStatusOff');
        }

        function applyLinks(on) {
            if (on) addClass(html, 'a11y-hl-links'); else removeClass(html, 'a11y-hl-links');
            safeSet('a11yHlLinks', on ? '1' : '0');
            var b = byId('linksToggleBtn');
            var st = byId('linksStatus');
            if (b) b.textContent = on ? t('linksOff') : t('linksOn');
            if (st) st.textContent = on ? t('linksStatusOn') : t('linksStatusOff');
        }

        applyHeadings(safeGet('a11yHlHeadings', '0') === '1');
        applyLinks(safeGet('a11yHlLinks', '0') === '1');

        var bh = byId('headingsToggleBtn');
        var bl = byId('linksToggleBtn');
        if (bh) bh.addEventListener('click', function () { applyHeadings(!hasClass(html, 'a11y-hl-headings')); });
        if (bl) bl.addEventListener('click', function () { applyLinks(!hasClass(html, 'a11y-hl-links')); });
    }

    // ---------- ALT modes ----------
    function initAltModes() {
        function allImages() {
            var wrap = byId('zoomWrap') || document.body;
            try { return wrap.querySelectorAll('img'); } catch (e) { return []; }
        }

        function applyAltHover(on) {
            var imgs = allImages();
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                if (!img) continue;
                var alt = img.getAttribute('alt') || '';
                if (!alt) continue;

                if (on) {
                    if (!img.getAttribute('data-a11y-old-title')) img.setAttribute('data-a11y-old-title', img.getAttribute('title') || '');
                    img.setAttribute('title', alt);
                } else {
                    var old = img.getAttribute('data-a11y-old-title');
                    img.setAttribute('title', old || '');
                    img.removeAttribute('data-a11y-old-title');
                }
            }

            safeSet('a11yAltHover', on ? '1' : '0');
            var b = byId('altHoverToggleBtn');
            var st = byId('altHoverStatus');
            if (b) b.textContent = on ? t('altHoverOff') : t('altHoverOn');
            if (st) st.textContent = on ? t('altHoverStatusOn') : t('altHoverStatusOff');
        }

        function removeAllAltLabels() {
            var wrap = byId('zoomWrap') || document.body;
            var labels = wrap.querySelectorAll('[data-a11y-alt-label="1"]');
            for (var j = 0; j < labels.length; j++) {
                if (labels[j] && labels[j].parentNode) labels[j].parentNode.removeChild(labels[j]);
            }
        }

        function applyAltFixed(on) {
            if (!on) removeAllAltLabels();

            var imgs = allImages();
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                var alt = img.getAttribute('alt') || '';
                if (!alt) continue;

                var next = img.nextSibling;
                var hasLabel = next && next.nodeType === 1 && next.getAttribute && next.getAttribute('data-a11y-alt-label') === '1';

                if (on) {
                    if (!hasLabel) {
                        var label = document.createElement('span');
                        label.className = 'a11y-alt-label';
                        label.setAttribute('data-a11y-alt-label', '1');
                        label.textContent = alt;
                        if (img.parentNode) img.parentNode.insertBefore(label, img.nextSibling);
                    }
                } else {
                    if (hasLabel && next.parentNode) next.parentNode.removeChild(next);
                }
            }

            safeSet('a11yAltFixed', on ? '1' : '0');
            var b = byId('altFixedToggleBtn');
            var st = byId('altFixedStatus');
            if (b) b.textContent = on ? t('altFixedOff') : t('altFixedOn');
            if (st) st.textContent = on ? t('altFixedStatusOn') : t('altFixedStatusOff');
        }

        applyAltHover(safeGet('a11yAltHover', '0') === '1');
        applyAltFixed(safeGet('a11yAltFixed', '0') === '1');

        var bh = byId('altHoverToggleBtn');
        var bf = byId('altFixedToggleBtn');
        if (bh) bh.addEventListener('click', function () { applyAltHover(safeGet('a11yAltHover', '0') !== '1'); });
        if (bf) bf.addEventListener('click', function () { applyAltFixed(safeGet('a11yAltFixed', '0') !== '1'); });
    }

    // ---------- Readable font ----------
    function initReadableFont() {
        var html = document.documentElement;
        function apply(on) {
            if (on) addClass(html, 'a11y-readable-font'); else removeClass(html, 'a11y-readable-font');
            safeSet('a11yReadableFont', on ? '1' : '0');
            var b = byId('readableFontToggleBtn');
            var st = byId('readableFontStatus');
            if (b) b.textContent = on ? t('readableOff') : t('readableOn');
            if (st) st.textContent = on ? t('readableStatusOn') : t('readableStatusOff');
        }
        apply(safeGet('a11yReadableFont', '0') === '1');
        var b = byId('readableFontToggleBtn');
        if (b) b.addEventListener('click', function () { apply(!hasClass(html, 'a11y-readable-font')); });
    }

    // ---------- Cursor ----------
    function initCursor() {
        var html = document.documentElement;

        function setStatus(mode) {
            var st = byId('cursorStatus');
            if (!st) return;
            if (mode === 'bigBlack') st.textContent = t('cursorStatusOnBlack');
            else if (mode === 'big') st.textContent = t('cursorStatusOn');
            else st.textContent = t('cursorStatusOff');
        }

        function apply(mode) {
            removeClass(html, 'a11y-cursor-big');
            removeClass(html, 'a11y-cursor-big-black');
            if (mode === 'big') addClass(html, 'a11y-cursor-big');
            if (mode === 'bigBlack') addClass(html, 'a11y-cursor-big-black');
            safeSet('a11yCursor', mode || 'off');
            setStatus(mode);
        }

        apply(safeGet('a11yCursor', 'off'));
        var big = byId('cursorBigBtn');
        var bigBlack = byId('cursorBigBlackBtn');
        var reset = byId('cursorResetBtn');
        if (big) big.addEventListener('click', function () { apply('big'); });
        if (bigBlack) bigBlack.addEventListener('click', function () { apply('bigBlack'); });
        if (reset) reset.addEventListener('click', function () { apply('off'); });
    }

    // ---------- Reading mode ----------
    function initReadingMode() {
        var html = document.documentElement;

        function apply(on) {
            if (on) addClass(html, 'a11y-reading'); else removeClass(html, 'a11y-reading');
            safeSet('a11yReading', on ? '1' : '0');
            var b = byId('readingToggleBtn');
            var st = byId('readingStatus');
            if (b) b.textContent = on ? t('readingOff') : t('readingOn');
            if (st) st.textContent = on ? t('readingStatusOn') : t('readingStatusOff');
        }

        apply(safeGet('a11yReading', '0') === '1');
        var b = byId('readingToggleBtn');
        if (b) b.addEventListener('click', function () { apply(!hasClass(html, 'a11y-reading')); });
    }

    // ---------- Target size ----------
    function initTargetSize() {
        var wrap = byId('zoomWrap');
        var btn = byId('targetsToggleBtn');
        var status = byId('targetsStatus');
        if (!wrap || !btn) return;

        function isHidden(el) {
            if (!el || el.nodeType !== 1) return true;
            if (el.disabled) return true;
            if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') return true;
            if (el.hidden) return true;
            var cs;
            try { cs = window.getComputedStyle(el); } catch (e) { cs = null; }
            if (cs) { if (cs.display === 'none' || cs.visibility === 'hidden') return true; }
            var r = el.getBoundingClientRect();
            if (!r || r.width <= 0 || r.height <= 0) return true;
            return false;
        }

        function isInteractive(el) {
            if (!el || el.nodeType !== 1) return false;
            var tag = (el.tagName || '').toLowerCase();
            if (tag === 'button') return true;
            if (tag === 'a' && el.getAttribute('href')) return true;
            if (tag === 'input' || tag === 'select' || tag === 'textarea') return true;
            var role = el.getAttribute('role');
            if (role === 'button') return true;
            var tabindex = el.getAttribute('tabindex');
            if (tabindex !== null && tabindex !== '-1') return true;
            return false;
        }

        function mark(el) {
            if (!el || el.nodeType !== 1) return;
            if (el.getAttribute('data-a11y-target-checked') === '1') return;
            el.setAttribute('data-a11y-target-checked', '1');

            if (isHidden(el) || !isInteractive(el)) return;

            var r = el.getBoundingClientRect();
            if (!r) return;
            if (r.width >= 44 && r.height >= 44) return;

            addClass(el, 'a11y-target-fix');
        }

        function scanRoot(root) {
            if (!root || root.nodeType !== 1) return;
            if (isInteractive(root)) mark(root);
            var sel = 'button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
            var list;
            try { list = root.querySelectorAll(sel); } catch (e) { list = []; }
            for (var i = 0; i < list.length; i++) mark(list[i]);
        }

        function clearAll() {
            var list;
            try { list = wrap.querySelectorAll('.a11y-target-fix'); } catch (e) { list = []; }
            for (var i = 0; i < list.length; i++) removeClass(list[i], 'a11y-target-fix');

            var checked;
            try { checked = wrap.querySelectorAll('[data-a11y-target-checked="1"]'); } catch (e) { checked = []; }
            for (var j = 0; j < checked.length; j++) checked[j].removeAttribute('data-a11y-target-checked');
        }

        function setUI(on) {
            btn.textContent = on ? t('targetsOff') : t('targetsOn');
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (status) status.textContent = on ? t('targetsStatusOn') : t('targetsStatusOff');
        }

        function apply(on) {
            if (on) { scanRoot(wrap); safeSet('a11yTargetSize', '1'); }
            else { clearAll(); safeSet('a11yTargetSize', '0'); }
            setUI(on);
        }

        apply(safeGet('a11yTargetSize', '0') === '1');
        btn.addEventListener('click', function () { apply(safeGet('a11yTargetSize', '0') !== '1'); });
    }

    // ---------- Reading focus ----------
    function initReadingFocus() {
        var btn = byId('focusToggleBtn');
        var biggerBtn = byId('focusBiggerBtn');
        var smallerBtn = byId('focusSmallerBtn');
        var status = byId('focusStatus');
        if (!btn) return;

        var enabled = safeGet('a11yFocusOn', '0') === '1';
        var height = parseInt(safeGet('a11yFocusHeight', '160'), 10);
        if (isNaN(height)) height = 160;
        height = Math.max(90, Math.min(360, height));

        var yCenter = parseInt(safeGet('a11yFocusY', '0'), 10);
        if (isNaN(yCenter) || yCenter <= 0) yCenter = Math.round(window.innerHeight / 2);

        var maskEl = null;
        var winEl = null;

        function ensureMask() {
            if (maskEl && winEl) return;
            maskEl = document.createElement('div');
            maskEl.id = 'a11yFocusMask';
            winEl = document.createElement('div');
            winEl.id = 'a11yFocusWindow';
            document.body.appendChild(maskEl);
            document.body.appendChild(winEl);
        }

        function clamp(v, min, max) { return v < min ? min : (v > max ? max : v); }

        function positionWindow() {
            if (!winEl) return;
            var top = Math.round(yCenter - (height / 2));
            top = clamp(top, 0, Math.max(0, window.innerHeight - height));
            winEl.style.top = top + 'px';
            winEl.style.height = height + 'px';
        }

        function setUI(on) {
            btn.textContent = on ? t('focusOff') : t('focusOn');
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (status) status.textContent = on ? (t('focusStatusOn') + ' (' + height + 'px)') : t('focusStatusOff');
            if (biggerBtn) biggerBtn.disabled = !on;
            if (smallerBtn) smallerBtn.disabled = !on;
        }

        function onMouseMove(e) {
            if (!enabled) return;
            yCenter = e.clientY;
            positionWindow();
            safeSet('a11yFocusY', String(yCenter));
        }

        function onKeyDown(e) {
            if (!enabled) return;
            if (e.key === 'Escape') { apply(false); return; }
            if (e.key === 'ArrowUp') {
                yCenter = clamp(yCenter - 20, 0, window.innerHeight);
                positionWindow();
                safeSet('a11yFocusY', String(yCenter));
            } else if (e.key === 'ArrowDown') {
                yCenter = clamp(yCenter + 20, 0, window.innerHeight);
                positionWindow();
                safeSet('a11yFocusY', String(yCenter));
            }
        }

        function attach() {
            document.addEventListener('mousemove', onMouseMove, true);
            document.addEventListener('keydown', onKeyDown, true);
            window.addEventListener('resize', positionWindow);
        }

        function detach() {
            document.removeEventListener('mousemove', onMouseMove, true);
            document.removeEventListener('keydown', onKeyDown, true);
            window.removeEventListener('resize', positionWindow);
        }

        function apply(on) {
            enabled = !!on;
            safeSet('a11yFocusOn', enabled ? '1' : '0');
            if (enabled) {
                ensureMask();
                positionWindow();
                if (maskEl) maskEl.style.display = 'block';
                if (winEl) winEl.style.display = 'block';
                attach();
            } else {
                detach();
                if (maskEl) maskEl.style.display = 'none';
                if (winEl) winEl.style.display = 'none';
            }
            setUI(enabled);
        }

        if (biggerBtn) biggerBtn.addEventListener('click', function () {
            if (!enabled) return;
            height = clamp(height + 20, 90, 360);
            safeSet('a11yFocusHeight', String(height));
            positionWindow();
            setUI(true);
        });
        if (smallerBtn) smallerBtn.addEventListener('click', function () {
            if (!enabled) return;
            height = clamp(height - 20, 90, 360);
            safeSet('a11yFocusHeight', String(height));
            positionWindow();
            setUI(true);
        });

        btn.addEventListener('click', function () { apply(!enabled); });
        apply(enabled);
    }

    // ---------- Skip button inside panel ----------
    function initSkipButton() {
        var b = byId('skipBtn');
        if (!b) return;
        b.addEventListener('click', function () {
            var target = findMainTarget();
            try { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } catch (_) { }
            try { target.scrollIntoView({ block: 'start' }); } catch (_) { try { target.scrollIntoView(true); } catch (__) { } }
        });
    }

    // ---------- Statement + feedback ----------
    function initStatementAndFeedback() {
        var statementBtn = byId('statementBtn');
        var feedbackBtn = byId('feedbackBtn');

        if (statementBtn) statementBtn.addEventListener('click', function () {
            var url = 'accessibility.html';
            try { window.open(url, '_blank'); }
            catch (e) {
                alert((getLang() === 'en')
                    ? 'Accessibility statement: please create accessibility.html in your site.'
                    : 'הצהרת נגישות: צרי באתר עמוד accessibility.html');
            }
        });

        if (feedbackBtn) feedbackBtn.addEventListener('click', function () {
            var subject = encodeURIComponent(getLang() === 'en' ? 'Accessibility feedback' : 'משוב נגישות');
            var body = encodeURIComponent(getLang() === 'en'
                ? 'Hi,\nI would like to report an accessibility issue:\n\nPage:\nIssue:\nDevice/Browser:\n'
                : 'היי,\nאני רוצה לדווח על בעיית נגישות:\n\nעמוד:\nהבעיה:\nמכשיר/דפדפן:\n');
            window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
        });
    }

    // ---------- Reset ----------
    function initReset() {
        var html = document.documentElement;
        var btn = byId('resetAllBtn');
        if (!btn) return;

        btn.addEventListener('click', function () {
            var classesToRemove = [
                'a11y-no-motion',
                'a11y-mono', 'a11y-sepia', 'a11y-hc', 'a11y-invert', 'a11y-blackyellow',
                'a11y-hl-headings', 'a11y-hl-links',
                'a11y-readable-font',
                'a11y-cursor-big', 'a11y-cursor-big-black',
                'a11y-reading',
                'a11y-spacing-1', 'a11y-spacing-2'
            ];
            for (var i = 0; i < classesToRemove.length; i++) removeClass(html, classesToRemove[i]);

            var keys = [
                'a11yNoMotion',
                'a11yMono', 'a11ySepia', 'a11yContrast', 'a11yInvert', 'a11yBlackYellow',
                'a11yHlHeadings', 'a11yHlLinks',
                'a11yAltHover', 'a11yAltFixed',
                'a11yReadableFont',
                'a11yCursor',
                'a11yReading',
                'a11yTargetSize',
                'a11yFocusOn', 'a11yFocusHeight', 'a11yFocusY',
                'a11yScreenZoom',
                'a11yCurrentFontPx',
                'a11ySpacing'
            ];
            for (var k = 0; k < keys.length; k++) safeDel(keys[k]);

            var wrap = byId('zoomWrap') || document.body;

            // remove fixed alt labels
            var labels = wrap.querySelectorAll('[data-a11y-alt-label="1"]');
            for (var j = 0; j < labels.length; j++) {
                if (labels[j] && labels[j].parentNode) labels[j].parentNode.removeChild(labels[j]);
            }

            // restore titles set by hover
            var imgs = wrap.querySelectorAll('img[data-a11y-old-title]');
            for (var m = 0; m < imgs.length; m++) {
                var old = imgs[m].getAttribute('data-a11y-old-title');
                imgs[m].setAttribute('title', old || '');
                imgs[m].removeAttribute('data-a11y-old-title');
            }

            try { location.reload(); } catch (e) { }
        });
    }

    // ---------- Language ----------
    function initLanguage() {
        var btn = byId('langToggleBtn');
        if (!btn) return;

        function refreshLangStatus() {
            var s = byId('langStatus');
            if (!s) return;
            s.textContent = (getLang() === 'en') ? t('langStatusEn') : t('langStatusHe');
        }

        btn.addEventListener('click', function () {
            setLang(getLang() === 'en' ? 'he' : 'en');
            try { location.reload(); } catch (e) { }
        });

        refreshLangStatus();
    }

    // ---------- init all ----------
    function initAll() {
        ensureSkipLink();      // visible on focus (Tab)
        ensureWidgetMarkup();
        ensureZoomWrap();

        initPanel();
        initFontSize();
        initScreenZoom();
        initTargetSize();
        initNoMotion();
        initViewToggles();
        initSpacing();

        initHighlights();
        initAltModes();
        initReadableFont();
        initCursor();
        initReadingMode();
        initReadingFocus();

        initSkipButton();
        initStatementAndFeedback();
        initReset();
        initLanguage();
    }

    onReady(initAll);
})();
