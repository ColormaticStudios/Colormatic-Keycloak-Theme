<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n> = $props();

  const message = $derived(kcContext.message);
  const client = $derived(kcContext.client);
  const skipLink = $derived(kcContext.skipLink);

  const msg = $derived($i18n.msg);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
  {#snippet headerNode()}
    {@render msg("errorTitle")()}
  {/snippet}
  <div id="kc-error-message">
    <p class="instruction">{@html kcSanitize(message.summary)}</p>
    {#if !skipLink && client !== undefined && client.baseUrl !== undefined}
      <p class="pt-2">
        <a id="backToApplication" href={client.baseUrl}>
          {@render msg("backToApplication")()}
        </a>
      </p>
    {/if}
  </div>
</Template>
