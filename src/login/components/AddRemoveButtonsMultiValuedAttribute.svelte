<script lang="ts">
  import {
    getButtonToDisplayForMultivaluedAttributeField,
    type FormAction,
  } from "../lib/useUserProfileForm";
  import type { Attribute } from "keycloakify/login/KcContext";
  import type { EventDispatcher } from "svelte";
  import type { Readable } from "svelte/store";
  import type { I18n } from "../i18n";
  import { Button } from "../../lib/components/ui/button";

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
  <Button
    id={`kc-remove${idPostfix}`}
    type="button"
    variant="ghost"
    size="sm"
    onclick={() =>
      dispatchFormAction("formAction", {
        action: "update",
        name: attribute.name,
        valueOrValues: values.filter((_, i) => i !== fieldIndex),
      })}
  >
    {@render msg("remove")()}
  </Button>
  {#if hasAdd}&nbsp;|&nbsp;{/if}
{/if}
{#if hasAdd}
  <Button
    id={`kc-add${idPostfix}`}
    type="button"
    variant="outline"
    size="sm"
    onclick={() =>
      dispatchFormAction("formAction", {
        action: "update",
        name: attribute.name,
        valueOrValues: [...values, ""],
      })}
  >
    {@render msg("addValue")()}
  </Button>
{/if}
