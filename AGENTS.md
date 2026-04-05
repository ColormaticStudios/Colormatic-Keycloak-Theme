# Colormatic Keycloak Theme

This repository is a monster. It includes a Keycloak login theme in Svelte and a fork of the Keycloak account console in React. It is frankensteined together with two separate Vite configs that output two themes that get combined into one.

The separation between the login theme and account console can be less than obvious and sometimes nonexistent. Use extra care to notice the difference between login theme parts and account console parts.

The style customization in the account console is done entirely with a css file containing many hand-crafted overrides, but some changes to the account console have been made for various purposes.

The style customization in the login theme is done in a similar way, but it also has some custom components and pieces.