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
  const advancedMsg = $derived($i18n.advancedMsg);

  const getAttribute = () => attribute;
  const getGroupNameRef = () => groupNameRef;

  let isGrouplabel = $state<boolean>(false);
  if (getAttribute().group?.name !== getGroupNameRef().current) {
    getGroupNameRef().current = getAttribute().group?.name ?? "";

    if (getGroupNameRef().current !== "") {
      assert(getAttribute().group !== undefined);
      isGrouplabel = true;
    }
  }

  const html5DataAnnotations = {
    ...Object.fromEntries(
      Object.entries(getAttribute().group?.html5DataAnnotations ?? {}).map(
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
