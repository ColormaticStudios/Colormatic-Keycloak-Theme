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
    Extract<KcContext, { pageId: "login-otp.ftl" }>,
    I18n
  > = $props();

  const { otpLogin, url, messagesPerField } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError("totp")}
>
  {#snippet headerNode()}
    {@render msg("doLogIn")()}
  {/snippet}
  <form
    id="kc-otp-login-form"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    {#if otpLogin.userOtpCredentials.length > 1}
      <div class="kcFormGroupClass">
        <ul class="kcInputWrapperClass">
          {#each otpLogin.userOtpCredentials as otpCredential, index}
            <li>
              <input
                id={`kc-otp-credential-${index}`}
                class="kcLoginOTPListInputClass"
                type="radio"
                name="selectedCredentialId"
                value={otpCredential.id}
                checked={otpCredential.id === otpLogin.selectedCredentialId}
              />
              <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
              <label
                for={`kc-otp-credential-${index}`}
                class="kcLoginOTPListClass"
                tabindex={index}
              >
                <span class="kcLoginOTPListItemHeaderClass">
                  <span class="kcLoginOTPListItemIconBodyClass">
                    <i
                      class="kcLoginOTPListItemIconClass"
                      aria-hidden="true"
                    ></i>
                  </span>
                  <span class="kcLoginOTPListItemTitleClass">
                    {otpCredential.userLabel}
                  </span>
                </span>
              </label>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <div class="kcFormGroupClass">
      <div class="kcLabelWrapperClass">
        <label for="otp" class="kcLabelClass">
          {@render msg("loginOtpOneTime")()}
        </label>
      </div>
      <div class="kcInputWrapperClass">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          id="otp"
          name="otp"
          autocomplete="off"
          type="text"
          class="kcInputClass"
          autofocus
          aria-invalid={messagesPerField.existsError("totp")}
        />
        {#if messagesPerField.existsError("totp")}
          <span
            id="input-error-otp-code"
            class="kcInputErrorMessageClass"
            aria-live="polite"
          >
            {@html kcSanitize(messagesPerField.get("totp"))}
          </span>
        {/if}
      </div>
    </div>

    <div class="kcFormGroupClass">
      <div id="kc-form-options" class="kcFormOptionsClass">
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
