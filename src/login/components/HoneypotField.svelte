<script lang="ts">
  const {
    fieldId = "website_fax",
    fieldName = "website_fax",
  }: {
    fieldId?: string;
    fieldName?: string;
  } = $props();
</script>

<div class="cm-login-aux-field" aria-hidden="true">
  <label for={fieldId}>Leave this field empty</label>
  <input
    id={fieldId}
    name={fieldName}
    type="text"
    value=""
    tabindex="-1"
    autocomplete="off"
    data-1p-ignore="true"
    data-lpignore="true"
    data-bwignore="true"
    data-form-type="other"
  />
</div>
