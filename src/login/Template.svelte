<script lang="ts">
  import { useInitialize } from "@keycloakify/svelte/login/Template.useInitialize";
  import type { TemplateProps } from "@keycloakify/svelte/login/TemplateProps";
  import { useSetClassName } from "@keycloakify/svelte/tools/useSetClassName";
  import type { I18n } from "./i18n";
  import type { KcContext } from "./KcContext";
  import ThemeSwitcher from "../shared/theme/ThemeSwitcher.svelte";
  import { Button } from "../lib/components/ui/button";
  import * as Card from "../lib/components/ui/card";
  import LocaleMenu from "./components/LocaleMenu.svelte";
  import LoginAlert from "./components/LoginAlert.svelte";
  import "./main.css";

  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    children,
  }: TemplateProps<KcContext, I18n> = $props();

  const getKcContext = () => kcContext;
  const getBodyClassName = () => bodyClassName;
  const getDoUseDefaultCss = () => doUseDefaultCss;

  const msgStr = $derived($i18n.msgStr);
  const currentLanguage = $derived($i18n.currentLanguage);
  const enabledLanguages = $derived($i18n.enabledLanguages);

  const realm = $derived(kcContext.realm);
  const auth = $derived(kcContext.auth);
  const url = $derived(kcContext.url);
  const message = $derived(kcContext.message);
  const isAppInitiatedAction = $derived(kcContext.isAppInitiatedAction);

  $effect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
  });
  useSetClassName({
    qualifiedName: "html",
    className: "kcHtmlClass",
  });

  useSetClassName({
    qualifiedName: "body",
    className: getBodyClassName() ?? "kcBodyClass",
  });
  const { isReadyToRender } = useInitialize({
    kcContext: getKcContext(),
    doUseDefaultCss: getDoUseDefaultCss(),
  });
</script>

<ThemeSwitcher />

{#if $isReadyToRender}
  <main class="kcLoginClass cm-login-shell">
    <header id="kc-header" class="kcHeaderClass cm-login-brand">
      <div
        id="kc-header-wrapper"
        class="kcHeaderWrapperClass cm-login-brand__title"
      >
        {msgStr("loginTitleHtml", realm.displayNameHtml)}
      </div>
    </header>

    <article
      class="relative w-[min(100%,34rem)] self-start"
      aria-labelledby="kc-page-title"
    >
      <Card.Root class="border-border w-full border ring-0">
        <Card.Header>
          <div class="flex min-w-0 items-start gap-3">
            <Card.Title class="min-w-0 flex-1 text-xl leading-snug">
              <h1 id="kc-page-title" class="break-words">
                {@render headerNode?.()}
              </h1>
            </Card.Title>
            {#if (kcContext.locale?.supported.length ?? 0) > 1}
              <LocaleMenu
                {currentLanguage}
                {enabledLanguages}
                label={msgStr("languages")}
              />
            {/if}
          </div>
          {#if displayRequiredFields}
            <p class="cm-login-required-note">
              <span class="required" aria-hidden="true">*</span>
              {msgStr("requiredFields")}
            </p>
          {/if}
          {#if auth !== undefined && auth.showUsername && !auth.showResetCredentials}
            <div id="kc-username" class="cm-login-attempted-user">
              <span id="kc-attempted-username">{auth.attemptedUsername}</span>
              <Button
                id="reset-login"
                variant="ghost"
                size="icon"
                href={url.loginRestartFlowUrl}
                aria-label={msgStr("restartLoginTooltip")}
              >
                <span class="kc-login-tooltip">
                  <i
                    class="bi bi-arrow-counterclockwise"
                    aria-hidden="true"
                  ></i>
                  <span class="kc-tooltip-text">
                    {msgStr("restartLoginTooltip")}
                  </span>
                </span>
              </Button>
            </div>
          {/if}
        </Card.Header>
        <Card.Content>
          <section id="kc-content" aria-labelledby="kc-page-title">
            <div id="kc-content-wrapper" class="cm-login-content grid gap-5">
              <!-- App-initiated actions should not see warning messages about the need to complete the action during login. -->
              {#if displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction)}
                <LoginAlert type={message.type} summary={message.summary} />
              {/if}
              {@render children?.()}
              {#if auth !== undefined && auth.showTryAnotherWayLink}
                <form
                  id="kc-select-try-another-way-form"
                  class="cm-login-form"
                  action={url.loginAction}
                  method="post"
                >
                  <input type="hidden" name="tryAnotherWay" value="on" />
                  <Button
                    id="try-another-way"
                    type="submit"
                    variant="outline"
                    class="cm-login-action cm-login-action--block"
                  >
                    {msgStr("doTryAnotherWay")}
                  </Button>
                </form>
              {/if}
              {@render socialProvidersNode?.()}
            </div>
          </section>
        </Card.Content>
        {#if displayInfo}
          <Card.Footer id="kc-info" class="kcSignUpClass">
            <div
              id="kc-info-wrapper"
              class="kcInfoAreaWrapperClass cm-login-info w-full"
            >
              {@render infoNode?.()}
            </div>
          </Card.Footer>
        {/if}
      </Card.Root>
    </article>
  </main>
{/if}
