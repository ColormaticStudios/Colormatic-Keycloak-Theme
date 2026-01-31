/* eslint-disable */

// @ts-nocheck

import {
	KeycloakContext,
	type BaseEnvironment,
} from "../../shared/keycloak-ui-shared";
import type { Keycloak } from "oidc-spa/keycloak-js";

import { joinPath } from "../utils/joinPath";
import { CONTENT_TYPE_HEADER, CONTENT_TYPE_JSON } from "./constants";

export type RequestOptions = {
	signal?: AbortSignal;
	getAccessToken?: () => Promise<string | undefined>;
	method?: "POST" | "PUT" | "DELETE";
	searchParams?: Record<string, string>;
	body?: unknown;
};

async function _request(
	url: URL,
	{ signal, getAccessToken, method, searchParams, body }: RequestOptions = {},
): Promise<Response> {
	if (searchParams) {
		Object.entries(searchParams).forEach(([key, value]) =>
			url.searchParams.set(key, value),
		);
	}

	return fetch(url, {
		signal,
		method,
		body: body ? JSON.stringify(body) : undefined,
		headers: {
			[CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
			authorization: `Bearer ${await getAccessToken?.()}`,
		},
	});
}

function createJsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			[CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
		},
	});
}

function getMockResponse(path: string, opts: RequestOptions = {}): Response {
	const cleanPath = path.split("?")[0];
	const method = opts.method ?? "GET";

	if (method === "POST" || method === "PUT") {
		return createJsonResponse({}, 204);
	}

	if (method === "DELETE") {
		return createJsonResponse({}, 204);
	}

	if (cleanPath === "/" || cleanPath === "") {
		return createJsonResponse({
			id: "dev-user",
			username: "dev-user",
			firstName: "Dev",
			lastName: "User",
			email: "dev@example.com",
			attributes: {
				locale: "en",
			},
			userProfileMetadata: {
				attributes: [
					{
						name: "username",
						displayName: "Username",
						required: true,
						readOnly: true,
						annotations: {},
						validators: {},
						multivalued: false,
						defaultValue: "dev-user",
					},
					{
						name: "email",
						displayName: "Email",
						required: true,
						readOnly: false,
						annotations: {},
						validators: {},
						multivalued: false,
						defaultValue: "dev@example.com",
					},
					{
						name: "firstName",
						displayName: "First name",
						required: true,
						readOnly: false,
						annotations: {},
						validators: {},
						multivalued: false,
						defaultValue: "Dev",
					},
					{
						name: "lastName",
						displayName: "Last name",
						required: true,
						readOnly: false,
						annotations: {},
						validators: {},
						multivalued: false,
						defaultValue: "User",
					},
					{
						name: "locale",
						displayName: "Locale",
						required: false,
						readOnly: false,
						annotations: {},
						validators: {},
						multivalued: false,
						defaultValue: "en",
					},
				],
			},
		});
	}

	if (cleanPath === "/supportedLocales") {
		return createJsonResponse(["en", "fr"]);
	}

	if (cleanPath === "/sessions" || cleanPath === "/sessions/devices") {
		return createJsonResponse([]);
	}

	if (cleanPath === "/applications") {
		return createJsonResponse([]);
	}

	if (cleanPath === "/credentials") {
		return createJsonResponse([]);
	}

	if (cleanPath === "/linked-accounts") {
		return createJsonResponse([]);
	}

	if (
		cleanPath.startsWith("/resources/") &&
		cleanPath.endsWith("/permissions/requests")
	) {
		return createJsonResponse([]);
	}

	if (cleanPath === "/groups") {
		return createJsonResponse([]);
	}

	if (cleanPath === "/organizations") {
		return createJsonResponse([]);
	}

	return createJsonResponse({});
}

export async function request(
	path: string,
	{ environment, keycloak }: KeycloakContext<BaseEnvironment>,
	opts: RequestOptions = {},
	fullUrl?: URL,
) {
	if (import.meta.env.DEV) {
		return getMockResponse(path, opts);
	}

	if (typeof fullUrl === "undefined") {
		fullUrl = url(environment, path);
	}
	return _request(fullUrl, {
		...opts,
		getAccessToken: token(keycloak),
	});
}

export const url = (environment: BaseEnvironment, path: string) =>
	new URL(
		joinPath(
			environment.serverBaseUrl,
			"realms",
			environment.realm,
			"account",
			path,
		),
	);

export const token = (keycloak: Keycloak) =>
	async function getAccessToken() {
		try {
			await keycloak.updateToken(5);
		} catch {
			await keycloak.login();
		}

		return keycloak.token;
	};
