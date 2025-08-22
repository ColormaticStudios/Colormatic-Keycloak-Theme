<script lang="ts">
  import type { UserProfileFormFieldsProps } from "../components/UserProfileFormFieldsProps";
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import { clsx } from "keycloakify/tools/clsx";
  import type { Component } from "svelte";
  import TermsAcceptance from "../components/TermsAcceptance.svelte";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";

  type RegisterProps = PageProps<
    Extract<KcContext, { pageId: "register.ftl" }>,
    I18n
  > & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  };
  const props: RegisterProps = $props();
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  } = props;

  const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
  } = kcContext;

  const { msg, msgStr, advancedMsg } = $i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={messagesPerField.exists("global")}
  displayRequiredFields={true}
>
  {#snippet headerNode()}
    {#if messageHeader !== undefined}
      {@render advancedMsg(messageHeader)()}
    {:else}
      {@render msg("registerTitle")()}
    {/if}
  {/snippet}
  <form
    id="kc-register-form"
    class="kcFormClass"
    action={url.registrationAction}
    method="post"
  >
    <UserProfileFormFields
      {kcContext}
      {i18n}
      onIsFormSubmittableValueChange={setIsFormSubmittable}
      {doMakeUserConfirmPassword}
    />
    {#if termsAcceptanceRequired}
      <TermsAcceptance
        {i18n}
        {messagesPerField}
        areTermsAccepted={$areTermsAccepted}
        onAreTermsAcceptedValueChange={setAreTermsAccepted}
      />
    {/if}
    {#if recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined)}
      <div class="form-group">
        <div class="kcInputWrapperClass">
          <div
            class="g-recaptcha flex justify-center pt-4"
            data-size="compact"
            data-sitekey={recaptchaSiteKey}
            data-action={recaptchaAction}
          ></div>
        </div>
      </div>
    {/if}
    <div class="kcFormGroupClass">
      {#if recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined}
        <div id="kc-form-buttons" class="kcFormButtonsClass">
          <button
            class={clsx(
              "kcButtonClass",
              "kcButtonPrimaryClass",
              "kcButtonBlockClass",
              "kcButtonLargeClass",
              "g-recaptcha",
            )}
            data-sitekey={recaptchaSiteKey}
            data-callback={() => {
              (
                document.getElementById("kc-register-form") as HTMLFormElement
              ).requestSubmit();
            }}
            data-action={recaptchaAction}
            type="submit"
          >
            {@render msg("doRegister")()}
          </button>
        </div>
      {:else}
        <div id="kc-form-buttons" class="kcFormButtonsClass">
          <input
            disabled={!$isFormSubmittable ||
              (termsAcceptanceRequired && !$areTermsAccepted)}
            class="
              kcButtonClass
              kcButtonPrimaryClass
              kcButtonBlockClass
              kcButtonLargeClass
            "
            type="submit"
            value={msgStr("doRegister")}
          />
        </div>
      {/if}
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass">
          <span>
            <a href={url.loginUrl}>{@render msg("backToLogin")()}</a>
          </span>
        </div>
      </div>
    </div>
  </form>
</Template>
