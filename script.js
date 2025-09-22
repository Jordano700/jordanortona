const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#primary-navigation');
const navLinks = navigation ? navigation.querySelectorAll('a[href^="#"]') : [];
const body = document.body;

const closeNav = () => {
  if (!navToggle) return;
  navToggle.setAttribute('aria-expanded', 'false');
  body.classList.remove('nav-open');
};

if (navToggle && navigation) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    body.classList.toggle('nav-open', !isExpanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      closeNav();
    }
  });
}

const currentYearEl = document.querySelector('#current-year');
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}

// Particle network in hero canvas
(function () {
  const canvas = document.querySelector('.net-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let width, height, nodes, rafId;
  const maxNodes = 70; // auto-scaled
  const linkDist = 120;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.floor(rect.width);
    height = Math.floor(rect.height);
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const area = width * height;
    const density = Math.min(maxNodes, Math.max(28, Math.floor(area / 6500)));
    nodes = new Array(density).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 1.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // draw links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < linkDist) {
          const alpha = 0.45 * (1 - d / linkDist);
          ctx.strokeStyle = `rgba(20,123,128,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // draw nodes and update
    for (const p of nodes) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.strokeStyle = 'rgba(20,123,128,0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    rafId = requestAnimationFrame(step);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function start() {
    cancelAnimationFrame(rafId);
    resize();
    if (reduceMotion.matches) {
      // draw a static frame
      step();
      cancelAnimationFrame(rafId);
    } else {
      step();
    }
  }

  start();
  window.addEventListener('resize', start);
})();

// Precise back-to-top scroll
(function () {
  const backTop = document.querySelector('.footer__link[href="#top"]');
  if (!backTop) return;
  backTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  });
})();
