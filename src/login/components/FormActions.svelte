<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    stacked = false,
    class: className,
  }: {
    children?: Snippet;
    stacked?: boolean;
    class?: string;
  } = $props();
</script>

<div
  data-slot="form-actions"
  class={[
    "cm-login-actions",
    stacked ? "cm-login-actions--stacked" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")}
>
  {@render children?.()}
</div>
