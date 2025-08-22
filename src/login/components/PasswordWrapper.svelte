<script lang="ts">
  import { useReducer } from "@keycloakify/svelte/tools/useReducer";
  import { assert } from "keycloakify/tools/assert";
  import { onMount, type Snippet } from "svelte";
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";

  const props: {
    i18n: Readable<I18n>;
    passwordInputId: string;
    children: Snippet;
  } = $props();
  const { i18n, passwordInputId, children } = props;

  const { msgStr } = $i18n;

  const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer<
    boolean,
    boolean
  >((isPasswordRevealed: boolean) => !isPasswordRevealed, false);
  onMount(() => {
    const unsubscribe = isPasswordRevealed.subscribe(($isPasswordRevealed) => {
      const passwordInputElement: HTMLInputElement = document.getElementById(
        passwordInputId,
      ) as HTMLInputElement;

      assert(passwordInputElement instanceof HTMLInputElement);
      passwordInputElement.type = $isPasswordRevealed ? "text" : "password";
    });
    return () => unsubscribe();
  });
</script>

<div class="kcInputGroup">
  {@render children?.()}
  <button
    type="button"
    class="kcFormPasswordVisibilityButtonClass"
    aria-label={msgStr($isPasswordRevealed ? "hidePassword" : "showPassword")}
    aria-controls={passwordInputId}
    onclick={() => toggleIsPasswordRevealed($isPasswordRevealed)}
  >
    <!-- Icons from Bootstrap Icons -->
    <!--
	 We really shouldn't be using base svg elements,
	 but I'm lazy. I'll probably fix it later.
	 -->
    {#if $isPasswordRevealed}
      <i class="bi bi-eye-slash-fill"></i>
    {:else}
      <i class="bi bi-eye-fill"></i>
    {/if}
  </button>
</div>
