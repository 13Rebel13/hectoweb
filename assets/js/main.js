// HectoWeb — v0.2
// Theme switcher + scroll reveals (GSAP)

gsap.registerPlugin(ScrollTrigger);

/* =================================================================
   THEME SWITCHER
   ================================================================= */
(() => {
  const dock = document.querySelector('.theme-dock');
  const toggle = document.getElementById('dock-toggle');
  const list = document.getElementById('dock-list');
  const nameLabel = document.getElementById('current-theme-name');
  const buttons = list.querySelectorAll('button[data-theme]');

  const STORAGE_KEY = 'hectoweb-theme';

  // Restore saved theme
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) applyTheme(saved, false);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dock.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!dock.contains(e.target)) {
      dock.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      const name = btn.dataset.name;
      applyTheme(theme, true, name);
      dock.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  function applyTheme(theme, save = true, name = null) {
    document.body.setAttribute('data-theme', theme);
    if (!name) {
      const btn = list.querySelector(`button[data-theme="${theme}"]`);
      name = btn?.dataset.name || theme;
    }
    nameLabel.textContent = name;
    buttons.forEach((b) => b.classList.toggle('active', b.dataset.theme === theme));
    // Update theme-color meta for mobile chrome
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      requestAnimationFrame(() => {
        const bg = getComputedStyle(document.body).backgroundColor;
        meta.setAttribute('content', bg);
      });
    }
    if (save) localStorage.setItem(STORAGE_KEY, theme);
  }
})();

/* =================================================================
   REVEAL ANIMATIONS
   ================================================================= */
document.querySelectorAll('.reveal').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: (i % 4) * 0.06,
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
  });
});

/* Hero intro */
gsap.fromTo('.hero .reveal',
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.15 }
);

/* =================================================================
   GENTLE PARALLAX ON HERO ORBS
   ================================================================= */
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  document.querySelectorAll('.orb').forEach((orb, i) => {
    const factor = (i + 1) * 0.6;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
}, { passive: true });

/* =================================================================
   CONTACT FORM — mailto fallback
   ================================================================= */
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const subject = encodeURIComponent(`HectoWeb — projet de ${f.nom.value}`);
  const body = encodeURIComponent(
    `Nom : ${f.nom.value}\nEmail : ${f.email.value}\nType : ${f.type.value}\n\n${f.message.value}`
  );
  window.location.href = `mailto:info@hectoweb.ch?subject=${subject}&body=${body}`;
});
