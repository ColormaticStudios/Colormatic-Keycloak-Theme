<script lang="ts">
  import { onMount } from "svelte";
  import { createElement } from "react";
  import { createRoot, type Root } from "react-dom/client";
  import ReactKcPage from "./KcPage";
  import type { KcContext } from "./KcContext";
  import ThemeSwitcher from "../shared/theme/ThemeSwitcher.svelte";

  const { kcContext }: { kcContext: KcContext } = $props();

  let reactRootElement: HTMLDivElement;

  onMount(() => {
    document.documentElement.classList.add("cm-account-theme");
    const reactRoot: Root = createRoot(reactRootElement);
    reactRoot.render(createElement(ReactKcPage, { kcContext }));

    return () => {
      document.documentElement.classList.remove("cm-account-theme");
      reactRoot.unmount();
    };
  });
</script>

<!-- Keep the React account console transparent to the surrounding Svelte root. -->
<div class="cm-account account-react-root" bind:this={reactRootElement}></div>
<ThemeSwitcher darkModeAllowed={kcContext.darkMode !== false} />

<style>
  .account-react-root {
    display: contents;
  }
</style>
