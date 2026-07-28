export const THEME_STORAGE_KEY = "colormatic-theme";
export const LEGACY_THEME_STORAGE_KEY = "mode-watcher-mode";

export const themePreferences = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof themePreferences)[number];
export type EffectiveTheme = Exclude<ThemePreference, "system">;

export type ThemeState = {
	preference: ThemePreference;
	effectiveTheme: EffectiveTheme;
	darkModeAllowed: boolean;
};

type ThemeListener = (state: ThemeState) => void;

const DARK_CLASS_NAMES = ["dark", "pf-v5-theme-dark"] as const;

let preference: ThemePreference = "system";
let effectiveTheme: EffectiveTheme = "light";
let darkModeAllowed = true;
let mediaQuery: MediaQueryList | undefined;
let initialized = false;
const listeners = new Set<ThemeListener>();

export function isThemePreference(value: unknown): value is ThemePreference {
	return themePreferences.includes(value as ThemePreference);
}

export function resolveEffectiveTheme(
	selectedPreference: ThemePreference,
	systemPrefersDark: boolean,
	isDarkModeAllowed = true,
): EffectiveTheme {
	if (!isDarkModeAllowed) {
		return "light";
	}

	if (selectedPreference === "system") {
		return systemPrefersDark ? "dark" : "light";
	}

	return selectedPreference;
}

function readStoredPreference(): ThemePreference {
	try {
		const storedPreference = localStorage.getItem(THEME_STORAGE_KEY);
		if (isThemePreference(storedPreference)) {
			return storedPreference;
		}

		const legacyPreference = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
		if (isThemePreference(legacyPreference)) {
			localStorage.setItem(THEME_STORAGE_KEY, legacyPreference);
			return legacyPreference;
		}
	} catch {
		// Storage can be unavailable in hardened or private browsing contexts.
	}

	return "system";
}

function getSystemPrefersDark() {
	return mediaQuery?.matches ?? false;
}

function getThemeState(): ThemeState {
	return { preference, effectiveTheme, darkModeAllowed };
}

function notifyListeners() {
	const state = getThemeState();
	for (const listener of listeners) {
		listener(state);
	}
}

function applyTheme() {
	effectiveTheme = resolveEffectiveTheme(
		preference,
		getSystemPrefersDark(),
		darkModeAllowed,
	);

	const root = document.documentElement;
	const isDark = effectiveTheme === "dark";

	for (const className of DARK_CLASS_NAMES) {
		root.classList.toggle(className, isDark);
	}

	root.dataset.theme = effectiveTheme;
	root.style.colorScheme = effectiveTheme;
	root.style.removeProperty("background-color");

	notifyListeners();
}

function handleSystemPreferenceChange() {
	if (preference === "system") {
		applyTheme();
	}
}

function handleStorage(event: StorageEvent) {
	if (
		event.key !== THEME_STORAGE_KEY &&
		event.key !== LEGACY_THEME_STORAGE_KEY
	) {
		return;
	}

	preference = isThemePreference(event.newValue) ? event.newValue : "system";
	applyTheme();
}

export function startThemeManagement(options?: { darkModeAllowed?: boolean }) {
	darkModeAllowed = options?.darkModeAllowed ?? true;

	if (!initialized) {
		preference = readStoredPreference();
		mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQuery.addEventListener("change", handleSystemPreferenceChange);
		window.addEventListener("storage", handleStorage);
		initialized = true;
	}

	applyTheme();

	return () => {
		mediaQuery?.removeEventListener("change", handleSystemPreferenceChange);
		window.removeEventListener("storage", handleStorage);
		mediaQuery = undefined;
		initialized = false;
	};
}

export function setThemePreference(nextPreference: ThemePreference) {
	preference = nextPreference;

	try {
		localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
	} catch {
		// Applying the in-memory preference still gives the user a working control.
	}

	applyTheme();
}

export function subscribeToTheme(listener: ThemeListener) {
	listeners.add(listener);
	listener(getThemeState());

	return () => listeners.delete(listener);
}
