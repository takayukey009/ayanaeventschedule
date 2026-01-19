/**
 * 写真集発売イベント LP
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initFAQ();
  initSmoothScroll(); // Keep native anchor scroll as fallback or helper
  initParallax();
  if (typeof Lenis !== 'undefined') {
    initLenis();
  }
});

/**
 * Modern Smooth Scroll using Lenis
 */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false, // Default: false (Native touch scroll is usually better for mobile UX, but can be true if requested)
    touchMultiplier: 2,
  });

  // Optimize for mobile: keep native touch scroll but use Lenis for momentum on desktop if desired.
  // User asked for "nurutto" feel. Lenis does this well on desktop. 
  // On mobile, "smoothTouch: true" can be heavy.
  // However, specifically answering the user's "smartphone" question:
  // Usually, keeping native scroll on mobile is safer for performance, 
  // but let's enable basic smoothing if they want "nurutto" everywhere.
  // For now, I'll stick to standard Lenis config which is high performance.

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const navList = document.getElementById('navList');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuBtn || !navList) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navList.classList.toggle('active');
    document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navList.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay for timeline items
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el, index) => {
    // Add stagger delay for items in grids
    if (el.closest('.benefits-grid') || el.closest('.timeline')) {
      el.dataset.delay = index * 100;
    }
    observer.observe(el);
  });
}

/**
 * FAQ accordion
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Parallax effect for hero section
 */
function initParallax() {
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  const particles = document.querySelector('.particles');

  if (!hero || !heroBg) return;

  // Use requestAnimationFrame for smooth parallax
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
          const parallaxValue = scrolled * 0.4;
          heroBg.style.transform = `translateY(${parallaxValue}px)`;

          if (particles) {
            particles.style.transform = `translateY(${parallaxValue * 0.2}px)`;
          }
        }

        ticking = false;
      });

      ticking = true;
    }
  });
}

/**
 * Button hover effect with magnetic attraction
 */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// Initialize magnetic buttons after a short delay
setTimeout(initMagneticButtons, 100);

/**
 * Typing effect for hero title (optional enhancement)
 */
function initTypingEffect() {
  const nameElement = document.querySelector('.hero-title .name');
  if (!nameElement) return;

  const text = nameElement.textContent;
  nameElement.textContent = '';
  nameElement.style.opacity = '1';

  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      nameElement.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
    }
  }, 100);
}

// Uncomment to enable typing effect
// setTimeout(initTypingEffect, 1000);
