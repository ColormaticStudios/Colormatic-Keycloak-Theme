<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import * as InputOTP from "../../lib/components/ui/input-otp/index.js";

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

  let OTPValue = $state("");
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
        <div class="grid gap-3 sm:grid-cols-2">
          {#each otpLogin.userOtpCredentials as otpCredential, index (index)}
            <div class="relative">
              <input
                id={`kc-otp-credential-${index}`}
                class="peer sr-only"
                type="radio"
                name="selectedCredentialId"
                value={otpCredential.id}
                checked={otpCredential.id === otpLogin.selectedCredentialId}
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
      </div>
    {/if}

    <div class="kcFormGroupClass">
      <div class="kcLabelWrapperClass">
        <label for="otp" class="kcLabelClass">
          {@render msg("loginOtpOneTime")()}
        </label>
      </div>
      <div class="kcInputWrapperClass">
        <input
          id="otp"
          name="otp"
          autocomplete="off"
          type="hidden"
          class="kcInputClass"
          value={OTPValue}
          aria-invalid={messagesPerField.existsError("totp")}
        />

        <div class="flex justify-center">
          <InputOTP.Root maxlength={6} bind:value={OTPValue}>
            {#snippet children({ cells })}
              <InputOTP.Group>
                {#each cells.slice(0, 3) as cell, i (i)}
                  <InputOTP.Slot {cell} />
                {/each}
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                {#each cells.slice(3, 6) as cell, i (i)}
                  <InputOTP.Slot {cell} />
                {/each}
              </InputOTP.Group>
            {/snippet}
          </InputOTP.Root>
        </div>

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
