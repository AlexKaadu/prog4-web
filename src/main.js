import 'bootstrap';

const tawkScriptUrl = 'https://embed.tawk.to/6abfb532d50d3a34cae395ef/1k3um2gg9';

if (tawkScriptUrl) {
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  (function () {
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];

    s1.async = true;
    s1.src = tawkScriptUrl;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
  })();
}

