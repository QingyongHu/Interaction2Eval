// ===== Particle Canvas =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '0,245,255' : '139,92,246',
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
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
          ctx.strokeStyle = `rgba(0,245,255,${0.05 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  const resizeObs = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize();
    createParticles();
    drawParticles();
  });
  resizeObs.observe(canvas.parentElement);
})();

// ===== Scroll Reveal =====
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// ===== Animated Counters =====
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isFloat = el.dataset.float === 'true';
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();

// ===== Chart.js Charts =====
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

// Dataset Doughnut Chart
(function initDatasetChart() {
  const ctx = document.getElementById('speechChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Teacher Speech', 'Student Speech'],
      datasets: [{
        data: [73.85, 26.15],
        backgroundColor: ['rgba(0,245,255,0.7)', 'rgba(139,92,246,0.7)'],
        borderColor: ['#00f5ff', '#8b5cf6'],
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
        tooltip: {
          callbacks: { label: (c) => ` ${c.label}: ${c.parsed}%` },
        },
      },
    },
  });

  const ctx2 = document.getElementById('speakerChart');
  if (!ctx2) return;
  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Teachers', 'Students'],
      datasets: [{
        data: [45.09, 54.91],
        backgroundColor: ['rgba(245,158,11,0.7)', 'rgba(236,72,153,0.7)'],
        borderColor: ['#f59e0b', '#ec4899'],
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
        tooltip: {
          callbacks: { label: (c) => ` ${c.label}: ${c.parsed}%` },
        },
      },
    },
  });
})();

// Model Agreement Bar Charts
(function initResultCharts() {
  const barOptions = (title) => ({
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c) => ` Agreement: ${c.parsed.x}%` },
      },
    },
    scales: {
      x: {
        min: 75,
        max: 95,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { callback: (v) => v + '%' },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 12, weight: '600' } },
      },
    },
  });

  const models = ['DeepSeek-v3.1', 'Qwen3-Max', 'Gemini-2.5-pro', 'GPT-5'];
  const ecqrsData = [87.3, 85.7, 85.6, 83.4];
  const sstewData = [87.9, 86.6, 84.1, 84.5];

  const ecqrsCtx = document.getElementById('ecqrsChart');
  if (ecqrsCtx) {
    new Chart(ecqrsCtx, {
      type: 'bar',
      data: {
        labels: models,
        datasets: [{
          data: ecqrsData,
          backgroundColor: [
            'rgba(0,245,255,0.8)',
            'rgba(0,245,255,0.55)',
            'rgba(0,245,255,0.4)',
            'rgba(0,245,255,0.25)',
          ],
          borderColor: '#00f5ff',
          borderWidth: 1,
          borderRadius: 6,
        }],
      },
      options: barOptions('ECQRS-EC Agreement'),
    });
  }

  const sstewCtx = document.getElementById('sstewChart');
  if (sstewCtx) {
    new Chart(sstewCtx, {
      type: 'bar',
      data: {
        labels: models,
        datasets: [{
          data: sstewData,
          backgroundColor: [
            'rgba(139,92,246,0.8)',
            'rgba(139,92,246,0.55)',
            'rgba(139,92,246,0.4)',
            'rgba(139,92,246,0.25)',
          ],
          borderColor: '#8b5cf6',
          borderWidth: 1,
          borderRadius: 6,
        }],
      },
      options: barOptions('SSTEW Agreement'),
    });
  }
})();

// ===== BibTeX Copy Button =====
(function initCopyBtn() {
  const btn = document.getElementById('copyBibtex');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    // Get raw text, stripping any HTML spans
    const el = document.getElementById('bibtexCode');
    const text = el.innerText || el.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy BibTeX';
      }, 2500);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.classList.add('copied');
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy BibTeX';
      }, 2500);
    }
  });
})();

// ===== Smooth Navbar =====
(function initNav() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.padding = '0.6rem 2rem';
    } else {
      nav.style.padding = '1rem 2rem';
    }
  }, { passive: true });
})();
