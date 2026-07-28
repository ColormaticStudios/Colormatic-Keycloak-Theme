<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import FormActions from "../components/FormActions.svelte";
  import { Button } from "../../lib/components/ui/button";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "login-x509-info.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const x509 = $derived(kcContext.x509);

  const msg = $derived($i18n.msg);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("doLogIn")()}
  {/snippet}
  <form
    id="kc-x509-login-info"
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    <dl class="cm-login-description-list">
      <div>
        <dt class="cm-login-label">
          {@render msg("clientCertificate")()}
        </dt>
        <dd id="certificate_subjectDN">
          {#if x509.formData.subjectDN}
            {x509.formData.subjectDN}
          {:else}
            {@render msg("noCertificate")()}
          {/if}
        </dd>
      </div>
      {#if x509.formData.isUserEnabled}
        <div>
          <dt class="cm-login-label">{@render msg("doX509Login")()}</dt>
          <dd id="username">{x509.formData.username}</dd>
        </div>
      {/if}
    </dl>
    <div class="kcFormGroupClass cm-login-field">
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass"></div>
      </div>
      <FormActions>
        <Button name="login" id="kc-login" type="submit">
          {@render msg("doContinue")()}
        </Button>
        {#if x509.formData.isUserEnabled}
          <Button variant="outline" name="cancel" id="kc-cancel" type="submit">
            {@render msg("doIgnore")()}
          </Button>
        {/if}
      </FormActions>
    </div>
  </form>
</Template>
