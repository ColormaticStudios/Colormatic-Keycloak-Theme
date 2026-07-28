import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const keycloakContextEntry = require.resolve("keycloakify/login/KcContext");
const upstreamContextPath = path.join(
  path.dirname(keycloakContextEntry),
  "KcContext.d.ts",
);
const localRouterPath = path.join(projectRoot, "src/login/KcPage.svelte");
const templatePath = path.join(projectRoot, "src/login/Template.svelte");
const pagesPath = path.join(projectRoot, "src/login/pages");

const upstreamContext = fs.readFileSync(upstreamContextPath, "utf8");
const localRouter = fs.readFileSync(localRouterPath, "utf8");
const template = fs.readFileSync(templatePath, "utf8");

const collect = (source, pattern) =>
  new Set(Array.from(source.matchAll(pattern), (match) => match[1]));

const supportedPageIds = collect(upstreamContext, /pageId:\s*"([^"]+\.ftl)"/g);
const implementedPageIds = collect(localRouter, /case\s+"([^"]+\.ftl)"/g);

const missing = [...supportedPageIds]
  .filter((pageId) => !implementedPageIds.has(pageId))
  .sort();
const unknown = [...implementedPageIds]
  .filter((pageId) => !supportedPageIds.has(pageId))
  .sort();

if (missing.length > 0 || unknown.length > 0) {
  const details = [
    missing.length > 0
      ? `Missing local login pages:\n- ${missing.join("\n- ")}`
      : undefined,
    unknown.length > 0
      ? `Local pages absent from the current Keycloakify context:\n- ${unknown.join("\n- ")}`
      : undefined,
  ]
    .filter(Boolean)
    .join("\n\n");

  throw new Error(details);
}

const structuralErrors = [];
const requiredTemplateMarkers = [
  ["semantic page landmark", "<main"],
  ["semantic authentication card", "<article"],
  ["labelled content region", "<section"],
  ["shared locale menu", "<LocaleMenu"],
  ["shared alert", "<LoginAlert"],
];

for (const [description, marker] of requiredTemplateMarkers) {
  if (!template.includes(marker)) {
    structuralErrors.push(
      `Template is missing its ${description} (${marker}).`,
    );
  }
}

for (const fileName of fs
  .readdirSync(pagesPath)
  .filter(
    (fileName) =>
      fileName.endsWith(".svelte") && !fileName.endsWith(".stories.svelte"),
  )) {
  const source = fs.readFileSync(path.join(pagesPath, fileName), "utf8");

  for (const form of source.matchAll(/<form\b[\s\S]*?>/g)) {
    if (!/\bclass=/.test(form[0]) || !/cm-login-form/.test(form[0])) {
      structuralErrors.push(
        `${fileName} contains a form without the shared cm-login-form contract.`,
      );
    }
  }

  if (
    /(?:slate|blue|indigo|green|red)-\d{2,3}|bg-white|text-white/.test(source)
  ) {
    structuralErrors.push(
      `${fileName} contains a raw palette utility instead of a semantic theme token.`,
    );
  }

  if (/<label\b[^>]*\bid=/.test(source)) {
    structuralErrors.push(
      `${fileName} uses a label as non-control display markup.`,
    );
  }
}

if (structuralErrors.length > 0) {
  throw new Error(
    `Login markup contract failed:\n- ${structuralErrors.join("\n- ")}`,
  );
}

console.log(
  `Login page coverage and markup contracts are complete (${supportedPageIds.size} pages).`,
);
