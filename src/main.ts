import { mount } from "svelte";
import KcPage from "./kc.gen.svelte";
import Spinner from "./login/Spinner.svelte";

async function getKcContextForCurrentEnvironment() {
	if (
		import.meta.env.DEV &&
		import.meta.env.MODE === "login" &&
		!window.kcContext
	) {
		const { getKcContextMock } = await import("./login/KcPageStory");
		window.kcContext = getKcContextMock({
			pageId: "login.ftl",
			overrides: {},
		});
	}

	if (
		import.meta.env.DEV &&
		import.meta.env.MODE === "account" &&
		!window.kcContext
	) {
		const { getKcContextMock } = await import("./account/kcContextMock");
		window.kcContext = getKcContextMock();
	}

	return window.kcContext;
}

async function start() {
	const kcContext = await getKcContextForCurrentEnvironment();

	if (!kcContext) {
		return undefined;
	}

	return mount(KcPage, {
		target: document.getElementById("kc-root")!,
		props: { kcContext, Fallback: Spinner },
	});
}

const app = start();

export default app;
