import type { LanguageDetectorModule } from "i18next";
import { createInstance } from "i18next";
import FetchBackend from "i18next-fetch-backend";
import { initReactI18next } from "react-i18next";

import { environment } from "../environment";
import { joinPath } from "../utils/joinPath";

const DEFAULT_LOCALE = "en";
const RTL_LANGUAGE_CODES = new Set(["ar", "fa", "he", "ur"]);

type KeyValue = { key: string; value: string };

export type TFuncKey = string;

function getLocaleDirection(locale: string): "ltr" | "rtl" {
	const languageCode = locale.toLowerCase().split(/[-_]/)[0] ?? locale;
	return RTL_LANGUAGE_CODES.has(languageCode) ? "rtl" : "ltr";
}

function applyDocumentLocale(locale: string) {
	document.documentElement.lang = locale;
	document.documentElement.dir = getLocaleDirection(locale);
}

export const keycloakLanguageDetector: LanguageDetectorModule = {
	type: "languageDetector",

	detect() {
		return environment.locale;
	},
};

applyDocumentLocale(environment.locale);

window.addEventListener("languageChanged", (event: Event) => {
	const customEvent = event as CustomEvent<{ language: string }>;
	const language = customEvent.detail.language;

	environment.locale = language;
	applyDocumentLocale(language);

	void i18n.changeLanguage(language, (error) => {
		if (error) {
			console.warn("Error(s) loading locale", language, error);
		}
	});
});

const devMessages = import.meta.env.DEV
	? import.meta.glob("./messages_*.properties", {
			query: "?raw",
			import: "default",
			eager: true,
		})
	: {};

function parseProperties(contents: string): Record<string, string> {
	const lines = contents.split(/\r?\n/);
	const result: Record<string, string> = {};

	for (const line of lines) {
		const trimmed = line.trim();

		if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("!")) {
			continue;
		}

		const separatorIndex = trimmed.search(/[:=]/);
		if (separatorIndex === -1) {
			continue;
		}

		const key = trimmed.slice(0, separatorIndex).trim();
		const value = trimmed.slice(separatorIndex + 1).trim();
		if (key) {
			result[key] = value;
		}
	}

	return result;
}

const devResources = import.meta.env.DEV
	? Object.fromEntries(
			Object.entries(devMessages).map(([filePath, contents]) => {
				const match = filePath.match(/messages_(.+)\.properties$/);
				const rawLang = match?.[1] ?? DEFAULT_LOCALE;
				const languageTag = rawLang.replace(/_/g, "-");

				return [
					languageTag,
					{ translation: parseProperties(contents as string) },
				];
			}),
		)
	: undefined;

export const i18n = createInstance({
	fallbackLng: DEFAULT_LOCALE,
	nsSeparator: false,
	interpolation: {
		escapeValue: false,
	},
	...(import.meta.env.DEV
		? { resources: devResources, lng: environment.locale }
		: {
				backend: {
					loadPath: joinPath(
						environment.serverBaseUrl,
						`resources/${environment.realm}/account/{{lng}}`,
					),
					parse(data: string) {
						const messages: KeyValue[] = JSON.parse(data);

						return Object.fromEntries(
							messages.map(({ key, value }) => [key, value]),
						);
					},
				},
			}),
});

if (!import.meta.env.DEV) {
	i18n.use(FetchBackend);
}
i18n.use(keycloakLanguageDetector);
i18n.use(initReactI18next);
