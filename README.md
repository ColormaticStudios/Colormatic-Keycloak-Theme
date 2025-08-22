# Colormatic Keycloak Theme

This project was built from the [Keycloakify Svelte Starter](https://github.com/keycloakify/keycloakify-starter-svelte)

Some things that need to be done:

- [x] Unify the architecture of all the forms
- [x] Fix the random spacing around the place
- [ ] Build a proper unified design language
- [ ] Customize the colors to thematically align with Colormatic
- [x] Integrate proper components (like [Shadcn/Svelte](https://www.shadcn-svelte.com/))
- [ ] User feedback

# Testing the theme locally

[Documentation](https://docs.keycloakify.dev/testing-your-theme)

# Building the theme

You need to have [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.1.1, Java >= 7).  
The `mvn` command must be in the $PATH.

- On macOS: `brew install maven`
- On Debian/Ubuntu: `sudo apt-get install maven`
- On Windows: `choco install openjdk` and `choco install maven` (Or download from [here](https://maven.apache.org/download.cgi))

```bash
yarn run build-keycloak-theme
```

Note that by default Keycloakify generates multiple .jar files for different versions of Keycloak.

