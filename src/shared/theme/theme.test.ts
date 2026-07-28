import { describe, expect, it } from "vitest";
import { isThemePreference, resolveEffectiveTheme } from "./theme";

describe("resolveEffectiveTheme", () => {
	it.each([
		["light", false, "light"],
		["light", true, "light"],
		["dark", false, "dark"],
		["dark", true, "dark"],
		["system", false, "light"],
		["system", true, "dark"],
	] as const)(
		"resolves %s with system dark=%s to %s",
		(preference, systemPrefersDark, expected) => {
			expect(resolveEffectiveTheme(preference, systemPrefersDark)).toBe(
				expected,
			);
		},
	);

	it("forces light when the realm disables dark mode", () => {
		expect(resolveEffectiveTheme("dark", true, false)).toBe("light");
	});
});

describe("isThemePreference", () => {
	it.each(["light", "dark", "system"])("accepts %s", (preference) => {
		expect(isThemePreference(preference)).toBe(true);
	});

	it.each(["auto", "", null, undefined])("rejects %s", (preference) => {
		expect(isThemePreference(preference)).toBe(false);
	});
});
