
  (function () {
    function loadFooter() {
        console.log("fffffffffffffffff")
      var el = document.getElementById('siteFooter');
      if (!el) return;

      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'footer.html', true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            el.innerHTML = xhr.responseText;
          }
        }
      };
      xhr.send();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
      loadFooter();
    }
  })();
