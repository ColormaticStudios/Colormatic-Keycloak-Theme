<script lang="ts">
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";

  const { i18n }: { i18n: Readable<I18n> } = $props();

  const { msg } = $i18n;
</script>

<div id="kc-form-options" class="kcFormOptionsClass">
  <div class="kcFormOptionsWrapperClass">
    <div class="checkbox">
      <label>
        <input
          type="checkbox"
          id="logout-sessions"
          name="logout-sessions"
          value="on"
          checked={true}
        />
        {@render msg("logoutOtherSessions")()}
      </label>
    </div>
  </div>
</div>
