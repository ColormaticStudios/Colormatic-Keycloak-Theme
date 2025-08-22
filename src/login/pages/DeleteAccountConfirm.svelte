<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

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

  const { url, triggered_from_aia } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("deleteAccountConfirm")()}
  {/snippet}

  <form action={url.loginAction} class="form-vertical" method="post">
    <div class="alert alert-warning pb-2">
      <i class="bi bi-exclamation-triangle-fill"></i>
      {@render msg("irreversibleAction")()}
    </div>
    <p>{@render msg("deletingImplies")()}</p>
    <ul class="text-slate-500">
      <li>{@render msg("loggingOutImmediately")()}</li>
      <li>{@render msg("errasingData")()}</li>
    </ul>
    <p class="delete-account-text">
      {@render msg("finalDeletionConfirmation")()}
    </p>
    <div id="kc-form-buttons" class="kcFormButtonsWrapperClass">
      <input
        class="
          kcButtonClass
          kcButtonLargeClass
          kcButtonRedClass
		  "
        type="submit"
        value={msgStr("doConfirmDelete")}
      />
      {#if triggered_from_aia}
        <button
          class="
            kcButtonClass
            kcButtonDefaultClass
            kcButtonLargeClass
          "
          type="submit"
          name="cancel-aia"
          value="true"
        >
          {msgStr("doCancel")}
        </button>
      {/if}
    </div>
  </form>
</Template>
