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
    <div class="kcSelectAuthListClass">
      {#each auth.authenticationSelections as authenticationSelection}
        <button
          class="kcSelectAuthListItemClass"
          type="submit"
          name="authenticationExecution"
          value={authenticationSelection.authExecId}
        >
          <div class="kcSelectAuthListItemIconClass">
            <i
              class="
                kcSelectAuthListItemIconPropertyClass
					 {authenticationSelection.iconCssClass}
              "
            ></i>
          </div>
          <div class="kcSelectAuthListItemBodyClass">
            <div class="kcSelectAuthListItemHeadingClass">
              {@render advancedMsg(authenticationSelection.displayName)()}
            </div>
            <div class="kcSelectAuthListItemDescriptionClass">
              {@render advancedMsg(authenticationSelection.helpText)()}
            </div>
          </div>
          <div class="kcSelectAuthListItemFillClass"></div>
          <div class="kcSelectAuthListItemArrowClass">
            <i class="kcSelectAuthListItemArrowIconClass"></i>
          </div>
        </button>
      {/each}
    </div>
  </form>
</Template>
