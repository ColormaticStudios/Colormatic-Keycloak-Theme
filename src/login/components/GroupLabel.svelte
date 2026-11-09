<script lang="ts">
  import type { Attribute } from "keycloakify/login/KcContext";
  import { assert } from "keycloakify/tools/assert";
  import { createRawSnippet } from "svelte";
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";

  type GroupLabelProps = {
    attribute: Attribute;
    isGroupStart: boolean;
    i18n: Readable<I18n>;
  };
  const { attribute, isGroupStart, i18n }: GroupLabelProps = $props();
  const advancedMsg = $derived($i18n.advancedMsg);

  const isGrouplabel = $derived.by(() => {
    if (!isGroupStart) {
      return false;
    }

    assert(attribute.group !== undefined);
    return true;
  });

  const html5DataAnnotations = $derived({
    ...Object.fromEntries(
      Object.entries(attribute.group?.html5DataAnnotations ?? {}).map(
        ([key, value]) => [`data-${key}`, value],
      ),
    ),
  });
</script>

{#if isGrouplabel}
  {@const groupDisplayHeader = attribute.group?.displayHeader ?? ""}
  {@const groupDisplayDescription = attribute.group?.displayDescription ?? ""}
  {@const groupHeaderText =
    groupDisplayHeader !== ""
      ? advancedMsg(groupDisplayHeader)
      : createRawSnippet(() => ({ render: () => attribute.group?.name ?? "" }))}
  <section
    class="kcFormGroupClass cm-login-field cm-login-field-group"
    aria-labelledby={`header-${attribute.group?.name}`}
    {...html5DataAnnotations}
  >
    <div class="kcContentWrapperClass">
      <h2 id={`header-${attribute.group?.name}`} class="kcFormGroupHeader">
        {@render groupHeaderText()}
      </h2>
    </div>
    {#if groupDisplayDescription !== ""}
      {@const groupDescriptionText = advancedMsg(groupDisplayDescription)}
      <div class="kcLabelWrapperClass">
        <p
          id={`description-${attribute.group?.name}`}
          class="kcLabelClass cm-login-field__help"
        >
          {@render groupDescriptionText()}
        </p>
      </div>
    {/if}
  </section>
{/if}
