import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { keycloakify } from "keycloakify/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		tailwindcss(),
		keycloakify({
			themeName: "colormatic-keycloak-theme",
			accountThemeImplementation: "Single-Page",
			extraThemeProperties: ["realmDisplayName=Colormatic ID"],
		}),
	],
	build: {
		assetsDir: "assets-login",
		manifest: "manifest-login.json",
	},
});
