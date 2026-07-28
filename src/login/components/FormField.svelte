<script lang="ts">
  import type { Snippet } from "svelte";

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

<div
  data-slot="form-field"
  class={["kcFormGroupClass", "cm-login-field", className]
    .filter(Boolean)
    .join(" ")}
  style:display={hidden ? "none" : undefined}
>
  <div class="kcLabelWrapperClass cm-login-field__label">
    <label
      id={`${inputId}-label`}
      for={inputId}
      class="kcLabelClass cm-login-label"
    >
      {@render label()}
      {#if required}
        <span class="required cm-login-required" aria-hidden="true">*</span>
      {/if}
    </label>
  </div>
  {#if helpBefore && hasHelpBefore}
    <div class="cm-login-field__help">
      {@render helpBefore()}
    </div>
  {/if}
  <div class="kcInputWrapperClass cm-login-field__control">
    {@render control()}
  </div>
  {#if error && hasError}
    <div
      class="kcInputErrorMessageClass cm-login-field__error"
      aria-live="polite"
    >
      {@render error()}
    </div>
  {/if}
  {#if helpAfter && hasHelpAfter}
    <div class="cm-login-field__help">
      {@render helpAfter()}
    </div>
  {/if}
</div>
