// Locate Georgia — site script
(function () {
  // Mobile menu
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
