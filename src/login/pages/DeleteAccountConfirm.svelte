<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import * as Alert from "../../lib/components/ui/alert";
  import { Button } from "../../lib/components/ui/button";

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const triggered_from_aia = $derived(kcContext.triggered_from_aia);

  const msg = $derived($i18n.msg);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("deleteAccountConfirm")()}
  {/snippet}

  <form
    action={url.loginAction}
    class="form-vertical cm-login-form"
    method="post"
  >
    <Alert.Root>
      <TriangleAlert aria-hidden="true" />
      <Alert.Description>
        {@render msg("irreversibleAction")()}
      </Alert.Description>
    </Alert.Root>
    <p>{@render msg("deletingImplies")()}</p>
    <ul class="cm-login-muted">
      <li>{@render msg("loggingOutImmediately")()}</li>
      <li>{@render msg("errasingData")()}</li>
    </ul>
    <p class="delete-account-text">
      {@render msg("finalDeletionConfirmation")()}
    </p>
    <div
      id="kc-form-buttons"
      class="kcFormButtonsWrapperClass cm-login-actions"
    >
      <Button type="submit" variant="destructive" size="lg">
        {@render msg("doConfirmDelete")()}
      </Button>
      {#if triggered_from_aia}
        <Button
          type="submit"
          variant="outline"
          size="lg"
          name="cancel-aia"
          value="true"
        >
          {@render msg("doCancel")()}
        </Button>
      {/if}
    </div>
  </form>
</Template>
