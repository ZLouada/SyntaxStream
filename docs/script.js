// Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const progress = document.getElementById('scroll-progress');

// Mobile menu
function toggleMenu() {
  const expanded = hamburger?.getAttribute('aria-expanded') === 'true' || false;
  hamburger?.setAttribute('aria-expanded', (!expanded).toString());
  navMenu?.classList.toggle('active');
  hamburger?.classList.toggle('active');
}
hamburger?.addEventListener('click', toggleMenu);
hamburger?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
});
navLinks.forEach(l => l.addEventListener('click', () => {
  navMenu?.classList.remove('active');
  hamburger?.classList.remove('active');
  hamburger?.setAttribute('aria-expanded', 'false');
}));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Active nav link on scroll + progress
window.addEventListener('scroll', () => {
  // progress
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1);
  if (progress) progress.style.width = `${scrolled * 100}%`;

  // nav highlight
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

// Reveal animations using IntersectionObserver
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      // Progress bars for skills
      if (entry.target.classList.contains('skill-card')) {
        const bar = entry.target.querySelector('.progress-bar');
        const width = bar?.getAttribute('data-width') || '0%';
        requestAnimationFrame(() => { if (bar) bar.style.width = width; });
      }
      io.unobserve(entry.target);
    }
  });
}, { threshold: .15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.skill-card, .project-card, .about-card, .edu-card, .timeline-content').forEach(el => {
  el.classList.add('reveal'); io.observe(el);
});

// Typing effect: only type inside the highlighted name, keep markup intact
function typeWriter(el, full, speed = 40) {
  if (!el) return;
  let i = 0;
  el.textContent = ''; // only clear inside the highlight span
  const timer = setInterval(() => {
    el.textContent = full.slice(0, i++);
    if (i > full.length) clearInterval(timer);
  }, speed);
}
window.addEventListener('load', () => {
  const nameEl = document.querySelector('.hero-title .highlight');
  const full = nameEl?.textContent?.trim() || '';
  if (nameEl && full) typeWriter(nameEl, full, 36);
});

// Parallax on hero wrapper (avoid conflict with tilt on the image card)
window.addEventListener('scroll', () => {
  const wrapper = document.querySelector('.hero-image');
  if (!wrapper) return;
  const y = window.scrollY * 0.06;
  wrapper.style.transform = `translateY(${y}px)`;
});

// Parallax tilt effect for cards
document.querySelectorAll('.tilt').forEach(card => {
  const maxTilt = 8; // deg
  const reset = () => card.style.transform = '';
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -2 * maxTilt;
    const ry = ((x / rect.width) - 0.5) * 2 * maxTilt;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });
  card.addEventListener('mouseleave', reset);
});

// Tabs (About)
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target)?.classList.add('active');
  });
});

// Project filters
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projectCards.forEach(card => {
      const cat = card.getAttribute('data-cat');
      const show = (filter === 'all' || filter === cat);
      card.style.opacity = show ? '1' : '0';
      card.style.transform = show ? '' : 'translateY(10px)';
      card.style.pointerEvents = show ? 'auto' : 'none';
      card.style.transition = 'opacity .25s ease, transform .25s ease';
      setTimeout(() => { card.style.display = show ? '' : 'none'; }, show ? 0 : 200);
    });
  });
});

// Contact form demo
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.btn-primary');
  if (!submitBtn) return;
  const orig = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  setTimeout(() => {
    alert('Thanks! Your (demo) message was “sent”. Replace this with your backend or Formspree.');
    contactForm.reset();
    submitBtn.textContent = orig || 'Send Message';
    submitBtn.disabled = false;
  }, 1400);
});

// Console note
console.log('✅ JS loaded: fixed typewriter scope and parallax/tilt conflict.');