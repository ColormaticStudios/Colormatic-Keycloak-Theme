<script lang="ts">
  import LogoutOtherSessions from "../components/LogoutOtherSessions.svelte";
  import type { PageProps } from "./PageProps";
  import { useScript } from "@keycloakify/svelte/login/pages/WebauthnRegister.useScript";
  import { untrack } from "svelte";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "webauthn-register.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const isSetRetry = $derived(kcContext.isSetRetry);
  const isAppInitiatedAction = $derived(kcContext.isAppInitiatedAction);

  const msg = $derived($i18n.msg);
  const msgStr = $derived($i18n.msgStr);

  const authButtonId = "authenticateWebAuthnButton";

  useScript({
    authButtonId,
    kcContext: untrack(() => kcContext),
    i18n: untrack(() => i18n),
  });
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    <span class="kcWebAuthnKeyIcon"></span>
    {@render msg("webauthn-registration-title")()}
  {/snippet}
  <form
    id="register"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <div class="kcFormGroupClass">
      <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
      <input type="hidden" id="attestationObject" name="attestationObject" />
      <input
        type="hidden"
        id="publicKeyCredentialId"
        name="publicKeyCredentialId"
      />
      <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
      <input type="hidden" id="transports" name="transports" />
      <input type="hidden" id="error" name="error" />
      <LogoutOtherSessions {i18n} />
    </div>
  </form>
  <input
    type="submit"
    class="
      kcButtonClass
      kcButtonPrimaryClass
      kcButtonBlockClass
      kcButtonLargeClass
    "
    id={authButtonId}
    value={msgStr("doRegisterSecurityKey")}
  />
  {#if !isSetRetry && isAppInitiatedAction}
    <form
      action={url.loginAction}
      class="kcFormClass"
      id="kc-webauthn-settings-form"
      method="post"
    >
      <button
        type="submit"
        class="
          kcButtonClass
          kcButtonDefaultClass
          kcButtonBlockClass
          kcButtonLargeClass
        "
        id="cancelWebAuthnAIA"
        name="cancel-aia"
        value="true"
      >
        {@render msg("doCancel")()}
      </button>
    </form>
  {/if}
</Template>
