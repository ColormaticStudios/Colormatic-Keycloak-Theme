<script lang="ts">
  import type { PageProps } from "./PageProps";
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
    Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);

  const msg = $derived($i18n.msg);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("oauth2DeviceVerificationTitle")()}
  {/snippet}
  <form
    id="kc-user-verify-device-user-code-form"
    class="kcFormClass cm-login-form"
    action={url.oauth2DeviceVerificationAction}
    method="post"
  >
    <FormField inputId="device-user-code">
      {#snippet label()}
        {@render msg("verifyOAuth2DeviceUserCode")()}
      {/snippet}
      {#snippet control()}
        <Input
          id="device-user-code"
          name="device_user_code"
          autocomplete="off"
          type="text"
          class="kcInputClass cm-login-input"
          autofocus
        />
      {/snippet}
    </FormField>

    <div class="kcFormGroupClass cm-login-field">
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass"></div>
      </div>

      <FormActions>
        <Button class="cm-login-action--block" type="submit">
          {@render msg("doSubmit")()}
        </Button>
      </FormActions>
    </div>
  </form>
</Template>
