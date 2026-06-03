export function initReveal() {
  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((element, index) => {
    element.style.setProperty(
      "--reveal-delay",
      `${Math.min(index * 45, 220)}ms`
    );
    observer.observe(element);
  });
}
