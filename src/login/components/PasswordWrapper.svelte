<script lang="ts">
  import { useReducer } from "@keycloakify/svelte/tools/useReducer";
  import { assert } from "keycloakify/tools/assert";
  import { onMount, type Snippet } from "svelte";
  import type { I18n } from "../i18n";
  import type { Readable } from "svelte/store";
  import * as InputGroup from "../../lib/components/ui/input-group";

  let {
    i18n,
    passwordInputId,
    children,
  }: {
    i18n: Readable<I18n>;
    passwordInputId: string;
    children: Snippet;
  } = $props();

  const msgStr = $derived($i18n.msgStr);

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

<InputGroup.Root data-slot="password-field">
  {@render children?.()}
  <InputGroup.Button
    type="button"
    size="icon-sm"
    aria-label={msgStr($isPasswordRevealed ? "hidePassword" : "showPassword")}
    aria-controls={passwordInputId}
    onclick={() => toggleIsPasswordRevealed($isPasswordRevealed)}
  >
    {#if $isPasswordRevealed}
      <i class="bi bi-eye-slash-fill" aria-hidden="true"></i>
    {:else}
      <i class="bi bi-eye-fill" aria-hidden="true"></i>
    {/if}
  </InputGroup.Button>
</InputGroup.Root>
