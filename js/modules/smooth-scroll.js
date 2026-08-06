const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getScrollableParent = (startElement, deltaY) => {
	let element = startElement instanceof Element ? startElement : null;

	while (element && element !== document.body) {
		const styles = window.getComputedStyle(element);
		const canScroll =
			/(auto|scroll|overlay)/.test(styles.overflowY) &&
			element.scrollHeight > element.clientHeight + 1;

		if (canScroll) {
			const hasRoomAbove = deltaY < 0 && element.scrollTop > 0;
			const hasRoomBelow =
				deltaY > 0 &&
				element.scrollTop + element.clientHeight < element.scrollHeight - 1;

			if (hasRoomAbove || hasRoomBelow) {
				return element;
			}
		}

		element = element.parentElement;
	}

	return null;
};

export function initSmoothScroll() {
	const root = document.documentElement;
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
	const wheelMultiplier = 0.82;
	const smoothing = 0.085;
	let currentY = window.scrollY;
	let targetY = currentY;
	let animationFrame = 0;
	let previousFrameTime = 0;
	let enabled = false;

	const getMaxScroll = () =>
		Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);

	const stopAnimation = () => {
		window.cancelAnimationFrame(animationFrame);
		animationFrame = 0;
		previousFrameTime = 0;
		currentY = window.scrollY;
		targetY = currentY;
	};

	const animate = (time) => {
		const elapsed = previousFrameTime ? Math.min(time - previousFrameTime, 34) : 16.67;
		const frameSmoothing = 1 - Math.pow(1 - smoothing, elapsed / 16.67);
		const distance = targetY - currentY;

		previousFrameTime = time;

		if (Math.abs(distance) <= 0.35) {
			currentY = targetY;
			window.scrollTo(0, currentY);
			animationFrame = 0;
			previousFrameTime = 0;
			return;
		}

		currentY += distance * frameSmoothing;
		window.scrollTo(0, currentY);
		animationFrame = window.requestAnimationFrame(animate);
	};

	const startAnimation = () => {
		if (!animationFrame) {
			currentY = window.scrollY;
			animationFrame = window.requestAnimationFrame(animate);
		}
	};

	const scrollToPosition = (position) => {
		targetY = clamp(position, 0, getMaxScroll());
		startAnimation();
	};

	const normalizeWheelDelta = (event) => {
		if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
			return event.deltaY * 18;
		}

		if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
			return event.deltaY * window.innerHeight * 0.9;
		}

		return event.deltaY;
	};

	const handleWheel = (event) => {
		if (
			!enabled ||
			event.defaultPrevented ||
			event.ctrlKey ||
			event.metaKey ||
			Math.abs(event.deltaX) > Math.abs(event.deltaY)
		) {
			return;
		}

		const deltaY = normalizeWheelDelta(event);

		if (!deltaY || getScrollableParent(event.target, deltaY)) {
			return;
		}

		event.preventDefault();

		if (!animationFrame) {
			currentY = window.scrollY;
			targetY = currentY;
		}

		const maxLead = window.innerHeight * 1.45;
		const requestedTarget = targetY + deltaY * wheelMultiplier;
		const limitedTarget = clamp(
			requestedTarget,
			currentY - maxLead,
			currentY + maxLead,
		);

		targetY = clamp(limitedTarget, 0, getMaxScroll());
		startAnimation();
	};

	const handleAnchorClick = (event) => {
		if (
			!enabled ||
			event.defaultPrevented ||
			event.button !== 0 ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		const link = event.target.closest("a[href]");

		if (!link) {
			return;
		}

		const url = new URL(link.href, window.location.href);

		if (
			url.origin !== window.location.origin ||
			url.pathname !== window.location.pathname ||
			url.search !== window.location.search ||
			!url.hash
		) {
			return;
		}

		const targetId = decodeURIComponent(url.hash.slice(1));
		const target = document.getElementById(targetId);

		if (!target) {
			return;
		}

		event.preventDefault();

		const scrollOffset = Number.parseFloat(
			window.getComputedStyle(root).scrollPaddingTop,
		);
		const targetPosition =
			targetId === "top"
				? 0
				: window.scrollY +
					target.getBoundingClientRect().top -
					(Number.isFinite(scrollOffset) ? scrollOffset : 0);

		if (window.location.hash !== url.hash) {
			window.history.pushState(null, "", url.hash);
		}

		scrollToPosition(targetPosition);
	};

	const handleKeydown = (event) => {
		const activeElement = document.activeElement;
		const isInteractive =
			activeElement instanceof HTMLElement &&
			(activeElement.isContentEditable ||
				/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(activeElement.tagName) ||
				activeElement.matches("a[href], summary, [role='button']"));

		if (
			!enabled ||
			event.defaultPrevented ||
			isInteractive ||
			event.ctrlKey ||
			event.metaKey ||
			event.altKey
		) {
			return;
		}

		let nextTarget = null;
		const pageStep = window.innerHeight * 0.82;

		switch (event.key) {
			case "ArrowDown":
				nextTarget = targetY + 110;
				break;
			case "ArrowUp":
				nextTarget = targetY - 110;
				break;
			case "PageDown":
				nextTarget = targetY + pageStep;
				break;
			case "PageUp":
				nextTarget = targetY - pageStep;
				break;
			case " ":
				nextTarget = targetY + (event.shiftKey ? -pageStep : pageStep);
				break;
			case "Home":
				nextTarget = 0;
				break;
			case "End":
				nextTarget = getMaxScroll();
				break;
			default:
				return;
		}

		event.preventDefault();

		if (!animationFrame) {
			currentY = window.scrollY;
			targetY = currentY;
		}

		scrollToPosition(nextTarget);
	};

	const syncWithNativeScroll = () => {
		if (!animationFrame) {
			currentY = window.scrollY;
			targetY = currentY;
		}
	};

	const syncEnabledState = () => {
		enabled = finePointer.matches && !reduceMotion.matches;
		root.classList.toggle("smooth-scroll-enabled", enabled);

		if (!enabled) {
			stopAnimation();
		}
	};

	window.addEventListener("wheel", handleWheel, { passive: false });
	document.addEventListener("click", handleAnchorClick);
	window.addEventListener("scroll", syncWithNativeScroll, { passive: true });
	window.addEventListener("resize", () => {
		targetY = clamp(targetY, 0, getMaxScroll());
	});
	window.addEventListener("pointerdown", stopAnimation, { passive: true });
	window.addEventListener("keydown", handleKeydown);
	reduceMotion.addEventListener("change", syncEnabledState);
	finePointer.addEventListener("change", syncEnabledState);

	syncEnabledState();
}
