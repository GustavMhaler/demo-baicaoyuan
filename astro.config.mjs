import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
	site: "https://intermediate-astro-kit-decap-cms.netlify.app", // update me!
	integrations: [
		icon(),
		sitemap({
			filter: (page) => !page.includes("/admin"),
			changefreq: "weekly",
			priority: 0.7,
		}),
	],
	image: {
		layout: "constrained",
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: "MiSans",
			cssVariable: "--font-primary",
			fallbacks: [
				"HarmonyOS Sans SC",
				"PingFang SC",
				"Microsoft YaHei",
				"sans-serif",
			],
			weights: [400, 700],
			styles: ["normal"],
			options: {
				variants: [
					{
						weight: 400,
						src: ["./src/assets/fonts/MiSans-Regular.woff2"],
					},
					{
						weight: 700,
						src: ["./src/assets/fonts/MiSans-Bold.woff2"],
					},
				],
			},
		},
	],
});
