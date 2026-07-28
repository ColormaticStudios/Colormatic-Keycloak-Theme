# Colormatic Keycloak Theme

Colormatic's Keycloak theme combines two intentionally different front ends in
one Keycloakify build:

- a Svelte login theme under `src/login`;
- a React fork of Keycloak's Single-Page account console under `src/account`
  and `src/shared`.

Svelte owns the generated Keycloak entry point. On account pages,
`src/account/KcPage.svelte` mounts the React console. Vite code-splits that
bridge, so login pages do not eagerly load the account console and no manifest
merge step is required.

## Compatibility

The maintained account-console baseline is Keycloak 26.7 or newer. Older
Keycloak artifacts are deliberately not generated. Review upstream account UI
changes before each Keycloak major upgrade, especially API endpoints, injected
feature flags, translations, and PatternFly versions.

## Requirements

- [Bun](https://bun.sh/)
- Java and Maven for the Keycloak JAR build

Install dependencies with:

```bash
bun install
```

The lockfile is committed and should be updated together with `package.json`.

## Development

```bash
bun run dev:login
bun run dev:account
bun run storybook
```

The two Vite commands use local Keycloak-context mocks. Storybook contains the
login page catalog and is the preferred way to inspect individual login flows.

## Design system

`src/main.css` is the shared visual source of truth. Its `--cm-*` semantic
tokens use Tailwind's exact color variables (currently the Slate palette), and
its shadcn-compatible variables are aliases rather than a second palette.

The login theme uses Svelte and shadcn-svelte primitives. The account console
keeps PatternFly for upstream structure and behavior, while
`src/account/theme.tokens.css` and `src/account/theme.css` adapt PatternFly's
component variables to the shared Colormatic tokens. Project-owned icons use
Bootstrap Icons and both themes use the system font stack.

Light, Dark, and System are one shared preference stored as
`colormatic-theme`. Both themes render the same bottom-right control and apply
the `dark`, `pf-v5-theme-dark`, and `data-theme` hooks together. The early
color-scheme scripts under `public/keycloak-theme` prevent a light flash before
the application mounts.

## Build

Build the shared Vite output only:

```bash
bun run build:theme
```

Build the deployable Keycloak theme JAR:

```bash
bun run build
```

The JAR is written to `dist_keycloak/` as
`colormatic-keycloak-theme-kc-26.7-and-newer.jar`.

## Verification

```bash
bun run check
bun run build-storybook
bun audit
```

`check` runs Svelte diagnostics, TypeScript, exhaustive login and account-route
coverage, tests, Tailwind compilation, and ESLint. Account-route coverage also
checks that every built-in navigation entry resolves to a page using the shared
semantic page shell.

## Maintenance

- [Upstream divergence and upgrade guide](docs/maintenance/upstream-divergence-and-upgrade-plan.md)
- [CSS customization strategy](docs/maintenance/css-customization.md)

The account console is a maintained fork. Port upstream behavior, security,
accessibility, API, and translation changes intentionally rather than replacing
the local integration and Colormatic styling wholesale.
