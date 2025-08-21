<script lang="ts">
  import type { Attribute } from "keycloakify/login/KcContext";
  import { assert } from "keycloakify/tools/assert";
  import { createRawSnippet } from "svelte";
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";

  type GroupLabelProps = {
    attribute: Attribute;
    groupNameRef: {
      current: string;
    };
    i18n: Readable<I18n>;
  };
  const { attribute, groupNameRef, i18n }: GroupLabelProps = $props();
  const { advancedMsg } = $i18n;

  let isGrouplabel = $state<boolean>(false);
  if (attribute.group?.name !== groupNameRef.current) {
    groupNameRef.current = attribute.group?.name ?? "";

    if (groupNameRef.current !== "") {
      assert(attribute.group !== undefined);
      isGrouplabel = true;
    }
  }

  const html5DataAnnotations = {
    ...Object.fromEntries(
      Object.entries(attribute.group?.html5DataAnnotations ?? {}).map(
        ([key, value]) => [`data-${key}`, value],
      ),
    ),
  };
</script>

{#if isGrouplabel}
  {@const groupDisplayHeader = attribute.group?.displayHeader ?? ""}
  {@const groupDisplayDescription = attribute.group?.displayDescription ?? ""}
  {@const groupHeaderText =
    groupDisplayHeader !== ""
      ? advancedMsg(groupDisplayHeader)
      : createRawSnippet(() => ({ render: () => attribute.group?.name ?? "" }))}
  <div class="kcFormGroupClass" {...html5DataAnnotations}>
    <div class="kcContentWrapperClass">
      <label id={`header-${attribute.group?.name}`} class="kcFormGroupHeader">
        {@render groupHeaderText()}
      </label>
    </div>
    {#if groupDisplayDescription !== ""}
      {@const groupDescriptionText = advancedMsg(groupDisplayDescription)}
      <div class="kcLabelWrapperClass">
        <label id={`description-${attribute.group?.name}`} class="kcLabelClass">
          {@render groupDescriptionText()}
        </label>
      </div>
    {/if}
  </div>
{/if}
