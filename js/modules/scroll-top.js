export function initScrollTop() {
  const scrollTopButton = document.querySelector(".scroll-top");
  const triggerSection = document.querySelector(".hero-card");

  if (!scrollTopButton || !triggerSection) {
    return;
  }

  const toggleScrollTop = () => {
    const triggerPoint = triggerSection.offsetTop;
    const isVisible = window.scrollY >= triggerPoint;

    scrollTopButton.classList.toggle("scroll-top--visible", isVisible);
  };

  window.addEventListener("scroll", toggleScrollTop, { passive: true });
  window.addEventListener("resize", toggleScrollTop);

  toggleScrollTop();
}
