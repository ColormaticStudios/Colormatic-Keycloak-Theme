<script lang="ts">
  import FieldErrors from "./FieldErrors.svelte";
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
  <div
    class="kcFormGroupClass"
    style:display={attribute.annotations.inputType === "hidden" ||
    (attribute.name === "password-confirm" && !props.doMakeUserConfirmPassword)
      ? "none"
      : undefined}
  >
    <div class="kcLabelWrapperClass">
      <label for={attribute.name} class="kcLabelClass">
        {@render advancedMsg(attribute.displayName ?? "")()}
      </label>
      {#if attribute.required}
        *
      {/if}
    </div>
    <div class="kcInputWrapperClass">
      {#if attribute.annotations.inputHelperTextBefore !== undefined}
        <div
          class="kcInputHelperTextBeforeClass"
          id={`form-help-text-before-${attribute.name}`}
          aria-live="polite"
        >
          {@render advancedMsg(attribute.annotations.inputHelperTextBefore)()}
        </div>
      {/if}
      <InputFieldByType
        {attribute}
        {valueOrValues}
        displayableErrors={$displayableErrors[i]}
        {dispatchFormAction}
        i18n={props.i18n}
      />
      <FieldErrors {attribute} bind:displayableErrors={$displayableErrors[i]} />
      {#if attribute.annotations.inputHelperTextAfter !== undefined}
        <div
          class="kcInputHelperTextAfterClass"
          id={`form-help-text-after-${attribute.name}`}
          aria-live="polite"
        >
          {@render advancedMsg(attribute.annotations.inputHelperTextAfter)()}
        </div>
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
      <!-- NOTE: Downloading of html5DataAnnotations scripts is done in the useUserProfileForm hook -->
    </div>
  </div>
{/each}
