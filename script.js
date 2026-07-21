/* ==========================================================================
   MARIAM MUHAMMED — PREMIUM PORTFOLIO
   Vanilla JS: loading screen, nav behaviour, scroll reveals,
   animated counters, contact form, back-to-top.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. LOADING SCREEN
  ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    document.body.style.overflow = '';
  };
  // Hide once page resources are ready, with a small minimum so it doesn't flash
  const minTimer = new Promise((resolve) => setTimeout(resolve, 700));
  const pageReady = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });
  document.body.style.overflow = 'hidden';
  Promise.all([minTimer, pageReady]).then(hideLoader);
  // Safety net in case load event is delayed
  setTimeout(hideLoader, 3500);

  /* ------------------------------------------------------------------
     2. NAV: scrolled state + mobile menu
  ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');

    const toTop = document.getElementById('toTop');
    if (toTop) {
      if (window.scrollY > 700) toTop.classList.add('is-visible');
      else toTop.classList.remove('is-visible');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // slight stagger for elements revealing together
            setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------
     4. ANIMATED COUNTERS
  ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.getAttribute('data-count')));
  }

  /* ------------------------------------------------------------------
     5. CONTACT FORM (front-end only — wire up to a backend/service
        of choice, e.g. Formspree, EmailJS, or a server endpoint)
  ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !emailPattern.test(email) || !message) {
        formNote.textContent = 'Please fill in your name, a valid email and a message.';
        formNote.style.color = '#e08a8a';
        return;
      }

      // TODO: connect to a real form handler (Formspree/EmailJS/custom API).
      // For now, this opens a pre-filled email as a reliable fallback.
      const subject = encodeURIComponent(`New project inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nBusiness: ${form.business.value.trim() || '—'}\n\n${message}`
      );
      window.location.href = `mailto:mariam.docs.services@gmail.com?subject=${subject}&body=${body}`;

      formNote.textContent = 'Opening your email client to send this message…';
      formNote.style.color = '';
      form.reset();
    });
  }

  /* ------------------------------------------------------------------
     6. BACK TO TOP
  ------------------------------------------------------------------ */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     7. FOOTER YEAR
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     8. SUBTLE HERO PARALLAX ON POINTER MOVE (desktop only, respects
        reduced-motion preference)
  ------------------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroGlow = document.querySelector('.hero__glow');

  if (heroGlow && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      heroGlow.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
});
