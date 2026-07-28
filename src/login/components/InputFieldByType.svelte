<script lang="ts">
  import type { InputFieldByTypeProps } from "./InputFieldByTypeProps";
  import InputTag from "./InputTag.svelte";
  import InputTagSelects from "./InputTagSelects.svelte";
  import PasswordWrapper from "./PasswordWrapper.svelte";
  import SelectTag from "./SelectTag.svelte";
  import TextareaTag from "./TextareaTag.svelte";
  import type { I18n } from "../i18n";

  let {
    attribute,
    valueOrValues,
    displayableErrors,
    ...props
  }: InputFieldByTypeProps<I18n> = $props();
  const inputType = $derived(attribute.annotations.inputType ?? "");
  const sharedProps = $derived({
    attribute,
    valueOrValues,
    ...props,
  } satisfies Omit<InputFieldByTypeProps<I18n>, "displayableErrors">);
</script>

{#if inputType === "hidden"}
  <input type="hidden" name={attribute.name} value={valueOrValues} />
{:else if inputType === "textarea"}
  <TextareaTag {...sharedProps} {displayableErrors} />
{:else if ["select", "multiselect"].includes(inputType)}
  <SelectTag {...sharedProps} {displayableErrors} />
{:else if ["select-radiobuttons", "multiselect-checkboxes"].includes(inputType)}
  <InputTagSelects {...sharedProps} {displayableErrors} />
{:else}
  <!-- default -->
  {#if valueOrValues instanceof Array}
    {#each valueOrValues as _, i (i)}
      <InputTag {...sharedProps} bind:displayableErrors fieldIndex={i} />
    {/each}
  {:else}
    {#snippet inputNode()}
      <InputTag
        {...sharedProps}
        bind:displayableErrors
        withinInputGroup={["password", "password-confirm"].includes(
          attribute.name,
        )}
      />
    {/snippet}
    {#if ["password", "password-confirm"].includes(attribute.name)}
      <PasswordWrapper i18n={sharedProps.i18n} passwordInputId={attribute.name}>
        {@render inputNode()}
      </PasswordWrapper>
    {:else}
      {@render inputNode()}
    {/if}
  {/if}
{/if}
