<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "../../lib/components/ui/button";

  let {
    title,
    description,
    icon = "bi-key-fill",
    type = "submit",
    name,
    value,
    id,
    onclick,
  }: {
    title: Snippet;
    description?: Snippet;
    icon?: string;
    type?: "button" | "submit";
    name?: string;
    value?: string;
    id?: string;
    onclick?: (event: MouseEvent) => void;
  } = $props();
</script>

<Button
  {id}
  {type}
  {name}
  {value}
  {onclick}
  variant="outline"
  class="kcSelectAuthListItemClass cm-login-auth-choice"
>
  <span
    class="kcSelectAuthListItemIconClass cm-login-auth-choice__icon"
    aria-hidden="true"
  >
    <i class={`bi ${icon}`}></i>
  </span>
  <span class="kcSelectAuthListItemBodyClass cm-login-auth-choice__body">
    <span class="kcSelectAuthListItemHeadingClass cm-login-auth-choice__title">
      {@render title()}
    </span>
    {#if description}
      <span
        class="kcSelectAuthListItemDescriptionClass cm-login-auth-choice__description"
      >
        {@render description()}
      </span>
    {/if}
  </span>
  <i
    class="bi bi-chevron-right kcSelectAuthListItemArrowClass cm-login-auth-choice__arrow"
    aria-hidden="true"
  ></i>
</Button>
