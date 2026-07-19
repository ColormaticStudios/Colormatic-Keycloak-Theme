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
  }: PageProps<
    Extract<KcContext, { pageId: "logout-confirm.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const client = $derived(kcContext.client);
  const logoutConfirm = $derived(kcContext.logoutConfirm);

  const msg = $derived($i18n.msg);
  const msgStr = $derived($i18n.msgStr);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("logoutConfirmTitle")()}
  {/snippet}

  <div id="kc-logout-confirm" class="content-area">
    <p class="instruction">{@render msg("logoutConfirmHeader")()}</p>
    <form class="form-actions" action={url.logoutConfirmAction} method="POST">
      <input type="hidden" name="session_code" value={logoutConfirm.code} />
      <div id="kc-form-buttons" class="kcFormGroupClass">
        <input
          class="
              kcButtonClass
              kcButtonPrimaryClass
              kcButtonBlockClass
              kcButtonLargeClass
            "
          name="confirmLogout"
          id="kc-logout"
          type="submit"
          value={msgStr("doLogout")}
        />
      </div>
    </form>
    <div id="kc-info-message">
      {#if !logoutConfirm.skipLink && client.baseUrl}
        <p>
          <a href={client.baseUrl}>{@render msg("backToApplication")()}</a>
        </p>
      {/if}
    </div>
  </div>
</Template>
