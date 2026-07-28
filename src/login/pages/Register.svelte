<script lang="ts">
  import type { UserProfileFormFieldsProps } from "../components/UserProfileFormFieldsProps";
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import { clsx } from "keycloakify/tools/clsx";
  import { untrack, type Component } from "svelte";
  import TermsAcceptance from "../components/TermsAcceptance.svelte";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";
  import { Button } from "../../lib/components/ui/button";

  type RegisterProps = PageProps<
    Extract<KcContext, { pageId: "register.ftl" }>,
    I18n
  > & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  };
  let {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  }: RegisterProps = $props();

  const messageHeader = $derived(kcContext.messageHeader);
  const url = $derived(kcContext.url);
  const messagesPerField = $derived(kcContext.messagesPerField);
  const recaptchaRequired = $derived(kcContext.recaptchaRequired);
  const recaptchaVisible = $derived(kcContext.recaptchaVisible);
  const recaptchaSiteKey = $derived(kcContext.recaptchaSiteKey);
  const recaptchaAction = $derived(kcContext.recaptchaAction);
  const termsAcceptanceRequired = $derived(kcContext.termsAcceptanceRequired);

  const msg = $derived($i18n.msg);
  const advancedMsg = $derived($i18n.advancedMsg);

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);
  let htmlFormElement: HTMLFormElement | null = $state(null);

  $effect(() => {
    if (htmlFormElement === null) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onSubmitRecaptcha = () => {
      htmlFormElement?.requestSubmit();
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onSubmitRecaptcha;
    };
  });
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
    class="kcFormClass cm-login-form"
    action={url.registrationAction}
    method="post"
    bind:this={htmlFormElement}
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
    <div class="kcFormGroupClass cm-login-field">
      {#if recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined}
        <div id="kc-form-buttons" class="kcFormButtonsClass cm-login-actions">
          <Button
            class={clsx("w-full", "g-recaptcha")}
            data-sitekey={recaptchaSiteKey}
            data-callback={untrack(() => "onSubmitRecaptcha")}
            data-action={recaptchaAction}
            type="submit"
          >
            {@render msg("doRegister")()}
          </Button>
        </div>
      {:else}
        <div id="kc-form-buttons" class="kcFormButtonsClass cm-login-actions">
          <Button
            disabled={!$isFormSubmittable ||
              (termsAcceptanceRequired && !$areTermsAccepted)}
            class="w-full"
            type="submit"
          >
            {@render msg("doRegister")()}
          </Button>
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
