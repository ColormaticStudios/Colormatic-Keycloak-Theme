<script lang="ts">
  import { useInitialize } from "@keycloakify/svelte/login/Template.useInitialize";
  import type { TemplateProps } from "@keycloakify/svelte/login/TemplateProps";
  import { useSetClassName } from "@keycloakify/svelte/tools/useSetClassName";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import { clsx } from "keycloakify/tools/clsx";
  import type { I18n } from "./i18n";
  import type { KcContext } from "./KcContext";
  import { ModeWatcher, toggleMode } from "mode-watcher";
  import { Button } from "../lib/components/ui/button/index.js";
  import { tick } from "svelte";
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

  let isLocaleMenuOpen = $state(false);
  let localeDropdown = $state<HTMLDivElement>();
  let localeMenuButton = $state<HTMLButtonElement>();
  let localeMenu = $state<HTMLUListElement>();

  function getLocaleMenuItems() {
    return Array.from(
      localeMenu?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ??
        [],
    );
  }

  async function openLocaleMenu(focus: "first" | "last" = "first") {
    isLocaleMenuOpen = true;
    await tick();

    const items = getLocaleMenuItems();
    items[focus === "first" ? 0 : items.length - 1]?.focus();
  }

  function closeLocaleMenu({ returnFocus = false } = {}) {
    isLocaleMenuOpen = false;
    if (returnFocus) {
      localeMenuButton?.focus();
    }
  }

  function handleLocaleButtonKeydown(event: KeyboardEvent) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    void openLocaleMenu(event.key === "ArrowDown" ? "first" : "last");
  }

  function handleLocaleMenuKeydown(event: KeyboardEvent) {
    const items = getLocaleMenuItems();
    const currentIndex = items.indexOf(
      document.activeElement as HTMLAnchorElement,
    );

    if (event.key === "Escape") {
      event.preventDefault();
      closeLocaleMenu({ returnFocus: true });
      return;
    }

    if (event.key === "Tab") {
      closeLocaleMenu();
      return;
    }

    const nextIndex = (() => {
      switch (event.key) {
        case "ArrowDown":
          return (currentIndex + 1) % items.length;
        case "ArrowUp":
          return (currentIndex - 1 + items.length) % items.length;
        case "Home":
          return 0;
        case "End":
          return items.length - 1;
        default:
          return undefined;
      }
    })();

    if (nextIndex === undefined || items.length === 0) {
      return;
    }

    event.preventDefault();
    items[nextIndex]?.focus();
  }

  function handleDocumentClick(event: MouseEvent) {
    if (
      isLocaleMenuOpen &&
      event.target instanceof Node &&
      !localeDropdown?.contains(event.target)
    ) {
      closeLocaleMenu();
    }
  }

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

<ModeWatcher />
<svelte:document onclick={handleDocumentClick} />

<Button
  onclick={toggleMode}
  variant="outline"
  size="icon"
  class="fixed right-5 bottom-5"
>
  <i
    class="bi bi-brightness-high-fill h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
  ></i>
  <i
    class="bi bi-moon-fill absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
  ></i>
  <span class="sr-only">Toggle theme</span>
</Button>

{#if $isReadyToRender}
  <div class="kcLoginClass">
    <div id="kc-header" class="kcHeaderClass">
      <div id="kc-header-wrapper" class="kcHeaderWrapperClass">
        {msgStr("loginTitleHtml", realm.displayNameHtml)}
      </div>
    </div>

    <div class="kcFormCardClass">
      <header class="kcFormHeaderClass">
        {#if (kcContext.locale?.supported.length ?? 0) > 1}
          <div class="kcLocaleMainClass float-right" id="kc-locale">
            <div id="kc-locale-wrapper" class="kcLocaleWrapperClass">
              <div
                bind:this={localeDropdown}
                id="kc-locale-dropdown"
                class={clsx("menu-button-links", "kcLocaleDropDownClass")}
              >
                <button
                  bind:this={localeMenuButton}
                  type="button"
                  id="kc-current-locale-link"
                  aria-label={msgStr("languages")}
                  aria-haspopup="menu"
                  aria-expanded={isLocaleMenuOpen}
                  aria-controls="language-switch1"
                  onclick={() =>
                    isLocaleMenuOpen
                      ? closeLocaleMenu({ returnFocus: true })
                      : openLocaleMenu()}
                  onkeydown={handleLocaleButtonKeydown}
                >
                  <i class="bi bi-globe2" aria-hidden="true"></i>
                  {currentLanguage.label}
                </button>
                <ul
                  bind:this={localeMenu}
                  role="menu"
                  aria-labelledby="kc-current-locale-link"
                  id="language-switch1"
                  class="kcLocaleListClass"
                  style:display={isLocaleMenuOpen ? "block" : "none"}
                  onkeydown={handleLocaleMenuKeydown}
                >
                  {#each enabledLanguages as enabledLanguage, i (enabledLanguage.languageTag)}
                    {@const { href } = enabledLanguage}
                    <li class="kcLocaleListItemClass" role="none">
                      <a
                        role="menuitem"
                        tabindex={-1}
                        id={`language-${i + 1}`}
                        class="kcLocaleItemClass"
                        {href}
                        aria-current={enabledLanguage.languageTag ===
                        currentLanguage.languageTag
                          ? "true"
                          : undefined}
                      >
                        {enabledLanguage.label}
                      </a>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {/if}
        {#snippet node()}
          <h1 id="kc-page-title">{@render headerNode?.()}</h1>
          {#if auth !== undefined && auth.showUsername && !auth.showResetCredentials}
            <div id="kc-username" class="kcFormGroupClass">
              <!-- svelte-ignore a11y_label_has_associated_control -->
              <label id="kc-attempted-username">{auth.attemptedUsername}</label>
              <a
                id="reset-login"
                href={url.loginRestartFlowUrl}
                aria-label={msgStr("restartLoginTooltip")}
              >
                <div class="kc-login-tooltip">
                  <i class="kcResetFlowIcon"></i>
                  <span class="kc-tooltip-text">
                    {msgStr("restartLoginTooltip")}
                  </span>
                </div>
              </a>
            </div>
          {/if}
        {/snippet}
        {#if displayRequiredFields}
          <div class="kcContentWrapperClass">
            <div class="kcLabelWrapperClass subtitle">
              <span class="subtitle">
                <span class="required">*</span>
                {msgStr("requiredFields")}
              </span>
            </div>
            <div class="col-md-10">{@render node()}</div>
          </div>
        {:else}
          {@render node()}
        {/if}
      </header>
      <div id="kc-content">
        <div id="kc-content-wrapper">
          <!-- App-initiated actions should not see warning messages about the need to complete the action during login. -->
          {#if displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction)}
            <div
              class={clsx(
                `alert-${message.type}`,
                "kcAlertClass",
                `pf-m-${message?.type === "error" ? "danger" : message.type}`,
              )}
              role={message.type === "error" || message.type === "warning"
                ? "alert"
                : "status"}
              aria-live={message.type === "error" || message.type === "warning"
                ? "assertive"
                : "polite"}
              aria-atomic="true"
            >
              <div class="pf-c-alert__icon">
                {#if message.type === "success"}
                  <span class="kcFeedbackSuccessIcon" aria-hidden="true"></span>
                {:else if message.type === "warning"}
                  <span class="kcFeedbackWarningIcon" aria-hidden="true"></span>
                {:else if message.type === "error"}
                  <span class="kcFeedbackErrorIcon" aria-hidden="true"></span>
                {:else if message.type === "info"}
                  <span class="kcFeedbackInfoIcon" aria-hidden="true"></span>
                {/if}
              </div>
              <span class="kcAlertTitleClass">
                {@html kcSanitize(message.summary)}
              </span>
            </div>
          {/if}
          {@render children?.()}
          {#if auth !== undefined && auth.showTryAnotherWayLink}
            <form
              id="kc-select-try-another-way-form"
              action={url.loginAction}
              method="post"
            >
              <div class="kcFormGroupClass">
                <input type="hidden" name="tryAnotherWay" value="on" />
                <button
                  id="try-another-way"
                  type="submit"
                  class="kcButtonClass kcButtonDefaultClass text-center no-underline!"
                >
                  {msgStr("doTryAnotherWay")}
                </button>
              </div>
            </form>
          {/if}
          {@render socialProvidersNode?.()}
          {#if displayInfo}
            <div id="kc-info" class="kcSignUpClass">
              <div id="kc-info-wrapper" class="kcInfoAreaWrapperClass">
                {@render infoNode?.()}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
