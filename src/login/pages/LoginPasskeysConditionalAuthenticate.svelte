<script lang="ts">
  import { useScript } from "@keycloakify/svelte/login/pages/LoginPasskeysConditionalAuthenticate.useScript";
  import type { PageProps } from "./PageProps";
  import { type ClassKey } from "keycloakify/login/lib/kcClsx";
  import { clsx } from "keycloakify/tools/clsx";
  import type { CxArg } from "keycloakify/tools/clsx_withTransform";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<
      KcContext,
      { pageId: "login-passkeys-conditional-authenticate.ftl" }
    >,
    I18n
  > = $props();

  const {
    messagesPerField,
    login,
    url,
    usernameHidden,
    shouldDisplayAuthenticators,
    authenticators,
    registrationDisabled,
    realm,
  } = kcContext;

  const { msg, msgStr, advancedMsg } = $i18n;

  const authButtonId = "authenticateWebAuthnButton";

  useScript({ authButtonId, kcContext, i18n });
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("passkey-login-title")()}
  {/snippet}
  {#snippet infoNode()}
    {#if realm.registrationAllowed && !registrationDisabled}
      <div id="kc-registration">
        <span>
          {@render msg("noAccount")()}
          <a tabindex={6} href={url.registrationUrl}>
            {@render msg("doRegister")()}
          </a>
        </span>
      </div>
    {/if}
  {/snippet}
  <form id="webauth" action={url.loginAction} method="post">
    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
    <input type="hidden" id="authenticatorData" name="authenticatorData" />
    <input type="hidden" id="signature" name="signature" />
    <input type="hidden" id="credentialId" name="credentialId" />
    <input type="hidden" id="userHandle" name="userHandle" />
    <input type="hidden" id="error" name="error" />
  </form>
  <div class="kcFormGroupClass">
    {#if authenticators !== undefined && Object.keys(authenticators).length !== 0}
      <form id="authn_select" class="kcFormClass">
        {#each authenticators.authenticators as authenticator}
          <input
            type="hidden"
            name="authn_use_chk"
            readOnly
            value={authenticator.credentialId}
          />
        {/each}
      </form>
      {#if shouldDisplayAuthenticators}
        {#if authenticators.authenticators.length > 1}
          <p class="kcSelectAuthListItemTitle">
            {msg("passkey-available-authenticators")}
          </p>
        {/if}
        <div class="kcFormClass">
          {#each authenticators.authenticators as authenticator, i}
            <div
              id={`kc-webauthn-authenticator-item-${i}`}
              class="kcSelectAuthListItemClass"
            >
              <i
                class={clsx(
                  (() => {
                    const klass = authenticator.transports
                      .iconClass as CxArg<ClassKey>;
                    if (klass === authenticator.transports.iconClass) {
                      return "kcWebAuthnDefaultIcon";
                    }
                    return klass;
                  })(),
                  "kcSelectAuthListItemIconPropertyClass",
                )}
              ></i>
              <div class="kcSelectAuthListItemBodyClass">
                <div
                  id={`kc-webauthn-authenticator-label-${i}`}
                  class="kcSelectAuthListItemHeadingClass"
                >
                  {advancedMsg(authenticator.label)}
                </div>
                {#if authenticator.transports !== undefined && authenticator.transports.displayNameProperties !== undefined && authenticator.transports.displayNameProperties.length !== 0}
                  <div
                    id={`kc-webauthn-authenticator-transport-${i}`}
                    class="kcSelectAuthListItemDescriptionClass"
                  >
                    {#each authenticator.transports.displayNameProperties as nameProperty, i}
                      <span>{advancedMsg(nameProperty)}</span>
                      {#if i !== authenticator.transports.displayNameProperties.length - 1}
                        <span>,</span>{/if}
                    {/each}
                  </div>
                {/if}
                <div class="kcSelectAuthListItemDescriptionClass">
                  <span id={`kc-webauthn-authenticator-createdlabel-${i}`}>
                    {msg("passkey-createdAt-label")}
                  </span>
                  <span id={`kc-webauthn-authenticator-created-${i}`}>
                    {authenticator.createdAt}
                  </span>
                </div>
              </div>
              <div class="kcSelectAuthListItemFillClass"></div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
    <div id="kc-form">
      <div id="kc-form-wrapper">
        {#if realm.password}
          <form
            id="kc-form-login"
            action={url.loginAction}
            method="post"
            style:display={"none"}
            onsubmit={(event) => {
              try {
                event.currentTarget.login.disabled = true;
              } catch (e) {
                console.error(e);
              }

              return true;
            }}
          >
            {#if !usernameHidden}
              <div class="kcFormGroupClass">
                <label for="username" class="kcLabelClass">
                  {msg("passkey-autofill-select")}
                </label>
                <!-- svelte-ignore a11y_autofocus -->
                <input
                  tabindex={1}
                  id="username"
                  aria-invalid={messagesPerField.existsError("username")}
                  class="kcInputClass"
                  name="username"
                  value={login.username ?? ""}
                  autocomplete="username webauthn"
                  type="text"
                  autofocus
                />
                {#if messagesPerField.existsError("username")}
                  <span
                    id="input-error-username"
                    class="kcInputErrorMessageClass"
                    aria-live="polite"
                  >
                    {messagesPerField.get("username")}
                  </span>
                {/if}
              </div>
            {/if}
          </form>
        {/if}
        <div
          id="kc-form-passkey-button"
          class="kcFormButtonsClass"
          style:display={"none"}
        >
          <!-- svelte-ignore a11y_autofocus -->
          <input
            id={authButtonId}
            type="button"
            autofocus
            value={msgStr("passkey-doAuthenticate")}
            class="
              kcButtonClass
              kcButtonPrimaryClass
              kcButtonBlockClass
              kcButtonLargeClass
            "
          />
        </div>
      </div>
    </div>
  </div>
</Template>
