<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import AuthChoice from "../components/AuthChoice.svelte";

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
  const url = $derived(kcContext.url);
  const auth = $derived(kcContext.auth);

  const msg = $derived($i18n.msg);
  const advancedMsg = $derived($i18n.advancedMsg);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes} displayMessage={false}>
  {#snippet headerNode()}
    {@render msg("loginChooseAuthenticator")()}
  {/snippet}
  <form
    id="kc-select-credential-form"
    class="kcFormClass cm-login-form"
    action={url.loginAction}
    method="post"
  >
    <div class="kcSelectAuthListClass grid gap-4">
      {#each auth.authenticationSelections as authenticationSelection, i (i)}
        <AuthChoice
          name="authenticationExecution"
          value={authenticationSelection.authExecId}
        >
          {#snippet title()}
            {@render advancedMsg(authenticationSelection.displayName)()}
          {/snippet}
          {#snippet description()}
            {@render advancedMsg(authenticationSelection.helpText)()}
          {/snippet}
        </AuthChoice>
      {/each}
    </div>
  </form>
</Template>
