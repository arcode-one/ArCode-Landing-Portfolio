let initialized = false;

export function initStackLinesMotion() {
	if (initialized) {
		return;
	}

	const stack = document.querySelector(".stack-lines");
	const lines = Array.from(stack?.querySelectorAll(".stack-line") ?? []);
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const { gsap, ScrollTrigger } = window;

	if (
		!stack ||
		lines.length === 0 ||
		!gsap ||
		!ScrollTrigger ||
		reduceMotion.matches
	) {
		return;
	}

	initialized = true;
	gsap.registerPlugin(ScrollTrigger);

	const direction = (index) => (index % 2 === 0 ? -1 : 1);
	const offscreenPosition = (index) => direction(index) * 115;

	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: stack,
			start: "top 92%",
			end: "bottom 8%",
			scrub: 0.7,
			invalidateOnRefresh: true,
		},
	});

	timeline
		.fromTo(
			lines,
			{
				xPercent: offscreenPosition,
				autoAlpha: 0,
			},
			{
				xPercent: 0,
				autoAlpha: 1,
				duration: 0.3,
				stagger: 0.04,
				ease: "power2.out",
				immediateRender: true,
			},
		)
		.to({}, { duration: 0.3 })
		.to(lines, {
			xPercent: offscreenPosition,
			autoAlpha: 0,
			duration: 0.3,
			stagger: 0.04,
			ease: "power2.in",
		});
}
