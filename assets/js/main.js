(() => {
  "use strict";

  /* ------------------------------------------------------------------------
     1. THEME SWITCHER (DARK / LIGHT + LOCALSTORAGE + SYSTEM PREFERENCE)
     ------------------------------------------------------------------------ */
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);

    if (themeIcon) {
      themeIcon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "light" ? "#f8fafc" : "#030b18",
      );
    }
  }

  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;
  applyTheme(savedTheme || (prefersLight ? "light" : "dark"));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme");
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  /* ------------------------------------------------------------------------
     2. SCROLL PROGRESS BAR, BACK TO TOP & ACTIVE NAV LINK
     ------------------------------------------------------------------------ */
  const progressBar = document.getElementById("progressBar");
  const backToTop = document.getElementById("backToTop");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-menu a");

  function handleScroll() {
    const winScroll = window.scrollY || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    if (progressBar) progressBar.style.width = `${scrolled}%`;
    if (backToTop) backToTop.classList.toggle("show", winScroll > 300);

    let current = "";
    sections.forEach((sec) => {
      if (winScroll >= sec.offsetTop - 160) {
        current = sec.getAttribute("id") || "";
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (current && link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------------
     3. MOBILE SIDEBAR MENU HANDLER
     ------------------------------------------------------------------------ */
  const navMenu = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const hamburgerIcon = document.getElementById("hamburgerIcon");

let isMenuTransitioning = false;

  function toggleMenu(forceClose = false) {
    if (!navMenu || !navOverlay || !hamburgerBtn || !hamburgerIcon) return;

    const isOpen = forceClose ? false : !navMenu.classList.contains("active");
    navMenu.classList.toggle("active", isOpen);
    navOverlay.classList.toggle("active", isOpen);
    navOverlay.setAttribute("aria-hidden", String(!isOpen));
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
    hamburgerIcon.className = isOpen ? "fas fa-xmark" : "fas fa-bars";
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function handleMenuButtonEvent(e) {
    if (e.type === "touchstart") {
      e.preventDefault();
      isMenuTransitioning = true;
      toggleMenu();
      setTimeout(() => {
        isMenuTransitioning = false;
      }, 300);
      return;
    }
    if (isMenuTransitioning) return;
    toggleMenu();
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("touchstart", handleMenuButtonEvent, { passive: false });
    hamburgerBtn.addEventListener("click", handleMenuButtonEvent);
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", () => toggleMenu(true));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(true);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navMenu?.classList.contains("active")) {
      toggleMenu(true);
    }
  });

  /* ------------------------------------------------------------------------
     4. CONTACT FORM HANDLING
     ------------------------------------------------------------------------ */
const contactForm = document.getElementById('contactForm');
  const contactSuccessBox = document.getElementById('contactSuccessBox');
  const sendAnotherBtn = document.getElementById('sendAnotherBtn');
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function setFormSubmittedState(isSubmitted) {
    if (contactForm) contactForm.hidden = isSubmitted;
    if (contactSuccessBox) contactSuccessBox.hidden = !isSubmitted;
  }

  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', () => {
      setFormSubmittedState(false);
      if (contactForm) {
        contactForm.reset();
        const firstInput = contactForm.querySelector('input:not([type="hidden"]), textarea');
        if (firstInput) firstInput.focus();
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const actionUrl = contactForm.getAttribute('action') || '';
      const hasExternalEndpoint =
        actionUrl &&
        actionUrl !== '#' &&
        !actionUrl.trim().toLowerCase().startsWith('mailto:');

      if (!hasExternalEndpoint) {
        showToast('Form belum dihubungkan ke endpoint email. Silakan kirim ke salmanaf083@gmail.com');
        return;
      }

      const btn = contactForm.querySelector('.btn-submit');
      const originalHTML = btn ? btn.innerHTML : '';
      if (btn) {
        btn.textContent = 'Mengirim...';
        btn.disabled = true;
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(actionUrl, {
          method: contactForm.method || 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          contactForm.reset();
          setFormSubmittedState(true);
          showToast('Pesan berhasil dikirim ke email!');
        } else {
          showToast('Gagal mengirim pesan. Silakan coba lagi atau email langsung.');
        }
      } catch (err) {
        showToast('Koneksi bermasalah. Silakan coba lagi atau kirim ke salmanaf083@gmail.com');
      } finally {
        if (btn) {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. PORTFOLIO CATEGORY FILTER
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-grid .p-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetFilter = btn.getAttribute("data-filter") || "all";

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      portfolioCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        const shouldShow = targetFilter === "all" || category === targetFilter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  document.addEventListener("DOMContentLoaded", handleScroll);
})();
