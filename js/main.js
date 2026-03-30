// ===== NAVIGATION =====
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-links a[data-page]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ===== PAGE NAVIGATION =====
const pages = {
  home: document.getElementById('home-page'),
  automation: document.getElementById('automation-page'),
  webdev: document.getElementById('webdev-page'),
};

function navigateTo(pageId) {
  // Hide all pages
  Object.values(pages).forEach(p => {
    if (p) p.classList.remove('active');
  });

  // Show target page
  const target = pages[pageId];
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Re-trigger reveal animations
    setTimeout(() => initReveal(), 100);
  }

  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) {
      link.classList.add('active');
    }
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    if (page) navigateTo(page);
  });
});

// Handle anchor links within home page
document.querySelectorAll('a[data-scroll]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(link.dataset.scroll);
    if (target) {
      navigateTo('home');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  });
});

// Service card navigation
document.querySelectorAll('[data-navigate]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(el.dataset.navigate);
  });
});

// ===== SCROLL REVEAL =====
function initReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => {
    el.classList.remove('active');
    observer.observe(el);
  });
}

initReveal();

// ===== SERVICE CARD MOUSE EFFECT =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

// ===== TYPING EFFECT =====
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

// ===== NUMBER COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        animateCounter(counter, parseInt(counter.dataset.count));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statObserver.observe(statsEl);

// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  const heroGlow = document.querySelector('.hero-glow');
  if (heroContent && window.scrollY < window.innerHeight) {
    const offset = window.scrollY * 0.3;
    heroContent.style.transform = `translateY(${offset}px)`;
    heroContent.style.opacity = 1 - (window.scrollY / (window.innerHeight * 0.7));
  }
  if (heroGlow && window.scrollY < window.innerHeight) {
    heroGlow.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.15}px))`;
  }
});
