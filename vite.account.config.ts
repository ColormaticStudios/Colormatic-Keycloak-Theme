import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Account console build (React). Output into dist/account to keep it separate from login build.
export default defineConfig({
	root: path.resolve("src/account"),
	publicDir: path.resolve("public"),
	base: "./",
	plugins: [react()],
	esbuild: {
		// The account console sources rely on non-type-only imports. Disable verbatimModuleSyntax for this build.
		tsconfigRaw: {
			compilerOptions: {
				verbatimModuleSyntax: false,
			},
		},
	},
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
