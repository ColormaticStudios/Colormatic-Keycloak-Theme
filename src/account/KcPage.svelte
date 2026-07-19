<script lang="ts">
  import { onMount } from "svelte";
  import { createElement } from "react";
  import { createRoot, type Root } from "react-dom/client";
  import ReactKcPage from "./KcPage";
  import type { KcContext } from "./KcContext";

  const { kcContext }: { kcContext: KcContext } = $props();

  let reactRootElement: HTMLDivElement;

  onMount(() => {
    const reactRoot: Root = createRoot(reactRootElement);
    reactRoot.render(createElement(ReactKcPage, { kcContext }));

    return () => reactRoot.unmount();
  });
</script>

<!-- Keep the React account console transparent to the surrounding Svelte root. -->
<div class="cm-account account-react-root" bind:this={reactRootElement}></div>

<style>
  .account-react-root {
    display: contents;
  }
</style>
