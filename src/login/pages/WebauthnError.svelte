<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "webauthn-error.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const isAppInitiatedAction = $derived(kcContext.isAppInitiatedAction);
  const execution = $derived(kcContext.execution);

  const msg = $derived($i18n.msg);
  const msgStr = $derived($i18n.msgStr);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={true}>
  {#snippet headerNode()}
    {@render msg("webauthn-error-title")()}
  {/snippet}
  <form
    id="kc-error-credential-form"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <input
      type="hidden"
      id="executionValue"
      name="authenticationExecution"
      value={execution}
    />
    <input type="hidden" id="isSetRetry" name="isSetRetry" value="retry" />
  </form>
  <input
    form="kc-error-credential-form"
    type="submit"
    class="
      kcButtonClass
      kcButtonPrimaryClass
      kcButtonBlockClass
      kcButtonLargeClass
    "
    name="try-again"
    id="kc-try-again"
    value={msgStr("doTryAgain")}
  />
  {#if isAppInitiatedAction}
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
        {msgStr("doCancel")}
      </button>
    </form>
  {/if}
</Template>
