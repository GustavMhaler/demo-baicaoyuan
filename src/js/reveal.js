/**
 * reveal.js - zero-dependency reveal layer.
 *
 * Responsibilities (only):
 *   1. When JS is available and motion is not reduced, add the
 *      `cs-reveal-pending` class to every [data-reveal] element.
 *   2. When an element enters the viewport, swap to `cs-revealed` and stop
 *      observing it.
 *
 * The animation itself (opacity / transform / transition) is defined by each
 * component in its own scoped styles - this file does not dictate a unified
 * visual. Elements are visible by default, so with JS disabled or
 * prefers-reduced-motion the content simply stays visible.
 */

document.addEventListener("astro:page-load", () => {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	if (!("IntersectionObserver" in window)) return;

	const elements = Array.from(document.querySelectorAll("[data-reveal]"));
	if (elements.length === 0) return;

	elements.forEach((el) => el.classList.add("cs-reveal-pending"));

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("cs-revealed");
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
	);

	elements.forEach((el) => observer.observe(el));
});
