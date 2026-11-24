<script lang="ts">
  import ShieldAlert from "@lucide/svelte/icons/shield-alert";
  import type { Readable } from "svelte/store";
  import type { I18n } from "../i18n";

  const { i18n }: { i18n: Readable<I18n> } = $props();

  const advancedMsg = $derived($i18n.advancedMsg);
</script>

<div
  class="cm-breached-password-notice"
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  <ShieldAlert class="cm-breached-password-notice__icon" aria-hidden="true" />
  <div class="cm-breached-password-notice__body">
    <p class="cm-breached-password-notice__title">
      {@render advancedMsg("breachedPasswordNoticeTitle")()}
    </p>
    <p class="cm-breached-password-notice__text">
      {@render advancedMsg("breachedPasswordNoticeBody")()}
    </p>
    <div class="cm-breached-password-notice__actions">
      <p class="cm-breached-password-notice__actions-heading">
        {@render advancedMsg("breachedPasswordActionsHeading")()}
      </p>
      <ul>
        <li>{@render advancedMsg("breachedPasswordActionUnique")()}</li>
        <li>{@render advancedMsg("breachedPasswordActionManager")()}</li>
        <li>{@render advancedMsg("breachedPasswordActionReuse")()}</li>
      </ul>
    </div>
  </div>
</div>
