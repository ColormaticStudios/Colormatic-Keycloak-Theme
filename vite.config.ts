import react from "@vitejs/plugin-react";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { keycloakify } from "keycloakify/vite-plugin";
import { defineConfig } from "vite";

// Svelte owns the Keycloak entry point and login theme. The React account
// console is mounted by src/account/KcPage.svelte and remains code-split, so
// both themes can share one Vite module graph and one Keycloakify build.
export default defineConfig({
	plugins: [
		svelte(),
		react(),
		tailwindcss(),
		keycloakify({
			themeName: "colormatic-keycloak-theme",
			accountThemeImplementation: "Single-Page",
			keycloakVersionTargets: {
				"22-to-25": false,
				"all-other-versions": "colormatic-keycloak-theme-kc-26.7-and-newer.jar",
			},
			extraThemeProperties: ["realmDisplayName=Colormatic ID"],
		}),
	],
});
