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

  const { msg } = $i18n;
</script>

<div class="form-group">
  <div class="kcInputWrapperClass">
    {@render msg("termsTitle")()}
    <div id="kc-registration-terms-text">{@render msg("termsText")()}</div>
  </div>
</div>
<div class="form-group">
  <div class="kcLabelWrapperClass">
    <input
      type="checkbox"
      id="termsAccepted"
      name="termsAccepted"
      class="kcCheckboxInputClass"
      checked={areTermsAccepted}
      onchange={(e) => onAreTermsAcceptedValueChange(e.currentTarget.checked)}
      aria-invalid={messagesPerField.existsError("termsAccepted")}
    />
    <label for="termsAccepted" class="kcLabelClass">
      {@render msg("acceptTerms")()}
    </label>
  </div>
  {#if messagesPerField.existsError("termsAccepted")}
    <div class="kcLabelWrapperClass">
      <span
        id="input-error-terms-accepted"
        class="kcInputErrorMessageClass"
        aria-live="polite"
      >
        {@html kcSanitize(messagesPerField.get("termsAccepted"))}
      </span>
    </div>
  {/if}
</div>
