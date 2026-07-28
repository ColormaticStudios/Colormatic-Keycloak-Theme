<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import FormActions from "../components/FormActions.svelte";
  import FormField from "../components/FormField.svelte";
  import { Button } from "../../lib/components/ui/button";
  import { Input } from "../../lib/components/ui/input";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const messagesPerField = $derived(kcContext.messagesPerField);
  const recoveryAuthnCodesInputBean = $derived(
    kcContext.recoveryAuthnCodesInputBean,
  );

  const msg = $derived($i18n.msg);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError("recoveryCodeInput")}
>
  {#snippet headerNode()}
    {@render msg("auth-recovery-code-header")()}
  {/snippet}
  <form
    id="kc-recovery-code-login-form"
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    <FormField
      inputId="recoveryCodeInput"
      hasError={messagesPerField.existsError("recoveryCodeInput")}
    >
      {#snippet label()}
        {@render msg(
          "auth-recovery-code-prompt",
          `${recoveryAuthnCodesInputBean.codeNumber}`,
        )()}
      {/snippet}
      {#snippet control()}
        <Input
          id="recoveryCodeInput"
          name="recoveryCodeInput"
          aria-invalid={messagesPerField.existsError("recoveryCodeInput")}
          autocomplete="off"
          type="text"
          class="kcInputClass cm-login-input"
          autofocus
        />
      {/snippet}
      {#snippet error()}
        {#if messagesPerField.existsError("recoveryCodeInput")}
          <span id="input-error">
            {@html kcSanitize(messagesPerField.get("recoveryCodeInput"))}
          </span>
        {/if}
      {/snippet}
    </FormField>

    <div class="kcFormGroupClass cm-login-field">
      <div id="kc-form-options" class="kcFormOptionsWrapperClass">
        <div class="kcFormOptionsWrapperClass"></div>
      </div>
      <FormActions>
        <Button
          class="cm-login-action--block"
          name="login"
          id="kc-login"
          type="submit"
        >
          {@render msg("doLogIn")()}
        </Button>
      </FormActions>
    </div>
  </form>
</Template>
