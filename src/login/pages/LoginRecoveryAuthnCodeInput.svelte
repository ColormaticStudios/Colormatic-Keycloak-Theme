<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

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

  const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext;

  const { msg, msgStr } = $i18n;
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
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <div class="kcFormGroupClass">
      <div class="kcLabelWrapperClass">
        <label for="recoveryCodeInput" class="kcLabelClass">
          {@render msg(
            "auth-recovery-code-prompt",
            `${recoveryAuthnCodesInputBean.codeNumber}`,
          )()}
        </label>
      </div>
      <div class="kcInputWrapperClass">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          tabindex={1}
          id="recoveryCodeInput"
          name="recoveryCodeInput"
          aria-invalid={messagesPerField.existsError("recoveryCodeInput")}
          autocomplete="off"
          type="text"
          class="kcInputClass"
          autofocus
        />
        {#if messagesPerField.existsError("recoveryCodeInput")}
          <span
            id="input-error"
            class="kcInputErrorMessageClass"
            aria-live="polite"
          >
            {@html kcSanitize(messagesPerField.get("recoveryCodeInput"))}
          </span>
        {/if}
      </div>
    </div>

    <div class="kcFormGroupClass">
      <div id="kc-form-options" class="kcFormOptionsWrapperClass">
        <div class="kcFormOptionsWrapperClass"></div>
      </div>
      <div id="kc-form-buttons" class="kcFormButtonsClass">
        <input
          class="
            kcButtonClass
            kcButtonPrimaryClass
            kcButtonBlockClass
            kcButtonLargeClass
          "
          name="login"
          id="kc-login"
          type="submit"
          value={msgStr("doLogIn")}
        />
      </div>
    </div>
  </form>
</Template>
