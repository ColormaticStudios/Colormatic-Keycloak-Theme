<script lang="ts">
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";
  import { Checkbox } from "../../lib/components/ui/checkbox";
  import { Label } from "../../lib/components/ui/label";

  const { i18n }: { i18n: Readable<I18n> } = $props();

  const msg = $derived($i18n.msg);
</script>

<div id="kc-form-options" class="kcFormOptionsClass">
  <div class="kcFormOptionsWrapperClass">
    <div class="checkbox cm-login-check">
      <Checkbox
        id="logout-sessions"
        name="logout-sessions"
        value="on"
        checked={true}
      />
      <Label for="logout-sessions">
        {@render msg("logoutOtherSessions")()}
      </Label>
    </div>
  </div>
</div>
