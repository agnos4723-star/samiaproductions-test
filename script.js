// ====================== SAMIA PRODUCTIONS — SCRIPT.JS ======================

document.addEventListener('DOMContentLoaded', () => {

  // ==================== UTILS ====================
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ==================== LOADER ====================
  window.addEventListener('load', () => {
    setTimeout(() => {
      $('loader').classList.add('hidden');
    }, 2200);
  });

  // ==================== YEAR ====================
  $('year').textContent = new Date().getFullYear();

  // ==================== CUSTOM CURSOR ====================
  const cursor = $('cursor');
  const follower = $('cursorFollower');

  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 4 + 'px';
      cursor.style.top = e.clientY - 4 + 'px';
      follower.style.left = e.clientX - 18 + 'px';
      follower.style.top = e.clientY - 18 + 'px';
    });

    $$('a, button, .gallery-item, .equip-item, .card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
  }

  // ==================== TOPBAR SCROLL ====================
  const topbar = $('topbar');
  const backToTop = $('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    topbar.classList.toggle('scrolled', scrollY > 80);
    backToTop.classList.toggle('visible', scrollY > 600);
  });

  // ==================== BACK TO TOP ====================
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==================== SMOOTH SCROLL ====================
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const topPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    });
  });

  // ==================== BURGER MENU ====================
  const burger = $('burger');
  const mobileMenu = $('mobileMenu');

  burger.addEventListener('click', () => {
    const isActive = mobileMenu.classList.toggle('active');
    burger.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==================== REVEAL ON SCROLL ====================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal').forEach(el => revealObserver.observe(el));

  // ==================== STATS COUNTERS ====================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const isPercent = target === 98;
      let current = 0;
      const duration = 1800;
      const steps = 60;
      const increment = target / steps;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          if (isPercent) {
            el.textContent = target + '%';
          } else {
            el.textContent = target + '+';
          }
          clearInterval(timer);
        } else {
          if (isPercent) {
            el.textContent = Math.floor(current) + '%';
          } else {
            el.textContent = Math.floor(current);
          }
        }
      }, stepTime);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  $$('.stat-number').forEach(el => counterObserver.observe(el));

  // ==================== LIGHTBOX ====================
  const lightbox = $('lightbox');
  const lightboxImg = $('lightboxImg');
  const lightboxCounter = $('lightboxCounter');
  const galleryItems = $$('.gallery-item');
  let currentIndex = 0;
  const galleryImages = Array.from(galleryItems).map(item => item.querySelector('img').src);

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    lightboxImg.src = galleryImages[currentIndex];
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  $('lightboxClose').addEventListener('click', closeLightbox);
  $('lightboxNext').addEventListener('click', nextImage);
  $('lightboxPrev').addEventListener('click', prevImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // ==================== TOUCH SWIPE LIGHTBOX ====================
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { nextImage(); } else { prevImage(); }
    }
  }, { passive: true });

  // ==================== TESTIMONIALS SLIDER ====================
  const track = $('testimonialTrack');
  const dotsContainer = $('sliderDots');
  const totalSlides = $$('.testimonial-card').length;
  let currentSlide = 0;
  let autoplay;

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    $$('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  $('nextTestimonial').addEventListener('click', () => {
    goToSlide((currentSlide + 1) % totalSlides);
  });

  $('prevTestimonial').addEventListener('click', () => {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  });

  function startAutoplay() {
    autoplay = setInterval(() => {
      goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
  }

  function stopAutoplay() { clearInterval(autoplay); }

  const sliderContainer = document.querySelector('.testimonials-slider');
  sliderContainer.addEventListener('mouseenter', stopAutoplay);
  sliderContainer.addEventListener('mouseleave', startAutoplay);
  startAutoplay();

  let sliderTouchStartX = 0;
  let sliderTouchEndX = 0;

  sliderContainer.addEventListener('touchstart', (e) => {
    sliderTouchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  sliderContainer.addEventListener('touchend', (e) => {
    sliderTouchEndX = e.changedTouches[0].screenX;
    const diff = sliderTouchStartX - sliderTouchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide((currentSlide + 1) % totalSlides);
      } else {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
      }
    }
    startAutoplay();
  }, { passive: true });

  // ==================== PARTICLES ====================
  const canvas = $('particles');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,169,110,' + this.opacity + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    resizeCanvas();
    const count = window.innerWidth < 768 ? 30 : 60;
    particlesArray = [];
    for (let i = 0; i < count; i++) { particlesArray.push(new Particle()); }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
      for (let j = i + 1; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.strokeStyle = 'rgba(201,169,110,' + (0.06 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  initParticles();
  animateParticles();

  // ==================== NAV ACTIVE LINK ====================
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // ==================== EQUIPMENT PARALLAX 3D ====================
  $$('.equip-animation').forEach(anim => {
    anim.addEventListener('mousemove', (e) => {
      const rect = anim.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width * 20;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height * 20;
      anim.style.transform = 'perspective(500px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg)';
    });
    anim.addEventListener('mouseleave', () => {
      anim.style.transform = 'perspective(500px) rotateY(0) rotateX(0)';
      anim.style.transition = 'transform 0.5s ease';
    });
    anim.addEventListener('mouseenter', () => {
      anim.style.transition = 'none';
    });
  });

  // ==================== CINEMA TIMECODE ====================
  const timecodeEl = document.querySelector('.cinema-timecode');
  if (timecodeEl) {
    let frame = 0;
    setInterval(() => {
      frame++;
      const f = frame % 25;
      const s = Math.floor(frame / 25) % 60;
      const m = Math.floor(frame / 1500) % 60;
      const h = Math.floor(frame / 90000) % 24;
      timecodeEl.textContent =
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0') + ':' +
        String(f).padStart(2, '0');
    }, 40);
  }

  // ==================== CONSOLE LOG ====================
  console.log('%cSamia Productions — Site chargé avec succès ✨', 'color:#c9a96e; font-size:14px; font-family:Cormorant Garamond,serif;');

});
