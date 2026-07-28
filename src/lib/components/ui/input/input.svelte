<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "../../../utils.js";

  type InputProps = WithElementRef<HTMLInputAttributes>;

  let {
    class: className,
    ref = $bindable(null),
    type = "text",
    ...restProps
  }: InputProps = $props();
</script>

<input
  bind:this={ref}
  data-slot="input"
  {type}
  class={cn(
    "border-input bg-background text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    className,
  )}
  {...restProps}
/>
