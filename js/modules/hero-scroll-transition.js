function setupHeroScrollTransition() {
	const hero = document.querySelector(".hero");
	const stage = hero?.querySelector(".hero__stage");
	const intro = hero?.querySelector(".hero__content");
	const cardShell = hero?.querySelector(".hero-card-shell");
	const card = hero?.querySelector(".hero-card");
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
	hero.classList.add("hero--scroll-transition");
	card.classList.add("hero-intro--card-ready");

	gsap.set(intro, {
		transformOrigin: "50% 45%",
		force3D: true,
	});
	gsap.set(cardShell, {
		autoAlpha: 1,
		yPercent: 110,
		transformOrigin: "50% 50%",
		pointerEvents: "none",
		force3D: true,
	});

	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: stage,
			start: "top top",
			end: () => `+=${Math.max(window.innerHeight * 1.05, 680)}`,
			scrub: 0.4,
			pin: true,
			pinSpacing: true,
			anticipatePin: 1,
			invalidateOnRefresh: true,
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
			0.3,
		);

	if (document.fonts?.ready) {
		document.fonts.ready.then(() => ScrollTrigger.refresh());
	}
}

export function initHeroScrollTransition() {
	if (window.gsap && window.ScrollTrigger) {
		setupHeroScrollTransition();
		return;
	}

	window.addEventListener("load", setupHeroScrollTransition, { once: true });
}
