# CSS Customization Strategy

This document records how to make the login and account themes maintainable
without changing their current visual design. It is intentionally tied to the
actual upstream architecture rather than to an aspirational PatternFly upgrade.

## Current Constraint

Keycloak's account console still uses PatternFly 5. The Keycloak `main` branch
at commit `33695405ea86a5741dbe07f406b10a02aacb5a4b` (July 17, 2026) declares
PatternFly 5.4 dependencies and continues to emit `pf-v5-*` classes. There is no
Keycloak 27 release tag yet, and the account-console changes between the 26.7.0
tag and that commit contain no PatternFly migration.

Primary sources:

- [Keycloak account UI package on current `main`](https://github.com/keycloak/keycloak/blob/33695405ea86a5741dbe07f406b10a02aacb5a4b/js/apps/account-ui/package.json)
- [Keycloak account UI source](https://github.com/keycloak/keycloak/tree/33695405ea86a5741dbe07f406b10a02aacb5a4b/js/apps/account-ui/src)
- [Keycloak 26.7.0 tag](https://github.com/keycloak/keycloak/tree/26.7.0/js/apps/account-ui)

PatternFly 6 design tokens are materially better than the PatternFly 5 variable
system, but they require PatternFly 6. Moving this fork to PatternFly 6 before
Keycloak does would turn routine upstream merges into a permanent compatibility
port. Do not do that as part of the Keycloak 26.7/27 preparation work.

Primary sources:

- [PatternFly theming guidance](https://www.patternfly.org/design-foundations/theming/)
- [PatternFly design-token development guidance](https://www.patternfly.org/foundations-and-styles/design-tokens/develop/)
- [PatternFly 5 CSS-variable guidance](https://pf5.patternfly.org/developer-resources/global-css-variables/)

## Recommended Architecture While Account UI Uses PatternFly 5

Use three distinct customization mechanisms for three distinct jobs.

### 1. Colormatic semantic tokens

Define a small set of project-owned semantic custom properties for the visual
decisions shared by components in `src/account/theme.tokens.css`. Use names
based on purpose, not on a particular Tailwind shade:

```css
:root {
  --cm-account-canvas: var(--color-slate-100);
  --cm-account-surface: var(--color-slate-200);
  --cm-account-control-surface: var(--color-slate-300);
  --cm-account-border: var(--color-slate-400);
  --cm-account-text: var(--color-black);
}

.pf-v5-theme-dark {
  --cm-account-canvas: var(--color-slate-950);
  --cm-account-surface: var(--color-slate-900);
  --cm-account-control-surface: var(--color-slate-800);
  --cm-account-border: var(--color-slate-700);
  --cm-account-text: var(--color-slate-100);
}
```

Keep these in an account-specific token file. Do not repurpose the generic
`--background`, `--card`, or `--primary` variables in `src/main.css`: those are
shared with the Svelte login theme and do not have the same semantics as the
account-console surfaces.

The account bootstrap currently adds both `pf-v5-theme-dark` and `dark` to the
document root. Account design tokens should use the canonical PatternFly dark
class. The Tailwind `dark` variant remains appropriate for login-theme and local
utility styling.

### 2. PatternFly component variables

Map the Colormatic tokens onto PatternFly component custom properties at the
top-level component selector. This is PatternFly 5's supported customization
mechanism and is less coupled to internal pseudo-elements than direct property
overrides.

Examples of existing direct overrides that have a component-variable equivalent:

| Current target          | Prefer these PatternFly 5 variables                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.pf-v5-c-page`         | `--pf-v5-c-page--BackgroundColor`                                                                                                                                 |
| `.pf-v5-c-masthead`     | `--pf-v5-c-masthead--BackgroundColor`                                                                                                                             |
| `.pf-v5-c-toolbar`      | `--pf-v5-c-toolbar--BackgroundColor`                                                                                                                              |
| `.pf-v5-c-form-control` | `--pf-v5-c-form-control--BackgroundColor`, `--pf-v5-c-form-control--Color`, and its `before`/`after` border variables                                             |
| `.pf-v5-c-menu-toggle`  | `--pf-v5-c-menu-toggle--BackgroundColor`, `--pf-v5-c-menu-toggle--Color`, state background variables, border variables, and `--pf-v5-c-menu-toggle--BorderRadius` |
| `.pf-v5-c-menu`         | `--pf-v5-c-menu--BackgroundColor`, `--pf-v5-c-menu--BoxShadow`, and list-item state variables                                                                     |
| `.pf-v5-c-button`       | `--pf-v5-c-button--BorderRadius` and the `m-primary`, `m-secondary`, and `m-link` state variables                                                                 |
| `.pf-v5-c-alert`        | `--pf-v5-c-alert--BackgroundColor`, `--pf-v5-c-alert--BoxShadow`, and border variables                                                                            |
| `.pf-v5-c-data-list`    | `--pf-v5-c-data-list--BorderTopColor` and item background/border variables                                                                                        |

For example, prefer:

```css
.pf-v5-c-button {
  --pf-v5-c-button--BorderRadius: var(--radius-md);
  --pf-v5-c-button--after--BorderRadius: var(--radius-md);
  --pf-v5-c-button--m-primary--BackgroundColor: var(--cm-account-action);
  --pf-v5-c-button--m-primary--hover--BackgroundColor: var(
    --cm-account-action-hover
  );
}
```

over assigning `background-color` directly to `.pf-v5-c-button.pf-m-primary`
with `!important`. Keep direct declarations only when PatternFly exposes no
component variable, such as an intentionally different layout or max width.

Avoid broad overrides of `--pf-v5-global-*`. A global replacement can alter a
new upstream component that this theme has never reviewed. Component variables
give roughly the same maintenance benefit while containing the blast radius.

### 3. Local component classes and CSS modules

Use project-owned classes for project-owned markup. CSS modules are already in
use for the account header and shared scroll-form components; they are the right
default for new local account UI. The login theme should continue to style the
stable `kc*` class contract supplied through Keycloakify rather than reaching
into element structure.

Tailwind `@apply` is reasonable for project-owned layout classes. It is less
useful as a PatternFly theming API because it emits direct declarations and has
encouraged the current `!important` overrides.

## Scoping

The eventual single Vite graph should retain CSS chunking so the account theme
does not load its PatternFly override sheet on login pages. That is the strongest
and simplest scope boundary.

As defense in depth, add a stable project-owned class such as `.cm-account` to
the account application root, then scope overrides with zero extra specificity:

```css
:where(.cm-account) .pf-v5-c-button {
  /* component variable mappings */
}
```

Do not use `#root .pf-v5-*` as the standard scope. The ID adds specificity and
recreates the same override escalation this migration is intended to remove.
Do not depend on `.pf-v5-c-page` itself as the scope marker; it is an upstream
implementation detail rather than a Colormatic contract.

Adding the root class requires a small React/bootstrap change, so it should be
done together with the single-build architecture rather than as a CSS-only edit.

## Cascade Layers

Cascade layers would make the intended order explicit:

```css
@layer reset, patternfly, colormatic;
```

They cannot safely be added only around `theme.css`. Normal declarations outside
a layer outrank normal declarations inside a layer, regardless of source order.
PatternFly is currently imported as unlayered CSS from the account entry point,
so putting only Colormatic overrides into a layer would make those overrides
weaker.

Layers become useful only after the PatternFly stylesheets are imported into a
named `patternfly` layer as part of the same stylesheet pipeline. Treat that as
a build/integration migration and verify it in every supported browser; do not
apply layers as a standalone cleanup.

## Migration Sequence

Migrate incrementally, one visual component family at a time:

1. Add account semantic tokens with light and dark values that exactly reproduce
   the current generated Tailwind colors.
2. Add the stable `.cm-account` root scope during the single-build integration.
3. Migrate page, masthead, and toolbar background variables.
4. Migrate form control, menu toggle, and menu state variables.
5. Migrate button, alert, and data-list variables.
6. Replace remaining direct structural overrides only where upstream exposes a
   suitable component variable.
7. Consider cascade layers only after all PatternFly CSS imports can be placed in
   an explicit layer.
8. When Keycloak itself moves the account console to PatternFly 6, replace the
   PF5 mappings with PF6 semantic design tokens and component variables. Do not
   mechanically rename variables; PatternFly explicitly recommends choosing the
   semantic token appropriate to each use.

For every step, capture account-console screenshots before and after at desktop
and mobile widths, in light and dark mode, and for both left-to-right and
right-to-left locales. The migration is complete only when visual changes are
intentional and keyboard focus/error states remain visible.

## Keycloak 27-Facing Watch List

At the time of this review, no Keycloak 27 tag exists. The current `main` branch
has no material post-26.7 account UI feature or styling change. The only relevant
post-tag account-theme content is localization maintenance; the account UI and
shared UI package versions are reset to the development snapshot.

Before adopting a future Keycloak 27 account-console baseline:

- diff `js/apps/account-ui`, `js/libs/ui-shared`, and the `keycloak.v3` account
  messages from the 26.7.0 tag to the final 27.0.0 tag;
- check the account UI package for a PatternFly major change before updating any
  `pf-v5-*` selectors;
- preserve the new 26.7 Verifiable Credentials route and issued-credential UI;
- refresh all checked-in account translations, not only English; and
- run the CSS migration screenshot matrix because even patch-level React
  component changes can alter emitted PatternFly markup.
