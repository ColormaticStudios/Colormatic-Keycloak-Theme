<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
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
    Extract<KcContext, { pageId: "login-reset-password.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const realm = $derived(kcContext.realm);
  const auth = $derived(kcContext.auth);
  const messagesPerField = $derived(kcContext.messagesPerField);

  const msg = $derived($i18n.msg);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayInfo={true}
  displayMessage={!messagesPerField.existsError("username")}
>
  {#snippet headerNode()}
    {@render msg("emailForgotTitle")()}
  {/snippet}
  {#snippet infoNode()}
    {#if realm.duplicateEmailsAllowed}
      {@render msg("emailInstructionUsername")()}
    {:else}
      {@render msg("emailInstruction")()}
    {/if}
  {/snippet}
  <form
    id="kc-reset-password-form"
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    <FormField
      inputId="username"
      hasError={messagesPerField.existsError("username")}
    >
      {#snippet label()}
        {#if !realm.loginWithEmailAllowed}
          {@render msg("username")()}
        {:else if !realm.registrationEmailAsUsername}
          {@render msg("usernameOrEmail")()}
        {:else}
          {@render msg("email")()}
        {/if}
      {/snippet}
      {#snippet control()}
        <Input
          type="text"
          id="username"
          name="username"
          autofocus
          value={auth.attemptedUsername ?? ""}
          aria-invalid={messagesPerField.existsError("username")}
        />
      {/snippet}
      {#snippet error()}
        {#if messagesPerField.existsError("username")}
          <span id="input-error-username">
            {@html kcSanitize(messagesPerField.get("username"))}
          </span>
        {/if}
      {/snippet}
    </FormField>
    <div class="kcFormGroupClass kcFormSettingClass">
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass pt-3">
          <span>
            <a href={url.loginUrl}>{@render msg("backToLogin")()}</a>
          </span>
        </div>
      </div>

      <FormActions>
        <Button class="cm-login-action--block" type="submit">
          {@render msg("doSubmit")()}
        </Button>
      </FormActions>
    </div>
  </form>
</Template>
