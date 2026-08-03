export function initScrollTop() {
  const scrollTopButton = document.querySelector(".scroll-top");
  const triggerSection = document.querySelector("#about");

  if (!scrollTopButton) {
    return;
  }

  const toggleScrollTop = () => {
    const triggerPoint = triggerSection
      ? Math.max(triggerSection.offsetTop - window.innerHeight * 0.5, 320)
      : 320;
    const isVisible = window.scrollY >= triggerPoint;

    scrollTopButton.classList.toggle("scroll-top--visible", isVisible);
  };

  window.addEventListener("scroll", toggleScrollTop, { passive: true });
  window.addEventListener("resize", toggleScrollTop);

  toggleScrollTop();
}
