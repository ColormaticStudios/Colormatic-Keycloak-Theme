(() => {
	const root = document.documentElement;
	let preference = "system";

	try {
		preference =
			localStorage.getItem("colormatic-theme") ??
			localStorage.getItem("mode-watcher-mode") ??
			"system";
	} catch {
		// Fall back to the operating system preference when storage is unavailable.
	}

	if (!new Set(["light", "dark", "system"]).has(preference)) {
		preference = "system";
	}

	const isDark =
		preference === "dark" ||
		(preference === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);

	root.classList.toggle("dark", isDark);
	root.classList.toggle("pf-v5-theme-dark", isDark);
	root.dataset.theme = isDark ? "dark" : "light";
	root.style.colorScheme = isDark ? "dark" : "light";
})();
