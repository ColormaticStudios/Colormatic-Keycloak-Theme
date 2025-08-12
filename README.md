# Colormatic Keycloak Theme

This theme was built with Keycloakify. It's still early in development and needs a lot of work to be ready.

Some things that need to be done:

- Unify the architecture of all the forms
- Fix the random spacing around the place (related to the previous issue)
- Build a proper unified design language
- Customize the colors to thematically align Colormatic
- Integrate proper components (like [Shadcn/Svelte](https://www.shadcn-svelte.com/))
- User feedback

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

Built from: [Keycloakify Svelte Starter](https://github.com/keycloakify/keycloakify-starter-svelte)
