<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import { untrack } from "svelte";
  import type { I18n } from "../i18n";
  import * as InputOTP from "../../lib/components/ui/input-otp/index.js";
  import CredentialChoice from "../components/CredentialChoice.svelte";
  import FormActions from "../components/FormActions.svelte";
  import FormField from "../components/FormField.svelte";
  import { Button } from "../../lib/components/ui/button";
  import * as RadioGroup from "../../lib/components/ui/radio-group";

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

  const otpLogin = $derived(kcContext.otpLogin);
  const url = $derived(kcContext.url);
  const messagesPerField = $derived(kcContext.messagesPerField);

  const msg = $derived($i18n.msg);
  let OTPValue = $state("");
  let selectedCredentialId = $state(
    untrack(() => otpLogin.selectedCredentialId ?? ""),
  );
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
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    {#if otpLogin.userOtpCredentials.length > 1}
      <div class="kcFormGroupClass cm-login-field">
        <RadioGroup.Root
          class="cm-login-choice-grid"
          name="selectedCredentialId"
          bind:value={selectedCredentialId}
        >
          {#each otpLogin.userOtpCredentials as otpCredential, index (index)}
            <CredentialChoice
              id={`kc-otp-credential-${index}`}
              value={otpCredential.id}
            >
              {#snippet title()}
                {otpCredential.userLabel}
              {/snippet}
            </CredentialChoice>
          {/each}
        </RadioGroup.Root>
      </div>
    {/if}

    <FormField inputId="otp" hasError={messagesPerField.existsError("totp")}>
      {#snippet label()}{@render msg("loginOtpOneTime")()}{/snippet}
      {#snippet control()}
        <input
          id="otp"
          name="otp"
          autocomplete="off"
          type="hidden"
          class="kcInputClass cm-login-input"
          value={OTPValue}
          aria-invalid={messagesPerField.existsError("totp")}
        />

        <div class="flex justify-center">
          <InputOTP.Root
            maxlength={6}
            bind:value={OTPValue}
            aria-labelledby="otp-label"
          >
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
      {/snippet}
      {#snippet error()}
        {#if messagesPerField.existsError("totp")}
          <span id="input-error-otp-code">
            {@html kcSanitize(messagesPerField.get("totp"))}
          </span>
        {/if}
      {/snippet}
    </FormField>

    <div class="kcFormGroupClass cm-login-field">
      <div id="kc-form-options" class="kcFormOptionsClass">
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
