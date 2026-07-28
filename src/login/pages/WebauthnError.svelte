<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import { Button } from "../../lib/components/ui/button";

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
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={true}>
  {#snippet headerNode()}
    {@render msg("webauthn-error-title")()}
  {/snippet}
  <form
    id="kc-error-credential-form"
    class="kcFormClass cm-login-form"
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
  <Button
    form="kc-error-credential-form"
    type="submit"
    class="w-full"
    name="try-again"
    id="kc-try-again"
  >
    {@render msg("doTryAgain")()}
  </Button>
  {#if isAppInitiatedAction}
    <form
      action={url.loginAction}
      class="kcFormClass cm-login-form"
      id="kc-webauthn-settings-form"
      method="post"
    >
      <Button
        type="submit"
        class="w-full"
        variant="outline"
        id="cancelWebAuthnAIA"
        name="cancel-aia"
        value="true"
      >
        {@render msg("doCancel")()}
      </Button>
    </form>
  {/if}
</Template>
