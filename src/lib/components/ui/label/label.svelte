<script lang="ts">
  import type { HTMLLabelAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn, type WithElementRef } from "../../../utils.js";

  type LabelProps = WithElementRef<HTMLLabelAttributes> & {
    children?: Snippet;
  };

  let {
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: LabelProps = $props();
</script>

<label
  bind:this={ref}
  data-slot="label"
  class={cn(
    "flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</label>
