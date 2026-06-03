export function initPriceStack() {
  const scene = document.querySelector(".price-scene");
  const cards = Array.from(document.querySelectorAll("[data-price-card]"));

  if (!scene || cards.length < 2) {
    return;
  }

  const updatePriceStack = () => {
    if (window.innerWidth <= 992) {
      cards.forEach((card) => {
        card.classList.remove("price--active");
      });
      return;
    }

    const viewportCenter = window.innerHeight * 0.5;
    let activeIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height * 0.5;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    cards.forEach((card, index) => {
      card.classList.toggle("price--active", index === activeIndex);
    });
  };

  let ticking = false;

  const requestUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(() => {
      updatePriceStack();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", updatePriceStack);

  updatePriceStack();
}
