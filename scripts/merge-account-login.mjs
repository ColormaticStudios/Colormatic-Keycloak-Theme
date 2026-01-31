import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const accountDir = path.join(distDir, "account");

const loginManifestPath = path.join(distDir, "manifest-login.json");
const accountManifestPath = path.join(accountDir, "manifest-account.json");

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

const loginManifest = readJson(loginManifestPath);
const accountManifest = readJson(accountManifestPath);

const loginEntry = pickEntry(loginManifest);
const accountEntry = pickEntry(accountManifest);

const loginCss = loginEntry.css ?? [];
const accountCss = accountEntry.css ?? [];

const loginScript = `/${loginEntry.file}`;
const accountScript = `/account/${accountEntry.file}`;

const loginCssLinks = loginCss.map((file) => `/${file}`);
const accountCssLinks = accountCss.map((file) => `/account/${file}`);

const html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg" href="/colormatic_logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <main id="kc-root"></main>
    <script type="module">
      const themeType = window.kcContext?.themeType;
      const isAccount = themeType === "account";

      const cssFiles = isAccount
        ? ${JSON.stringify(accountCssLinks)}
        : ${JSON.stringify(loginCssLinks)};

      for (const href of cssFiles) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }

      const script = document.createElement("script");
      script.type = "module";
      script.src = isAccount ? "${accountScript}" : "${loginScript}";
      document.body.appendChild(script);
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), html, "utf8");
