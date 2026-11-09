<script lang="ts">
  import PasswordWrapper from "../components/PasswordWrapper.svelte";
  import FormActions from "../components/FormActions.svelte";
  import FormField from "../components/FormField.svelte";
  import { Button } from "../../lib/components/ui/button";
  import * as InputGroup from "../../lib/components/ui/input-group";
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import { useScript } from "@keycloakify/svelte/login/pages/LoginPassword.useScript";
  import { untrack } from "svelte";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "login-password.ftl" }>,
    I18n
  > = $props();

  const realm = $derived(kcContext.realm);
  const url = $derived(kcContext.url);
  const messagesPerField = $derived(kcContext.messagesPerField);
  const enableWebAuthnConditionalUI = $derived(
    kcContext.enableWebAuthnConditionalUI,
  );
  const authenticators = $derived(kcContext.authenticators);

  const msg = $derived($i18n.msg);
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const webAuthnButtonId = "authenticateWebAuthnButton";

  useScript({
    webAuthnButtonId,
    kcContext: untrack(() => kcContext),
    i18n: untrack(() => i18n),
  });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError("password")}
>
  {#snippet headerNode()}
    {@render msg("doLogIn")()}
  {/snippet}

  <div id="kc-form">
    <div id="kc-form-wrapper">
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
        <FormField
          inputId="password"
          class="no-bottom-margin"
          hasError={messagesPerField.existsError("password")}
        >
          {#snippet label()}
            {@render msg("password")()}
          {/snippet}
          {#snippet control()}
            <PasswordWrapper {i18n} passwordInputId="password">
              <InputGroup.Input
                id="password"
                name="password"
                type="password"
                autofocus
                autocomplete="current-password"
                aria-invalid={messagesPerField.existsError(
                  "username",
                  "password",
                )}
              />
            </PasswordWrapper>
          {/snippet}
          {#snippet error()}
            {#if messagesPerField.existsError("password")}
              <span id="input-error-password">
                {@html kcSanitize(messagesPerField.get("password"))}
              </span>
            {/if}
          {/snippet}
        </FormField>
        <div class="kcFormGroupClass kcFormSettingClass">
          <div id="kc-form-options"></div>
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
          <Button
            class="cm-login-action--block"
            name="login"
            id="kc-login"
            type="submit"
            disabled={$isLoginButtonDisabled}
          >
            {@render msg("doLogIn")()}
          </Button>
        </FormActions>
      </form>
    </div>
  </div>
  {#if enableWebAuthnConditionalUI}
    <form
      id="webauth"
      class="cm-login-form"
      action={url.loginAction}
      method="post"
    >
      <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
      <input type="hidden" id="authenticatorData" name="authenticatorData" />
      <input type="hidden" id="signature" name="signature" />
      <input type="hidden" id="credentialId" name="credentialId" />
      <input type="hidden" id="userHandle" name="userHandle" />
      <input type="hidden" id="error" name="error" />
    </form>

    {#if authenticators !== undefined && authenticators.authenticators.length !== 0}
      <form id="authn_select" class="kcFormClass cm-login-form">
        {#each authenticators.authenticators as authenticator (authenticator.credentialId)}
          <input
            type="hidden"
            name="authn_use_chk"
            readonly
            value={authenticator.credentialId}
          />
        {/each}
      </form>
    {/if}

    <Button
      id={webAuthnButtonId}
      type="button"
      variant="outline"
      class="cm-login-action--block"
    >
      {@render msg("passkey-doAuthenticate")()}
    </Button>
  {/if}
</Template>
