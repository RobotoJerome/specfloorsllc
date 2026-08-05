/* ============================================================
   Spec Floors LLC — site scripts
   Vanilla JS, no dependencies, no build step.
   ============================================================ */
(function () {
  'use strict';

  var BUSINESS_EMAIL = 'specfloorsnick@gmail.com';

  /* ----------------------------------------------------------
     OPTIONAL: real form delivery
     By default the estimate form opens a pre-filled email in the
     visitor's mail app (works everywhere, needs no hosting account).
     To have submissions emailed to Nick automatically instead:
       1. Create a free form endpoint (e.g. formspree.io) with
          specfloorsnick@gmail.com as the destination.
       2. Paste the endpoint URL below.
     ---------------------------------------------------------- */
  var FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxxx'

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- header shadow on scroll ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById('navtoggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    // close after tapping a link
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // close on outside click / Escape
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (e.target.closest('#nav') || e.target.closest('#navtoggle')) return;
      closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------- gallery filters ---------- */
  var filters = document.querySelectorAll('.filter');
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-filter');

      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      shots.forEach(function (shot) {
        var cats = (shot.getAttribute('data-cat') || '').split(/\s+/);
        var show = want === 'all' || cats.indexOf(want) !== -1;
        shot.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var current = 0;
  var lastFocused = null;

  function visibleShots() {
    return shots.filter(function (s) { return !s.classList.contains('is-hidden'); });
  }

  function render(i) {
    var list = visibleShots();
    if (!list.length) return;
    current = (i + list.length) % list.length;

    var shot = list[current];
    var img = shot.querySelector('img');

    lbImg.src = shot.getAttribute('data-full') || (img && img.src) || '';
    lbImg.alt = (img && img.alt) || 'Completed flooring project by Spec Floors LLC';
    lbCap.textContent = shot.getAttribute('data-caption') || '';

    var multiple = list.length > 1;
    lbPrev.hidden = !multiple;
    lbNext.hidden = !multiple;
  }

  function openLightbox(shot) {
    if (!lb) return;
    lastFocused = document.activeElement;
    var list = visibleShots();
    render(list.indexOf(shot));
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lb) return;
    lb.hidden = true;
    lbImg.removeAttribute('src'); // src='' would re-request the page URL
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  shots.forEach(function (shot) {
    shot.addEventListener('click', function () { openLightbox(shot); });
  });

  if (lb) {
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { render(current - 1); });
    lbNext.addEventListener('click', function () { render(current + 1); });

    lb.addEventListener('click', function (e) {
      // click on the backdrop (not the image or a control) closes
      if (e.target === lb || e.target.classList.contains('lightbox__figure')) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') render(current - 1);
      else if (e.key === 'ArrowRight') render(current + 1);
      else if (e.key === 'Tab') {
        // simple focus trap
        var focusables = [lbClose, lbPrev, lbNext].filter(function (el) { return !el.hidden; });
        var idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey ? idx - 1 : idx + 1;
        if (next < 0) next = focusables.length - 1;
        if (next >= focusables.length) next = 0;
        focusables[next].focus();
      }
    });

    // swipe on touch devices
    var touchX = null;
    lb.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 55) render(dx > 0 ? current - 1 : current + 1);
      touchX = null;
    }, { passive: true });
  }

  /* ---------- estimate form ---------- */
  var form = document.getElementById('estimateForm');
  var status = document.getElementById('formStatus');

  function setStatus(msg, isError) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('is-error', !!isError);
  }

  function fieldValue(name) {
    var el = form.elements[name];
    return el ? String(el.value || '').trim() : '';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = fieldValue('name');
      var phone = fieldValue('phone');
      var email = fieldValue('email');
      var projectType = fieldValue('projectType');
      var material = fieldValue('material');
      var scope = fieldValue('scope');
      var message = fieldValue('message');

      // validation — name + phone are the two things Nick actually needs
      var missing = [];
      [['name', name], ['phone', phone]].forEach(function (pair) {
        var el = form.elements[pair[0]];
        var empty = !pair[1];
        if (el) el.classList.toggle('is-error', empty);
        if (empty) missing.push(pair[0] === 'name' ? 'your name' : 'a phone number');
      });

      if (missing.length) {
        setStatus('Please add ' + missing.join(' and ') + ' so Nick can get back to you.', true);
        var firstBad = form.querySelector('input.is-error, select.is-error');
        if (firstBad) firstBad.focus();
        return;
      }

      var subject = 'Flooring Estimate Request — ' + name;
      var lines = [
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + (email || '(not provided)'),
        'Project type: ' + projectType,
        'Flooring: ' + material,
        'Rooms / sq ft: ' + (scope || '(not provided)'),
        '',
        'Details:',
        message || '(none)',
        '',
        '— Sent from specfloorsllc.com'
      ];
      var body = lines.join('\n');

      // Option A: real endpoint configured -> post in the background
      if (FORM_ENDPOINT) {
        setStatus('Sending…');
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name, phone: phone, email: email,
            projectType: projectType, material: material,
            scope: scope, message: message,
            _subject: subject
          })
        }).then(function (res) {
          if (!res.ok) throw new Error('bad response');
          form.reset();
          setStatus('Thanks ' + name.split(' ')[0] + " — your request is in. Nick will get back to you shortly. Need it sooner? Call 815-520-6734.");
        }).catch(function () {
          setStatus('Something went wrong sending that. Please call 815-520-6734 or email ' + BUSINESS_EMAIL + '.', true);
        });
        return;
      }

      // Option B (default): open a pre-filled email
      var href = 'mailto:' + BUSINESS_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;
      setStatus('Opening your email app with the details filled in — just hit send. If nothing opened, call 815-520-6734.');
    });

    // clear the error state as soon as the visitor starts fixing it
    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-error')) {
        e.target.classList.remove('is-error');
        setStatus('');
      }
    });
  }

  /* ---------- smooth anchor offset for the sticky header ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (!id || id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY -
      (header ? header.offsetHeight + 12 : 0);
    window.scrollTo({ top: top, behavior: 'smooth' });
    history.replaceState(null, '', id);
  });

})();
