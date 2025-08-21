<script lang="ts">
  import type { UserProfileFormFieldsProps } from "../components/UserProfileFormFieldsProps";
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import type { Component } from "svelte";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

  type IdpReviewUserProfileProps = PageProps<
    Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>,
    I18n
  > & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  };

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  }: IdpReviewUserProfileProps = $props();

  const { msg, msgStr } = $i18n;

  const { url, messagesPerField } = kcContext;

  const [isFomSubmittable, setIsFomSubmittable] = useState(false);
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
    {@render msg("loginIdpReviewProfileTitle")()}
  {/snippet}
  <form
    id="kc-idp-review-profile-form"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <UserProfileFormFields
      {kcContext}
      {i18n}
      onIsFormSubmittableValueChange={setIsFomSubmittable}
      {doMakeUserConfirmPassword}
    />
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
          type="submit"
          value={msgStr("doSubmit")}
          disabled={!$isFomSubmittable}
        />
      </div>
    </div>
  </form>
</Template>
