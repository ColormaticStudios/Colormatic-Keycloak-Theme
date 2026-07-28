<script lang="ts">
  import LogoutOtherSessions from "../components/LogoutOtherSessions.svelte";
  import type { PageProps } from "./PageProps";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";
  import * as Alert from "../../lib/components/ui/alert";
  import { Button } from "../../lib/components/ui/button";
  import { Checkbox } from "../../lib/components/ui/checkbox";
  import { Label } from "../../lib/components/ui/label";

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

  const recoveryAuthnCodesConfigBean = $derived(
    kcContext.recoveryAuthnCodesConfigBean,
  );
  const isAppInitiatedAction = $derived(kcContext.isAppInitiatedAction);

  const msg = $derived($i18n.msg);
  const msgStr = $derived($i18n.msgStr);
  const currentLanguage = $derived($i18n.currentLanguage);

  const olRecoveryCodesListId = "kc-recovery-codes-list";
  const recoveryCodesDownloadFilename = "Colormatic ID Recovery Codes.txt";
  const formattedRecoveryCodes = $derived(
    recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map(
      (code, index) =>
        `${index + 1}: ${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8)}`,
    ),
  );

  let hasConfirmedRecoveryCodes = $state(false);

  function copyWithTextarea(content: string) {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function formatCurrentDateTime() {
    return new Intl.DateTimeFormat(currentLanguage.languageTag, {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    }).format(new Date());
  }

  function buildRecoveryCodesDocument() {
    return [
      msgStr("recovery-codes-download-file-header"),
      "",
      formattedRecoveryCodes.join("\r\n"),
      "",
      msgStr("recovery-codes-download-file-description"),
      "",
      `${msgStr("recovery-codes-download-file-date")} ${formatCurrentDateTime()}`,
    ].join("\r\n");
  }

  async function copyRecoveryCodes() {
    const content = formattedRecoveryCodes.join("\n");

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(content);
        return;
      } catch {
        copyWithTextarea(content);
        return;
      }
    }

    copyWithTextarea(content);
  }

  function downloadRecoveryCodes() {
    const blob = new Blob([buildRecoveryCodesDocument()], {
      type: "text/plain;charset=utf-8",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = recoveryCodesDownloadFilename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
  }

  function printRecoveryCodes() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return;
    }

    printWindow.opener = null;
    const printDocument = printWindow.document;
    printDocument.title = msgStr("recovery-codes-download-file-header");

    const style = printDocument.createElement("style");
    style.textContent = `
      @page { size: auto; margin-top: 0; }
      body { width: 480px; font-family: sans-serif; }
      ol { font-family: monospace; }
      p:first-of-type { margin-top: 48px; }
    `;

    const heading = printDocument.createElement("p");
    heading.textContent = msgStr("recovery-codes-download-file-header");
    const codes = printDocument.createElement("ol");
    for (const code of formattedRecoveryCodes) {
      const item = printDocument.createElement("li");
      item.textContent = code.replace(/^\d+: /, "");
      codes.appendChild(item);
    }
    const description = printDocument.createElement("p");
    description.textContent = msgStr(
      "recovery-codes-download-file-description",
    );
    const generatedAt = printDocument.createElement("p");
    generatedAt.textContent = `${msgStr("recovery-codes-download-file-date")} ${formatCurrentDateTime()}`;

    printDocument.head.appendChild(style);
    printDocument.body.replaceChildren(
      heading,
      codes,
      description,
      generatedAt,
    );
    printWindow.addEventListener("afterprint", () => printWindow.close(), {
      once: true,
    });
    printWindow.focus();
    printWindow.print();
  }
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("recovery-code-config-header")()}
  {/snippet}
  <Alert.Root>
    <TriangleAlert aria-hidden="true" />
    <Alert.Title>
      {@render msg("recovery-code-config-warning-title")()}
    </Alert.Title>
    <Alert.Description>
      <p>{@render msg("recovery-code-config-warning-message")()}</p>
    </Alert.Description>
  </Alert.Root>

  <ol
    id={olRecoveryCodesListId}
    class="kcRecoveryCodesList columns-2 gap-6 [column-fill:balance]"
  >
    {#each recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList as code, index (index)}
      <li>
        <span>{index + 1}:</span>
        {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
      </li>
    {/each}
  </ol>

  <!-- actions -->
  <div class="kcRecoveryCodesActions flex justify-around py-3">
    <Button
      id="printRecoveryCodes"
      variant="outline"
      type="button"
      onclick={printRecoveryCodes}
    >
      <i class="bi bi-printer-fill" aria-hidden="true"></i>
      {@render msg("recovery-codes-print")()}
    </Button>
    <Button
      id="downloadRecoveryCodes"
      variant="outline"
      type="button"
      onclick={downloadRecoveryCodes}
    >
      <i class="bi bi-download" aria-hidden="true"></i>
      {@render msg("recovery-codes-download")()}
    </Button>
    <Button
      id="copyRecoveryCodes"
      variant="outline"
      type="button"
      onclick={copyRecoveryCodes}
    >
      <i class="bi bi-copy" aria-hidden="true"></i>
      {@render msg("recovery-codes-copy")()}
    </Button>
  </div>

  <!-- confirmation checkbox -->
  <div class="kcFormOptionsClass flex items-center gap-2">
    <Checkbox
      id="kcRecoveryCodesConfirmationCheck"
      name="kcRecoveryCodesConfirmationCheck"
      bind:checked={hasConfirmedRecoveryCodes}
    />
    <Label for="kcRecoveryCodesConfirmationCheck" class="font-bold">
      {@render msg("recovery-codes-confirmation-message")()}
    </Label>
  </div>

  <form
    action={kcContext.url.loginAction}
    class="kcFormClass cm-login-form"
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

    <div class="cm-login-actions">
      {#if isAppInitiatedAction}
        <Button
          type="submit"
          size="lg"
          id="saveRecoveryAuthnCodesBtn"
          disabled={!hasConfirmedRecoveryCodes}
        >
          {@render msg("recovery-codes-action-complete")()}
        </Button>
        <Button
          type="submit"
          variant="outline"
          size="lg"
          id="cancelRecoveryAuthnCodesBtn"
          name="cancel-aia"
          value="true"
        >
          {@render msg("recovery-codes-action-cancel")()}
        </Button>
      {:else}
        <Button
          type="submit"
          class="w-full"
          size="lg"
          id="saveRecoveryAuthnCodesBtn"
          disabled={!hasConfirmedRecoveryCodes}
        >
          {@render msg("recovery-codes-action-complete")()}
        </Button>
      {/if}
    </div>
  </form>
</Template>
