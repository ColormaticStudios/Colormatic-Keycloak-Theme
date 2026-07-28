<script lang="ts">
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";
  import type { PageProps } from "./PageProps";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "link-idp-action.ftl" }>,
    I18n
  > = $props();

  const idpDisplayName = $derived(kcContext.idpDisplayName);
  const url = $derived(kcContext.url);

  const msg = $derived($i18n.msg);
  const msgStr = $derived($i18n.msgStr);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
  {#snippet headerNode()}
    {@render msg("linkIdpActionTitle", idpDisplayName)()}
  {/snippet}

  <div id="kc-link-text" class="kcContentWrapperClass">
    {@render msg("linkIdpActionMessage", idpDisplayName)()}
  </div>
  <form
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    <div class="kcFormGroupClass cm-login-field">
      <div id="kc-form-buttons" class="kcFormButtonsClass cm-login-actions">
        <input
          class="kcButtonClass kcButtonPrimaryClass kcButtonLargeClass"
          name="continue"
          id="kc-continue"
          type="submit"
          value={msgStr("doContinue")}
        />
        <input
          class="kcButtonClass kcButtonDefaultClass kcButtonLargeClass"
          name="cancel-aia"
          id="kc-cancel"
          type="submit"
          value={msgStr("doCancel")}
        />
      </div>
    </div>
  </form>
  <div class="clearfix"></div>
</Template>
