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

  // Hero slideshow: crossfades every few seconds
  var hero = document.querySelector('.hero');
  var slides = hero ? hero.querySelectorAll('.hero__slide') : [];
  if (slides.length > 1) {
    var dots = hero.querySelectorAll('.hero__dot');
    var place = hero.querySelector('.hero__place');
    var placeText = hero.querySelector('.hero__place-text');
    var interval = parseInt(hero.getAttribute('data-interval'), 10) || 3000;
    var current = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // load the other photos after the first one is shown
    slides.forEach(function (s) {
      var bg = s.getAttribute('data-bg');
      if (bg) { var img = new Image(); img.src = bg; s.style.backgroundImage = "url('" + bg + "')"; }
    });

    var show = function (i) {
      slides[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
      var loc = slides[current].getAttribute('data-location') || '';
      if (placeText) placeText.textContent = loc;
      if (place) place.hidden = !loc;
    };
    var start = function () { if (!reduce) { stop(); timer = setInterval(function () { show(current + 1); }, interval); } };
    var stop = function () { if (timer) clearInterval(timer); timer = null; };

    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); start(); }); });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    start();
  }

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
