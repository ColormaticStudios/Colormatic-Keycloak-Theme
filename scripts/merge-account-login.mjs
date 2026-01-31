import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const loginManifestPath = path.join(distDir, "manifest-login.json");
const accountManifestPath = path.join(
  distDir,
  "account",
  "manifest-account.json",
);

const readJson = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing manifest: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const pickEntry = (manifest) => {
  const entry = Object.values(manifest).find((value) => value.isEntry);
  if (entry) {
    return entry;
  }
  if (manifest["index.html"]) {
    return manifest["index.html"];
  }
  const first = Object.values(manifest)[0];
  if (!first) {
    throw new Error("Manifest has no entries");
  }
  return first;
};

const loginEntry = pickEntry(readJson(loginManifestPath));
const accountEntry = pickEntry(readJson(accountManifestPath));

const loginCss = loginEntry.css ?? [];
const accountCss = accountEntry.css ?? [];

if (!loginEntry.file || !accountEntry.file) {
  throw new Error("Manifest entry missing file field");
}

const html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg" href="./colormatic_logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <main id="kc-root"></main>
    <script type="module">
      const themeType = window.kcContext?.themeType;
      const isAccount = themeType === "account";

      const cssFiles = isAccount
        ? ${JSON.stringify(accountCss)}
        : ${JSON.stringify(loginCss)};

      const resourcesPath =
        window.kcContext?.url?.resourcesPath ??
        window.kcContext?.["x-keycloakify"]?.resourcesPath;
      const toResourceUrl = (file, isAccountAsset) => {
        if (!resourcesPath) {
          return "./" + file;
        }
        const accountPrefix = isAccountAsset ? "/dist/account/" : "/dist/";
        return resourcesPath + accountPrefix + file;
      };

      for (const href of cssFiles) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = toResourceUrl(href, isAccount);
        document.head.appendChild(link);
      }

      const script = document.createElement("script");
      script.type = "module";
      script.src = isAccount
        ? toResourceUrl("${accountScript}", true)
        : toResourceUrl("${loginScript}", false);
      document.body.appendChild(script);
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), html, "utf8");
