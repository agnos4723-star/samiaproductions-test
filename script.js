document.addEventListener('DOMContentLoaded', () => {

  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  const body = document.body;

  // ==================== LOADER ====================
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = $('loader');
      if (loader) loader.classList.add('hidden');
    }, 2200);
  });

  // ==================== YEAR ====================
  const yearEl = $('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==================== THEME TOGGLE ====================
  const THEME_KEY = 'samia-theme';
  const themeToggle = $('themeToggle');
  const mobileThemeToggle = $('mobileThemeToggle');
  const themeToggleText = $('themeToggleText');
  const themeToggleIcon = $('themeToggleIcon');

  function updateThemeUI() {
    const isLight = body.classList.contains('light-theme');
    if (themeToggleText) themeToggleText.textContent = isLight ? 'Thème galaxy' : 'Thème blanc';
    if (themeToggleIcon) themeToggleIcon.textContent = isLight ? '☾' : '☀';
    const mIcon = mobileThemeToggle?.querySelector('.theme-toggle-icon');
    if (mIcon) mIcon.textContent = isLight ? '☾' : '☀';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
    updateThemeUI();
  }

  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved === 'light' ? 'light' : 'galaxy');

  function toggleTheme() {
    applyTheme(body.classList.contains('light-theme') ? 'galaxy' : 'light');
  }

  themeToggle?.addEventListener('click', toggleTheme);
  mobileThemeToggle?.addEventListener('click', toggleTheme);

  // ==================== CURSOR ====================
  const cursor = $('cursor');
  const follower = $('cursorFollower');

  if (window.innerWidth > 768 && cursor && follower) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX - 4 + 'px';
      cursor.style.top = e.clientY - 4 + 'px';
      follower.style.left = e.clientX - 18 + 'px';
      follower.style.top = e.clientY - 18 + 'px';
    });

    $$('a, button, .gallery-item, .equip-item, .card, .tilt-card').forEach(el => {
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

  // ==================== TOPBAR ====================
  const topbar = $('topbar');
  const backToTop = $('backToTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (topbar) topbar.classList.toggle('scrolled', y > 60);
    if (backToTop) backToTop.classList.toggle('visible', y > 500);
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==================== SMOOTH SCROLL ====================
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
      }
    });
  });

  // ==================== BURGER ====================
  const burger = $('burger');
  const mobileMenu = $('mobileMenu');

  burger?.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
    document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
  });

  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      burger?.classList.remove('active');
      mobileMenu?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==================== REVEAL ====================
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => revealObserver.observe(el));

  // ==================== STATS ====================
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Si c'est un texte statique (Plusieurs / Illimitées), on skip le compteur
      if (el.classList.contains('stat-text')) {
        counterObserver.unobserve(el);
        return;
      }

      const target = parseInt(el.dataset.target);
      const isPercent = target === 98;
      let current = 0;
      const steps = 60;
      const inc = target / steps;
      const stepTime = 1800 / steps;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          el.textContent = isPercent ? target + '%' : target + '+';
          clearInterval(timer);
        } else {
          el.textContent = isPercent ? Math.floor(current) + '%' : Math.floor(current);
        }
      }, stepTime);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  $$('.stat-number').forEach(el => counterObserver.observe(el));

  // ==================== STARS CANVAS ====================
  const starsCanvas = $('starsCanvas');
  const starsCtx = starsCanvas?.getContext('2d');
  let stars = [];

  function resizeStars() {
    if (!starsCanvas) return;
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
  }

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * starsCanvas.width;
      this.y = Math.random() * starsCanvas.height;
      this.size = Math.random() * 1.8 + 0.3;
      this.alpha = Math.random() * 0.8 + 0.2;
      this.speed = Math.random() * 0.02 + 0.004;
      this.dir = Math.random() > 0.5 ? 1 : -1;
      const r = Math.random();
      this.color = r > 0.85 ? '201,169,110' : '255,255,255';
    }
    update() {
      this.alpha += this.speed * this.dir;
      if (this.alpha >= 1) { this.alpha = 1; this.dir = -1; }
      if (this.alpha <= 0.1) { this.alpha = 0.1; this.dir = 1; }
    }
    draw() {
      starsCtx.beginPath();
      starsCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      starsCtx.fillStyle = 'rgba(' + this.color + ',' + this.alpha + ')';
      starsCtx.fill();
    }
  }

  function initStars() {
    if (!starsCanvas) return;
    resizeStars();
    const count = window.innerWidth < 768 ? 120 : 250;
    stars = [];
    for (let i = 0; i < count; i++) stars.push(new Star());
  }

  function animateStars() {
    if (!starsCtx) return;
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    stars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateStars);
  }

  initStars();
  animateStars();
  window.addEventListener('resize', initStars);

  // ==================== PARTICLES ====================
  const canvas = $('particles');
  const ctx = canvas?.getContext('2d');
  let particlesArray = [];

  function resizeCanvas() {
    if (!canvas) return;
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
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,169,110,' + this.opacity + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    if (!canvas) return;
    resizeCanvas();
    const count = window.innerWidth < 768 ? 30 : 60;
    particlesArray = [];
    for (let i = 0; i < count; i++) particlesArray.push(new Particle());
  }

  function animateParticles() {
    if (!ctx) return;
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
          ctx.strokeStyle = 'rgba(201,169,110,' + (0.05 * (1 - dist / 120)) + ')';
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

  // ==================== NAV ACTIVE ====================
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
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

  // ==================== LIGHTBOX ====================
  const lightbox = $('lightbox');
  const lightboxImg = $('lightboxImg');
  const lightboxCounter = $('lightboxCounter');
  const galleryItems = Array.from($$('.gallery-item img'));
  let currentIndex = 0;

  function updateLightbox() {
    if (!lightboxImg || !galleryItems.length) return;
    lightboxImg.src = galleryItems[currentIndex].src;
    if (lightboxCounter) lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() { currentIndex = (currentIndex + 1) % galleryItems.length; updateLightbox(); }
  function prevImage() { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; updateLightbox(); }

  galleryItems.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
  $('lightboxClose')?.addEventListener('click', closeLightbox);
  $('lightboxNext')?.addEventListener('click', nextImage);
  $('lightboxPrev')?.addEventListener('click', prevImage);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextImage() : prevImage(); }
  }, { passive: true });

  // ==================== TESTIMONIALS ====================
  const track = $('testimonialTrack');
  const dotsContainer = $('sliderDots');
  const totalSlides = $$('.testimonial-card').length;
  let currentSlide = 0;
  let autoplay;

  if (dotsContainer) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentSlide = index;
    if (track) track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    $$('.slider-dot').forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  $('nextTestimonial')?.addEventListener('click', () => goToSlide((currentSlide + 1) % totalSlides));
  $('prevTestimonial')?.addEventListener('click', () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides));

  function startAutoplay() { autoplay = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000); }
  function stopAutoplay() { clearInterval(autoplay); }

  const sliderContainer = document.querySelector('.testimonials-slider');
  sliderContainer?.addEventListener('mouseenter', stopAutoplay);
  sliderContainer?.addEventListener('mouseleave', startAutoplay);
  if (totalSlides) startAutoplay();

  let sliderTouchStartX = 0;
  sliderContainer?.addEventListener('touchstart', e => { sliderTouchStartX = e.changedTouches[0].screenX; stopAutoplay(); }, { passive: true });
  sliderContainer?.addEventListener('touchend', e => {
    const diff = sliderTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goToSlide((currentSlide + 1) % totalSlides) : goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }
    startAutoplay();
  }, { passive: true });

  // ==================== 3D TILT CARDS ====================
  $$('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ==================== EQUIPMENT 3D ====================
  $$('.equip-animation').forEach(anim => {
    anim.addEventListener('mousemove', e => {
      const rect = anim.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width * 20;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height * 20;
      anim.style.transform = 'perspective(500px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg)';
    });
    anim.addEventListener('mouseleave', () => {
      anim.style.transform = 'perspective(500px) rotateY(0) rotateX(0)';
      anim.style.transition = 'transform 0.5s ease';
    });
    anim.addEventListener('mouseenter', () => { anim.style.transition = 'none'; });
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

  // ==================== PARALLAX HERO ====================
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroBg = document.querySelector('.hero-bg-img');
    const heroLogo = document.querySelector('.hero-logo-float');
    if (heroBg) heroBg.style.transform = 'translateY(' + (y * 0.25) + 'px)';
    if (heroLogo) heroLogo.style.transform = 'translateX(-50%) translateY(' + (y * 0.18) + 'px)';
  });

  // ==================== CONSOLE ====================
  console.log('%cSamia Productions ✨ — Galaxy + Blanc prêts !', 'color:#c9a96e; font-size:14px;');

});
