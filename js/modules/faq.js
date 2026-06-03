export function initFaq() {
  const buttons = document.querySelectorAll(".faq__question");

  if (buttons.length === 0) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq__item");

      if (!item) {
        return;
      }

      const isOpening = !item.classList.contains("is-active");

      document.querySelectorAll(".faq__item").forEach((element) => {
        if (element !== item) {
          element.classList.remove("is-active");
        }
      });

      item.classList.toggle("is-active", isOpening);
    });
  });
}
