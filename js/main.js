const socialLinks = {
  instagram: "https://www.instagram.com/encue7cuerpos?igsh=eXRpNjNianJoMWdx",
  whatsappNumber: "527291189182"
};

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) setTimeout(() => loader.classList.add("is-hidden"), 420);
});

const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mob-menu");

function syncNavbar() {
  navbar?.classList.toggle("scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", syncNavbar, { passive: true });
syncNavbar();

hamburger?.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("is-active");
  mobileMenu?.classList.toggle("is-open", isOpen);
  navbar?.classList.toggle("menu-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("is-active");
    mobileMenu.classList.remove("is-open");
    navbar?.classList.remove("menu-open");
    hamburger?.setAttribute("aria-expanded", "false");
  });
});

const marquee = document.getElementById("marquee");
if (marquee) {
  const items = [
    "Modelo de los 7 Cuerpos",
    "Escuela online de 12 meses",
    "Terapia EN-CUE",
    "Diagnostico energetico integral",
    "CISENCUE",
    "Musica consciente",
    "Libro EN-CUE noviembre 2026"
  ];
  const row = items.map((item) => `<span>${item}</span><i class="fa-solid fa-spa"></i>`).join("");
  marquee.innerHTML = row + row;
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = target > 100 ? 1500 : 950;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.4 });

document.querySelectorAll(".stat-num").forEach((el) => countObserver.observe(el));

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const form = document.getElementById("wa-form");
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("f-name")?.value.trim();
  const interest = document.getElementById("f-interest")?.value;
  const message = document.getElementById("f-msg")?.value.trim();

  if (!name || !message) {
    form.reportValidity();
    return;
  }

  const text = `Hola EN-CUE, soy ${name}. Me interesa: ${interest}. ${message}`;
  const waLink = `https://wa.me/${socialLinks.whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(waLink, "_blank", "noopener,noreferrer");
});

const canvas = document.getElementById("hero-canvas");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
  let width = 0;
  let height = 0;
  let points = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = Array.from({ length: Math.floor(Math.min(width, 1280) / 22) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + .45,
      vx: (Math.random() - .5) * .16,
      vy: (Math.random() - .5) * .14,
      hue: Math.random() > .62 ? "85, 214, 194" : "255, 227, 155"
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    points.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.hue}, .58)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < points.length; j += 1) {
        const q = points[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 125) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 227, 155, ${.11 * (1 - dist / 125)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
}
