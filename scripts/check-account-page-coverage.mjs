import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageEntry = require.resolve("@keycloakify/keycloak-account-ui");
const upstreamRoutesPath = path.join(
  path.dirname(packageEntry),
  "keycloak-theme/account/routes.tsx",
);
const localRoutesPath = path.join(projectRoot, "src/account/routes.tsx");
const localNavigationPath = path.join(
  projectRoot,
  "src/account/assets/content.ts",
);

const read = (filePath) => fs.readFileSync(filePath, "utf8");
const collect = (source, pattern) =>
  new Set(Array.from(source.matchAll(pattern), (match) => match[1]));
const difference = (left, right) =>
  [...left].filter((value) => !right.has(value)).sort();

const upstreamRoutes = read(upstreamRoutesPath);
const localRoutes = read(localRoutesPath);
const localNavigation = read(localNavigationPath);

const upstreamPaths = collect(upstreamRoutes, /\bpath:\s*"([^"]*)"/g);
const localPaths = collect(localRoutes, /\bpath:\s*"([^"]*)"/g);
const navigationPaths = collect(localNavigation, /\bpath:\s*"([^"]*)"/g);
const builtInPaths = new Set(
  [...localPaths].filter((routePath) => !routePath.startsWith("content/")),
);

const missingRoutes = difference(upstreamPaths, localPaths);
const unknownRoutes = difference(localPaths, upstreamPaths);
const missingNavigation = difference(builtInPaths, navigationPaths);
const unknownNavigation = difference(navigationPaths, builtInPaths);

const localPageImports = [
  ...localRoutes.matchAll(
    /const\s+\w+\s*=\s*lazy\(\(\)\s*=>\s*import\("([^"]+)"\)\)/g,
  ),
].map((match) => match[1]);
const pagesWithoutShell = localPageImports
  .filter((modulePath) => modulePath !== "./content/ContentComponent")
  .filter((modulePath) => {
    const sourcePath = path.join(
      path.dirname(localRoutesPath),
      `${modulePath}.tsx`,
    );
    return !read(sourcePath).includes("<Page");
  });

const problems = [
  missingRoutes.length > 0
    ? `Missing local account routes:\n- ${missingRoutes.join("\n- ")}`
    : undefined,
  unknownRoutes.length > 0
    ? `Local routes absent from the current account UI package:\n- ${unknownRoutes.join("\n- ")}`
    : undefined,
  missingNavigation.length > 0
    ? `Built-in routes missing from account navigation:\n- ${missingNavigation.join("\n- ")}`
    : undefined,
  unknownNavigation.length > 0
    ? `Navigation entries without a built-in route:\n- ${unknownNavigation.join("\n- ")}`
    : undefined,
  pagesWithoutShell.length > 0
    ? `Built-in pages that do not use the shared Page shell:\n- ${pagesWithoutShell.join("\n- ")}`
    : undefined,
].filter(Boolean);

if (problems.length > 0) {
  throw new Error(problems.join("\n\n"));
}

console.log(
  `Account page coverage is complete (${localPaths.size} routes, ${builtInPaths.size} navigation entries).`,
);
