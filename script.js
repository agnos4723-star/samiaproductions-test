/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2500);
});

/* ===== YEAR ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 4 + 'px';
    cursor.style.top = e.clientY - 4 + 'px';
    follower.style.left = e.clientX - 18 + 'px';
    follower.style.top = e.clientY - 18 + 'px';
  });

  document.querySelectorAll('a, button, .gallery-item, .equip-item, input, textarea, select').forEach(el => {
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

/* ===== TOPBAR SCROLL ===== */
const topbar = document.getElementById('topbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  topbar.classList.toggle('scrolled', y > 80);
  backToTop.classList.toggle('visible', y > 600);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== BURGER ===== */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ===== REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== COUNTERS ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const galleryItems = document.querySelectorAll('.gallery-item');
let currentIndex = 0;
const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

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
  lightboxImg.src = images[currentIndex];
  lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
}
function nextImage() { currentIndex = (currentIndex + 1) % images.length; updateLightbox(); }
function prevImage() { currentIndex = (currentIndex - 1 + images.length) % images.length; updateLightbox(); }

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxNext').addEventListener('click', nextImage);
document.getElementById('lightboxPrev').addEventListener('click', prevImage);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});

/* ===== TESTIMONIALS ===== */
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const totalSlides = document.querySelectorAll('.testimonial-card').length;
let currentSlide = 0;

for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('button');
  dot.classList.add('slider-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

document.getElementById('nextTestimonial').addEventListener('click', () => goToSlide((currentSlide + 1) % totalSlides));
document.getElementById('prevTestimonial').addEventListener('click', () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides));

let autoPlay = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000);
const sliderEl = document.querySelector('.testimonials-slider');
sliderEl.addEventListener('mouseenter', () => clearInterval(autoPlay));
sliderEl.addEventListener('mouseleave', () => { autoPlay = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000); });

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Envoi en cours...</span>';
    btn.disabled = true;
    setTimeout(() => {
      toast.classList.add('active');
      form.reset();
      btn.innerHTML = original;
      btn.disabled = false;
      setTimeout(() => toast.classList.remove('active'), 4000);
    }, 1500);
  });
}

/* ===== PARTICLES ===== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

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
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,169,110,${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  resizeCanvas();
  const count = window.innerWidth < 768 ? 30 : 60;
  particles = [];
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(201,169,110,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
initParticles();
animateParticles();

/* ===== NAV HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ===== PARALLAX on MOUSE (Equipment section) ===== */
document.querySelectorAll('.equip-animation').forEach(anim => {
  anim.addEventListener('mousemove', (e) => {
    const rect = anim.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width * 20;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height * 20;
    anim.style.transform = `perspective(500px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  anim.addEventListener('mouseleave', () => {
    anim.style.transform = 'perspective(500px) rotateY(0) rotateX(0)';
    anim.style.transition = 'transform 0.5s ease';
  });
  anim.addEventListener('mouseenter', () => {
    anim.style.transition = 'none';
  });
});

/* ===== TIMECODE animation ===== */
const timecodeEl = document.querySelector('.cinema-timecode');
if (timecodeEl) {
  let frame = 0;
  setInterval(() => {
    frame++;
    const f = frame % 25;
    const s = Math.floor(frame / 25) % 60;
    const m = Math.floor(frame / 1500) % 60;
    const h = Math.floor(frame / 90000) % 24;
    timecodeEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(f).padStart(2,'0')}`;
  }, 40);
}
