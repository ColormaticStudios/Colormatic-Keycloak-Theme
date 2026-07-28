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
  }: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n> = $props();

  const msg = $derived($i18n.msg);

  const url = $derived(kcContext.url);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
  {#snippet headerNode()}
    {@render msg("termsTitle")()}
  {/snippet}
  <div id="kc-terms-text">{@render msg("termsText")()}</div>
  <form
    class="form-actions cm-login-form"
    action={url.loginAction}
    method="POST"
  >
    <div
      id="kc-form-buttons"
      class="kcFormButtonsWrapperClass cm-login-actions"
    >
      <Button size="lg" name="accept" id="kc-accept" type="submit">
        {@render msg("doAccept")()}
      </Button>
      <Button
        variant="outline"
        size="lg"
        name="cancel"
        id="kc-decline"
        type="submit"
      >
        {@render msg("doDecline")()}
      </Button>
    </div>
  </form>
  <div class="clearfix"></div>
</Template>
