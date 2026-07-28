<script lang="ts">
  import { kcSanitize } from "keycloakify/lib/kcSanitize";
  import { clsx } from "keycloakify/tools/clsx";

  let {
    type,
    summary,
  }: {
    type: "success" | "warning" | "error" | "info";
    summary: string;
  } = $props();

  const icon = $derived(
    type === "success"
      ? "bi-check-circle"
      : type === "warning"
        ? "bi-exclamation-triangle"
        : type === "error"
          ? "bi-x-circle"
          : "bi-info-circle",
  );
</script>

<div
  data-slot="alert"
  class={clsx(
    "cm-login-alert",
    `cm-login-alert--${type}`,
    `alert-${type}`,
    "kcAlertClass",
    `pf-m-${type === "error" ? "danger" : type}`,
  )}
  role={type === "error" || type === "warning" ? "alert" : "status"}
  aria-live={type === "error" || type === "warning" ? "assertive" : "polite"}
  aria-atomic="true"
>
  <i class={`bi ${icon} cm-login-alert__icon`} aria-hidden="true"></i>
  <div class="kcAlertTitleClass cm-login-alert__content">
    {@html kcSanitize(summary)}
  </div>
</div>
