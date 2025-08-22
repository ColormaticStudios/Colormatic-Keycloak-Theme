<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n> = $props();

  const { msg, msgStr } = $i18n;

  const { url } = kcContext;
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
  {#snippet headerNode()}
    {@render msg("termsTitle")()}
  {/snippet}
  <div id="kc-terms-text">{@render msg("termsText")()}</div>
  <form class="form-actions" action={url.loginAction} method="POST">
    <div id="kc-form-buttons" class="kcFormButtonsWrapperClass">
      <input
        class="
          kcButtonClass
          kcButtonPrimaryClass
          kcButtonLargeClass
        "
        name="accept"
        id="kc-accept"
        type="submit"
        value={msgStr("doAccept")}
      />
      <input
        class="
          kcButtonClass
          kcButtonDefaultClass
          kcButtonLargeClass
        "
        name="cancel"
        id="kc-decline"
        type="submit"
        value={msgStr("doDecline")}
      />
    </div>
  </form>
  <div class="clearfix"></div>
</Template>
