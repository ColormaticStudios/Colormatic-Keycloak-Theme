<script lang="ts">
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { Readable } from "svelte/store";
  import type { I18n } from "../i18n";

  type CapWidgetProps = {
    apiEndpoint: string;
    i18n: Readable<I18n>;
    widgetScriptUrl?: string;
    wasmUrl?: string;
    hashwxUrl?: string;
    errorMessage?: string;
    onSolvedChange?: (solved: boolean) => void;
  };

  let {
    apiEndpoint,
    i18n,
    widgetScriptUrl = "/.cap/assets/widget.js",
    wasmUrl = "/.cap/assets/cap_wasm_bg.wasm",
    hashwxUrl = "/.cap/assets/hashwx.wasm",
    errorMessage,
    onSolvedChange,
  }: CapWidgetProps = $props();

  let widgetElement: HTMLElement | null = $state(null);

  const currentLang = $derived($i18n.currentLanguage.languageTag);
  const initialStateLabel = $derived($i18n.msgStr("capInitialState"));
  const verifyingLabel = $derived($i18n.msgStr("capVerifyingLabel"));
  const solvedLabel = $derived($i18n.msgStr("capSolvedLabel"));
  const errorLabel = $derived($i18n.msgStr("capErrorLabel"));
  const requiredLabel = $derived($i18n.msgStr("capRequiredLabel"));
  const troubleshootingLabel = $derived(
    $i18n.msgStr("capTroubleshootingLabel"),
  );
  const groupAriaLabel = $derived($i18n.msgStr("capGroupAriaLabel"));
  const verifyAriaLabel = $derived($i18n.msgStr("capVerifyAriaLabel"));
  const verifyingAriaLabel = $derived($i18n.msgStr("capVerifyingAriaLabel"));
  const verifiedAriaLabel = $derived($i18n.msgStr("capVerifiedAriaLabel"));
  const errorAriaLabel = $derived($i18n.msgStr("capErrorAriaLabel"));

  $effect(() => {
    const capWindow = window as unknown as Record<string, unknown>;
    if (wasmUrl) {
      capWindow.CAP_CUSTOM_WASM_URL = wasmUrl;
    }
    if (hashwxUrl) {
      capWindow.CAP_CUSTOM_HASHWX_URL = hashwxUrl;
    }

    if (
      typeof customElements !== "undefined" &&
      customElements.get("cap-widget")
    ) {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-cm-cap-widget="true"]',
    );
    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.src = widgetScriptUrl;
    script.async = true;
    script.dataset.cmCapWidget = "true";
    document.head.appendChild(script);
  });

  $effect(() => {
    const element = widgetElement;
    if (!element) {
      return;
    }

    const removeCredits = () => {
      element.shadowRoot?.querySelectorAll("a.credits").forEach((link) => {
        link.remove();
      });
    };

    let observer: MutationObserver | null = null;
    let cancelled = false;

    const attachCreditsObserver = () => {
      if (cancelled || !element.shadowRoot) {
        return false;
      }
      removeCredits();
      if (!observer) {
        observer = new MutationObserver(() => {
          removeCredits();
        });
        observer.observe(element.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
      return true;
    };

    if (!attachCreditsObserver() && typeof customElements !== "undefined") {
      void customElements.whenDefined("cap-widget").then(() => {
        if (!attachCreditsObserver()) {
          requestAnimationFrame(() => {
            attachCreditsObserver();
          });
        }
      });
    }

    const handleSolve = () => {
      removeCredits();
      onSolvedChange?.(true);
    };
    const handleUnsolved = () => {
      removeCredits();
      onSolvedChange?.(false);
    };

    element.addEventListener("solve", handleSolve);
    element.addEventListener("progress", removeCredits);
    element.addEventListener("reset", handleUnsolved);
    element.addEventListener("error", handleUnsolved);

    return () => {
      cancelled = true;
      observer?.disconnect();
      element.removeEventListener("solve", handleSolve);
      element.removeEventListener("progress", removeCredits);
      element.removeEventListener("reset", handleUnsolved);
      element.removeEventListener("error", handleUnsolved);
    };
  });
</script>

<div class="kcFormGroupClass cm-login-field cm-cap-widget-container">
  <cap-widget
    bind:this={widgetElement}
    class="cm-cap-widget"
    data-cap-api-endpoint={apiEndpoint}
    data-cap-lang={currentLang}
    data-cap-i18n-initial-state={initialStateLabel}
    data-cap-i18n-verifying-label={verifyingLabel}
    data-cap-i18n-solved-label={solvedLabel}
    data-cap-i18n-error-label={errorLabel}
    data-cap-i18n-required-label={requiredLabel}
    data-cap-i18n-troubleshooting-label={troubleshootingLabel}
    data-cap-i18n-group-aria-label={groupAriaLabel}
    data-cap-i18n-verify-aria-label={verifyAriaLabel}
    data-cap-i18n-verifying-aria-label={verifyingAriaLabel}
    data-cap-i18n-verified-aria-label={verifiedAriaLabel}
    data-cap-i18n-error-aria-label={errorAriaLabel}
  ></cap-widget>
  {#if errorMessage}
    <span id="input-error-cap" class="cm-login-field__error" aria-live="polite">
      {@html kcSanitize(errorMessage)}
    </span>
  {/if}
</div>
