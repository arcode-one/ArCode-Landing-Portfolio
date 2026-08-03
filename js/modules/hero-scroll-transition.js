function setupHeroScrollTransition() {
	const hero = document.querySelector(".hero");
	const stage = hero?.querySelector(".hero__stage");
	const intro = hero?.querySelector(".hero__content");
	const cardShell = hero?.querySelector(".hero-card-shell");
	const card = hero?.querySelector(".hero-card");
	const marquee = hero?.querySelector(".marquee");
	const about = document.querySelector(".about");
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const { gsap, ScrollTrigger } = window;

	if (
		!hero ||
		!stage ||
		!intro ||
		!cardShell ||
		!card ||
		!gsap ||
		!ScrollTrigger ||
		reduceMotion.matches
	) {
		return;
	}

	gsap.registerPlugin(ScrollTrigger);
	const isTouchDevice =
		ScrollTrigger.isTouch > 0 ||
		window.matchMedia("(pointer: coarse)").matches;
	const isCompactLayout =
		isTouchDevice || window.matchMedia("(max-width: 1024px)").matches;
	const viewportHeight = document.documentElement.clientHeight;
	const transitionDistance = isTouchDevice
		? Math.max(viewportHeight * 0.85, 560)
		: Math.max(viewportHeight * 1.05, 680);

	if (isTouchDevice) {
		ScrollTrigger.config({ ignoreMobileResize: true });
		hero.classList.add("hero--touch-transition");
	}

	hero.classList.add("hero--scroll-transition");
	card.classList.add("hero-intro--card-ready");

	const syncResponsiveMarqueeSpacing = () => {
		if (!marquee || !about) {
			return;
		}

		if (
			!isTouchDevice &&
			!window.matchMedia("(max-width: 1024px)").matches
		) {
			marquee.style.removeProperty("margin-top");
			return;
		}

		const stageHeight = stage.getBoundingClientRect().height;
		const cardHeight = card.offsetHeight;
		const heroStyles = window.getComputedStyle(hero);
		const aboutStyles = window.getComputedStyle(about);
		const cardStyles = window.getComputedStyle(card);
		let cardShiftY = 0;

		if (cardStyles.transform !== "none") {
			try {
				cardShiftY = new DOMMatrixReadOnly(cardStyles.transform).m42;
			} catch {
				cardShiftY = 30;
			}
		}

		const cardBottomGap = Math.max(
			(stageHeight - cardHeight) / 2 - cardShiftY,
			0,
		);
		const targetGap =
			Number.parseFloat(heroStyles.paddingBottom) +
			Number.parseFloat(aboutStyles.paddingTop);
		const marqueeOffset = targetGap - cardBottomGap;

		marquee.style.marginTop = `${Math.round(marqueeOffset)}px`;
	};

	syncResponsiveMarqueeSpacing();

	gsap.set(intro, {
		transformOrigin: "50% 45%",
		force3D: true,
	});
	gsap.set(cardShell, {
		autoAlpha: 1,
		yPercent: isCompactLayout ? 80 : 110,
		transformOrigin: "50% 50%",
		pointerEvents: "none",
		force3D: true,
	});

	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: stage,
			start: "top top",
			end: `+=${transitionDistance}`,
			scrub: isTouchDevice ? true : 0.4,
			pin: true,
			pinSpacing: true,
			anticipatePin: 1,
			invalidateOnRefresh: true,
			onRefreshInit: syncResponsiveMarqueeSpacing,
			onUpdate: ({ progress }) => {
				cardShell.style.pointerEvents = progress >= 0.94 ? "auto" : "none";
			},
		},
	});

	timeline
		.to(
			intro,
			{
				autoAlpha: 0,
				yPercent: -4,
				scale: 0.985,
				duration: 0.46,
				ease: "power2.inOut",
			},
			0,
		)
		.to(
			cardShell,
			{
				yPercent: 0,
				duration: 0.85,
				ease: "none",
			},
			isCompactLayout ? 0.18 : 0.3,
		);

	if (document.fonts?.ready) {
		document.fonts.ready.then(() => {
			syncResponsiveMarqueeSpacing();
			ScrollTrigger.refresh();
		});
	}
}

export function initHeroScrollTransition() {
	if (window.gsap && window.ScrollTrigger) {
		setupHeroScrollTransition();
		return;
	}

	window.addEventListener("load", setupHeroScrollTransition, { once: true });
}
