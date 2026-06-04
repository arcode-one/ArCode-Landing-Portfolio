import { initFaq } from "./modules/faq.js";
import { initContactForm } from "./modules/contact-form.js";
import { initHeroCardHoverFix } from "./modules/hero-card-hover-fix.js";
import { initHeroCardTilt } from "./modules/hero-card-tilt.js";
import { initHeroLine } from "./modules/hero-line.js";
import { initParallax } from "./modules/parallax.js";
import { initPriceStack } from "./modules/price-stack.js";
import { initProcessStack } from "./modules/process-stack.js";
import { initReveal } from "./modules/reveal.js";
import { initSideNav } from "./modules/side-nav.js";
import { initScrollTop } from "./modules/scroll-top.js";
import { initStackRadar } from "./modules/stack-radar.js";
import { initTelegramLinks } from "./modules/telegram-link.js";

initHeroCardHoverFix();
initReveal();
initFaq();
initContactForm();
initTelegramLinks();

const initDeferredEnhancements = () => {
	initHeroCardTilt();
	initHeroLine();
	initPriceStack();
	initProcessStack();
	initParallax();
	initSideNav();
	initScrollTop();
	initStackRadar();
};

if ("requestIdleCallback" in window) {
	window.requestIdleCallback(initDeferredEnhancements, { timeout: 1200 });
} else {
	window.setTimeout(initDeferredEnhancements, 0);
}
