// ===== Particle Canvas (light theme) =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], animId, isMobile;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    isMobile = window.innerWidth < 768;
    const density = isMobile ? 50000 : 18000;
    const count = Math.floor((canvas.width * canvas.height) / density);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.25 + 0.05,
        color: Math.random() > 0.5 ? '37,99,235' : '124,58,237',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    if (!isMobile) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${0.04 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  resize(); createParticles(); draw();

  const obs = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize(); createParticles(); draw();
  });
  obs.observe(canvas.parentElement);
})();

// ===== Scroll Reveal =====
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// ===== Animated Counters =====
(function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.floor(val) : val.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(update);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();

// ===== Stat Bars (Dataset section) =====
(function initStatBars() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.sb-fill[data-pct]').forEach(el => {
        el.style.width = parseFloat(el.dataset.pct) + '%';
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  const sb = document.querySelector('.stat-bars');
  if (sb) io.observe(sb);
})();

// ===== Efficiency Bars Animation =====
(function initEffBars() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.eff-fill[data-pct]').forEach(el => {
        el.style.width = parseFloat(el.dataset.pct) + '%';
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  const eff = document.querySelector('.efficiency-bar');
  if (eff) io.observe(eff);
})();

// ===== Charts =====
Chart.defaults.color = '#64748b';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;

// Inline data label plugin — shows values to the right of each bar
Chart.register({
  id: 'barDatalabels',
  afterDraw(chart) {
    if (chart.config.type !== 'bar') return;
    const { ctx } = chart;
    chart.data.datasets.forEach((ds, i) => {
      chart.getDatasetMeta(i).data.forEach((bar, j) => {
        const val = ds.data[j];
        ctx.save();
        ctx.fillStyle = j === 0 ? '#0f172a' : '#475569';
        ctx.font = `${j === 0 ? '700' : '600'} 11px "Inter", -apple-system, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(val + '%', bar.x + 6, bar.y);
        ctx.restore();
      });
    });
  }
});

// Bar Charts — Model Agreement
const barOpts = (color) => ({
  responsive: true,
  indexAxis: 'y',
  layout: { padding: { right: 8 } },
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (c) => ` ${c.parsed.x}% agreement` } },
  },
  scales: {
    x: {
      min: 78, max: 93,
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: { callback: v => v + '%', font: { size: 11 } },
      border: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: { font: { size: 12, weight: '600' }, color: '#1e293b' },
      border: { display: false },
    },
  },
});

const models = ['DeepSeek-v3.1', 'Qwen3-Max', 'GPT-5', 'Gemini-2.5-pro'];

const ecqrsCtx = document.getElementById('ecqrsChart');
if (ecqrsCtx) {
  new Chart(ecqrsCtx, {
    type: 'bar',
    data: {
      labels: models,
      datasets: [{
        data: [87.3, 85.7, 83.4, 85.6],
        backgroundColor: models.map((_, i) => `rgba(37,99,235,${0.85 - i * 0.15})`),
        borderColor: '#2563eb',
        borderWidth: 0,
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: barOpts('#2563eb'),
  });
}

const sstewCtx = document.getElementById('sstewChart');
if (sstewCtx) {
  new Chart(sstewCtx, {
    type: 'bar',
    data: {
      labels: models,
      datasets: [{
        data: [87.9, 86.6, 84.5, 84.1],
        backgroundColor: models.map((_, i) => `rgba(124,58,237,${0.85 - i * 0.15})`),
        borderColor: '#7c3aed',
        borderWidth: 0,
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: barOpts('#7c3aed'),
  });
}

// ===== BibTeX Copy =====
(function initCopy() {
  const btn = document.getElementById('copyBibtex');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const text = document.getElementById('bibtexCode').innerText;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = Object.assign(document.createElement('textarea'), {
        value: text, style: 'position:fixed;opacity:0'
      });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    btn.classList.add('copied');
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy BibTeX';
    }, 2500);
  });
})();
