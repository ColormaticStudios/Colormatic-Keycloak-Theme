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
	properties: Record<KcEnvName, string>;
};

export const { getKcContext } = createGetKcContext<KcContext>();
