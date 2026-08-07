import { initAboutMotion } from "./modules/about-motion.js";
import { initFaq } from "./modules/faq.js";
import { initContactForm } from "./modules/contact-form.js";
import { initHeroCardHoverFix } from "./modules/hero-card-hover-fix.js";
import { initHeroCardTilt } from "./modules/hero-card-tilt.js";
import { initHeroLine } from "./modules/hero-line.js";
import { initHeroScrollTransition } from "./modules/hero-scroll-transition.js";
import { initParallax } from "./modules/parallax.js";
import { initProcessStack } from "./modules/process-stack.js";
import { initReveal } from "./modules/reveal.js";
import { initSideNav } from "./modules/side-nav.js";
import { initSmoothScroll } from "./modules/smooth-scroll.js";
import { initScrollTop } from "./modules/scroll-top.js";
import { initTelegramLinks } from "./modules/telegram-link.js";

initHeroCardHoverFix();
initSmoothScroll();
initHeroScrollTransition();
initAboutMotion();
initReveal();
initFaq();
initContactForm();
initTelegramLinks();

const initDeferredEnhancements = () => {
	initHeroCardTilt();
	initHeroLine();
	initProcessStack();
	initParallax();
	initSideNav();
	initScrollTop();
};

if ("requestIdleCallback" in window) {
	window.requestIdleCallback(initDeferredEnhancements, { timeout: 1200 });
} else {
	window.setTimeout(initDeferredEnhancements, 0);
}
