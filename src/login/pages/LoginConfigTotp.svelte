<script lang="ts">
  import LogoutOtherSessions from "../components/LogoutOtherSessions.svelte";
  import type { PageProps } from "./PageProps";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import * as InputOTP from "../../lib/components/ui/input-otp/index.js";
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
    Extract<KcContext, { pageId: "login-config-totp.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const isAppInitiatedAction = $derived(kcContext.isAppInitiatedAction);
  const totp = $derived(kcContext.totp);
  const mode = $derived(kcContext.mode);
  const messagesPerField = $derived(kcContext.messagesPerField);

  const msg = $derived($i18n.msg);
  const advancedMsg = $derived($i18n.advancedMsg);

  let OTPValue = $state("");
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError("totp", "userLabel")}
>
  {#snippet headerNode()}
    {@render msg("loginTotpTitle")()}
  {/snippet}
  <ol id="kc-totp-settings">
    <li>
      <p>{@render msg("loginTotpStep1")()}</p>

      <ul id="kc-totp-supported-apps">
        {#each totp.supportedApplications as app, i (i)}
          <li>{@render advancedMsg(app)()}</li>
        {/each}
      </ul>
    </li>
    {#if mode === "manual"}
      <li>
        <p>{@render msg("loginTotpManualStep2")()}</p>
        <p>
          <span id="kc-totp-secret-key">{totp.totpSecretEncoded}</span>
        </p>
        <p>
          <a href={totp.qrUrl} id="mode-barcode">
            {@render msg("loginTotpScanBarcode")()}
          </a>
        </p>
      </li>
      <li>
        <p>{@render msg("loginTotpManualStep3")()}</p>
        <ul>
          <li id="kc-totp-type">
            {@render msg("loginTotpType")()}: {@render msg(
              `loginTotp.${totp.policy.type}`,
            )()}
          </li>
          <li id="kc-totp-algorithm">
            {@render msg("loginTotpAlgorithm")()}: {totp.policy.getAlgorithmKey()}
          </li>
          <li id="kc-totp-digits">
            {@render msg("loginTotpDigits")()}: {totp.policy.digits}
          </li>
          {#if totp.policy.type === "totp"}
            <li id="kc-totp-period">
              {@render msg("loginTotpInterval")()}: {totp.policy.period}
            </li>
          {:else}
            <li id="kc-totp-counter">
              {@render msg("loginTotpCounter")()}: {totp.policy.initialCounter}
            </li>
          {/if}
        </ul>
      </li>
    {:else}
      <li>
        <p>{@render msg("loginTotpStep2")()}</p>
        <img
          id="kc-totp-secret-qr-code"
          src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
          alt="Figure: Barcode"
          class="mx-auto rounded-[28px] p-4"
        />
        <br />
        <p>
          <a href={totp.manualUrl} id="mode-manual">
            {@render msg("loginTotpUnableToScan")()}
          </a>
        </p>
      </li>
    {/if}
    <li>
      <p>{@render msg("loginTotpStep3")()}</p>
      <p>{@render msg("loginTotpStep3DeviceName")()}</p>
    </li>
  </ol>

  <form
    action={url.loginAction}
    class="kcFormClass cm-login-form"
    id="kc-totp-settings-form"
    method="post"
  >
    <FormField
      inputId="userLabel"
      required={totp.otpCredentials.length >= 1}
      hasError={messagesPerField.existsError("userLabel")}
    >
      {#snippet label()}{@render msg("loginTotpDeviceName")()}{/snippet}
      {#snippet control()}
        <Input
          type="text"
          id="userLabel"
          name="userLabel"
          autocomplete="off"
          aria-invalid={messagesPerField.existsError("userLabel")}
        />
      {/snippet}
      {#snippet error()}
        {#if messagesPerField.existsError("userLabel")}
          <span id="input-error-otp-label">
            {@html kcSanitize(messagesPerField.get("userLabel"))}
          </span>
        {/if}
      {/snippet}
    </FormField>

    <FormField
      inputId="totp"
      required
      hasError={messagesPerField.existsError("totp")}
    >
      {#snippet label()}{@render msg("authenticatorCode")()}{/snippet}
      {#snippet control()}
        <input
          type="hidden"
          id="totp"
          name="totp"
          autocomplete="off"
          class="kcInputClass cm-login-input"
          value={OTPValue}
          aria-invalid={messagesPerField.existsError("totp")}
        />

        <div class="flex justify-center">
          <InputOTP.Root
            maxlength={6}
            bind:value={OTPValue}
            aria-labelledby="totp-label"
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
    <input
      type="hidden"
      id="totpSecret"
      name="totpSecret"
      value={totp.totpSecret}
    />
    {#if mode}
      <input type="hidden" id="mode" name="mode" value={mode} />
    {/if}

    <div class="kcFormGroupClass cm-login-field">
      <LogoutOtherSessions {i18n} />
    </div>

    <FormActions>
      <Button type="submit" id="saveTOTPBtn">
        {@render msg("doSubmit")()}
      </Button>
      {#if isAppInitiatedAction}
        <Button
          type="submit"
          variant="outline"
          id="cancelTOTPBtn"
          name="cancel-aia"
          value="true"
        >
          {@render msg("doCancel")()}
        </Button>
      {/if}
    </FormActions>
  </form>
</Template>
