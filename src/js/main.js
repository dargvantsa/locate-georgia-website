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

  // Tour slider: pages of 3 (2 on tablets, 1 on phones)
  document.querySelectorAll('[data-slider]').forEach(function (track) {
    var name = track.getAttribute('data-slider');
    var nav = document.querySelector('[data-slider-nav="' + name + '"]');
    var dotsWrap = document.querySelector('[data-slider-dots="' + name + '"]');
    var cards = track.querySelectorAll('.tour-card');
    if (!cards.length) return;
    var prev = nav && nav.querySelector('[data-dir="-1"]');
    var next = nav && nav.querySelector('[data-dir="1"]');

    var perView = function () {
      var w = cards[0].getBoundingClientRect().width;
      return Math.max(1, Math.round(track.clientWidth / (w || 1)));
    };
    var pages = function () { return Math.max(1, Math.ceil(cards.length / perView())); };
    var pageNow = function () {
      var max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return 0;
      return Math.round((track.scrollLeft / max) * (pages() - 1));
    };
    var goTo = function (p) {
      var target = cards[Math.min(cards.length - 1, p * perView())];
      track.scrollTo({ left: target.offsetLeft - cards[0].offsetLeft });
    };
    var build = function () {
      var n = pages();
      var show = n > 1;
      if (nav) nav.hidden = !show;
      if (dotsWrap) {
        dotsWrap.hidden = !show;
        dotsWrap.innerHTML = '';
        for (var i = 0; i < n; i++) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'slider-dot';
          b.setAttribute('aria-label', 'Show tours ' + (i + 1));
          (function (i) { b.addEventListener('click', function () { goTo(i); }); })(i);
          dotsWrap.appendChild(b);
        }
      }
      update();
    };
    var update = function () {
      var p = pageNow(), n = pages();
      if (dotsWrap) dotsWrap.querySelectorAll('.slider-dot').forEach(function (d, i) { d.classList.toggle('is-active', i === p); });
    };
    // arrows always work: after the last group they loop back to the first, and vice versa
    if (prev) prev.addEventListener('click', function () { var n = pages(), p = pageNow(); goTo(p <= 0 ? n - 1 : p - 1); });
    if (next) next.addEventListener('click', function () { var n = pages(), p = pageNow(); goTo(p >= n - 1 ? 0 : p + 1); });
    var t; track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(update, 80); });
    var r; window.addEventListener('resize', function () { clearTimeout(r); r = setTimeout(build, 150); });
    build();
  });

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
