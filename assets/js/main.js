(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME SWITCHER (DARK / LIGHT + LOCALSTORAGE + SYSTEM PREFERENCE)
     ------------------------------------------------------------------------ */
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    if (themeIcon) {
      themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#f8fafc' : '#030b18');
    }
  }

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ------------------------------------------------------------------------
     2. SCROLL PROGRESS BAR, BACK TO TOP & ACTIVE NAV LINK
     ------------------------------------------------------------------------ */
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu a');

  function handleScroll() {
    const winScroll = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    if (progressBar) progressBar.style.width = `${scrolled}%`;
    if (backToTop) backToTop.classList.toggle('show', winScroll > 300);

    let current = '';
    sections.forEach((sec) => {
      if (winScroll >= sec.offsetTop - 160) {
        current = sec.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (current && link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     3. MOBILE SIDEBAR MENU HANDLER
     ------------------------------------------------------------------------ */
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const hamburgerIcon = document.getElementById('hamburgerIcon');

  function toggleMenu(forceClose = false) {
    if (!navMenu || !navOverlay || !hamburgerBtn || !hamburgerIcon) return;

    const isOpen = forceClose ? false : !navMenu.classList.contains('active');
    navMenu.classList.toggle('active', isOpen);
    navOverlay.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    hamburgerIcon.className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleMenu());
  if (navOverlay) navOverlay.addEventListener('click', () => toggleMenu(true));

  navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu?.classList.contains('active')) {
      toggleMenu(true);
    }
  });

  /* ------------------------------------------------------------------------
     4. CONTACT FORM HANDLING
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      const originalHTML = btn.innerHTML;

      btn.textContent = 'Mengirim...';
      btn.disabled = true;

      setTimeout(() => {
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 3000);
        }
        contactForm.reset();
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }, 1200);
    });
  }

  /* ------------------------------------------------------------------------
     5. PORTFOLIO CATEGORY FILTER
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-grid .p-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-filter') || 'all';

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const shouldShow = targetFilter === 'all' || category === targetFilter;
        card.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });

  document.addEventListener('DOMContentLoaded', handleScroll);
})();
