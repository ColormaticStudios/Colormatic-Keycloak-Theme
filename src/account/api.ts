import type { KeycloakContext } from "../shared/keycloak-ui-shared";
import { type BaseEnvironment } from "../shared/keycloak-ui-shared";

import type { CallOptions } from "./api/methods";
import type { Links } from "./api/parse-links";
import { parseLinks } from "./api/parse-links";
import { parseResponse, throwIfResponseNotOk } from "./api/parse-response";
import type { Permission, Resource, Scope } from "./api/representations";
import { request } from "./api/request";

export const fetchResources = async (
	{ signal, context }: CallOptions,
	requestParams: Record<string, string>,
	shared: boolean | undefined = false,
): Promise<{ data: Resource[]; links: Links }> => {
	const response = await request(
		`/resources${shared ? "/shared-with-me?" : "?"}`,
		context,
		{ searchParams: requestParams, signal },
	);

	const links = parseLinks(response);

	return {
		data: checkResponse(await response.json()),
		links,
	};
};

export const fetchPermission = async (
	{ signal, context }: CallOptions,
	resourceId: string,
): Promise<Permission[]> => {
	const response = await request(
		`/resources/${resourceId}/permissions`,
		context,
		{ signal },
	);
	return parseResponse<Permission[]>(response);
};

export const updateRequest = async (
	context: KeycloakContext<BaseEnvironment>,
	resourceId: string,
	username: string,
	scopes: Scope[] | string[],
): Promise<void> => {
	const response = await request(
		`/resources/${resourceId}/permissions`,
		context,
		{
			method: "PUT",
			body: [{ username, scopes }],
		},
	);
	await throwIfResponseNotOk(response);
};

export const updatePermissions = async (
	context: KeycloakContext<BaseEnvironment>,
	resourceId: string,
	permissions: Permission[],
): Promise<void> => {
	const response = await request(
		`/resources/${resourceId}/permissions`,
		context,
		{
			method: "PUT",
			body: permissions,
		},
	);
	await throwIfResponseNotOk(response);
};

function checkResponse<T>(response: T) {
	if (!response) throw new Error("Could not fetch");
	return response;
}
