let initialized = false;

function setupAboutMotion() {
	if (initialized) {
		return;
	}

	const section = document.querySelector(".about");
	const pin = section?.querySelector(".about__pin");
	const rail = section?.querySelector(".about__rail");
	const panels = Array.from(section?.querySelectorAll(".about-panel") ?? []);
	const progressBar = section?.querySelector(".about__progress-bar");
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const { gsap, ScrollTrigger } = window;

	if (!section || !pin || !rail || panels.length < 2) {
		return;
	}

	initialized = true;

	if (reduceMotion.matches) {
		return;
	}

	if (!gsap || !ScrollTrigger) {
		section.classList.add("about--static");
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	const media = gsap.matchMedia();

	media.add(
		{
			desktop: "(min-width: 1201px)",
			compactDesktop: "(min-width: 901px) and (max-width: 1200px)",
			mobile: "(max-width: 900px)",
		},
		(context) => {
			const { desktop } = context.conditions;

			section.classList.remove("about--static");

			const getHorizontalDistance = () =>
				Math.max(rail.scrollWidth - window.innerWidth, 0);

			const updateProgress = (progress) => {
				if (progressBar) {
					gsap.set(progressBar, { scaleX: progress });
				}
			};

			const serviceLayers = panels.slice(1).map((panel) => ({
				inner: panel.querySelector(".about-panel__inner"),
				offer: panel.querySelector(".about-service__offer"),
				watermark: panel.querySelector(".about-service__watermark"),
			}));
			const adaptiveTitleLayers = panels.map((panel, index) => {
				const inner = panel.querySelector(".about-panel__inner");
				const title = panel.querySelector(
					index === 0 ? ".about__title" : ".about-service__title",
				);

				return {
					inner,
					title,
					start:
						index === 0 ? panel.querySelector(".about__eyebrow") : title,
					end:
						index === 0
							? panel.querySelector(".about__lead")
							: panel.querySelector(".about-service__cta"),
				};
			});

			const positionAdaptiveTitles = () => {
				if (desktop || window.innerWidth > 820) {
					pin.style.removeProperty("--about-mobile-panel-top");
					pin.style.removeProperty("--about-mobile-title-leading");
					return;
				}

				const metrics = adaptiveTitleLayers
					.map(({ inner, title, start, end }) => {
						if (!inner || !title || !start || !end) {
							return null;
						}

						const titleRect = title.getBoundingClientRect();
						const startRect = start.getBoundingClientRect();
						const endRect = end.getBoundingClientRect();

						return {
							innerHeight: inner.clientHeight,
							above: Math.max(titleRect.top - startRect.top, 0),
							below: Math.max(endRect.bottom - titleRect.top, 0),
						};
					})
					.filter(Boolean);

				if (!metrics.length) {
					return;
				}

				const innerHeight = Math.min(
					...metrics.map(({ innerHeight: height }) => height),
				);
				const titleLeading = Math.max(...metrics.map(({ above }) => above));
				const contentBelow = Math.max(...metrics.map(({ below }) => below));
				const panelTop = Math.max(
					(innerHeight - titleLeading - contentBelow) / 2,
					0,
				);

				pin.style.setProperty("--about-mobile-panel-top", `${panelTop}px`);
				pin.style.setProperty(
					"--about-mobile-title-leading",
					`${titleLeading}px`,
				);
			};

			const positionAdaptiveWatermarks = () => {
				serviceLayers.forEach(({ inner, offer, watermark }) => {
					if (!inner || !offer || !watermark) {
						return;
					}

					if (desktop) {
						watermark.style.removeProperty("top");
						watermark.style.removeProperty("transform");
						return;
					}

					const innerRect = inner.getBoundingClientRect();
					const offerRect = offer.getBoundingClientRect();
					const watermarkHeight = watermark.offsetHeight;
					const top = offerRect.top - innerRect.top - watermarkHeight * 0.7;

					watermark.style.top = `${Math.max(top, 0)}px`;
					watermark.style.transform = "none";
				});
			};

			const syncAdaptiveLayout = () => {
				positionAdaptiveTitles();
				positionAdaptiveWatermarks();
			};

			const layoutObserver =
				!desktop && "ResizeObserver" in window
					? new ResizeObserver(syncAdaptiveLayout)
					: null;

			serviceLayers.forEach(({ inner, offer, watermark }) => {
				[inner, offer, watermark].forEach((element) => {
					if (element) {
						layoutObserver?.observe(element);
					}
				});
			});
			adaptiveTitleLayers.forEach(({ inner, title, start, end }) => {
				[inner, title, start, end].forEach((element) => {
					if (element) {
						layoutObserver?.observe(element);
					}
				});
			});

			syncAdaptiveLayout();

			gsap.set(rail, { x: 0 });
			updateProgress(0);

			const horizontalTween = gsap.to(rail, {
				x: () => -getHorizontalDistance(),
				ease: "none",
				scrollTrigger: {
					trigger: section,
					start: "top top",
					end: () => `+=${Math.max(getHorizontalDistance() * 0.88, 1)}`,
					pin,
					pinSpacing: true,
					scrub: true,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					onUpdate: (self) => updateProgress(self.progress),
				},
			});

			const introLines = section.querySelectorAll(".about__title-line");
			const introCopy = section.querySelector(".about__intro-copy");

			gsap.fromTo(
				introLines,
				{ yPercent: 110 },
				{
					yPercent: 0,
					duration: 0.95,
					stagger: 0.1,
					ease: "power4.out",
					immediateRender: false,
					clearProps: "transform",
					scrollTrigger: {
						trigger: section,
						start: "top 76%",
						once: true,
					},
				},
			);

			if (introCopy) {
				gsap.fromTo(
					introCopy,
					{ x: 42 },
					{
						x: 0,
						duration: 0.85,
						ease: "power3.out",
						immediateRender: false,
						clearProps: "transform",
						scrollTrigger: {
							trigger: section,
							start: "top 76%",
							once: true,
						},
					},
				);
			}

			if (desktop) {
				panels.slice(1).forEach((panel) => {
					const head = panel.querySelector(".about-service__head");
					const copy = panel.querySelector(".about-service__copy");
					const offer = panel.querySelector(".about-service__offer");

					if (head) {
						gsap.fromTo(
							head,
							{ x: 60 },
							{
								x: 0,
								ease: "none",
								immediateRender: false,
								scrollTrigger: {
									trigger: panel,
									containerAnimation: horizontalTween,
									start: "left 88%",
									end: "left 62%",
									scrub: true,
								},
							},
						);
					}

					if (copy) {
						gsap.fromTo(
							copy,
							{ x: 90 },
							{
								x: 0,
								ease: "none",
								immediateRender: false,
								scrollTrigger: {
									trigger: panel,
									containerAnimation: horizontalTween,
									start: "left 86%",
									end: "left 48%",
									scrub: true,
								},
							},
						);
					}

					if (offer) {
						gsap.fromTo(
							offer,
							{ x: 140, rotateY: 4 },
							{
								x: 0,
								rotateY: 0,
								transformOrigin: "100% 50%",
								ease: "none",
								immediateRender: false,
								scrollTrigger: {
									trigger: panel,
									containerAnimation: horizontalTween,
									start: "left 82%",
									end: "left 42%",
									scrub: true,
								},
							},
						);
					}
				});
			}

			const refreshOnLoad = () => {
				syncAdaptiveLayout();
				ScrollTrigger.refresh();
			};
			ScrollTrigger.addEventListener("refreshInit", syncAdaptiveLayout);
			window.addEventListener("load", refreshOnLoad, { once: true });
			document.fonts?.ready.then(refreshOnLoad);

			return () => {
				window.removeEventListener("load", refreshOnLoad);
				ScrollTrigger.removeEventListener(
					"refreshInit",
					syncAdaptiveLayout,
				);
				layoutObserver?.disconnect();
				pin.style.removeProperty("--about-mobile-panel-top");
				pin.style.removeProperty("--about-mobile-title-leading");
				horizontalTween.scrollTrigger?.kill();
				horizontalTween.kill();
				gsap.set(rail, { clearProps: "transform" });
				updateProgress(0);
			};
		},
	);
}

export function initAboutMotion() {
	if (window.gsap && window.ScrollTrigger) {
		setupAboutMotion();
		return;
	}

	window.addEventListener("load", setupAboutMotion, { once: true });
}
