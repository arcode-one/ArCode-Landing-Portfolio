function setStatus(statusNode, message, type) {
	if (!statusNode) {
		return;
	}

	statusNode.hidden = false;
	statusNode.textContent = message;
	statusNode.dataset.state = type;
}

function initContactMethod(form) {
	const methodInputs = Array.from(
		form.querySelectorAll("[data-contact-method]"),
	);
	const contactPanels = Array.from(
		form.querySelectorAll("[data-contact-panel]"),
	);

	if (!methodInputs.length || !contactPanels.length) {
		return () => {};
	}

	const syncContactMethod = ({ focus = false } = {}) => {
		const selectedMethod = methodInputs.find((input) => input.checked);
		const method = selectedMethod?.dataset.contactMethod ?? "telegram";
		let activeInput = null;

		contactPanels.forEach((panel) => {
			const input = panel.querySelector("[data-contact-input]");
			const isActive = panel.dataset.contactPanel === method;

			panel.hidden = !isActive;

			if (input instanceof HTMLInputElement) {
				input.disabled = !isActive;
				input.required = isActive;
				input.setCustomValidity("");

				if (isActive) {
					activeInput = input;
				}
			}
		});

		if (focus && activeInput instanceof HTMLInputElement) {
			window.requestAnimationFrame(() => {
				activeInput.focus({ preventScroll: true });
			});
		}
	};

	methodInputs.forEach((input) => {
		input.addEventListener("change", () => {
			syncContactMethod({ focus: true });
		});
	});

	form.addEventListener("reset", () => {
		window.requestAnimationFrame(() => syncContactMethod());
	});

	syncContactMethod();

	return syncContactMethod;
}

export function initContactForm() {
	const form = document.querySelector("[data-contact-form]");

	if (!(form instanceof HTMLFormElement)) {
		return;
	}

	const submitButton = form.querySelector('button[type="submit"]');
	const statusNode = form.querySelector(".contact-form__status");
	const syncContactMethod = initContactMethod(form);
	let statusTimeoutId = 0;

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		if (submitButton instanceof HTMLButtonElement) {
			submitButton.disabled = true;
			submitButton.textContent = "Отправляется...";
		}

		if (statusNode) {
			window.clearTimeout(statusTimeoutId);
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
			syncContactMethod();
			setStatus(
				statusNode,
				"Заявка отправлена. Скоро свяжусь с тобой.",
				"success",
			);
		} catch (error) {
			console.error(error);
			setStatus(
				statusNode,
				"Не получилось отправить заявку. Попробуй ещё раз или напиши в Telegram.",
				"error",
			);
		} finally {
			if (statusNode && !statusNode.hidden) {
				statusTimeoutId = window.setTimeout(() => {
					statusNode.hidden = true;
					statusNode.textContent = "";
					delete statusNode.dataset.state;
				}, 7000);
			}

			if (submitButton instanceof HTMLButtonElement) {
				submitButton.disabled = false;
				submitButton.textContent = "Отправить заявку";
			}
		}
	});
}
