/* ===========================================================
   FRUIT SALAD — motion
   =========================================================== */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- nav scrolled state -------------------------------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- hero enter ---------------------------------------- */
  const hero = document.querySelector('.hero');
  const revealHero = () => hero && hero.classList.add('in');
  setTimeout(revealHero, 60);
  window.addEventListener('load', revealHero);

  /* ---- backup visibility failsafe ------------------------ */
  /* Independent of the head-script timer: if anything is still hidden
     after motion should have run, force the whole page visible. */
  setTimeout(() => {
    const s = document.querySelector('.hero__title .ln > span');
    if (!s || parseFloat(getComputedStyle(s).opacity) < 0.05) {
      document.documentElement.classList.add('shown');
    }
  }, 2200);

  /* ---- scroll reveals ------------------------------------ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  /* ---- count-up metrics ---------------------------------- */
  function animateCount(el) {
    const raw = el.getAttribute('data-count');
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const target = parseFloat(raw);
    const decimals = (raw.split('.')[1] || '').length;
    const dur = 1500;
    const t0 = performance.now();
    function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const val = (target * eased).toFixed(decimals);
      el.textContent = prefix + Number(val).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = prefix + Number(target).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    }
    if (reduce) { el.textContent = prefix + raw + suffix; return; }
    requestAnimationFrame(step);
  }
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        if (document.documentElement.classList.contains('anim')) animateCount(e.target);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

  if (reduce) return; // skip pointer/ambient motion when reduced

  /* ---- hero cursor parallax ------------------------------ */
  const art = document.querySelector('.hero__art');
  if (art) {
    const layers = [...art.querySelectorAll('[data-depth]')];
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5);
      ty = ((e.clientY - r.top) / r.height - 0.5);
    });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
    function loop() {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      layers.forEach((l) => {
        const d = parseFloat(l.getAttribute('data-depth'));
        l.style.setProperty('--px', (cx * d * 34).toFixed(2) + 'px');
        l.style.setProperty('--py', (cy * d * 34).toFixed(2) + 'px');
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---- card 3d tilt (work) ------------------------------- */
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-10px) perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  /* ---- ambient drifting particles ------------------------ */
  const amb = document.querySelector('.ambient');
  if (amb) {
    const colors = ['#F2433F', '#F2871E', '#A7C42A', '#5B3CD6', '#EB5C9A'];
    const N = 9;
    for (let i = 0; i < N; i++) {
      const p = document.createElement('span');
      p.className = 'p';
      const size = 8 + Math.random() * 16;
      p.style.width = p.style.height = size + 'px';
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.top = (Math.random() * 100) + 'vh';
      p.style.background = colors[i % colors.length];
      p.style.opacity = 0.18 + Math.random() * 0.18;
      amb.appendChild(p);
      drift(p);
    }
    function drift(p) {
      const move = () => {
        const x = (Math.random() * 80 - 40);
        const y = (Math.random() * 80 - 40);
        const dur = 9000 + Math.random() * 8000;
        p.animate([
          { transform: p.style.transform || 'translate(0,0)' },
          { transform: `translate(${x}px, ${y}px)` }
        ], { duration: dur, easing: 'ease-in-out', fill: 'forwards' });
        p.style.transform = `translate(${x}px, ${y}px)`;
        setTimeout(move, dur);
      };
      setTimeout(move, Math.random() * 2000);
    }
  }

  /* ---- active nav link on scroll ------------------------- */
  const sections = ['home', 'about', 'services', 'work', 'contact'];
  const linkFor = {};
  document.querySelectorAll('.nav__links a').forEach((a) => {
    const id = (a.getAttribute('href') || '').replace('#', '');
    if (id) linkFor[id] = a;
  });
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        document.querySelectorAll('.nav__links a').forEach((a) => a.classList.remove('active'));
        if (linkFor[id]) linkFor[id].classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach((id) => { const el = document.getElementById(id); if (el) secIO.observe(el); });
})();
