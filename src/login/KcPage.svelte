<script lang="ts">
  import Template from "./Template.svelte";
  import UserProfileFormFields from "./components/UserProfileFormFields.svelte";
  import type { KcContext } from "keycloakify/login/KcContext";
  import type { ClassKey } from "keycloakify/login/lib/kcClsx";
  import type { Component } from "svelte";
  import { useI18n } from "./i18n";

  const { kcContext }: { kcContext: KcContext } = $props();

  const { i18n } = useI18n({ kcContext });

  const classes = {} satisfies { [key in ClassKey]?: string };
  const doMakeUserConfirmPassword = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = async (): Promise<{ default?: Component<any> }> => {
    switch (kcContext.pageId) {
      case "login.ftl":
        return import("./pages/Login.svelte");
      case "login-username.ftl":
        return import("./pages/LoginUsername.svelte");
      case "login-password.ftl":
        return import("./pages/LoginPassword.svelte");
      case "webauthn-authenticate.ftl":
        return import("./pages/WebauthnAuthenticate.svelte");
      case "webauthn-register.ftl":
        return import("./pages/WebauthnRegister.svelte");
      case "register.ftl":
        return import("./pages/Register.svelte");
      case "info.ftl":
        return import("./pages/Info.svelte");
      case "error.ftl":
        return import("./pages/Error.svelte");
      case "login-reset-password.ftl":
        return import("./pages/LoginResetPassword.svelte");
      case "login-verify-email.ftl":
        return import("./pages/LoginVerifyEmail.svelte");
      case "terms.ftl":
        return import("./pages/Terms.svelte");
      case "login-oauth2-device-verify-user-code.ftl":
        return import("./pages/LoginOauth2DeviceVerifyUserCode.svelte");
      case "login-oauth-grant.ftl":
        return import("./pages/LoginOauthGrant.svelte");
      case "login-otp.ftl":
        return import("./pages/LoginOtp.svelte");
      case "login-update-profile.ftl":
        return import("./pages/LoginUpdateProfile.svelte");
      case "login-update-password.ftl":
        return import("./pages/LoginUpdatePassword.svelte");
      case "login-idp-link-confirm.ftl":
        return import("./pages/LoginIdpLinkConfirm.svelte");
      case "login-idp-link-email.ftl":
        return import("./pages/LoginIdpLinkEmail.svelte");
      case "login-page-expired.ftl":
        return import("./pages/LoginPageExpired.svelte");
      case "login-config-totp.ftl":
        return import("./pages/LoginConfigTotp.svelte");
      case "logout-confirm.ftl":
        return import("./pages/LogoutConfirm.svelte");
      case "idp-review-user-profile.ftl":
        return import("./pages/IdpReviewUserProfile.svelte");
      case "update-email.ftl":
        return import("./pages/UpdateEmail.svelte");
      case "select-authenticator.ftl":
        return import("./pages/SelectAuthenticator.svelte");
      case "saml-post-form.ftl":
        return import("./pages/SamlPostForm.svelte");
      case "delete-credential.ftl":
        return import("./pages/DeleteCredential.svelte");
      case "code.ftl":
        return import("./pages/Code.svelte");
      case "delete-account-confirm.ftl":
        return import("./pages/DeleteAccountConfirm.svelte");
      case "frontchannel-logout.ftl":
        return import("./pages/FrontchannelLogout.svelte");
      case "login-recovery-authn-code-config.ftl":
        return import("./pages/LoginRecoveryAuthnCodeConfig.svelte");
      case "login-recovery-authn-code-input.ftl":
        return import("./pages/LoginRecoveryAuthnCodeInput.svelte");
      case "login-reset-otp.ftl":
        return import("./pages/LoginResetOtp.svelte");
      case "login-x509-info.ftl":
        return import("./pages/LoginX509Info.svelte");
      case "webauthn-error.ftl":
        return import("./pages/WebauthnError.svelte");
      case "login-passkeys-conditional-authenticate.ftl":
        return import("./pages/LoginPasskeysConditionalAuthenticate.svelte");
      case "login-idp-link-confirm-override.ftl":
        return import("./pages/LoginIdpLinkConfirmOverride.svelte");
      default:
        return import("@keycloakify/svelte/login/DefaultPage.svelte");
    }
  };
</script>

{#await page() then { default: Page }}
  <Page
    {kcContext}
    {i18n}
    {classes}
    {Template}
    {UserProfileFormFields}
    doUseDefaultCss={false}
    {doMakeUserConfirmPassword}
  ></Page>
{/await}
