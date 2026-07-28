<script lang="ts">
  import { Spinner } from "../lib/components/ui/spinner";
  import { fade } from "svelte/transition";
</script>

<div
  class="bg-background text-foreground absolute inset-0 flex flex-col items-center justify-center gap-3"
  role="status"
  aria-live="polite"
  transition:fade
>
  <Spinner class="size-6" />
  <span class="text-sm font-medium">Loading...</span>
</div>
