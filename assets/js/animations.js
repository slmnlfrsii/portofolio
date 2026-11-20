(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isTouchDevice = window.matchMedia(
    "(hover: none), (pointer: coarse)",
  ).matches;

  /* ------------------------------------------------------------------------
     1. TYPING EFFECT WITH BLINKING CURSOR
     ------------------------------------------------------------------------ */
  const textElement = document.getElementById("typing-text");
  const words = ["Fullstack Developer", "Junior Web Developer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!textElement) return;

    if (prefersReducedMotion) {
      textElement.textContent = words[0];
      return;
    }

    const currentWord = words[wordIndex];

    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 450;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  /* ------------------------------------------------------------------------
     2. STAGGERED SCROLL REVEAL OBSERVER
     ------------------------------------------------------------------------ */
  const staggerGroups = document.querySelectorAll(".stagger-group");
  staggerGroups.forEach((group) => {
    const items = group.querySelectorAll(
      ":scope > .stagger-item, :scope > .reveal",
    );
    items.forEach((item, idx) => {
      const delayMs = Math.min(idx * 75, 450);
      item.style.setProperty("--reveal-delay", `${delayMs}ms`);
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add("active"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     3. SUBTLE CARD TILT ON NON-TOUCH POINTER DEVICES
     ------------------------------------------------------------------------ */
  if (!prefersReducedMotion && !isTouchDevice) {
    const tiltCards = document.querySelectorAll(".service-card, .p-card");

    tiltCards.forEach((card) => {
      card.classList.add("tilt-enabled");

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-y * 7).toFixed(2);
        const rotateY = (x * 7).toFixed(2);

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", typeEffect);
})();
