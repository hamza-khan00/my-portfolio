'use strict';

/* ══ 1. CUSTOM CURSOR ══ */
(function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  function animateCursor() {
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .photo-frame, .skill-card, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.borderColor = 'var(--pink)'; });
    el.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)';   ring.style.borderColor = 'var(--cyan)'; });
  });
})();


/* ══ 2. CANVAS PARTICLE NETWORK ══ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size    = Math.random() * 1.4 + 0.3;
      this.speedX  = (Math.random() - 0.5) * 0.4;
      this.speedY  = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.life    = 0;
      this.maxLife = 200 + Math.random() * 300;
      const palette = ['#00ffe7', '#ff2d78', '#b8ff3a'];
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.x += this.speedX; this.y += this.speedY; this.life++;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const alpha = Math.floor(this.opacity * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 120 }, () => new Particle());

  function drawGrid() {
    ctx.strokeStyle = 'rgba(0,255,231,0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,231,${0.07 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(render);
  }
  render();
})();


/* ══ 3. SCROLL REVEAL ══ */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const bar = entry.target.querySelector('.skill-fill');
        if (bar) setTimeout(() => bar.classList.add('animated'), 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ══ 4. SKILL BAR ANIMATIONS ══ */
(function initSkillBars() {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          setTimeout(() => bar.classList.add('animated'), 300);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));
})();


/* ══ 5. ACTIVE NAV HIGHLIGHT ══ */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) currentId = s.id; });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + currentId ? 'var(--cyan)' : '';
    });
  });
})();


/* ══ 6. PHOTO UPLOAD ══ */
(function initPhotoUpload() {
  const input       = document.getElementById('pfpInput');
  const img         = document.getElementById('pfpImg');
  const placeholder = document.getElementById('photoPlaceholder');
  if (!input || !img || !placeholder) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
      img.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });
})();