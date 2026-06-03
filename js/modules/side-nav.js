export function initSideNav() {
	const links = Array.from(document.querySelectorAll(".side-nav__link"));

	if (!links.length) {
		return;
	}

	const sections = links
		.map((link) => {
			const id = link.getAttribute("href")?.slice(1);
			const section = id ? document.getElementById(id) : null;

			return section ? { link, section } : null;
		})
		.filter(Boolean);

	if (!sections.length) {
		return;
	}

	const topSection = document.getElementById("top");

	const setActive = (activeId) => {
		sections.forEach(({ link, section }) => {
			link.classList.toggle("side-nav__link--active", section.id === activeId);
		});
	};

	const updateActiveLink = () => {
		const firstContentSection = sections.find(({ section }) => section.id !== "top")?.section;

		if (topSection && firstContentSection) {
			const switchPoint = Math.max(firstContentSection.offsetTop - window.innerHeight * 0.35, 0);

			if (window.scrollY < switchPoint) {
				setActive(topSection.id);
				return;
			}
		}

		const viewportCenter = window.scrollY + window.innerHeight * 0.42;
		let currentSection = sections[0].section.id;

		sections.forEach(({ section }) => {
			if (viewportCenter >= section.offsetTop) {
				currentSection = section.id;
			}
		});

		setActive(currentSection);
	};

	window.addEventListener("scroll", updateActiveLink, { passive: true });
	window.addEventListener("resize", updateActiveLink);

	updateActiveLink();
}
