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

  // B2B partner form: sends to Netlify Forms without leaving the page
  var pform = document.querySelector('.partner-form');
  if (pform) {
    var status = pform.querySelector('.partner-form__status');
    var btn = pform.querySelector('button[type="submit"]');
    var say = function (msg, err) { status.textContent = msg; status.hidden = false; status.classList.toggle('is-error', !!err); };
    if (/[?&]sent=1/.test(location.search)) say(pform.getAttribute('data-success') || 'Thank you! We will be in touch shortly.');
    pform.addEventListener('submit', function (e) {
      e.preventDefault();
      btn.disabled = true;
      var body = new URLSearchParams(new FormData(pform)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          pform.reset();
          say(pform.getAttribute('data-success'));
        })
        .catch(function () { say('Sorry, the form could not be sent. Please email us at info@locategeorgia.ge.', true); })
        .then(function () { btn.disabled = false; });
    });
  }

  // Tours page: checkbox filters on the left (also reads ?duration=&category= from the homepage search)
  var grid = document.getElementById('tourGrid');
  var ff = document.getElementById('filtersForm');
  if (grid && ff) {
    var cards = grid.querySelectorAll('.tour-card');
    var countEl = document.getElementById('tours-count');
    var emptyEl = document.getElementById('toursEmpty');
    var clearEl = document.getElementById('toursClear');
    var badge = document.getElementById('filtersBadge');
    var params = new URLSearchParams(location.search);
    params.getAll('duration').concat(params.getAll('category')).forEach(function (v) {
      ff.querySelectorAll('input[value="' + v + '"]').forEach(function (i) { i.checked = true; });
    });
    var picked = function (name) { return Array.prototype.map.call(ff.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; }); };
    var PER_PAGE = 6, page = 1, matches = [];
    var pager = document.getElementById('toursPager');
    var showPage = function (p, scroll) {
      var pages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
      page = Math.min(Math.max(1, p), pages);
      cards.forEach(function (c) { c.hidden = true; });
      matches.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach(function (c) { c.hidden = false; });
      pager.hidden = pages < 2;
      pager.innerHTML = '';
      if (pages > 1) {
        var mk = function (label, target, opts) {
          var b = document.createElement('button'); b.type = 'button'; b.innerHTML = label;
          if (opts && opts.aria) b.setAttribute('aria-label', opts.aria);
          if (target === page && !(opts && opts.nav)) b.setAttribute('aria-current', 'page');
          if (opts && opts.disabled) b.disabled = true;
          b.addEventListener('click', function () { if (target !== page) showPage(target, true); });
          pager.appendChild(b);
        };
        mk('<svg class="arrow" style="transform:scaleX(-1)"><use href="#i-arrow"/></svg>', page - 1, { nav: true, aria: 'Previous page', disabled: page === 1 });
        for (var i = 1; i <= pages; i++) mk(String(i), i, { aria: 'Page ' + i });
        mk('<svg class="arrow"><use href="#i-arrow"/></svg>', page + 1, { nav: true, aria: 'Next page', disabled: page === pages });
      }
      if (scroll) document.querySelector('.tours-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    var apply = function () {
      var du = picked('duration'), ca = picked('category'), n = 0;
      matches = [];
      cards.forEach(function (c) {
        var cats = (c.dataset.categories || '').split(' ');
        var ok = (!du.length || du.indexOf(c.dataset.duration) > -1) &&
                 (!ca.length || ca.every(function (x) { return cats.indexOf(x) > -1; }));
        if (ok) { matches.push(c); n++; }
      });
      showPage(1, false);
      countEl.textContent = n + (n === 1 ? ' tour' : ' tours');
      emptyEl.hidden = n > 0;
      var total = du.length + ca.length;
      clearEl.hidden = !total;
      if (badge) { badge.hidden = !total; badge.textContent = total; }
    };
    ff.addEventListener('change', apply);
    clearEl.addEventListener('click', function () { ff.reset(); apply(); });
    var tg = document.getElementById('filtersToggle');
    if (tg) tg.addEventListener('click', function () {
      var open = tg.parentNode.classList.toggle('is-open');
      tg.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    apply();
  }

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
