import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// Account console build (React). Output into dist/account to keep it separate from login build.
export default defineConfig({
	root: path.resolve("src/account"),
	publicDir: path.resolve("public"),
	base: "./",
	plugins: [react(), tailwindcss()],
	build: {
		outDir: path.resolve("dist/account"),
		emptyOutDir: true,
		assetsDir: "assets-account",
		manifest: "manifest-account.json",
		rollupOptions: {
			input: path.resolve("src/account/index.html"),
		},
	},
});
