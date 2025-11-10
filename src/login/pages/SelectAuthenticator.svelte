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
    Extract<KcContext, { pageId: "select-authenticator.ftl" }>,
    I18n
  > = $props();
  const { url, auth } = kcContext;

  const { msg, advancedMsg } = $i18n;
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
  {#snippet headerNode()}
    {@render msg("loginChooseAuthenticator")()}
  {/snippet}
  <form
    id="kc-select-credential-form"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <div class="kcSelectAuthListClass grid gap-4">
      {#each auth.authenticationSelections as authenticationSelection, i (i)}
        <button
          class="kcSelectAuthListItemClass flex w-full cursor-pointer
            items-center justify-between rounded-lg border
            border-slate-300 bg-white p-2 shadow-sm transition
            hover:border-slate-400 hover:shadow-md dark:border-slate-700
            dark:bg-slate-800 dark:hover:border-slate-600"
          type="submit"
          name="authenticationExecution"
          value={authenticationSelection.authExecId}
        >
          <div
            class="kcSelectAuthListItemIconClass mr-4 flex h-8 w-8
              items-center justify-center rounded-full bg-slate-100
              text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            <i class="bi bi-key-fill text-xl"></i>
          </div>

          <div class="kcSelectAuthListItemBodyClass text-left">
            <div
              class="kcSelectAuthListItemHeadingClass text-lg font-semibold text-slate-800 dark:text-slate-100"
            >
              {@render advancedMsg(authenticationSelection.displayName)()}
            </div>
            <div
              class="kcSelectAuthListItemDescriptionClass mt-1 text-sm text-slate-500 dark:text-slate-400"
            >
              {@render advancedMsg(authenticationSelection.helpText)()}
            </div>
          </div>

          <div class="kcSelectAuthListItemFillClass flex-1"></div>

          <div
            class="kcSelectAuthListItemArrowClass ml-3 text-slate-400 dark:text-slate-500"
          >
            <i class="kcSelectAuthListItemArrowIconClass text-xl"></i>
          </div>
        </button>
      {/each}
    </div>
  </form>
</Template>
