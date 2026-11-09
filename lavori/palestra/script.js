// Gestione delle animazioni di entrata (Reveal on scroll)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

// Applica l'osservatore a tutti gli elementi con la classe .reveal
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));