<script lang="ts">
  import { useInitialize } from "@keycloakify/svelte/login/Template.useInitialize";
  import type { TemplateProps } from "@keycloakify/svelte/login/TemplateProps";
  import { useSetClassName } from "@keycloakify/svelte/tools/useSetClassName";
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import { clsx } from "keycloakify/tools/clsx";
  import { onMount } from "svelte";
  import type { I18n } from "./i18n";
  import type { KcContext } from "./KcContext";
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

  const { msgStr, currentLanguage, enabledLanguages } = $i18n;

  const { realm, auth, url, message, isAppInitiatedAction } = kcContext;
  onMount(() => {
    document.title =
      documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
  });
  useSetClassName({
    qualifiedName: "html",
    className: "kcHtmlClass",
  });

  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? "kcBodyClass",
  });
  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
</script>

{#if $isReadyToRender}
  <div class="kcLoginClass">
    <div id="kc-header" class="kcHeaderClass">
      <div id="kc-header-wrapper" class="kcHeaderWrapperClass">
        {msgStr("loginTitleHtml", realm.displayNameHtml)}
      </div>
    </div>

    <div class="kcFormCardClass">
      <header class="kcFormHeaderClass">
        {#if enabledLanguages.length > 1}
          <div class="kcLocaleMainClass" id="kc-locale">
            <div id="kc-locale-wrapper" class="kcLocaleWrapperClass">
              <div
                id="kc-locale-dropdown"
                class={clsx("menu-button-links", "kcLocaleDropDownClass")}
              >
                <button
                  tabindex={1}
                  id="kc-current-locale-link"
                  aria-label={msgStr("languages")}
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-controls="language-switch1"
                >
                  {currentLanguage.label}
                </button>
                <!-- svelte-ignore a11y_incorrect_aria_attribute_type -->
                <ul
                  role="menu"
                  tabindex={-1}
                  aria-labelledby="kc-current-locale-link"
                  aria-activedescendant=""
                  id="language-switch1"
                  class="kcLocaleListClass"
                >
                  {#each enabledLanguages as enabledLanguage, i (enabledLanguage.label)}
                    {@const { label, href } = enabledLanguage}
                    <li class="kcLocaleListItemClass" role="none">
                      <a
                        role="menuitem"
                        id={`language-${i + 1}`}
                        class="kcLocaleItemClass"
                        {href}
                      >
                        {label}
                      </a>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {/if}
        {#snippet node()}
          {#if !(auth !== undefined && auth.showUsername && !auth.showResetCredentials)}
            <h1 id="kc-page-title">{@render headerNode?.()}</h1>
          {:else}
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
            >
              <div class="pf-c-alert__icon">
                {#if message.type === "success"}
                  <span class="kcFeedbackSuccessIcon"></span>
                {:else if message.type === "warning"}
                  <span class="kcFeedbackWarningIcon"></span>
                {:else if message.type === "error"}
                  <span class="kcFeedbackErrorIcon"></span>
                {:else if message.type === "info"}
                  <span class="kcFeedbackInfoIcon"></span>
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
                <!-- svelte-ignore a11y_invalid_attribute -->
                <a
                  href="#"
                  id="try-another-way"
                  onclick={() => {
                    document.forms[
                      "kc-select-try-another-way-form" as never
                    ].requestSubmit();
                    return false;
                  }}
                >
                  {msgStr("doTryAnotherWay")}
                </a>
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
