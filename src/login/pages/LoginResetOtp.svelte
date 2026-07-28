<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import CredentialChoice from "../components/CredentialChoice.svelte";
  import { Button } from "../../lib/components/ui/button";
  import * as RadioGroup from "../../lib/components/ui/radio-group";

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

  const url = $derived(kcContext.url);
  const messagesPerField = $derived(kcContext.messagesPerField);
  const configuredOtpCredentials = $derived(kcContext.configuredOtpCredentials);

  const msg = $derived($i18n.msg);
  let selectedCredentialId = $state("");
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
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    <div class="kcInputWrapperClass">
      <div class="kcInfoAreaWrapperClass">
        <p id="kc-otp-reset-form-description">
          {@render msg("otp-reset-description")()}
        </p>
        <RadioGroup.Root
          class="cm-login-choice-grid"
          name="selectedCredentialId"
          bind:value={selectedCredentialId}
        >
          {#each configuredOtpCredentials.userOtpCredentials as otpCredential, index (index)}
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

        <div class="kcFormGroupClass cm-login-field">
          <div id="kc-form-buttons" class="kcFormButtonsClass cm-login-actions">
            <Button id="kc-otp-reset-form-submit" class="w-full" type="submit">
              {@render msg("doSubmit")()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </form>
</Template>
