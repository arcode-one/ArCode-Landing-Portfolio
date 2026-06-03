export function initHeroLine() {
  const line = document.querySelector(".hero__line");
  const nextSection = document.querySelector("#why");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!line || !nextSection || reduceMotion.matches) {
    return;
  }

  let isActive = true;

  const updateState = () => {
    const nextSectionTop = nextSection.getBoundingClientRect().top;
    isActive = nextSectionTop > window.innerHeight * 0.5;

    if (!isActive) {
      line.style.transform = "translateY(0)";
      line.style.opacity = "0.9";
    }
  };

  const animate = (time) => {
    if (isActive) {
      const progress = time / 1100;
      const offset = Math.sin(progress) * 8;
      const opacity = 0.7 + ((Math.sin(progress) + 1) / 2) * 0.3;

      line.style.transform = `translateY(${offset}px)`;
      line.style.opacity = opacity.toFixed(3);
    }

    window.requestAnimationFrame(animate);
  };

  window.addEventListener("scroll", updateState, { passive: true });
  window.addEventListener("resize", updateState);

  updateState();
  window.requestAnimationFrame(animate);
}
