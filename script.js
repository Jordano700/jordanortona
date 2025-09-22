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
