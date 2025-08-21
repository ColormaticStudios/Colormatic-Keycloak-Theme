<script lang="ts">
  import LogoutOtherSessions from "../components/LogoutOtherSessions.svelte";
  import PasswordWrapper from "../components/PasswordWrapper.svelte";
  import type { PageProps } from "./PageProps";
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
    Extract<KcContext, { pageId: "login-update-password.ftl" }>,
    I18n
  > = $props();

  const { msg, msgStr } = $i18n;

  const { url, messagesPerField, isAppInitiatedAction } = kcContext;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError("password", "password-confirm")}
>
  {#snippet headerNode()}
    {@render msg("updatePasswordTitle")()}
  {/snippet}
  <form
    id="kc-passwd-update-form"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <div class="kcFormGroupClass">
      <div class="kcLabelWrapperClass">
        <label for="password-new" class="kcLabelClass">
          {@render msg("passwordNew")()}
        </label>
      </div>
      <div class="kcInputWrapperClass">
        <PasswordWrapper {i18n} passwordInputId="password-new">
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="password"
            id="password-new"
            name="password-new"
            class="kcInputClass"
            autofocus
            autocomplete="new-password"
            aria-invalid={messagesPerField.existsError(
              "password",
              "password-confirm",
            )}
          />
        </PasswordWrapper>

        {#if messagesPerField.existsError("password")}
          <span
            id="input-error-password"
            class="kcInputErrorMessageClass"
            aria-live="polite"
          >
            {@html kcSanitize(messagesPerField.get("password"))}
          </span>
        {/if}
      </div>
    </div>

    <div class="kcFormGroupClass">
      <div class="kcLabelWrapperClass">
        <label for="password-confirm" class="kcLabelClass">
          {@render msg("passwordConfirm")()}
        </label>
      </div>
      <div class="kcInputWrapperClass">
        <PasswordWrapper {i18n} passwordInputId="password-confirm">
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="password"
            id="password-confirm"
            name="password-confirm"
            class="kcInputClass"
            autofocus
            autocomplete="new-password"
            aria-invalid={messagesPerField.existsError(
              "password",
              "password-confirm",
            )}
          />
        </PasswordWrapper>

        {#if messagesPerField.existsError("password-confirm")}
          <span
            id="input-error-password-confirm"
            class="kcInputErrorMessageClass"
            aria-live="polite"
          >
            {@html kcSanitize(messagesPerField.get("password-confirm"))}
          </span>
        {/if}
      </div>
    </div>
    <div class="kcFormGroupClass">
      <LogoutOtherSessions {i18n} />
      <div id="kc-form-buttons" class="kcFormButtonsClass">
        <input
          class="
            kcButtonClass
            kcButtonPrimaryClass
				{!isAppInitiatedAction ? 'kcButtonBlockClass' : ''}
            kcButtonLargeClass
          "
          type="submit"
          value={msgStr("doSubmit")}
        />
        {#if isAppInitiatedAction}
          <button
            class="
              kcButtonClass
              kcButtonDefaultClass
              kcButtonLargeClass
            "
            type="submit"
            name="cancel-aia"
            value="true"
          >
            {@render msg("doCancel")()}
          </button>
        {/if}
      </div>
    </div>
  </form>
</Template>
