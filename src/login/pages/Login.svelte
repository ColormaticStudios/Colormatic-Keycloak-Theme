<script lang="ts">
  import PasswordWrapper from "../components/PasswordWrapper.svelte";
  import FormActions from "../components/FormActions.svelte";
  import FormField from "../components/FormField.svelte";
  import { Button } from "../../lib/components/ui/button";
  import { Input } from "../../lib/components/ui/input";
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import { clsx } from "keycloakify/tools/clsx";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n> = $props();

  const social = $derived(kcContext.social);
  const realm = $derived(kcContext.realm);
  const url = $derived(kcContext.url);
  const usernameHidden = $derived(kcContext.usernameHidden);
  const login = $derived(kcContext.login);
  const auth = $derived(kcContext.auth);
  const registrationDisabled = $derived(kcContext.registrationDisabled);
  const messagesPerField = $derived(kcContext.messagesPerField);
  const enableWebAuthnConditionalUI = $derived(
    kcContext.enableWebAuthnConditionalUI,
  );

  const msg = $derived($i18n.msg);
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError("username", "password")}
  displayInfo={realm.password &&
    realm.registrationAllowed &&
    !registrationDisabled}
>
  {#snippet headerNode()}
    {@render msg("loginAccountTitle")()}
  {/snippet}

  {#snippet infoNode()}
    <div id="kc-registration-container">
      <div id="kc-registration">
        <span>
          {@render msg("noAccount")()}&nbsp;
          <a href={url.registrationUrl}>
            {@render msg("doRegister")()}
          </a>
        </span>
      </div>
    </div>
  {/snippet}
  {#snippet socialProvidersNode()}
    {@const providers = social?.providers}
    {#if realm.password && !!providers && !!providers.length}
      <div id="kc-social-providers" class="kcFormSocialAccountSectionClass">
        <hr />
        <h2>{@render msg("identity-provider-login-label")()}</h2>
        <ul
          class="kcFormSocialAccountListClass {providers.length > 3
            ? 'kcFormSocialAccountListGridClass'
            : ''}"
        >
          {#each providers as p (p.alias)}
            <li>
              <a
                id={`social-${p.alias}`}
                class="kcFormSocialAccountListButtonClass {providers.length > 3
                  ? 'kcFormSocialAccountGridItem'
                  : ''}"
                type="button"
                href={p.loginUrl}
              >
                {#if p.iconClasses}
                  <i
                    class={clsx("kcCommonLogoIdP", p.iconClasses)}
                    aria-hidden="true"
                  ></i>
                {/if}
                <span
                  class={clsx(
                    "kcFormSocialAccountNameClass",
                    p.iconClasses && "kc-social-icon-text",
                  )}
                >
                  {@html kcSanitize(p.displayName)}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/snippet}
  <div id="kc-form">
    <div id="kc-form-wrapper">
      {#if realm.password}
        <form
          class="cm-login-form"
          id="kc-form-login"
          onsubmit={() => {
            setIsLoginButtonDisabled(true);
            return true;
          }}
          action={url.loginAction}
          method="post"
        >
          {#if !usernameHidden}
            <FormField
              inputId="username"
              hasError={messagesPerField.existsError("username", "password")}
            >
              {#snippet label()}
                {@render (!realm.loginWithEmailAllowed
                  ? msg("username")
                  : !realm.registrationEmailAsUsername
                    ? msg("usernameOrEmail")
                    : msg("email"))()}
              {/snippet}
              {#snippet control()}
                <Input
                  id="username"
                  class="kcInputClass cm-login-input"
                  name="username"
                  value={login.username ?? ""}
                  type="text"
                  autofocus
                  autocomplete={enableWebAuthnConditionalUI
                    ? "username webauthn"
                    : "username"}
                  aria-invalid={messagesPerField.existsError(
                    "username",
                    "password",
                  )}
                />
              {/snippet}
              {#snippet error()}
                {#if messagesPerField.existsError("username", "password")}
                  <span id="input-error">
                    {@html kcSanitize(
                      messagesPerField.getFirstError("username", "password"),
                    )}
                  </span>
                {/if}
              {/snippet}
            </FormField>
          {/if}

          <FormField
            inputId="password"
            hasError={usernameHidden &&
              messagesPerField.existsError("username", "password")}
          >
            {#snippet label()}
              {@render msg("password")()}
            {/snippet}
            {#snippet control()}
              <PasswordWrapper {i18n} passwordInputId="password">
                <Input
                  id="password"
                  class="kcInputClass cm-login-input"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  aria-invalid={messagesPerField.existsError(
                    "username",
                    "password",
                  )}
                />
              </PasswordWrapper>
            {/snippet}
            {#snippet error()}
              {#if usernameHidden && messagesPerField.existsError("username", "password")}
                <span id="input-error">
                  {@html kcSanitize(
                    messagesPerField.getFirstError("username", "password"),
                  )}
                </span>
              {/if}
            {/snippet}
          </FormField>

          <div class="kcFormGroupClass kcFormSettingClass">
            <div id="kc-form-options">
              {#if realm.rememberMe && !usernameHidden}
                <div class="checkbox">
                  <label>
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={!!login.rememberMe}
                    />
                    &nbsp;
                    {@render msg("rememberMe")()}
                  </label>
                </div>
              {/if}
            </div>
            <div class="kcFormOptionsWrapperClass">
              {#if realm.resetPasswordAllowed}
                <span>
                  <a href={url.loginResetCredentialsUrl}>
                    {@render msg("doForgotPassword")()}
                  </a>
                </span>
              {/if}
            </div>
          </div>

          <FormActions>
            <input
              type="hidden"
              id="id-hidden-input"
              name="credentialId"
              value={auth.selectedCredential}
            />
            <Button
              disabled={$isLoginButtonDisabled}
              class="cm-login-action--block"
              name="login"
              id="kc-login"
              type="submit"
            >
              {@render msg("doLogIn")()}
            </Button>
          </FormActions>
        </form>
      {/if}
    </div>
  </div>
</Template>
