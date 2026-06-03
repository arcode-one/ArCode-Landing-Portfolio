export function initHeroCardHoverFix() {
  const card = document.querySelector(".hero-intro--card");

  if (!card) {
    return;
  }

  const releaseCardTransform = () => {
    card.classList.add("hero-intro--card-ready");
  };

  card.addEventListener("animationend", (event) => {
    if (event.animationName === "hero-intro-card-move") {
      releaseCardTransform();
    }
  });

  window.setTimeout(releaseCardTransform, 1400);
}
