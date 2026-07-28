<script lang="ts">
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";
  import { Checkbox } from "../../lib/components/ui/checkbox";
  import * as Field from "../../lib/components/ui/field";

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

<Field.Field>
  <div class="kcInputWrapperClass">
    <div id="kc-registration-terms-text">{@render msg("termsText")()}</div>
  </div>
</Field.Field>
<Field.Field data-invalid={messagesPerField.existsError("termsAccepted")}>
  <div class="flex items-center gap-2">
    <Checkbox
      id="termsAccepted"
      name="termsAccepted"
      checked={areTermsAccepted}
      onCheckedChange={onAreTermsAcceptedValueChange}
      aria-invalid={messagesPerField.existsError("termsAccepted")}
    />
    <Field.Label for="termsAccepted">
      {@render msg("acceptTerms")()}
    </Field.Label>
  </div>
  {#if messagesPerField.existsError("termsAccepted")}
    <Field.Error id="input-error-terms-accepted" aria-live="polite">
      {@html kcSanitize(messagesPerField.get("termsAccepted"))}
    </Field.Error>
  {/if}
</Field.Field>
