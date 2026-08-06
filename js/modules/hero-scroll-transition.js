function setupHeroScrollTransition() {
	const hero = document.querySelector(".hero");
	const stage = hero?.querySelector(".hero__stage");
	const sticky = hero?.querySelector(".hero__sticky");
	const intro = hero?.querySelector(".hero__content");
	const line = hero?.querySelector(".hero__line");
	const cardShell = hero?.querySelector(".hero-card-shell");
	const card = hero?.querySelector(".hero-card");
	const marquee = hero?.querySelector(".marquee");
	const nextSection = hero?.nextElementSibling;
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const { gsap, ScrollTrigger } = window;

	if (
		!hero ||
		!stage ||
		!sticky ||
		!intro ||
		!line ||
		!cardShell ||
		!card ||
		!gsap ||
		!ScrollTrigger ||
		reduceMotion.matches
	) {
		return;
	}

	gsap.registerPlugin(ScrollTrigger);
	ScrollTrigger.clearScrollMemory?.("manual");
	const isTouchDevice =
		ScrollTrigger.isTouch > 0 ||
		window.matchMedia("(pointer: coarse)").matches;
	const isCompactLayout =
		isTouchDevice || window.matchMedia("(max-width: 1024px)").matches;
	const viewportHeight = document.documentElement.clientHeight;
	const transitionDistance = isTouchDevice
		? Math.max(viewportHeight * 0.85, 560)
		: Math.max(viewportHeight * 1.05, 680);
	stage.style.setProperty(
		"--hero-transition-distance",
		`${Math.round(transitionDistance)}px`,
	);

	if (isTouchDevice) {
		ScrollTrigger.config({ ignoreMobileResize: true });
		hero.classList.add("hero--touch-transition");
	}

	hero.classList.add("hero--scroll-transition");
	card.classList.add("hero-intro--card-ready");

	const syncMarqueeSpacing = () => {
		if (!marquee || !nextSection) {
			return;
		}

		const stageHeight = sticky.getBoundingClientRect().height;
		const cardHeight = card.offsetHeight;
		const heroStyles = window.getComputedStyle(hero);
		const nextSectionStyles = window.getComputedStyle(nextSection);
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
			Number.parseFloat(nextSectionStyles.paddingTop);
		const marqueeOffset = targetGap - cardBottomGap;

		marquee.style.marginTop = `${Math.round(marqueeOffset)}px`;
	};

	syncMarqueeSpacing();

	gsap.set(intro, {
		transformOrigin: "50% 45%",
		force3D: true,
	});
	gsap.set(cardShell, {
		transformOrigin: "50% 50%",
		pointerEvents: "none",
		force3D: true,
	});

	let isCardInteractive = false;
	const cardInteractiveProgress = 0.18;

	const resetCardTilt = () => {
		card.style.setProperty("--hero-card-rotate-x", "0deg");
		card.style.setProperty("--hero-card-rotate-y", "0deg");
		card.style.setProperty("--hero-card-shift-x", "0px");
		card.style.setProperty("--hero-card-shift-y", "0px");
		card.style.setProperty("--hero-card-glow-opacity", "0");
	};

	const setCardInteractive = (interactive) => {
		if (interactive === isCardInteractive) {
			return;
		}

		isCardInteractive = interactive;
		cardShell.style.pointerEvents = "none";
		card.style.pointerEvents = interactive ? "auto" : "none";

		if (!interactive) {
			resetCardTilt();
		}
	};

	const restoreHeroStartState = () => {
		if (window.__arcodePageLeaving) {
			return;
		}

		gsap.set(intro, {
			autoAlpha: 1,
			yPercent: 0,
			scale: 1,
		});
		gsap.set(cardShell, {
			autoAlpha: 1,
			yPercent: 88,
		});
		gsap.set(line, { autoAlpha: 1 });
		setCardInteractive(false);
	};

	const timeline = gsap.timeline({ paused: true });

	timeline
		.fromTo(
			line,
			{ autoAlpha: 1 },
			{
				autoAlpha: 0,
				duration: 0.24,
				ease: "power1.out",
				immediateRender: true,
			},
			0,
		)
		.fromTo(
			intro,
			{
				autoAlpha: 1,
				yPercent: 0,
				scale: 1,
			},
			{
				autoAlpha: 0,
				yPercent: -4,
				scale: 0.985,
				duration: 0.56,
				ease: "power2.inOut",
				immediateRender: true,
			},
			0,
		)
		.fromTo(
			cardShell,
			{
				autoAlpha: 1,
				yPercent: 88,
			},
			{
				autoAlpha: 1,
				yPercent: 0,
				duration: 0.85,
				ease: "none",
				immediateRender: true,
			},
			0.12,
		);

	let progressTween = null;

	window.addEventListener("beforeunload", () => {
		if (progressTween) {
			progressTween.kill();
			progressTween = null;
		}
	});

	const setTimelineProgress = (
		progress,
		{ immediate = false, isActive = false } = {},
	) => {
		if (window.__arcodePageLeaving) {
			return;
		}

		const targetProgress = gsap.utils.clamp(0, 1, progress);
		const isInteractive = targetProgress >= cardInteractiveProgress;

		if (progressTween) {
			progressTween.kill();
			progressTween = null;
		}

		if (immediate || isTouchDevice) {
			timeline.progress(targetProgress);
			setCardInteractive(isInteractive);
			return;
		}

		setCardInteractive(isInteractive);
		progressTween = gsap.to(timeline, {
			progress: targetProgress,
			duration: 0.18,
			ease: "power1.out",
			overwrite: true,
			onComplete: () => {
				progressTween = null;
				setCardInteractive(isInteractive);
			},
		});
	};

	const scrollTrigger = ScrollTrigger.create({
		trigger: stage,
		start: "top top",
		end: `+=${transitionDistance}`,
		onRefreshInit: syncMarqueeSpacing,
		onRefresh: ({ progress, isActive }) => {
			setTimelineProgress(progress, { immediate: true, isActive });
		},
		onUpdate: ({ progress, isActive }) => {
			setTimelineProgress(progress, { isActive });
		},
		onLeaveBack: () => {
			if (window.__arcodePageLeaving) {
				return;
			}

			setTimelineProgress(0, { immediate: true });
			restoreHeroStartState();
		},
	});

	let pendingRestoredScrollY = Number(window.__arcodeRestoreScrollY);
	let syncFrame = 0;
	let releaseFrame = 0;

	if (!Number.isFinite(pendingRestoredScrollY)) {
		pendingRestoredScrollY = null;
	}

	const scrollInstantlyTo = (scrollY) => {
		const root = document.documentElement;
		const previousBehavior = root.style.scrollBehavior;
		root.style.scrollBehavior = "auto";
		window.scrollTo(0, scrollY);
		root.style.scrollBehavior = previousBehavior;
	};

	const releaseRestoredViewAfterPaint = () => {
		if (typeof window.__arcodeReleaseScrollRestore !== "function") {
			return;
		}

		window.cancelAnimationFrame(releaseFrame);
		releaseFrame = window.requestAnimationFrame(() => {
			releaseFrame = window.requestAnimationFrame(() => {
				releaseFrame = 0;
				window.__arcodeReleaseScrollRestore?.();
			});
		});
	};

	const syncHeroScrollState = () => {
		scrollTrigger.refresh();

		if (pendingRestoredScrollY !== null) {
			scrollInstantlyTo(pendingRestoredScrollY);
			pendingRestoredScrollY = null;
			window.__arcodeRestoreScrollY = null;
		}

		scrollTrigger.update();
		setTimelineProgress(scrollTrigger.progress, {
			immediate: true,
			isActive: scrollTrigger.isActive,
		});

		if (scrollTrigger.progress <= 0.001) {
			restoreHeroStartState();
		}

		releaseRestoredViewAfterPaint();
	};

	const scheduleHeroScrollSync = () => {
		window.cancelAnimationFrame(syncFrame);
		syncFrame = window.requestAnimationFrame(() => {
			syncFrame = window.requestAnimationFrame(syncHeroScrollState);
		});
	};

	window.addEventListener("pageshow", scheduleHeroScrollSync);
	scheduleHeroScrollSync();

	if (document.fonts?.ready) {
		document.fonts.ready.then(() => {
			syncMarqueeSpacing();
			scheduleHeroScrollSync();
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
