<script lang="ts">
  import {
    getButtonToDisplayForMultivaluedAttributeField,
    type FormAction,
  } from "../lib/useUserProfileForm";
  import type { Attribute } from "keycloakify/login/KcContext";
  import type { EventDispatcher } from "svelte";
  import type { Readable } from "svelte/store";
  import type { I18n } from "../i18n";

  type AddRemoveButtonsMultiValuedAttributeProps = {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: EventDispatcher<{
      formAction: Extract<FormAction, { action: "update" }>;
    }>;
    i18n: Readable<I18n>;
  };
  const {
    attribute,
    values,
    fieldIndex,
    dispatchFormAction,
    i18n,
  }: AddRemoveButtonsMultiValuedAttributeProps = $props();
  const msg = $derived($i18n.msg);

  const getAttribute = () => attribute;
  const getValues = () => values;
  const getFieldIndex = () => fieldIndex;

  const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({
    attribute: getAttribute(),
    values: getValues(),
    fieldIndex: getFieldIndex(),
  });

  const idPostfix = `-${getAttribute().name}-${getFieldIndex() + 1}`;
</script>

{#if hasRemove}
  <button
    id={`kc-remove${idPostfix}`}
    type="button"
    class="pf-c-button pf-m-inline pf-m-link"
    onclick={() =>
      dispatchFormAction("formAction", {
        action: "update",
        name: attribute.name,
        valueOrValues: values.filter((_, i) => i !== fieldIndex),
      })}
  >
    {@render msg("remove")()}
  </button>
  {#if hasAdd}&nbsp;|&nbsp;{/if}
{/if}
{#if hasAdd}
  <button
    id={`kc-add${idPostfix}`}
    type="button"
    class="kcButtonClass kcButtonDefaultClass"
    onclick={() =>
      dispatchFormAction("formAction", {
        action: "update",
        name: attribute.name,
        valueOrValues: [...values, ""],
      })}
  >
    {@render msg("addValue")()}
  </button>
{/if}
