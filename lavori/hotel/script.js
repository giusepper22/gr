// Effetto Reveal on Scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Gestione Navbar (scrolled) e Sticky CTA
const nav = document.getElementById("nav");
const stickyCta = document.getElementById("stickyCta");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  
  if (nav) {
    nav.classList.toggle("scrolled", y > 40);
  }
  
  if (stickyCta) {
    stickyCta.classList.toggle("visible", y > 600);
  }
});