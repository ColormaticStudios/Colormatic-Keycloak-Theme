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
  class="h-auto min-h-16 w-full justify-start gap-3 p-3 text-left"
>
  <span
    class="bg-muted text-muted-foreground inline-grid size-10 shrink-0 place-items-center rounded-full"
    aria-hidden="true"
  >
    <i class={`bi ${icon}`}></i>
  </span>
  <span class="grid min-w-0 flex-1 gap-1">
    <span class="font-medium">
      {@render title()}
    </span>
    {#if description}
      <span class="text-muted-foreground text-sm whitespace-normal">
        {@render description()}
      </span>
    {/if}
  </span>
  <i
    class="bi bi-chevron-right text-muted-foreground shrink-0"
    aria-hidden="true"
  ></i>
</Button>
