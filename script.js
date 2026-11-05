/* ==========================================================================
   1. Reveal sections as they scroll into view
   (the .reveal and .visible styles live in style.css)
   ========================================================================== */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12 }, // reveal when 12% of the section is on screen
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  // Very old browsers: just show everything
  revealItems.forEach((item) => item.classList.add("visible"));
}

/* ==========================================================================
   2. Highlight the nav link of the section you are viewing
   ========================================================================== */
const nav = document.querySelector("nav");
const navLinks = document.querySelectorAll("nav a");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// On phones the nav scrolls sideways, so keep the current link in view
function keepLinkInView(link) {
  if (nav.scrollWidth <= nav.clientWidth) return; // everything fits already

  nav.scrollTo({
    left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

if ("IntersectionObserver" in window) {
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "location");
            keepLinkInView(link);
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    // A thin band across the middle of the screen decides the "current" section
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach((section) => navObserver.observe(section));
}
