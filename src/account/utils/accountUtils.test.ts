import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";
import { joinPath } from "./joinPath";

describe("account utilities", () => {
	it("joins URL path fragments without duplicate separators", () => {
		expect(joinPath("https://id.example/", "/realms/", "/colormatic")).toBe(
			"https://id.example/realms/colormatic",
		);
	});

	it("formats dates with the requested locale", () => {
		const date = new Date("2026-07-18T12:00:00Z");

		expect(
			formatDate(date, "en-US", { dateStyle: "long", timeZone: "UTC" }),
		).toBe("July 18, 2026");
		expect(
			formatDate(date, "de-DE", { dateStyle: "long", timeZone: "UTC" }),
		).toContain("18. Juli 2026");
	});
});
