<script lang="ts">
  import FieldErrors from "./FieldErrors.svelte";
  import FormField from "./FormField.svelte";
  import GroupLabel from "./GroupLabel.svelte";
  import InputFieldByType from "./InputFieldByType.svelte";
  import type { UserProfileFormFieldsProps } from "./UserProfileFormFieldsProps";
  import { useUserProfileForm } from "../lib/useUserProfileForm";
  import { onMount, untrack } from "svelte";
  import { derived } from "svelte/store";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";

  const props: UserProfileFormFieldsProps<KcContext, I18n> = $props();
  const kcContext = untrack(() => props.kcContext);
  const i18n = untrack(() => props.i18n);
  const doMakeUserConfirmPassword = untrack(
    () => props.doMakeUserConfirmPassword,
  );
  const advancedMsg = $derived($i18n.advancedMsg);

  const { formState, dispatchFormAction } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword,
  });
  onMount(() => {
    const unsubscribe = formState.subscribe(({ isFormSubmittable }) => {
      props.onIsFormSubmittableValueChange(isFormSubmittable);
    });
    return () => unsubscribe();
  });

  const groupNameRef = { current: "" };
  const formFieldStates = derived(
    formState,
    ($formState) => $formState.formFieldStates,
  );
  const displayableErrors = derived(formFieldStates, ($formFieldStates) =>
    $formFieldStates.map((f) => f.displayableErrors),
  );
</script>

{#each $formFieldStates as formFieldState, i (i)}
  {@const { attribute, valueOrValues } = formFieldState}
  {@const helperTextBefore = attribute.annotations.inputHelperTextBefore}
  {@const helperTextAfter = attribute.annotations.inputHelperTextAfter}
  <GroupLabel {attribute} {groupNameRef} i18n={props.i18n} />
  {#if props.beforeField}
    {@render props.beforeField({
      attribute,
      dispatchFormAction,
      displayableErrors: $displayableErrors[i],
      valueOrValues,
      i18n: props.i18n,
    })}
  {/if}
  <FormField
    inputId={attribute.name}
    required={attribute.required}
    hasError={$displayableErrors[i].length !== 0}
    hasHelpBefore={helperTextBefore !== undefined}
    hasHelpAfter={helperTextAfter !== undefined ||
      props.afterField !== undefined}
    hidden={attribute.annotations.inputType === "hidden" ||
      (attribute.name === "password-confirm" &&
        !props.doMakeUserConfirmPassword)}
  >
    {#snippet label()}
      {@render advancedMsg(attribute.displayName ?? "")()}
    {/snippet}
    {#snippet helpBefore()}
      {#if helperTextBefore !== undefined}
        <span id={`form-help-text-before-${attribute.name}`} aria-live="polite">
          {@render advancedMsg(helperTextBefore)()}
        </span>
      {/if}
    {/snippet}
    {#snippet control()}
      <InputFieldByType
        {attribute}
        {valueOrValues}
        displayableErrors={$displayableErrors[i]}
        {dispatchFormAction}
        i18n={props.i18n}
      />
    {/snippet}
    {#snippet error()}
      <FieldErrors {attribute} bind:displayableErrors={$displayableErrors[i]} />
    {/snippet}
    {#snippet helpAfter()}
      {#if helperTextAfter !== undefined}
        <span id={`form-help-text-after-${attribute.name}`} aria-live="polite">
          {@render advancedMsg(helperTextAfter)()}
        </span>
      {/if}
      {#if props.afterField}
        {@render props.afterField({
          attribute,
          dispatchFormAction,
          displayableErrors: $displayableErrors[i],
          valueOrValues,
          i18n: props.i18n,
        })}
      {/if}
    {/snippet}
  </FormField>
{/each}
