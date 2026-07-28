<script lang="ts">
  import LogoutOtherSessions from "../components/LogoutOtherSessions.svelte";
  import PasswordWrapper from "../components/PasswordWrapper.svelte";
  import type { PageProps } from "./PageProps";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";
  import FormActions from "../components/FormActions.svelte";
  import FormField from "../components/FormField.svelte";
  import { Button } from "../../lib/components/ui/button";
  import * as InputGroup from "../../lib/components/ui/input-group";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "login-update-password.ftl" }>,
    I18n
  > = $props();

  const msg = $derived($i18n.msg);
  const url = $derived(kcContext.url);
  const messagesPerField = $derived(kcContext.messagesPerField);
  const isAppInitiatedAction = $derived(kcContext.isAppInitiatedAction);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError("password", "password-confirm")}
>
  {#snippet headerNode()}
    {@render msg("updatePasswordTitle")()}
  {/snippet}
  <form
    id="kc-passwd-update-form"
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    <FormField
      inputId="password-new"
      hasError={messagesPerField.existsError("password")}
    >
      {#snippet label()}{@render msg("passwordNew")()}{/snippet}
      {#snippet control()}
        <PasswordWrapper {i18n} passwordInputId="password-new">
          <InputGroup.Input
            type="password"
            id="password-new"
            name="password-new"
            autofocus
            autocomplete="new-password"
            aria-invalid={messagesPerField.existsError(
              "password",
              "password-confirm",
            )}
          />
        </PasswordWrapper>
      {/snippet}
      {#snippet error()}
        {#if messagesPerField.existsError("password")}
          <span id="input-error-password">
            {@html kcSanitize(messagesPerField.get("password"))}
          </span>
        {/if}
      {/snippet}
    </FormField>

    <FormField
      inputId="password-confirm"
      hasError={messagesPerField.existsError("password-confirm")}
    >
      {#snippet label()}{@render msg("passwordConfirm")()}{/snippet}
      {#snippet control()}
        <PasswordWrapper {i18n} passwordInputId="password-confirm">
          <InputGroup.Input
            type="password"
            id="password-confirm"
            name="password-confirm"
            autocomplete="new-password"
            aria-invalid={messagesPerField.existsError(
              "password",
              "password-confirm",
            )}
          />
        </PasswordWrapper>
      {/snippet}
      {#snippet error()}
        {#if messagesPerField.existsError("password-confirm")}
          <span id="input-error-password-confirm">
            {@html kcSanitize(messagesPerField.get("password-confirm"))}
          </span>
        {/if}
      {/snippet}
    </FormField>
    <div class="kcFormGroupClass cm-login-field">
      <LogoutOtherSessions {i18n} />
      <FormActions>
        <Button
          class={!isAppInitiatedAction ? "cm-login-action--block" : undefined}
          type="submit"
        >
          {@render msg("doSubmit")()}
        </Button>
        {#if isAppInitiatedAction}
          <Button
            variant="outline"
            type="submit"
            name="cancel-aia"
            value="true"
          >
            {@render msg("doCancel")()}
          </Button>
        {/if}
      </FormActions>
    </div>
  </form>
</Template>
