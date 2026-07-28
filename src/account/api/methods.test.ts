import { beforeEach, describe, expect, it, vi } from "vitest";

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock("./request", () => ({ request }));
vi.mock("../../shared/keycloak-ui-shared", () => ({}));

import {
	deleteConsent,
	deleteVerifiableCredential,
	unLinkAccount,
} from "./methods";

const context = {} as never;

describe("account API path construction", () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(new Response(null, { status: 204 }));
	});

	it("encodes client IDs before deleting consent", async () => {
		await deleteConsent(context, "client/with spaces?");

		expect(request).toHaveBeenCalledWith(
			"/applications/client%2Fwith%20spaces%3F/consent",
			context,
			{ method: "DELETE" },
		);
	});

	it("encodes credential scope names before deleting credentials", async () => {
		await deleteVerifiableCredential(context, "scope/name with spaces");

		expect(request).toHaveBeenCalledWith(
			"/verifiable-credentials/scope%2Fname%20with%20spaces",
			context,
			{ method: "DELETE" },
		);
	});

	it("encodes identity-provider names before unlinking accounts", async () => {
		await unLinkAccount(context, {
			providerName: "provider/with spaces?",
		} as never);

		expect(request).toHaveBeenCalledWith(
			"/linked-accounts/provider%2Fwith%20spaces%3F",
			context,
			{ method: "DELETE" },
		);
	});

	it("rejects a failed consent deletion", async () => {
		request.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: "server_error" }), {
				status: 500,
				headers: { "content-type": "application/json" },
			}),
		);

		await expect(deleteConsent(context, "client")).rejects.toThrow();
	});
});
