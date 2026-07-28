import { describe, expect, it } from "vitest";

import { request } from "./request";

const context = {
	environment: {},
	keycloak: {},
} as never;

describe("account development API", () => {
	it("returns iterable verifiable credentials", async () => {
		const response = await request("/verifiable-credentials", context);
		const credentials = await response.json();

		expect(Array.isArray(credentials)).toBe(true);
		expect(credentials).toEqual([
			expect.objectContaining({
				credentialScopeName: "ColormaticEmployeeCredential",
			}),
		]);
	});

	it("returns iterable issued credentials", async () => {
		const response = await request("/issued-verifiable-credentials", context);
		const credentials = await response.json();

		expect(Array.isArray(credentials)).toBe(true);
		expect(credentials).toEqual([
			expect.objectContaining({
				credentialType: "ColormaticEmployeeCredential",
			}),
		]);
	});
});
