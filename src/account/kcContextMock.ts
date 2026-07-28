import { kcEnvDefaults, themeNames } from "../kc.gen";
import type { KcContext } from "./KcContext";

const baseUrl = new URL("http://localhost:5173/");

const baseUrlParts = {
	rawSchemeSpecificPart: `//${baseUrl.host}${baseUrl.pathname}`,
	scheme: baseUrl.protocol.replace(":", ""),
	authority: baseUrl.host,
	path: baseUrl.pathname,
};

const defaultKcContext: KcContext = {
	themeType: "account",
	themeName: themeNames[0],
	properties: { ...kcEnvDefaults, realmDisplayName: "Colormatic ID" },
	realm: {
		name: "master",
		registrationEmailAsUsername: false,
		editUsernameAllowed: true,
		isInternationalizationEnabled: true,
		identityFederationEnabled: true,
		userManagedAccessAllowed: true,
	},
	resourceUrl: `${baseUrl.origin}/resources`,
	baseUrl: baseUrlParts,
	locale: "en",
	isAuthorizationEnabled: true,
	deleteAccountAllowed: true,
	updateEmailFeatureEnabled: true,
	updateEmailActionEnabled: true,
	darkMode: true,
	referrerName: "Account",
	serverBaseUrl: "http://localhost:8080",
	authUrl: "http://localhost:8080",
	clientId: "account",
	authServerUrl: "http://localhost:8080",
	isOid4VciEnabled: true,
	isViewApplicationsEnabled: true,
	isViewGroupsEnabled: true,
	isViewOrganizationsEnabled: true,
};

export function getKcContextMock(overrides?: Partial<KcContext>): KcContext {
	if (!overrides) {
		return { ...defaultKcContext, realm: { ...defaultKcContext.realm } };
	}

	return {
		...defaultKcContext,
		...overrides,
		realm: {
			...defaultKcContext.realm,
			...overrides.realm,
		},
		baseUrl: {
			...defaultKcContext.baseUrl,
			...overrides.baseUrl,
		},
		properties: {
			...defaultKcContext.properties,
			...overrides.properties,
		},
	};
}
