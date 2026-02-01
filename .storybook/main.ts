import type { StorybookConfig } from "@storybook/svelte-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|ts|svelte)"],
	addons: ["@storybook/addon-svelte-csf", "@storybook/addon-docs"],
	framework: {
		name: "@storybook/svelte-vite",
		options: {
			docgen: false,
		},
	},
	async viteFinal(config) {
		// Add Tailwind. Avoid adding a second Svelte plugin (Storybook provides one).
		config.plugins = [tailwindcss(), ...(config.plugins ?? [])];

		const plugins = config.plugins ?? [];
		const filteredPlugins = plugins
			.flat()
			.filter(Boolean)
			.filter(
				(plugin) =>
					!(
						plugin &&
						"name" in plugin &&
						plugin.name.startsWith("vite-plugin-svelte")
					),
			);

		const { svelte } = await import("@sveltejs/vite-plugin-svelte");
		filteredPlugins.unshift(
			svelte({
				configFile: path.resolve(process.cwd(), "svelte.config.js"),
				include: [
					/\.svelte$/,
					/node_modules\/@storybook\/svelte\/static\/.*\.svelte$/,
					/node_modules\/@storybook\/svelte-vite\/.*\.svelte$/,
				],
			}),
		);

		config.plugins = filteredPlugins;

		return config;
	},
};
export default config;
