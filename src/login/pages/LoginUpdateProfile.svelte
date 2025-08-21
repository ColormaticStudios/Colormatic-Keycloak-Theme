<script lang="ts">
  import type { UserProfileFormFieldsProps } from "../components/UserProfileFormFieldsProps";
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import type { Component } from "svelte";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";

  type LoginUpdateProfileProps = PageProps<
    Extract<KcContext, { pageId: "login-update-profile.ftl" }>,
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
  }: LoginUpdateProfileProps = $props();

  const { messagesPerField, url, isAppInitiatedAction } = kcContext;

  const { msg, msgStr } = $i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayRequiredFields={true}
  displayMessage={messagesPerField.exists("global")}
>
  {#snippet headerNode()}
    {@render msg("loginProfileTitle")()}
  {/snippet}

  <form
    id="kc-update-profile-form"
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
      <div id="kc-form-buttons" class="kcFormButtonsClass">
        <input
          disabled={!$isFormSubmittable}
          class="
            kcButtonClass
            kcButtonPrimaryClass
				{!isAppInitiatedAction ? 'kcButtonBlockClass' : ''}
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
            "
            type="submit"
            name="cancel-aia"
            value="true"
            formnovalidate
          >
            {@render msg("doCancel")()}
          </button>
        {/if}
      </div>
    </div>
  </form>
</Template>
