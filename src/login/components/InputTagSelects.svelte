<script lang="ts">
  import type { InputFieldByTypeProps } from "./InputFieldByTypeProps";
  import { inputLabel } from "./inputLabel";
  import type { I18n } from "../i18n";
  import { Checkbox } from "../../lib/components/ui/checkbox";
  import { Label } from "../../lib/components/ui/label";
  import * as RadioGroup from "../../lib/components/ui/radio-group";

  const {
    attribute,
    dispatchFormAction,
    i18n,
    valueOrValues,
    displayableErrors,
  }: InputFieldByTypeProps<I18n> = $props();

  const isRadio = $derived(
    attribute.annotations.inputType === "select-radiobuttons",
  );

  const options = (() => {
    walk: {
      const { inputOptionsFromValidation } = attribute.annotations;

      if (inputOptionsFromValidation === undefined) {
        break walk;
      }

      const validator = (
        attribute.validators as Record<string, { options?: string[] }>
      )[inputOptionsFromValidation];

      if (validator === undefined) {
        break walk;
      }

      if (validator.options === undefined) {
        break walk;
      }

      return validator.options;
    }

    return attribute.validators.options?.options ?? [];
  })();

  function updateValue(nextValue: string | string[]) {
    dispatchFormAction("formAction", {
      action: "update",
      name: attribute.name,
      valueOrValues: nextValue,
    });
  }

  function handleFocusLost() {
    dispatchFormAction("formAction", {
      action: "focus lost",
      name: attribute.name,
      fieldIndex: undefined,
    });
  }
</script>

{#if isRadio}
  <RadioGroup.Root
    name={attribute.name}
    value={typeof valueOrValues === "string" ? valueOrValues : ""}
    disabled={attribute.readOnly}
    aria-invalid={displayableErrors.length !== 0}
    onValueChange={updateValue}
    onfocusout={handleFocusLost}
  >
    {#each options as option, i (i)}
      <div class="flex items-center gap-2">
        <RadioGroup.Item
          id={`${attribute.name}-${option}`}
          value={option}
          aria-invalid={displayableErrors.length !== 0}
        />
        <Label for={`${attribute.name}-${option}`}>
          {@render inputLabel($i18n, attribute, option)()}
        </Label>
      </div>
    {/each}
  </RadioGroup.Root>
{:else}
  {#each options as option, i (i)}
    <div class="flex items-center gap-2">
      <Checkbox
        id={`${attribute.name}-${option}`}
        name={attribute.name}
        value={option}
        aria-invalid={displayableErrors.length !== 0}
        disabled={attribute.readOnly}
        checked={valueOrValues instanceof Array &&
          valueOrValues.includes(option)}
        onCheckedChange={(isChecked) => {
          const newValues =
            valueOrValues instanceof Array ? [...valueOrValues] : [];

          if (isChecked && !newValues.includes(option)) {
            newValues.push(option);
          } else if (!isChecked) {
            const optionIndex = newValues.indexOf(option);
            if (optionIndex !== -1) {
              newValues.splice(optionIndex, 1);
            }
          }

          updateValue(newValues);
        }}
        onblur={handleFocusLost}
      />
      <Label for={`${attribute.name}-${option}`}>
        {@render inputLabel($i18n, attribute, option)()}
      </Label>
    </div>
  {/each}
{/if}
