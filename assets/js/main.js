// HectoWeb — main.js
// GSAP scroll reveals + Hero particles + Three.js wobbly mesh
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   CUSTOM CURSOR HALO
   ============================================================ */
(() => {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  const loop = () => {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(2.2)');
    el.addEventListener('mouseleave', () => cursor.style.transform = cursor.style.transform.replace(' scale(2.2)', ''));
  });
})();

/* ============================================================
   REVEAL ANIMATIONS — fade + lift on scroll
   ============================================================ */
document.querySelectorAll('.reveal').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
});

/* ============================================================
   HERO — animated particles canvas
   ============================================================ */
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  const resize = () => {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
    const count = Math.min(140, Math.floor((w * h) / 11000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
    }));
  };
  resize();
  window.addEventListener('resize', resize);

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    // links
    ctx.strokeStyle = 'rgba(124,246,111,0.10)';
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.globalAlpha = 1 - d / 130;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    // particles
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(124,246,111,0.85)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };
  tick();
})();

/* ============================================================
   HERO — text intro stagger
   ============================================================ */
gsap.fromTo('#hero .reveal',
  { opacity: 0, y: 60 },
  { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.15, delay: 0.2 }
);

/* ============================================================
   THREE.JS — section 4 (animated icosahedron + lights)
   ============================================================ */
(() => {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050505, 4, 12);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

  // Icosahedron mesh
  const geo = new THREE.IcosahedronGeometry(1.6, 4);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x7cf66f,
    wireframe: true,
    emissive: 0x1a6614,
    metalness: 0.3,
    roughness: 0.5,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Inner solid
  const innerGeo = new THREE.IcosahedronGeometry(1.0, 2);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    emissive: 0x7cf66f,
    emissiveIntensity: 0.25,
    metalness: 0.7,
    roughness: 0.2,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const p1 = new THREE.PointLight(0x7cf66f, 4, 12);
  p1.position.set(3, 2, 3);
  scene.add(p1);
  const p2 = new THREE.PointLight(0xff4fa1, 2.5, 12);
  p2.position.set(-3, -2, 2);
  scene.add(p2);

  // Distort vertices on tick (wobble)
  const positions = geo.attributes.position;
  const original = positions.array.slice();

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  const clock = new THREE.Clock();
  let running = false;

  // Only render when section is in viewport (perf)
  const obs = new IntersectionObserver((entries) => {
    running = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  obs.observe(canvas);

  const animate = () => {
    requestAnimationFrame(animate);
    if (!running) return;
    const t = clock.getElapsedTime();

    // wobble vertices
    for (let i = 0; i < positions.count; i++) {
      const ox = original[i * 3];
      const oy = original[i * 3 + 1];
      const oz = original[i * 3 + 2];
      const noise = Math.sin(t * 1.4 + ox * 2 + oy * 2 + oz * 2) * 0.08;
      const len = Math.hypot(ox, oy, oz);
      const factor = (1 + noise) / len;
      positions.array[i * 3] = ox * factor * len;
      positions.array[i * 3 + 1] = oy * factor * len;
      positions.array[i * 3 + 2] = oz * factor * len;
    }
    positions.needsUpdate = true;

    mesh.rotation.x = t * 0.15 + mouseY * 0.3;
    mesh.rotation.y = t * 0.2 + mouseX * 0.3;
    inner.rotation.x = -t * 0.25;
    inner.rotation.y = -t * 0.18;

    renderer.render(scene, camera);
  };
  animate();
})();

/* ============================================================
   NAV — color flips per-section via mix-blend-difference already
   plus subtle hide-on-down / show-on-up
   ============================================================ */
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 200 && y > lastY) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    nav.style.transition = 'transform .35s ease';
    lastY = y;
  });
})();

/* ============================================================
   PARALLAX on memphis shapes
   ============================================================ */
gsap.utils.toArray('.memphis-shape').forEach((el, i) => {
  gsap.to(el, {
    y: (i % 2 === 0 ? -80 : 80),
    rotation: (i % 2 === 0 ? 25 : -25),
    scrollTrigger: { trigger: '#vitrine', start: 'top bottom', end: 'bottom top', scrub: true },
  });
});

/* ============================================================
   GLASS ORBS drift
   ============================================================ */
gsap.utils.toArray('.glass-orb').forEach((el, i) => {
  gsap.to(el, {
    x: (i % 2 === 0 ? 120 : -120),
    y: (i % 2 === 0 ? 80 : -80),
    scrollTrigger: { trigger: '#ecom', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
  });
});

/* ============================================================
   CONTACT FORM — graceful mailto fallback (no backend yet)
   ============================================================ */
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const subject = encodeURIComponent(`HectoWeb — projet de ${f.nom.value}`);
  const body = encodeURIComponent(
    `Nom : ${f.nom.value}\nEmail : ${f.email.value}\nType : ${f.type.value}\n\n${f.message.value}`
  );
  window.location.href = `mailto:info@hectoweb.ch?subject=${subject}&body=${body}`;
});
