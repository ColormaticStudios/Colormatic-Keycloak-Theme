<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Field from "../../lib/components/ui/field";

  let {
    inputId,
    label,
    control,
    error,
    helpBefore,
    helpAfter,
    hasError = error !== undefined,
    hasHelpBefore = helpBefore !== undefined,
    hasHelpAfter = helpAfter !== undefined,
    required = false,
    hidden = false,
    class: className,
  }: {
    inputId: string;
    label: Snippet;
    control: Snippet;
    error?: Snippet;
    helpBefore?: Snippet;
    helpAfter?: Snippet;
    hasError?: boolean;
    hasHelpBefore?: boolean;
    hasHelpAfter?: boolean;
    required?: boolean;
    hidden?: boolean;
    class?: string;
  } = $props();
</script>

<Field.Field
  data-invalid={hasError}
  class={["kcFormGroupClass", "cm-login-field", className]
    .filter(Boolean)
    .join(" ")}
  style={hidden ? "display: none" : undefined}
>
  <Field.Label id={`${inputId}-label`} for={inputId}>
    {@render label()}
    {#if required}
      <span class="text-destructive" aria-hidden="true">*</span>
    {/if}
  </Field.Label>
  {#if helpBefore && hasHelpBefore}
    <Field.Description>
      {@render helpBefore()}
    </Field.Description>
  {/if}
  <div class="kcInputWrapperClass cm-login-field__control">
    {@render control()}
  </div>
  {#if error && hasError}
    <Field.Error aria-live="polite">
      {@render error()}
    </Field.Error>
  {/if}
  {#if helpAfter && hasHelpAfter}
    <Field.Description>
      {@render helpAfter()}
    </Field.Description>
  {/if}
</Field.Field>
