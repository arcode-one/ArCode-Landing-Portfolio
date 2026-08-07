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
			const { desktop, compactDesktop, mobile } = context.conditions;
			const shouldSnap = compactDesktop || mobile;

			section.classList.remove("about--static");

			const getHorizontalDistance = () =>
				Math.max(rail.scrollWidth - window.innerWidth, 0);

			const updateProgress = (progress) => {
				if (progressBar) {
					gsap.set(progressBar, { scaleX: progress });
				}
			};

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
					scrub: mobile ? 0.6 : 1.05,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					...(shouldSnap
						? {
								snap: {
									snapTo: 1 / (panels.length - 1),
									duration: { min: 0.16, max: 0.38 },
									delay: 0.08,
									ease: "power2.out",
								},
							}
						: {}),
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

			const refreshOnLoad = () => ScrollTrigger.refresh();
			window.addEventListener("load", refreshOnLoad, { once: true });
			document.fonts?.ready.then(refreshOnLoad);

			return () => {
				window.removeEventListener("load", refreshOnLoad);
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
