import { beforeEach, describe, expect, it, vi } from "vitest";

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock("./api/request", () => ({ request }));
vi.mock("../shared/keycloak-ui-shared", () => ({}));

import { fetchResources, updatePermissions } from "./api";

const context = {} as never;

describe("resource API", () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(
			new Response(JSON.stringify([]), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);
	});

	it("sends filters and pagination for owned resources", async () => {
		const searchParams = { first: "5", max: "10", name: "project" };

		await fetchResources({ context }, searchParams, false);

		expect(request).toHaveBeenCalledWith("/resources?", context, {
			searchParams,
			signal: undefined,
		});
	});

	it("rejects a failed permission update", async () => {
		request.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: "server_error" }), {
				status: 500,
				headers: { "content-type": "application/json" },
			}),
		);

		await expect(
			updatePermissions(context, "resource", [
				{ username: "user", scopes: [] },
			]),
		).rejects.toThrow();
	});
});
