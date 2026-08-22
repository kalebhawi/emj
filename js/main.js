document.addEventListener("DOMContentLoaded", function () {
  // Smooth scroll via CSS fallback already, but ensure behavior for older browsers
  try {
    document.documentElement.style.scrollBehavior = "smooth";
  } catch (e) {}

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  reveals.forEach((el, i) => {
    el.style.transitionDelay = i * 60 + "ms";
    io.observe(el);
  });

  // Hero logo gentle parallax on mouse move
  const hero = document.querySelector(".hero");
  const logo = document.querySelector(".hero-logo");
  if (hero && logo) {
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const tx = x * 10;
      const ty = y * 8;
      logo.style.transform = `translate(${tx}px, ${ty}px) scale(1.02)`;
    });
    hero.addEventListener("mouseleave", () => {
      logo.style.transform = "";
    });
  }

  // Add small staggered reveal for service cards
  const cards = document.querySelectorAll(".services-grid .service-card");
  cards.forEach((c, idx) => {
    c.classList.add("reveal");
    c.style.transitionDelay = 140 + idx * 60 + "ms";
  });
});
