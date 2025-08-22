<script lang="ts">
  import LogoutOtherSessions from "../components/LogoutOtherSessions.svelte";
  import type { UserProfileFormFieldsProps } from "../components/UserProfileFormFieldsProps";
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import type { Component } from "svelte";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";

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

  const { msg, msgStr } = $i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);

  const { url, messagesPerField, isAppInitiatedAction } = kcContext;
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
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <UserProfileFormFields
      {kcContext}
      {i18n}
      onIsFormSubmittableValueChange={setIsFormSubmittable}
      {doMakeUserConfirmPassword}
    />

    <div class="kcFormGroupClass">
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass"></div>
      </div>

      <LogoutOtherSessions {i18n} />

      <div id="kc-form-buttons" class="kcFormButtonsWrapperClass">
        <input
          disabled={!$isFormSubmittable}
          class="
            kcButtonClass
            kcButtonPrimaryClass
            kcButtonBlockClass
            kcButtonLargeClass
          "
          type="submit"
          value={msgStr("doSubmit")}
        />
        {#if isAppInitiatedAction}
          <button
            class="
              kcButtonClass
              kcButtonDefaultClass
              kcButtonLargeClass
              kcButtonBlockClass
            "
            type="submit"
            name="cancel-aia"
            value="true"
          >
            {@render msg("doCancel")()}
          </button>
        {/if}
      </div>
    </div>
  </form>
</Template>
