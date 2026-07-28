<script lang="ts">
  import type { InputFieldByTypeProps } from "./InputFieldByTypeProps";
  import { inputLabel } from "./inputLabel";
  import { assert } from "keycloakify/tools/assert";
  import type { I18n } from "../i18n";
  import * as Select from "../../lib/components/ui/select";
  import { untrack } from "svelte";

  const {
    attribute,
    dispatchFormAction,
    displayableErrors,
    i18n,
    valueOrValues,
  }: InputFieldByTypeProps<I18n> = $props();

  const getAttribute = () => attribute;
  const isMultiple = getAttribute().annotations.inputType === "multiselect";
  const advancedMsgStr = $derived($i18n.advancedMsgStr);
  const options = (() => {
    walk: {
      const { inputOptionsFromValidation } = getAttribute().annotations;

      if (inputOptionsFromValidation === undefined) {
        break walk;
      }

      assert(typeof inputOptionsFromValidation === "string");

      const validator = (
        getAttribute().validators as Record<string, { options?: string[] }>
      )[inputOptionsFromValidation];

      if (validator === undefined) {
        break walk;
      }

      if (validator.options === undefined) {
        break walk;
      }

      return validator.options;
    }

    return getAttribute().validators.options?.options ?? [];
  })();

  const optionLabel = (option: string) => {
    if (attribute.annotations.inputOptionLabels !== undefined) {
      return advancedMsgStr(
        attribute.annotations.inputOptionLabels[option] ?? option,
      );
    }

    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
      return advancedMsgStr(
        `${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`,
      );
    }

    return option;
  };

  let value = $state<string | string[]>(untrack(() => valueOrValues));

  const selectedLabel = $derived(
    (value instanceof Array ? value : value ? [value] : [])
      .map(optionLabel)
      .join(", "),
  );

  function updateValue(nextValue: string | string[]) {
    value = nextValue;
    dispatchFormAction("formAction", {
      action: "update",
      name: attribute.name,
      valueOrValues: nextValue,
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      dispatchFormAction("formAction", {
        action: "focus lost",
        name: attribute.name,
        fieldIndex: undefined,
      });
    }
  }
</script>

<Select.Root
  type={isMultiple ? "multiple" : "single"}
  name={attribute.name}
  value={value as never}
  disabled={attribute.readOnly}
  onValueChange={updateValue}
  onOpenChange={handleOpenChange}
>
  <Select.Trigger
    id={attribute.name}
    class="w-full"
    aria-invalid={displayableErrors.length !== 0}
  >
    <span class:text-muted-foreground={!selectedLabel}>
      {selectedLabel || "—"}
    </span>
  </Select.Trigger>
  <Select.Content>
    {#each options as option, i (i)}
      <Select.Item value={option} label={optionLabel(option)}>
        {@render inputLabel($i18n, attribute, option)()}
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
