<script lang="ts">
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import CircleCheck from "@lucide/svelte/icons/circle-check";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import Info from "@lucide/svelte/icons/info";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import * as Alert from "../../lib/components/ui/alert";

  let {
    type,
    summary,
  }: {
    type: "success" | "warning" | "error" | "info";
    summary: string;
  } = $props();

  const Icon = $derived(
    type === "success"
      ? CircleCheck
      : type === "warning"
        ? TriangleAlert
        : type === "error"
          ? CircleX
          : Info,
  );
</script>

<Alert.Root
  variant={type === "error" ? "destructive" : "default"}
  role={type === "error" || type === "warning" ? "alert" : "status"}
  aria-live={type === "error" || type === "warning" ? "assertive" : "polite"}
  aria-atomic="true"
>
  <Icon aria-hidden="true" />
  <Alert.Description>
    {@html kcSanitize(summary)}
  </Alert.Description>
</Alert.Root>
