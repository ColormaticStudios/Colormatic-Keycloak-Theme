<script lang="ts">
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";

  const { i18n }: { i18n: Readable<I18n> } = $props();

  const msg = $derived($i18n.msg);
</script>

<div id="kc-form-options" class="kcFormOptionsClass">
  <div class="kcFormOptionsWrapperClass">
    <div class="checkbox cm-login-check">
      <input
        type="checkbox"
        id="logout-sessions"
        name="logout-sessions"
        value="on"
        checked={true}
      />
      <label for="logout-sessions" class="cm-login-label">
        {@render msg("logoutOtherSessions")()}
      </label>
    </div>
  </div>
</div>
