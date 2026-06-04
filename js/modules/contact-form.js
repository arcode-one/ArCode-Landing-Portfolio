function setStatus(statusNode, message, type) {
  if (!statusNode) {
    return;
  }

  statusNode.hidden = false;
  statusNode.textContent = message;
  statusNode.dataset.state = type;
}

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const statusNode = form.querySelector(".contact-form__status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = "Отправляется...";
    }

    if (statusNode) {
      statusNode.hidden = true;
      statusNode.textContent = "";
      delete statusNode.dataset.state;
    }

    try {
      const response = await fetch(form.action, {
        method: form.method || "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      form.reset();
      setStatus(statusNode, "Заявка отправлена. Скоро свяжусь с тобой.", "success");
    } catch (error) {
      console.error(error);
      setStatus(
        statusNode,
        "Не получилось отправить заявку. Попробуй ещё раз или напиши в Telegram.",
        "error"
      );
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = "Отправить заявку";
      }
    }
  });
}
