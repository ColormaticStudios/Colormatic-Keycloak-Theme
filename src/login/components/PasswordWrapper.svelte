<script lang="ts">
  import { useReducer } from "@keycloakify/svelte/tools/useReducer";
  import type { KcClsx } from "keycloakify/login/lib/kcClsx";
  import { assert } from "keycloakify/tools/assert";
  import { onMount, type Snippet } from "svelte";
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";

  const props: {
    kcClsx: KcClsx;
    i18n: Readable<I18n>;
    passwordInputId: string;
    children: Snippet;
  } = $props();
  const { kcClsx, i18n, passwordInputId, children } = props;

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"
        />
        <path
          d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"
        />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
        <path
          d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
        />
      </svg>
    {/if}
  </button>
</div>
