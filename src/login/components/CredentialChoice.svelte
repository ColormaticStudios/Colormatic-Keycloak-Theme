<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    id,
    name,
    value,
    checked = false,
    title,
    icon = "bi-lock-fill",
  }: {
    id: string;
    name: string;
    value: string;
    checked?: boolean;
    title: Snippet;
    icon?: string;
  } = $props();
</script>

<div class="cm-login-credential-choice">
  <input {id} {name} {value} {checked} type="radio" />
  <label for={id} class="cm-login-credential-choice__label">
    <span class="cm-login-credential-choice__icon" aria-hidden="true">
      <i class={`bi ${icon}`}></i>
    </span>
    <span class="cm-login-credential-choice__title">{@render title()}</span>
  </label>
  <i
    class="bi bi-check cm-login-credential-choice__check"
    aria-hidden="true"
  ></i>
</div>
