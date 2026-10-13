/* RESQ-X motion layer (GSAP + ScrollTrigger).
 * Everything here is progressive enhancement: if GSAP is missing, or the visitor
 * prefers reduced motion, the "anim" class is never kept and the page is fully
 * visible and static. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('anim')) return;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('anim'); return; }
  window.__motion = true;

  gsap.registerPlugin(ScrollTrigger);
  try { init(); } catch (err) {
    if (window.console) console.error('RESQ-X motion disabled:', err);
    root.classList.remove('anim');
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    gsap.globalTimeline.clear();
  }

  function init() {
    gsap.defaults({ ease: 'power3.out', duration: 0.8 });

    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

    /* Wrap every word of an element's text in a mask (.w) with an inner span (.wi)
       so words can rise out of a clipped line. Returns the inner spans. */
    function splitWords(el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'), i = document.createElement('span');
          w.className = 'w'; i.className = 'wi'; i.textContent = part;
          w.appendChild(i); frag.appendChild(w);
        });
        el.replaceChild(frag, n);
      });
      return $$('.wi', el);
    }

    /* ---------- header: entrance, progress, section indicator ---------- */
    var header = $('.site-header');
    gsap.fromTo(header, { yPercent: -100, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.9, delay: 0.05 });

    gsap.fromTo('.progress', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });

    var nav = $('.site-nav'), ink = $('.nav-ink'), links = $$('a', nav), current;
    function setActive(id, force) {
      if (id === current && !force) return;
      var wasNone = !current;
      current = id;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (!id) { gsap.to(ink, { opacity: 0, duration: 0.3 }); return; }
      var a = $('a[href="#' + id + '"]', nav);
      if (!a) return;
      a.setAttribute('aria-current', 'true');
      if (wasNone || force) gsap.set(ink, { x: a.offsetLeft, width: a.offsetWidth });
      gsap.to(ink, { x: a.offsetLeft, width: a.offsetWidth, opacity: 1, duration: wasNone ? 0.3 : 0.55 });
      nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
    }
    var spy = { idea: 'idea', problem: 'idea', aim: 'idea', how: 'how', board: 'board', components: 'components',
                testing: 'testing', results: 'testing', limits: 'limits', why: null, conclusion: null, team: 'team' };
    Object.keys(spy).forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: 'top 45%', end: 'bottom 45%',
        onToggle: function (self) { if (self.isActive) setActive(spy[id]); }
      });
    });
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom 45%',
      onToggle: function (self) { if (self.isActive) setActive(null); }
    });
    window.addEventListener('resize', function () { if (current) setActive(current, true); });

    /* ---------- hero: one orchestrated intro ---------- */
    var h1 = $('.hero h1'), h1Words = splitWords(h1);
    gsap.set(h1, { visibility: 'visible' });

    var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
      .fromTo('.logo', { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'expo.inOut' }, 0.15)
      .fromTo('#thermal', { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.9, ease: 'power2.inOut' }, 0.35)
      .fromTo('.scan', { top: '0%', opacity: 1 },
        { top: '100%', duration: 1.9, ease: 'power2.inOut' }, 0.35)
      .to('.scan', { opacity: 0, duration: 0.35, ease: 'none' }, '>-0.25')
      .fromTo(h1Words, { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.05 }, 0.75)
      .fromTo('.hero-status', { opacity: 0, '--bar-s': 0 },
        { opacity: 1, '--bar-s': 1, duration: 0.9 }, 1.25)
      .fromTo(['.lead', '.actions', '.caption'], { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 }, 1.2)
      .fromTo('.glance', { '--gl-s': 0 }, { '--gl-s': 1, duration: 1.1, ease: 'power3.inOut' }, 1.5)
      .fromTo('.glance > div', { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 1.65);

    /* slow depth: thermal field drifts behind the content as you scroll away */
    gsap.to('.hero-thermal', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* ---------- sections: rule draws in, heading words rise ---------- */
    $$('.block').forEach(function (b) {
      var h = $('.layout > h2', b), words = splitWords(h);
      gsap.set(h, { visibility: 'visible' });
      gsap.timeline({ scrollTrigger: { trigger: b, start: 'top 78%', once: true } })
        .fromTo(b, { '--line-s': 0 }, { '--line-s': 1, duration: 1.1, ease: 'power3.inOut' }, 0)
        .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, 0.15);
    });

    /* body copy comes up to full contrast as it enters the reading zone */
    $$('.prose > p').forEach(function (p) {
      if (/\b(rq|note|legend)\b/.test(p.className)) return;
      gsap.fromTo(p, { opacity: 0.2 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: p, start: 'top 90%', end: 'top 65%', scrub: true }
      });
    });

    /* research question */
    var rq = $('.rq'), rqWords = splitWords(rq);
    gsap.set(rq, { visibility: 'visible' });
    gsap.timeline({ scrollTrigger: { trigger: rq, start: 'top 85%', once: true } })
      .fromTo(rq, { '--bar-s': 0 }, { '--bar-s': 1, duration: 1, ease: 'power3.inOut' }, 0)
      .fromTo(rqWords, { yPercent: 110 }, { yPercent: 0, duration: 0.95, stagger: 0.04, ease: 'expo.out' }, 0.1);

    /* callout bars */
    $$('.note').forEach(function (n) {
      gsap.fromTo(n, { '--bar-s': 0 }, {
        '--bar-s': 1, duration: 0.9, ease: 'power3.inOut',
        scrollTrigger: { trigger: n, start: 'top 90%', once: true }
      });
    });

    /* ---------- signal-flow diagram ---------- */
    var fig = $('.diagram'), svg = $('svg', fig);
    var rects = $$('rect', svg);
    var solid = rects.filter(function (r) { return !r.parentNode.getAttribute('stroke-dasharray'); });
    var dashed = rects.filter(function (r) { return !!r.parentNode.getAttribute('stroke-dasharray'); });
    var texts = $$('text', svg), paths = $$('g[marker-end] path', svg);

    solid.forEach(function (r) {
      var L = r.getTotalLength();
      r.style.strokeDasharray = L;
      r.style.strokeDashoffset = L;
    });
    gsap.set([texts, dashed, paths], { opacity: 0 });

    var packetTweens = [], packetsOn = false;
    function startPackets() {
      /* only the core (solid) connections carry a moving signal; planned ones stay still */
      var core = [[180, 250, 48], [180, 250, 128], [440, 510, 48], [440, 510, 208], [440, 510, 288], [700, 770, 48]];
      var ns = 'http://www.w3.org/2000/svg';
      core.forEach(function (c, i) {
        var dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('r', '2.6'); dot.setAttribute('cy', c[2]); dot.setAttribute('cx', c[0]);
        dot.setAttribute('fill', '#ff6a1a'); dot.setAttribute('opacity', '0');
        svg.appendChild(dot);
        var t = gsap.timeline({ repeat: -1, repeatDelay: 1.3 + (i % 3) * 0.3, delay: i * 0.4 });
        t.set(dot, { opacity: 1, attr: { cx: c[0] + 4 } })
         .to(dot, { attr: { cx: c[1] - 7 }, duration: 0.9, ease: 'power1.inOut' })
         .to(dot, { opacity: 0, duration: 0.12, ease: 'none' });
        packetTweens.push(t);
      });
      packetsOn = true;
    }

    gsap.timeline({
      scrollTrigger: { trigger: fig, start: 'top 80%', once: true },
      onComplete: function () {
        solid.forEach(function (r) { r.style.strokeDasharray = 'none'; r.style.strokeDashoffset = '0'; });
        startPackets();
      }
    })
      .to(solid, { strokeDashoffset: 0, duration: 1.3, stagger: 0.08, ease: 'power2.inOut' }, 0)
      .to(dashed, { opacity: 1, duration: 0.6, stagger: 0.08, ease: 'none' }, 0.4)
      .to(texts, { opacity: 1, duration: 0.5, stagger: 0.03, ease: 'none' }, 0.7)
      .to(paths, { opacity: 1, duration: 0.5, stagger: 0.05, ease: 'none' }, 1.0);

    /* pause the signal animation while the diagram is off-screen */
    ScrollTrigger.create({
      trigger: fig, start: 'top bottom', end: 'bottom top',
      onToggle: function (self) {
        if (!packetsOn) return;
        packetTweens.forEach(function (t) { self.isActive ? t.play() : t.pause(); });
      }
    });

    /* ---------- 3D viewer: stage wipes open, then the controls arrive ---------- */
    gsap.timeline({ scrollTrigger: { trigger: '.viewer', start: 'top 82%', once: true } })
      .fromTo('.viewer-stage', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power3.inOut' }, 0);

    /* ---------- components ---------- */
    gsap.timeline({ scrollTrigger: { trigger: '.parts', start: 'top 82%', once: true } })
      .from('.part', { opacity: 0, y: 12, duration: 0.6, stagger: 0.05 }, 0)
      .from('.part .dot', { scale: 0, duration: 0.5, stagger: 0.05 }, 0.1);

    /* ---------- testing plan: progress rail ---------- */
    var wrap = $('.steps-wrap');
    gsap.fromTo($('.rail i', wrap), { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 }
    });
    $$('.steps li', wrap).forEach(function (li) {
      ScrollTrigger.create({
        trigger: li, start: 'top 62%',
        onEnter: function () { li.classList.add('on'); },
        onLeaveBack: function () { li.classList.remove('on'); }
      });
    });

    /* layout shifts when web fonts arrive */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
