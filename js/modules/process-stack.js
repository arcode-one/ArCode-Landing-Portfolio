let initialized = false;

const resetStepVisibility = (steps) => {
	steps.forEach((step) => {
		step.classList.remove(
			"is-active",
			"is-stacked",
			"is-precompact",
			"is-compact",
		);

		[step, ...step.children].forEach((element) => {
			element.style.removeProperty("opacity");
			element.style.removeProperty("visibility");
			element.style.removeProperty("filter");
			element.style.removeProperty("clip-path");
			element.style.removeProperty("transform");
		});
	});
};

export function initProcessStack() {
	if (initialized) {
		return;
	}

	const process = document.querySelector(".process--merge");
	const steps = Array.from(process?.querySelectorAll(".process-step") ?? []);

	if (!process || !steps.length) {
		return;
	}

	initialized = true;
	resetStepVisibility(steps);

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const { gsap, ScrollTrigger } = window;

	if (!gsap || !ScrollTrigger || reduceMotion.matches) {
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	const stepParts = steps.flatMap((step) => Array.from(step.children));

	gsap.fromTo(
		stepParts,
		{ x: 16, y: 14 },
		{
			x: 0,
			y: 0,
			duration: 0.68,
			stagger: 0.045,
			ease: "power3.out",
			clearProps: "transform",
			immediateRender: false,
			scrollTrigger: {
				trigger: process,
				start: "top 82%",
				once: true,
				invalidateOnRefresh: true,
			},
		},
	);

	const media = gsap.matchMedia();

	media.add(
		"(prefers-reduced-motion: no-preference)",
		() => {
			const stackTweens = steps.slice(0, -1).map((step, index) => {
				const nextStep = steps[index + 1];

				return gsap.to(step, {
					y: -10,
					scale: 0.972,
					transformOrigin: "50% 0%",
					ease: "none",
					overwrite: "auto",
					scrollTrigger: {
						trigger: nextStep,
						start: () => {
							const stickyTop = Number.parseFloat(
								window.getComputedStyle(nextStep).top,
							);
							const top = Number.isFinite(stickyTop) ? stickyTop : 108;

							return `top ${top + step.offsetHeight + 36}px`;
						},
						end: () => {
							const stickyTop = Number.parseFloat(
								window.getComputedStyle(nextStep).top,
							);
							const top = Number.isFinite(stickyTop) ? stickyTop : 108;

							return `top ${top}px`;
						},
						scrub: 0.55,
						invalidateOnRefresh: true,
					},
				});
			});

			return () => {
				stackTweens.forEach((tween) => {
					tween.scrollTrigger?.kill();
					tween.kill();
				});

				gsap.set(steps, {
					clearProps: "transform,transformOrigin",
				});
			};
		},
	);
}
