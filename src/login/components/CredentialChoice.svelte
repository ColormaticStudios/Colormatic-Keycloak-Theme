<script lang="ts">
  import type { Snippet } from "svelte";
  import { Label } from "../../lib/components/ui/label";
  import * as RadioGroup from "../../lib/components/ui/radio-group";

  let {
    id,
    value,
    title,
    icon = "bi-lock-fill",
  }: {
    id: string;
    value: string;
    title: Snippet;
    icon?: string;
  } = $props();
</script>

<Label
  for={id}
  class="cm-login-credential-choice hover:bg-muted flex min-h-15 w-full cursor-pointer items-center gap-3 rounded-lg border bg-transparent p-3 transition-colors"
>
  <span
    class="bg-muted text-muted-foreground grid size-9 shrink-0 place-items-center rounded-full"
    aria-hidden="true"
  >
    <i class={`bi ${icon}`}></i>
  </span>
  <span id={`${id}-label`} class="min-w-0 flex-1 font-medium">
    {@render title()}
  </span>
  <RadioGroup.Item {id} {value} aria-labelledby={`${id}-label`} />
</Label>
