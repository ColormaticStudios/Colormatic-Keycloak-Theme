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
        <p id="kc-otp-reset-form-description">
          {@render msg("otp-reset-description")()}
        </p>
        <div class="grid gap-3 pt-2 sm:grid-cols-2">
          {#each configuredOtpCredentials.userOtpCredentials as otpCredential, index (index)}
            <div class="relative">
              <input
                id={`kc-otp-credential-${index}`}
                class="peer sr-only"
                type="radio"
                name="selectedCredentialId"
                value={otpCredential.id}
                checked={otpCredential.id === otpCredential}
              />

              <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
              <label
                for={`kc-otp-credential-${index}`}
                tabindex={index + 1}
                class="block cursor-pointer rounded-lg border border-slate-300
                  bg-white p-2 shadow-sm transition peer-checked:border-indigo-500
                  peer-checked:ring-2 peer-checked:ring-indigo-400 hover:shadow-md
                  dark:border-slate-700 dark:bg-slate-800"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700"
                  >
                    <i
                      class="bi bi-lock-fill text-xl text-slate-500 dark:text-slate-300"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <span class="font-medium text-slate-900 dark:text-slate-100">
                    {otpCredential.userLabel}
                  </span>
                </div>
              </label>

              <div
                class="pointer-events-none absolute top-4 right-3 hidden h-5 w-5
                  items-center justify-center rounded-full bg-green-500
                  text-white peer-checked:flex"
              >
                <i class="bi bi-check"></i>
              </div>
            </div>
          {/each}
        </div>

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
