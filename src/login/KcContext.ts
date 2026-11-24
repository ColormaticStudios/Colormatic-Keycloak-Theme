import type { ExtendKcContext } from "keycloakify/login";
import type { KcEnvName, ThemeName } from "../kc.gen";

export type KcContextExtension = {
	themeName: ThemeName;
	properties: Record<KcEnvName, string>;
	capRequired?: boolean;
	capApiEndpoint?: string;
	capWidgetScriptUrl?: string;
	capWasmUrl?: string;
	capHashwxUrl?: string;
};

export type KcContextExtensionPerPage = {
	"login-update-password.ftl": {
		breachedPassword?: boolean;
	};
};

export type KcContext = ExtendKcContext<
	KcContextExtension,
	KcContextExtensionPerPage
>;
