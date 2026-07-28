<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import { Button } from "../../lib/components/ui/button";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "login-idp-link-confirm-override.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const idpDisplayName = $derived(kcContext.idpDisplayName);

  const msg = $derived($i18n.msg);
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("confirmOverrideIdpTitle")()}
  {/snippet}

  <form
    class="cm-login-form"
    id="kc-register-form"
    action={url.loginAction}
    method="post"
  >
    {@render msg("pageExpiredMsg1")()}
    <a id="loginRestartLink" href={url.loginRestartFlowUrl}>
      {@render msg("doClickHere")()}
    </a>
    <br />
    <br />
    <Button
      type="submit"
      class="w-full"
      variant="outline"
      size="lg"
      name="submitAction"
      id="confirmOverride"
      value="confirmOverride"
    >
      {@render msg("confirmOverrideIdpContinue", idpDisplayName)()}
    </Button>
  </form>
</Template>
