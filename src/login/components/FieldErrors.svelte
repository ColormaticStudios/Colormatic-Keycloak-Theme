<script lang="ts">
  import type { FormFieldError } from "@keycloakify/svelte/login/lib/useUserProfileForm";
  import type { Attribute } from "keycloakify/login/KcContext";

  type FieldErrorProps = {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    fieldIndex?: number;
  };
  let {
    attribute,
    fieldIndex,
    displayableErrors = $bindable([]),
  }: FieldErrorProps = $props();
</script>

{#snippet fieldErrors()}
  {@const _displayableErrors = displayableErrors.filter(
    (error) => error.fieldIndex === fieldIndex,
  )}
  {#if _displayableErrors.length !== 0}
    <span
      id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
      class="kcInputErrorMessageClass"
      aria-live="polite"
    >
      {#each _displayableErrors as displayableError, i (displayableError.errorMessage)}
        {@const { errorMessage } = displayableError}
        {@render errorMessage()}
        {#if _displayableErrors.length - 1 !== i}<br />{/if}
      {/each}
    </span>
  {/if}
{/snippet}
{@render fieldErrors()}
