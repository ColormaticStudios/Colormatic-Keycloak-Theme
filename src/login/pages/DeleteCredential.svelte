<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import { Button } from "../../lib/components/ui/button";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "delete-credential.ftl" }>,
    I18n
  > = $props();

  const msg = $derived($i18n.msg);

  const url = $derived(kcContext.url);
  const credentialLabel = $derived(kcContext.credentialLabel);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
  {#snippet headerNode()}
    {@render msg("deleteCredentialTitle", credentialLabel)()}
  {/snippet}

  <div id="kc-delete-text">
    {@render msg("deleteCredentialMessage", credentialLabel)()}
  </div>
  <form
    class="form-actions cm-login-form"
    action={url.loginAction}
    method="POST"
  >
    <div
      id="kc-form-buttons"
      class="kcFormButtonsWrapperClass cm-login-actions"
    >
      <Button
        variant="destructive"
        size="lg"
        name="accept"
        id="kc-accept"
        type="submit"
      >
        {@render msg("doConfirmDelete")()}
      </Button>
      <Button
        variant="outline"
        size="lg"
        name="cancel-aia"
        id="kc-decline"
        type="submit"
      >
        {@render msg("doCancel")()}
      </Button>
    </div>
  </form>
</Template>
