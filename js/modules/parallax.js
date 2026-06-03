export function initParallax() {
  const parallaxItems = document.querySelectorAll("[data-parallax]");

  if (parallaxItems.length === 0) {
    return;
  }

  const updateParallax = () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax);
      item.style.setProperty("--parallax-y", `${scrollY * speed}px`);
    });
  };

  window.addEventListener("scroll", updateParallax, { passive: true });
  updateParallax();
}
