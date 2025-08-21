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
    Extract<KcContext, { pageId: "login-reset-otp.ftl" }>,
    I18n
  > = $props();

  const { url, messagesPerField, configuredOtpCredentials } = kcContext;

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
    id="kc-otp-reset-form"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <div class="kcInputWrapperClass">
      <div class="kcInfoAreaWrapperClass">
        <p id="kc-otp-reset-form-description">{msg("otp-reset-description")}</p>
        <ul>
          {#each configuredOtpCredentials.userOtpCredentials as otpCredential, index}
            <li>
              <input
                id={`kc-otp-credential-${index}`}
                class="kcLoginOTPListInputClass"
                type="radio"
                name="selectedCredentialId"
                value={otpCredential.id}
                checked={otpCredential.id ===
                  configuredOtpCredentials.selectedCredentialId}
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
        <div class="kcFormGroupClass">
          <div id="kc-form-buttons" class="kcFormButtonsClass">
            <input
              id="kc-otp-reset-form-submit"
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
      </div>
    </div>
  </form>
</Template>
