<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n> = $props();

  const advancedMsgStr = $derived($i18n.advancedMsgStr);
  const msg = $derived($i18n.msg);

  const messageHeader = $derived(kcContext.messageHeader);
  const message = $derived(kcContext.message);
  const requiredActions = $derived(kcContext.requiredActions);
  const skipLink = $derived(kcContext.skipLink);
  const pageRedirectUri = $derived(kcContext.pageRedirectUri);
  const actionUri = $derived(kcContext.actionUri);
  const client = $derived(kcContext.client);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
  {#snippet headerNode()}
    <span>{@html kcSanitize(messageHeader ?? message.summary)}</span>
  {/snippet}

  <div id="kc-info-message">
    <p class="instruction">
      {@html kcSanitize(
        (() => {
          let html = message.summary;

          if (requiredActions) {
            html += "<b>";

            html += requiredActions
              .map((requiredAction) =>
                advancedMsgStr(`requiredAction.${requiredAction}`),
              )
              .join(", ");

            html += "</b>";
          }

          return html;
        })(),
      )}
    </p>
    {#if !skipLink}
      <p class="pt-2">
        {#if pageRedirectUri}
          <a href={pageRedirectUri}>{@render msg("backToApplication")()}</a>
        {:else if actionUri}
          <a href={actionUri}>{@render msg("proceedWithAction")()}</a>
        {:else if client.baseUrl}
          <a href={client.baseUrl}>{@render msg("backToApplication")()}</a>
        {/if}
      </p>
    {/if}
  </div>
</Template>
