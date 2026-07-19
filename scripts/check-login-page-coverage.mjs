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

const upstreamContext = fs.readFileSync(upstreamContextPath, "utf8");
const localRouter = fs.readFileSync(localRouterPath, "utf8");

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

console.log(
  `Login page coverage is complete (${supportedPageIds.size} pages).`,
);
