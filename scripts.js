/**
 * Dr. Reddy's Clinic - Interactive Scripts
 * Premium medical landing page interactions
 */

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initNavigation();
  initSlider();
  initGallery();
  initTestimonials();
  initScrollReveal();
  initSmoothScroll();
});

// Initialize Lucide Icons
function initLucide() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ strokeWidth: 2.5 });
  }
}

// ========================================
// NAVIGATION
// ========================================

function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  // Sticky nav scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  function openMobileMenu() {
    mobileMenu.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle) toggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });
}

// ========================================
// HERO SLIDER
// ========================================

const slidesData = [
  {
    title: "Advanced Cure for PILES",
    desc: "Ayurvedic formulations & signature Ksharakarma treatment for permanent relief.",
    image: "assets/slider-1.png"
  },
  {
    title: "IFTak Technique for FISTULA",
    desc: "Complementing Kshara Sutra for high success rates without sphincter damage.",
    image: "assets/slider-2.png"
  },
  {
    title: "Laser-Assisted SINUS Care",
    desc: "Kshara Karma with modern laser assistance for pilonidal sinus treatment.",
    image: "assets/slider-3.png"
  }
];

let currentSlide = 0;
let progressInterval = null;
const sliderInterval = 7000;

function initSlider() {
  const root = document.getElementById('slider-root');
  const dots = document.getElementById('slide-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!root || !dots) return;

  // Render slides
  slidesData.forEach((slide, idx) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = `slide ${idx === 0 ? 'active' : ''}`;
    slideDiv.id = `slide-${idx}`;
    slideDiv.setAttribute('role', 'tabpanel');
    slideDiv.setAttribute('aria-label', `Slide ${idx + 1} of ${slidesData.length}`);
    
    slideDiv.innerHTML = `
      <div class="slide__bg">
        <img src="${slide.image}" alt="${slide.title}" class="slide__image" 
             onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200'">
      </div>
      <div class="slide__overlay"></div>
      <div class="slide__content">
        <span class="slide__badge">Day Care Procedure</span>
        <h2 class="slide__title">${slide.title}</h2>
        <p class="slide__desc">${slide.desc}</p>
        <a href="tel:8123198711" class="btn btn--primary">
          <i data-lucide="phone-call" class="btn__icon"></i>
          Call Clinic Now
        </a>
      </div>
    `;
    root.appendChild(slideDiv);

    // Create dot
    const dot = document.createElement('button');
    dot.className = `slider__dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goToSlide(idx));
    dots.appendChild(dot);
  });

  // Reinitialize icons for dynamically added content
  initLucide();

  // Start progress
  startProgress();

  // Navigation buttons
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Pause on hover
  root.addEventListener('mouseenter', () => cancelAnimationFrame(progressInterval));
  root.addEventListener('mouseleave', startProgress);
}

function startProgress() {
  const bar = document.getElementById('slide-progress');
  if (!bar) return;

  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = ((timestamp - start) / sliderInterval) * 100;
    bar.style.width = `${Math.min(progress, 100)}%`;

    if (progress < 100) {
      progressInterval = requestAnimationFrame(step);
    } else {
      nextSlide();
    }
  }

  progressInterval = requestAnimationFrame(step);
}

function goToSlide(idx) {
  cancelAnimationFrame(progressInterval);

  // Update slides
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
  });

  // Update dots
  const dots = document.querySelectorAll('.slider__dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
    dot.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });

  currentSlide = idx;
  startProgress();
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slidesData.length);
}

function prevSlide() {
  goToSlide((currentSlide - 1 + slidesData.length) % slidesData.length);
}

// ========================================
// GALLERY CAROUSEL
// ========================================

const galleryImages = [
  { id: 1, src: "assets/p1.jpeg", caption: "Successful Piles Treatment" },
  { id: 2, src: "assets/p2.jpeg", caption: "Complex Fistula Case Recovery" },
  { id: 3, src: "assets/p3.jpeg", caption: "Laser assisted results" },
  { id: 4, src: "assets/p4.jpeg", caption: "Patient Post-Op Result" },
  { id: 5, src: "assets/p5.jpeg", caption: "Clinical Documentation" },
  { id: 6, src: "assets/p6.jpeg", caption: "Treatment Progress Case" },
  { id: 7, src: "assets/p7.jpeg", caption: "Advanced Pilonidal Care" }
];

let currentGalleryIndex = 0;

function initGallery() {
  const track = document.getElementById('gallery-track');
  const dotsContainer = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (!track || !dotsContainer) return;

  // Render gallery cards
  galleryImages.forEach((img, i) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <img src="${img.src}" alt="${img.caption}" class="gallery-card__image" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400'">
      <div class="gallery-card__overlay">
        <p class="gallery-card__caption">${img.caption}</p>
      </div>
    `;
    track.appendChild(card);

    // Create dot
    const dot = document.createElement('button');
    dot.className = `carousel__dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.addEventListener('click', () => scrollToGallery(i));
    dotsContainer.appendChild(dot);
  });

  // Navigation
  if (prevBtn) prevBtn.addEventListener('click', () => scrollGallery('left'));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollGallery('right'));

  // Initial position
  setTimeout(() => scrollToGallery(0), 100);
}

function scrollToGallery(index) {
  const track = document.getElementById('gallery-track');
  const dots = document.querySelectorAll('#gallery-dots .carousel__dot');

  if (!track || !track.children.length) return;

  const card = track.children[0];
  const cardWidth = card.getBoundingClientRect().width;
  const gap = 24; // var(--space-6)

  currentGalleryIndex = index;
  const offset = index * (cardWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function scrollGallery(direction) {
  const visible = window.innerWidth >= 768 ? 2 : 1;
  const max = galleryImages.length - visible;

  if (direction === 'right') {
    currentGalleryIndex = currentGalleryIndex >= max ? 0 : currentGalleryIndex + 1;
  } else {
    currentGalleryIndex = currentGalleryIndex <= 0 ? max : currentGalleryIndex - 1;
  }

  scrollToGallery(currentGalleryIndex);
}

// ========================================
// TESTIMONIALS CAROUSEL
// ========================================

const testimonialsData = [
  {
    name: "Lingesh Biradar",
    initials: "LB",
    color: "teal",
    text: "One of the best kinds of hospitals specialised in piles treatment nearby, Best hands on experience Doctor available.",
    meta: "Verified Review • 11 months ago"
  },
  {
    name: "Mirgaji Sudarshan",
    initials: "MS",
    color: "orange",
    text: "Nature and behaviour of doctor is very good. Correct explanation regarding the disease and suitable treatment will be given.",
    meta: "Verified Review • 11 months ago"
  },
  {
    name: "Viswadeep Morambe",
    initials: "VM",
    color: "blue",
    text: "Well equiped hospital with cost effective procedures for piles operation. Highly recommended.",
    meta: "Eagle Watch • 11 months ago"
  },
  {
    name: "Sudhakar Tugave",
    initials: "ST",
    color: "rose",
    text: "Calm, patient and responsive listens and responds professionally. A truly comforting experience.",
    meta: "4 reviews • 1 year ago"
  },
  {
    name: "Amarja Mirasdar",
    initials: "AM",
    color: "teal",
    text: "Best service by the experienced doctor, most recommended for piles pain relief.",
    meta: "Verified Patient"
  }
];

let currentTestimonial = 0;

function initTestimonials() {
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (!track || !dotsContainer) return;

  // Render testimonials
  testimonialsData.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="testimonial-card__header">
        <div class="testimonial-card__avatar testimonial-card__avatar--${t.color}">${t.initials}</div>
        <div class="testimonial-card__author">
          <h5 class="testimonial-card__name">${t.name}</h5>
          <p class="testimonial-card__meta">${t.meta}</p>
        </div>
      </div>
      <div class="testimonial-card__stars">
        <i data-lucide="star"></i>
        <i data-lucide="star"></i>
        <i data-lucide="star"></i>
        <i data-lucide="star"></i>
        <i data-lucide="star"></i>
      </div>
      <p class="testimonial-card__text">"${t.text}"</p>
    `;
    track.appendChild(card);

    // Create dot
    const dot = document.createElement('button');
    dot.className = `carousel__dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => scrollToTestimonial(i));
    dotsContainer.appendChild(dot);
  });

  // Reinitialize icons
  initLucide();

  // Navigation
  if (prevBtn) prevBtn.addEventListener('click', () => scrollTestimonials('left'));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollTestimonials('right'));

  // Initial position
  setTimeout(() => scrollToTestimonial(0), 100);

  // Auto-scroll
  setInterval(() => scrollTestimonials('right'), 6000);
}

function scrollToTestimonial(index) {
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('#testimonial-dots .carousel__dot');

  if (!track || !track.children.length) return;

  const card = track.children[0];
  const cardWidth = card.getBoundingClientRect().width;
  const gap = 24;

  currentTestimonial = index;
  const offset = index * (cardWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function scrollTestimonials(direction) {
  const visible = window.innerWidth >= 1280 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
  const max = testimonialsData.length - visible;

  if (direction === 'right') {
    currentTestimonial = currentTestimonial >= max ? 0 : currentTestimonial + 1;
  } else {
    currentTestimonial = currentTestimonial <= 0 ? max : currentTestimonial - 1;
  }

  scrollToTestimonial(currentTestimonial);
}

// Handle resize
window.addEventListener('resize', () => {
  scrollToTestimonial(currentTestimonial);
  scrollToGallery(currentGalleryIndex);
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Get delay from data attribute or use index
        const delay = entry.target.dataset.delay || index * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
