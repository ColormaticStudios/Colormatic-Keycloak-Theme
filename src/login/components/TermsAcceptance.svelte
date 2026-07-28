<script lang="ts">
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";

  type TermsAcceptanceProps = {
    i18n: Readable<I18n>;
    messagesPerField: Pick<
      KcContext["messagesPerField"],
      "existsError" | "get"
    >;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
  };
  const {
    i18n,
    messagesPerField,
    areTermsAccepted,
    onAreTermsAcceptedValueChange,
  }: TermsAcceptanceProps = $props();

  const msg = $derived($i18n.msg);
</script>

<div class="form-group cm-login-field">
  <div class="kcInputWrapperClass">
    <div id="kc-registration-terms-text">{@render msg("termsText")()}</div>
  </div>
</div>
<div class="form-group cm-login-field">
  <div class="kcLabelWrapperClass cm-login-check">
    <input
      type="checkbox"
      id="termsAccepted"
      name="termsAccepted"
      class="kcCheckboxInputClass"
      checked={areTermsAccepted}
      onchange={(e) => onAreTermsAcceptedValueChange(e.currentTarget.checked)}
      aria-invalid={messagesPerField.existsError("termsAccepted")}
    />
    <label for="termsAccepted" class="kcLabelClass cm-login-label">
      {@render msg("acceptTerms")()}
    </label>
  </div>
  {#if messagesPerField.existsError("termsAccepted")}
    <div class="kcLabelWrapperClass">
      <span
        id="input-error-terms-accepted"
        class="kcInputErrorMessageClass cm-login-field__error"
        aria-live="polite"
      >
        {@html kcSanitize(messagesPerField.get("termsAccepted"))}
      </span>
    </div>
  {/if}
</div>
