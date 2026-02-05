import {
	type KcContextLike,
	createGetKcContext,
} from "@keycloakify/keycloak-account-ui";
import type { KcEnvName } from "../kc.gen";

export type KcContextExtension = {
	themeName: string;
	properties: Record<KcEnvName, string>;
};

export type KcContextExtensionPerPage = Record<
	`${string}.ftl`,
	Record<string, unknown>
>;

export type KcContext = KcContextLike.Keycloak25AndUp & {
	themeType: "account";
	themeName: string;
	properties: Record<KcEnvName, string> & {
		realmDisplayName?: string;
		realmDisplayNameHtml?: string;
	};
	url?: {
		resourcesPath?: string;
	};
	"x-keycloakify"?: {
		resourcesPath?: string;
	};
	realm: KcContextLike.Keycloak25AndUp["realm"] & {
		displayName?: string;
		displayNameHtml?: string;
	};
};

export const { getKcContext } = createGetKcContext<KcContext>();
