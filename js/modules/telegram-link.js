export function initTelegramLinks() {
  const telegramLinks = Array.from(
    document.querySelectorAll("[data-telegram-link]")
  );

  if (!telegramLinks.length) {
    return;
  }

  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);

  if (!isTouchDevice) {
    return;
  }

  telegramLinks.forEach((link) => {
    const appHref = link.dataset.telegramApp;
    const fallbackHref = link.dataset.telegramFallback || link.href;

    if (!appHref || !fallbackHref) {
      return;
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();

      const fallbackTimer = window.setTimeout(() => {
        window.location.href = fallbackHref;
      }, 700);

      const clearFallback = () => {
        window.clearTimeout(fallbackTimer);
        window.removeEventListener("pagehide", clearFallback);
        document.removeEventListener("visibilitychange", clearOnHide);
      };

      const clearOnHide = () => {
        if (document.visibilityState === "hidden") {
          clearFallback();
        }
      };

      window.addEventListener("pagehide", clearFallback, { once: true });
      document.addEventListener("visibilitychange", clearOnHide);

      window.location.href = appHref;
    });
  });
}
