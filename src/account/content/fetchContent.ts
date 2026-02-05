import type { CallOptions } from "../api/methods";
import type { MenuItem } from "../root/PageNav";

export default async function fetchContentJson(
	_opts: CallOptions,
): Promise<MenuItem[]> {
	void _opts;
	const { content } = await import("../assets/content");
	return content;
}
