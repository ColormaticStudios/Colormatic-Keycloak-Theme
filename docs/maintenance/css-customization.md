# CSS and Design-System Architecture

This project deliberately shares a visual language across two different UI
frameworks: Svelte/shadcn-svelte for login and React/PatternFly 5 for the
account console. PatternFly remains the account console's compatibility layer;
it is not the source of truth for Colormatic design decisions.

## Source of truth

`src/main.css` owns the cross-theme system:

- `--cm-*` variables are semantic Colormatic tokens;
- their current values use Tailwind's exact palette variables, primarily Slate;
- shadcn variables such as `--background`, `--primary`, and `--ring` alias the
  semantic tokens instead of defining another palette;
- `--cm-font-sans` and `--cm-font-mono` define the system font stacks; and
- Bootstrap Icons are loaded once for project-owned iconography.

Use purpose-based tokens such as `--cm-text-muted` or `--cm-control-hover` in
new shared styles. Do not hard-code a Slate shade when a semantic token already
describes the role. This keeps a future palette change local to `src/main.css`.

## Login theme

Login markup lives under `src/login`. New project-owned UI should use local
Svelte components and the shadcn-svelte primitives under `src/lib/components`.
Tailwind utilities are appropriate for component layout and variants because
they resolve through the shared tokens.

Keycloakify's `kc*` class contract remains useful at the template boundary, but
new components should not reproduce upstream pages' arbitrary element nesting.
Prefer a clear hierarchy of page, section, field group, control, help/error
text, and actions. Refactor pages incrementally so behavior and accessibility
can be checked per flow.

## Account console

The account console remains a fork of Keycloak's React application and still
uses PatternFly 5 for structure, keyboard behavior, and upstream alignment.
There are two account-specific adapter files:

- `src/account/theme.tokens.css` gives account concepts stable names and aliases
  them to the shared `--cm-*` tokens;
- `src/account/theme.css` maps those concepts onto PatternFly component custom
  properties and contains the remaining structural exceptions.

Built-in pages use `src/account/components/page/Page.tsx` as their semantic
shell. It owns the `article`, page `header`, single `h1`, description, and body
regions. Repeated page areas use `AccountPageSection`, which supplies a
labelled `section`, `h2`, optional description, and action region. Do not style
PatternFly's root `<main>` as an individual page card or recreate page headings
with utility-class stacks.

Prefer a PatternFly component custom property over a direct declaration. For
example:

```css
.cm-account .pf-v5-c-button {
  --pf-v5-c-button--BorderRadius: var(--radius-md);
  --pf-v5-c-button--m-primary--BackgroundColor: var(--cm-account-action);
  --pf-v5-c-button--m-primary--hover--BackgroundColor: var(
    --cm-account-action-hover
  );
}
```

Keep direct declarations only when PatternFly exposes no suitable component
variable, especially for intentional layout and sizing changes. Avoid broad
`--pf-v5-global-*` overrides: they can silently alter new upstream components
that this theme has not reviewed.

Use CSS modules or project-owned classes for project-owned React markup. Do not
increase specificity with `#root .pf-v5-*`; that recreates the override
escalation this adapter is intended to prevent.

Keep PatternFly adapter selectors under the single `.cm-account` mount class.
React's PatternFly styles are injected after the static theme stylesheet in
development and may also load later through code-split chunks. The mount class
provides one predictable specificity step so component variables continue to
win without per-component `!important` rules or progressively deeper
selectors.

## Theme preference

`src/shared/theme/theme.ts` owns the Light, Dark, and System preference. It:

- persists `colormatic-theme` in local storage;
- migrates the former `mode-watcher-mode` value when present;
- follows `prefers-color-scheme` only for the System preference;
- synchronizes changes across same-origin tabs; and
- applies `.dark`, `.pf-v5-theme-dark`, `data-theme`, and native
  `color-scheme` together.

`src/shared/theme/ThemeSwitcher.svelte` is the one control rendered by both
themes. Do not create framework-specific theme controls. The account realm's
`darkMode` setting may force the effective theme to Light, but the saved user
preference is retained for realms where dark mode is allowed.

Keycloakify copies the early scripts in `public/keycloak-theme/login` and
`public/keycloak-theme/account` into the corresponding theme resources. Keep
their small, dependency-free bootstrap logic equivalent to the controller so
the first paint matches the saved preference.

## Icons and typography

Project-owned React icon markup goes through
`src/shared/keycloak-ui-shared/icons/BootstrapIcon.tsx`; Svelte markup uses the
same `bi` classes directly. PatternFly may use its own icons inside unmodified
internals, but do not introduce new `@patternfly/react-icons` imports.

Both themes inherit the shared system font stack. Component-specific font
families should only be added for a deliberate design requirement.

## Cascade and scoping

The single Vite graph code-splits the account bridge, so login pages do not
eagerly load account code. The account stylesheet is imported only by the
account entry path, which is the bundle scope boundary. The `.cm-account`
React mount is the selector scope and deliberate specificity boundary for the
PatternFly adapter.

Cascade layers are not currently used. PatternFly CSS is unlayered, and normal
declarations outside a layer outrank normal declarations inside one. Introducing
layers is only safe if PatternFly and Colormatic styles are placed into named
layers as one coordinated pipeline change.

## Maintenance checklist

When changing a component family:

1. Add or reuse a semantic token in `src/main.css`.
2. Add an account alias only when the account concept needs a stable adapter
   name.
3. Map PatternFly component variables before adding direct declarations.
4. Use the shared theme control, Bootstrap Icon primitive, and system fonts.
5. Check light, dark, and system behavior, including an operating-system scheme
   change while System is selected.
6. Check keyboard focus, disabled, error, and hover states.
7. Compare desktop and mobile layouts; include right-to-left locales when a
   change affects directional layout.

When Keycloak upgrades PatternFly, review the emitted markup and supported
component variables before changing the adapter. Do not mechanically rename
PatternFly variables across major versions.
