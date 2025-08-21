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
    Extract<KcContext, { pageId: "login-reset-password.ftl" }>,
    I18n
  > = $props();

  const { url, realm, auth, messagesPerField } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayInfo={true}
  displayMessage={!messagesPerField.existsError("username")}
>
  {#snippet headerNode()}
    {@render msg("emailForgotTitle")()}
  {/snippet}
  {#snippet infoNode()}
    {#if realm.duplicateEmailsAllowed}
      {@render msg("emailInstructionUsername")()}
    {:else}
      {@render msg("emailInstruction")()}
    {/if}
  {/snippet}
  <form
    id="kc-reset-password-form"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <div class="kcFormGroupClass">
      <div class="kcLabelWrapperClass">
        <label for="username" class="kcLabelClass">
          {#if !realm.loginWithEmailAllowed}
            {@render msg("username")()}
          {:else if !realm.registrationEmailAsUsername}
            {@render msg("usernameOrEmail")()}
          {:else}
            {@render msg("email")()}
          {/if}
        </label>
      </div>
      <div class="kcInputWrapperClass">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          id="username"
          name="username"
          class="kcInputClass"
          autofocus
          value={auth.attemptedUsername ?? ""}
          aria-invalid={messagesPerField.existsError("username")}
        />
        {#if messagesPerField.existsError("username")}
          <span
            id="input-error-username"
            class="kcInputErrorMessageClass"
            aria-live="polite"
          >
            {@html kcSanitize(messagesPerField.get("username"))}
          </span>
        {/if}
      </div>
    </div>
    <div class="kcFormGroupClass kcFormSettingClass">
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass">
          <span>
            <a href={url.loginUrl}>{@render msg("backToLogin")()}</a>
          </span>
        </div>
      </div>

      <div id="kc-form-buttons" class="kcFormButtonsClass">
        <input
          class="
            kcButtonClass
            kcButtonPrimaryClass
            kcButtonBlockClass
            kcButtonLargeClass
          "
          type="submit"
          value={msgStr("doSubmit")}
        />
      </div>
    </div>
  </form>
</Template>
