import type {
	BaseEnvironment,
	KeycloakContext,
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
	return new Response(status === 204 ? null : JSON.stringify(data), {
		status,
		headers: {
			[CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
		},
	});
}

function getMockResponse(path: string, opts: RequestOptions = {}): Response {
	const cleanPath = path.split("?")[0];
	const method = opts.method ?? "GET";
	const nowSeconds = Math.floor(Date.now() / 1000);

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
		return createJsonResponse([
			"ar",
			"cs",
			"da",
			"de",
			"el",
			"en",
			"es",
			"et",
			"fi",
			"fr",
			"he",
			"hi",
			"hr",
			"hu",
			"id",
			"it",
			"ja",
			"ko",
			"lt",
			"lv",
			"nl",
			"no",
			"pl",
			"pt",
			"pt-BR",
			"ro",
			"ru",
			"sk",
			"sl",
			"sv",
			"th",
			"tr",
			"uk",
			"vi",
			"zh-CN",
			"zh-TW",
		]);
	}

	if (cleanPath === "/sessions" || cleanPath === "/sessions/devices") {
		return createJsonResponse([
			{
				id: "device-1",
				ipAddress: "127.0.0.1",
				os: "macOS",
				osVersion: "14.2",
				browser: "Firefox",
				device: "Desktop",
				lastAccess: nowSeconds - 60 * 5,
				current: true,
				mobile: false,
				sessions: [
					{
						id: "session-1",
						ipAddress: "127.0.0.1",
						started: nowSeconds - 60 * 60,
						lastAccess: nowSeconds - 60 * 5,
						expires: nowSeconds + 60 * 30,
						clients: [],
						browser: "Firefox",
						current: true,
					},
					{
						id: "session-2",
						ipAddress: "127.0.0.1",
						started: nowSeconds - 60 * 60 * 24,
						lastAccess: nowSeconds - 60 * 60 * 8,
						expires: nowSeconds + 60 * 10,
						clients: [],
						browser: "Firefox",
						current: false,
					},
				],
			},
		]);
	}

	if (cleanPath === "/applications") {
		return createJsonResponse([
			{
				clientId: "colormatic-dashboard",
				clientName: "Colormatic Dashboard",
				description: "Manage Colormatic services and account settings.",
				userConsentRequired: true,
				inUse: true,
				offlineAccess: true,
				rootUrl: "https://example.com",
				baseUrl: "https://example.com/dashboard",
				effectiveUrl: "https://example.com/dashboard",
				logoUri: "",
				policyUri: "https://example.com/privacy",
				tosUri: "https://example.com/terms",
				consent: {
					grantedScopes: [
						{
							id: "profile",
							name: "profile",
							displayText: "User profile",
						},
						{
							id: "email",
							name: "email",
							displayText: "Email address",
						},
					],
					createdDate: Date.now() - 1000 * 60 * 60 * 24 * 30,
					lastUpdatedDate: Date.now() - 1000 * 60 * 60 * 24,
				},
			},
			{
				clientId: "account-console",
				clientName: "Account Console",
				description: "Built-in account management.",
				userConsentRequired: false,
				inUse: false,
				offlineAccess: false,
				rootUrl: "",
				baseUrl: "",
				effectiveUrl: "",
				logoUri: "",
				policyUri: "",
				tosUri: "",
			},
		]);
	}

	if (cleanPath === "/credentials") {
		return createJsonResponse([
			{
				type: "password",
				category: "basic-authentication",
				displayName: "password-display-name",
				helptext: "password-help-text",
				iconCssClass: "",
				createAction: "UPDATE_PASSWORD",
				updateAction: "UPDATE_PASSWORD",
				removeable: false,
				userCredentialMetadatas: [
					{
						infoMessage: null,
						infoProperties: [],
						warningMessageTitle: null,
						warningMessageDescription: null,
						credential: {
							id: "pwd-1",
							type: "password",
							userLabel: "password",
							createdDate: Date.now() - 1000 * 60 * 60 * 24 * 30,
							secretData: "",
							credentialData: "",
							priority: 0,
							value: "",
							temporary: false,
							device: "",
							hashedSaltedValue: "",
							salt: "",
							hashIterations: 0,
							counter: 0,
							algorithm: "",
							digits: 0,
							period: 0,
							config: {},
						},
					},
				],
				metadata: {
					type: "password",
					displayName: "password-display-name",
					helpText: "password-help-text",
					iconCssClass: "",
					createAction: "UPDATE_PASSWORD",
					updateAction: "UPDATE_PASSWORD",
					removeable: false,
					category: "basic-authentication",
				},
			},
			{
				type: "otp",
				category: "two-factor",
				displayName: "otp-display-name",
				helptext: "otp-help-text",
				iconCssClass: "",
				createAction: "CONFIGURE_TOTP",
				updateAction: "",
				removeable: true,
				userCredentialMetadatas: [],
				metadata: {
					type: "otp",
					displayName: "otp-display-name",
					helpText: "otp-help-text",
					iconCssClass: "",
					createAction: "CONFIGURE_TOTP",
					updateAction: "",
					removeable: true,
					category: "two-factor",
				},
			},
		]);
	}

	if (cleanPath === "/linked-accounts") {
		const accounts = [
			{
				connected: true,
				providerAlias: "github",
				providerName: "github",
				displayName: "GitHub",
				linkedUsername: "dev-user",
				social: true,
			},
			{
				connected: false,
				providerAlias: "google",
				providerName: "google",
				displayName: "Google",
				linkedUsername: "",
				social: true,
			},
			{
				connected: false,
				providerAlias: "colormatic-sso",
				providerName: "colormatic-sso",
				displayName: "Colormatic SSO",
				linkedUsername: "",
				social: false,
			},
		];
		const linked = opts.searchParams?.["linked"];
		const search = opts.searchParams?.["search"]?.toLocaleLowerCase();

		return createJsonResponse(
			accounts.filter(
				(account) =>
					(linked === undefined || account.connected === (linked === "true")) &&
					(!search ||
						account.displayName.toLocaleLowerCase().includes(search) ||
						account.providerName.toLocaleLowerCase().includes(search)),
			),
		);
	}

	if (cleanPath === "/resources") {
		return createJsonResponse([
			{
				_id: "resource-1",
				name: "Colormatic project",
				client: {
					baseUrl: "https://example.com/projects",
					clientId: "colormatic-dashboard",
					name: "Colormatic Dashboard",
				},
				scopes: [
					{ name: "view", displayName: "View" },
					{ name: "edit", displayName: "Edit" },
				],
				uris: ["https://example.com/projects/1"],
			},
		]);
	}

	if (cleanPath === "/resources/shared-with-me") {
		return createJsonResponse([
			{
				_id: "shared-resource-1",
				name: "Shared design library",
				client: {
					baseUrl: "https://example.com/design",
					clientId: "colormatic-dashboard",
					name: "Colormatic Dashboard",
				},
				scopes: [{ name: "view", displayName: "View" }],
				uris: ["https://example.com/design/library"],
			},
		]);
	}

	if (
		cleanPath.startsWith("/resources/") &&
		cleanPath.endsWith("/permissions/requests")
	) {
		return createJsonResponse([
			{
				email: "collaborator@example.com",
				firstName: "Casey",
				lastName: "Collaborator",
				scopes: [{ name: "view", displayName: "View" }],
				username: "collaborator",
			},
		]);
	}

	if (
		cleanPath.startsWith("/resources/") &&
		cleanPath.endsWith("/permissions")
	) {
		return createJsonResponse([
			{
				email: "teammate@example.com",
				firstName: "Taylor",
				lastName: "Teammate",
				scopes: [
					{ name: "view", displayName: "View" },
					{ name: "edit", displayName: "Edit" },
				],
				username: "teammate",
			},
		]);
	}

	if (cleanPath === "/groups") {
		return createJsonResponse([
			{ id: "group-1", name: "Engineering", path: "/Engineering" },
			{
				id: "group-2",
				name: "Frontend",
				path: "/Engineering/Frontend",
			},
			{ id: "group-3", name: "Design", path: "/Design" },
		]);
	}

	if (cleanPath === "/organizations") {
		return createJsonResponse([
			{
				id: "organization-1",
				name: "Colormatic",
				alias: "colormatic",
				description: "Colormatic software and services.",
				enabled: true,
				domains: [{ name: "colormatic.org", verified: true }],
				attributes: {},
			},
			{
				id: "organization-2",
				name: "Example partner",
				alias: "example-partner",
				description: "A disabled example organization.",
				enabled: false,
				domains: [{ name: "example.com", verified: false }],
				attributes: {},
			},
		]);
	}

	if (cleanPath === "/verifiable-credentials") {
		return createJsonResponse([
			{
				credentialScopeName: "ColormaticEmployeeCredential",
				credentialConfigurationId: "colormatic-employee",
				revision: "1",
				createdDate: Date.now() - 1000 * 60 * 60 * 24 * 90,
				updatedDate: Date.now() - 1000 * 60 * 60 * 24 * 7,
				userAttributes: {
					email: ["dev@example.com"],
					firstName: ["Dev"],
					lastName: ["User"],
				},
			},
		]);
	}

	if (cleanPath === "/issued-verifiable-credentials") {
		return createJsonResponse([
			{
				id: "issued-credential-1",
				userId: "dev-user",
				credentialType: "ColormaticEmployeeCredential",
				issuedAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
				expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 335,
				clientId: "colormatic-wallet",
				revision: "1",
				clientName: "Colormatic Wallet",
				clientBaseUrl: "https://example.com/wallet",
			},
		]);
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
