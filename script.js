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

// Language switcher
const translations = {
  en: {
    // Nav
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.cv': 'CV',
    'nav.menu': 'Menu',

    // Hero
    'hero.eyebrow': 'Computational Biologist | AI & Proteomics',
    'hero.title': 'Transforming complex biological data into actionable insights.',
    'hero.lead': 'I build intelligent tools that bridge molecular science and machine learning/deep learning to accelerate discovery in human health.',
    'hero.cta.projects': 'Explore Projects',
    'hero.cta.contact': "Let's Collaborate",

    // About
    'about.title': 'About Me',
    'about.p1': 'I am a computational biologist specializing in artificial intelligence for proteomics. My work focuses on developing machine learning models to enhance peptide identification in high-throughput LC-MS/MS, bridging AI, bioinformatics, and molecular medicine.',
    'about.p2': 'My academic path reflects this evolution: a B.Sc. in Microbiology & Immunology (McGill University), a Graduate Certificate in Clinical Bioinformatics (Humber College), and a Master\'s and now PhD in Molecular Medicine (Université Laval), where I apply AI-driven approaches to tackle complex biological data challenges.',
    'about.p3': 'I am passionate about leveraging artificial intelligence to transform biomedical research and healthcare, and I am open to opportunities in AI for bioinformatics, data science, and computational biology to help advance the biotechnology revolution.',
    'about.cta': 'Download CV',

    // Projects
    'projects.title': 'Selected Work',
    'projects.subtitle': 'Current research integrating AI with high-throughput proteomics.',
    'projects.peptdia.tag': 'AI · Proteomics',
    'projects.peptdia.title': 'PeptiDIA',
    'projects.peptdia.desc': 'Ongoing research project using machine learning to improve peptide identification in fast LC–MS/MS (DIA) workflows.',
    'projects.peptdia.link': 'View on GitHub',
    'projects.pedfm.tag': 'AI · Omics',
    'projects.pedfm.title': 'Pediatric Cancer Foundation Model',
    'projects.pedfm.desc': 'Training a foundation model on pediatric cancer data.',
    'projects.pedfm.status': 'Coming soon',

    // Contact
    'contact.title': "Let's Connect",
    'contact.desc': "I'm always open to discussing new collaborations, data challenges, or research opportunities. Reach out through any of the platforms below.",

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.backtop': 'Back to top'
  },
  fr: {
    // Nav
    'nav.about': 'À propos',
    'nav.projects': 'Projets',
    'nav.contact': 'Contact',
    'nav.cv': 'CV',
    'nav.menu': 'Menu',

    // Hero
    'hero.eyebrow': 'Biologiste Computationnel | IA & Protéomique',
    'hero.title': 'Transformer des données biologiques complexes en informations exploitables.',
    'hero.lead': 'Je développe des outils intelligents qui relient la science moléculaire et l\'apprentissage automatique/profond pour accélérer les découvertes en santé humaine.',
    'hero.cta.projects': 'Explorer les Projets',
    'hero.cta.contact': 'Collaborons',

    // About
    'about.title': 'À Propos de Moi',
    'about.p1': 'Je suis un biologiste computationnel spécialisé en intelligence artificielle pour la protéomique. Mon travail se concentre sur le développement de modèles d\'apprentissage automatique pour améliorer l\'identification des peptides en LC-MS/MS à haut débit, reliant l\'IA, la bioinformatique et la médecine moléculaire.',
    'about.p2': 'Mon parcours académique reflète cette évolution : un B.Sc. en Microbiologie et Immunologie (Université McGill), un Certificat d\'études supérieures en Bioinformatique Clinique (Collège Humber), une Maîtrise et maintenant un Doctorat en Médecine Moléculaire (Université Laval), où j\'applique des approches basées sur l\'IA pour relever des défis complexes de données biologiques.',
    'about.p3': 'Je suis passionné par l\'exploitation de l\'intelligence artificielle pour transformer la recherche biomédicale et les soins de santé, et je suis ouvert aux opportunités en IA pour la bioinformatique, la science des données et la biologie computationnelle pour contribuer à la révolution biotechnologique.',
    'about.cta': 'Télécharger le CV',

    // Projects
    'projects.title': 'Travaux Sélectionnés',
    'projects.subtitle': 'Recherche actuelle intégrant l\'IA à la protéomique à haut débit.',
    'projects.peptdia.tag': 'IA · Protéomique',
    'projects.peptdia.title': 'PeptiDIA',
    'projects.peptdia.desc': 'Projet de recherche en cours utilisant l\'apprentissage automatique pour améliorer l\'identification des peptides dans les flux de travail LC–MS/MS (DIA) rapides.',
    'projects.peptdia.link': 'Voir sur GitHub',
    'projects.pedfm.tag': 'IA · Omique',
    'projects.pedfm.title': 'Modèle de Fondation pour le Cancer Pédiatrique',
    'projects.pedfm.desc': 'Entraînement d\'un modèle de fondation sur des données de cancer pédiatrique.',
    'projects.pedfm.status': 'À venir',

    // Contact
    'contact.title': 'Restons en Contact',
    'contact.desc': 'Je suis toujours ouvert à discuter de nouvelles collaborations, de défis de données ou d\'opportunités de recherche. Contactez-moi via l\'une des plateformes ci-dessous.',

    // Footer
    'footer.rights': 'Tous droits réservés.',
    'footer.backtop': 'Retour en haut'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
        el.value = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Update lang toggle button
  const langToggle = document.querySelector('.lang-toggle');
  if (langToggle) {
    langToggle.textContent = lang === 'en' ? 'FR' : 'EN';
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch to French' : 'Passer à l\'anglais');
  }
}

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);

  const langToggle = document.querySelector('.lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'fr' : 'en');
    });
  }
});
