/* Oleg Pustogachev · v3 (Hallmark · Lumen Night Foundry). Plain JS, no dependencies. */
(() => {
  document.documentElement.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);


  /* ---------- reveal ---------- */
  const ro = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => ro.observe(el));

  /* ---------- videos: play only on screen; sound toggle ---------- */
  const vo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !reduced) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: 0.35 });
  document.querySelectorAll('video[data-autoplay]').forEach((v) => vo.observe(v));
  document.querySelectorAll('.soundbtn').forEach((b) => {
    const v = b.parentElement.querySelector('video');
    b.addEventListener('click', () => {
      v.muted = !v.muted; if (!v.muted) v.play().catch(() => {});
      b.setAttribute('aria-pressed', String(!v.muted)); b.textContent = v.muted ? 'Sound off' : 'Sound on';
    });
  });

  /* ---------- lightbox ---------- */
  const lb = $('lightbox');
  document.addEventListener('click', (e) => {
    const fig = e.target.closest('[data-lightbox]'); if (!fig) return;
    const img = fig.querySelector('img'); if (!img) return;
    lb.querySelector('img').src = img.currentSrc || img.src; lb.querySelector('img').alt = img.alt;
    lb.querySelector('.lightbox__cap').textContent = fig.querySelector('figcaption')?.textContent || '';
    lb.showModal();
  });
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.closest('.lightbox__close')) lb.close(); });

  /* ---------- copy email: silent success, honest failure ---------- */
  document.querySelectorAll('.copybtn').forEach((b) => {
    const label = b.querySelector('.copybtn__label'), status = $('copy-status'), text = b.dataset.copy;
    b.addEventListener('click', async () => {
      b.dataset.state = 'loading';
      try {
        await navigator.clipboard.writeText(text);
        b.dataset.state = 'success'; label.textContent = 'Copied'; status.textContent = 'Email address copied';
      } catch {
        b.dataset.state = 'error'; label.textContent = text; status.textContent = 'Copy failed. The address is shown on the button.';
      }
      setTimeout(() => { delete b.dataset.state; label.textContent = 'Copy email'; }, 2200);
    });
  });

})();
