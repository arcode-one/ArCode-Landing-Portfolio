export function initHeroCardTilt() {
  const card = document.querySelector(".hero-card");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!card || reduceMotion.matches || window.innerWidth <= 992) {
    return;
  }

  const resetTilt = () => {
    card.style.setProperty("--hero-card-rotate-x", "0deg");
    card.style.setProperty("--hero-card-rotate-y", "0deg");
    card.style.setProperty("--hero-card-shift-x", "0px");
    card.style.setProperty("--hero-card-shift-y", "0px");
    card.style.setProperty("--hero-card-glow-x", "50%");
    card.style.setProperty("--hero-card-glow-y", "50%");
    card.style.setProperty("--hero-card-glow-opacity", "0");
  };

  const updateTilt = (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 5;
    const rotateX = (0.5 - py) * 4;
    const shiftX = (px - 0.5) * 6;
    const shiftY = (py - 0.5) * 4;

    card.style.setProperty("--hero-card-rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--hero-card-rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--hero-card-shift-x", `${shiftX.toFixed(2)}px`);
    card.style.setProperty("--hero-card-shift-y", `${shiftY.toFixed(2)}px`);
    card.style.setProperty("--hero-card-glow-x", `${(px * 100).toFixed(2)}%`);
    card.style.setProperty("--hero-card-glow-y", `${(py * 100).toFixed(2)}%`);
    card.style.setProperty("--hero-card-glow-opacity", "1");
  };

  card.addEventListener("mouseenter", updateTilt);
  card.addEventListener("mousemove", updateTilt);
  card.addEventListener("mouseleave", resetTilt);

  resetTilt();
}
