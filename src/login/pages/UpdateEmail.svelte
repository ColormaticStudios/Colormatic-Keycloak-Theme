<script lang="ts">
  import LogoutOtherSessions from "../components/LogoutOtherSessions.svelte";
  import type { UserProfileFormFieldsProps } from "../components/UserProfileFormFieldsProps";
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import type { Component } from "svelte";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";
  import { Button } from "../../lib/components/ui/button";

  type UpdateEmailProps = PageProps<
    Extract<KcContext, { pageId: "update-email.ftl" }>,
    I18n
  > & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  };

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  }: UpdateEmailProps = $props();

  const msg = $derived($i18n.msg);

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);

  const url = $derived(kcContext.url);
  const messagesPerField = $derived(kcContext.messagesPerField);
  const isAppInitiatedAction = $derived(kcContext.isAppInitiatedAction);
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
    {@render msg("updateEmailTitle")()}
  {/snippet}
  <form
    id="kc-update-email-form"
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    <UserProfileFormFields
      {kcContext}
      {i18n}
      onIsFormSubmittableValueChange={setIsFormSubmittable}
      {doMakeUserConfirmPassword}
    />

    <div class="kcFormGroupClass cm-login-field">
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass"></div>
      </div>

      <LogoutOtherSessions {i18n} />

      <div
        id="kc-form-buttons"
        class="kcFormButtonsWrapperClass cm-login-actions"
      >
        <Button disabled={!$isFormSubmittable} class="w-full" type="submit">
          {@render msg("doSubmit")()}
        </Button>
        {#if isAppInitiatedAction}
          <Button
            variant="outline"
            class="w-full"
            type="submit"
            name="cancel-aia"
            value="true"
          >
            {@render msg("doCancel")()}
          </Button>
        {/if}
      </div>
    </div>
  </form>
</Template>
