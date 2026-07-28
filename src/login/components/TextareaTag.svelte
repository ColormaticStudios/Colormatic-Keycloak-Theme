<script lang="ts">
  import type { InputFieldByTypeProps } from "./InputFieldByTypeProps";
  import { assert } from "keycloakify/tools/assert";
  import type { I18n } from "../i18n";

  const {
    attribute,
    dispatchFormAction,
    displayableErrors,
    valueOrValues,
  }: InputFieldByTypeProps<I18n> = $props();

  const getValueOrValues = () => valueOrValues;
  const value = getValueOrValues();
  assert(typeof value === "string");
</script>

<textarea
  id={attribute.name}
  name={attribute.name}
  class="kcInputClass cm-login-input"
  data-slot="textarea"
  aria-invalid={displayableErrors.length !== 0}
  disabled={attribute.readOnly}
  cols={attribute.annotations.inputTypeCols === undefined
    ? undefined
    : parseInt(`${attribute.annotations.inputTypeCols}`)}
  rows={attribute.annotations.inputTypeRows === undefined
    ? undefined
    : parseInt(`${attribute.annotations.inputTypeRows}`)}
  maxlength={attribute.annotations.inputTypeMaxlength === undefined
    ? undefined
    : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
  {value}
  onchange={(event) =>
    dispatchFormAction("formAction", {
      action: "update",
      name: attribute.name,
      valueOrValues: event.currentTarget.value,
    })}
  onblur={() =>
    dispatchFormAction("formAction", {
      action: "focus lost",
      name: attribute.name,
      fieldIndex: undefined,
    })}
></textarea>
