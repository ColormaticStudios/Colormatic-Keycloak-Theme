<script lang="ts">
  import LogoutOtherSessions from "../components/LogoutOtherSessions.svelte";
  import { useScript } from "@keycloakify/svelte/login/pages/LoginRecoveryAuthnCodeConfig.useScript";
  import type { PageProps } from "./PageProps";
  import { clsx } from "keycloakify/tools/clsx";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>,
    I18n
  > = $props();

  const { recoveryAuthnCodesConfigBean, isAppInitiatedAction } = kcContext;

  const { msg, msgStr } = $i18n;

  const olRecoveryCodesListId = "kc-recovery-codes-list";

  useScript({ olRecoveryCodesListId, i18n });
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("recovery-code-config-header")()}
  {/snippet}
  <div
    class={clsx(
      "pf-c-alert",
      "pf-m-warning",
      "pf-m-inline",
      "kcRecoveryCodesWarning",
    )}
    aria-label="Warning alert"
  >
    <div class="pf-c-alert__icon">
      <i class="pficon-warning-triangle-o" aria-hidden="true"></i>
    </div>
    <h4 class="pf-c-alert__title">
      <span class="pf-screen-reader">Warning alert:</span>
      {@render msg("recovery-code-config-warning-title")()}
    </h4>
    <div class="pf-c-alert__description">
      <p>{@render msg("recovery-code-config-warning-message")()}</p>
    </div>
  </div>

  <ol id={olRecoveryCodesListId} class="kcRecoveryCodesList">
    {#each recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList as code, index (index)}
      <li>
        <span>{index + 1}:</span>
        {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
      </li>
    {/each}
  </ol>

  <!-- actions -->
  <div class="kcRecoveryCodesActions flex justify-around py-3">
    <button
      id="printRecoveryCodes"
      class={clsx(
        "pf-c-button",
        "pf-m-link",
        "kcButtonClass",
        "kcButtonDefaultClass",
      )}
      type="button"
    >
      <i class="pficon-print" aria-hidden="true"></i>
      {@render msg("recovery-codes-print")()}
    </button>
    <button
      id="downloadRecoveryCodes"
      class={clsx(
        "pf-c-button",
        "pf-m-link",
        "kcButtonClass",
        "kcButtonDefaultClass",
      )}
      type="button"
    >
      <i class="pficon-save" aria-hidden="true"></i>
      {@render msg("recovery-codes-download")()}
    </button>
    <button
      id="copyRecoveryCodes"
      class={clsx(
        "pf-c-button",
        "pf-m-link",
        "kcButtonClass",
        "kcButtonDefaultClass",
      )}
      type="button"
    >
      <i class="pficon-blueprint" aria-hidden="true"></i>
      {@render msg("recovery-codes-copy")()}
    </button>
  </div>

  <!-- confirmation checkbox -->
  <div class="kcFormOptionsClass">
    <input
      class="kcCheckInputClass"
      type="checkbox"
      id="kcRecoveryCodesConfirmationCheck"
      name="kcRecoveryCodesConfirmationCheck"
      onchange={(event) => {
        //@ts-expect-error: This is inherited from the original code
        document.getElementById("saveRecoveryAuthnCodesBtn").disabled =
          !event.currentTarget.checked;
      }}
    />
    <label for="kcRecoveryCodesConfirmationCheck">
      {@render msg("recovery-codes-confirmation-message")()}
    </label>
  </div>

  <form
    action={kcContext.url.loginAction}
    class="kcFormGroupClass"
    id="kc-recovery-codes-settings-form"
    method="post"
  >
    <input
      type="hidden"
      name="generatedRecoveryAuthnCodes"
      value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString}
    />
    <input
      type="hidden"
      name="generatedAt"
      value={recoveryAuthnCodesConfigBean.generatedAt}
    />
    <input
      type="hidden"
      id="userLabel"
      name="userLabel"
      value={msgStr("recovery-codes-label-default")}
    />

    <LogoutOtherSessions {i18n} />

    {#if isAppInitiatedAction}
      <input
        type="submit"
        class="
          kcButtonClass
          kcButtonPrimaryClass
          kcButtonLargeClass
        "
        id="saveRecoveryAuthnCodesBtn"
        value={msgStr("recovery-codes-action-complete")}
        disabled
      />
      <button
        type="submit"
        class="
          kcButtonClass
          kcButtonDefaultClass
          kcButtonLargeClass
        "
        id="cancelRecoveryAuthnCodesBtn"
        name="cancel-aia"
        value="true"
      >
        {@render msg("recovery-codes-action-cancel")()}
      </button>
    {:else}
      <input
        type="submit"
        class="
          kcButtonClass
          kcButtonPrimaryClass
          kcButtonBlockClass
          kcButtonLargeClass
        "
        id="saveRecoveryAuthnCodesBtn"
        value={msgStr("recovery-codes-action-complete")}
        disabled
      />
    {/if}
  </form>
</Template>
