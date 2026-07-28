<script lang="ts">
  import { onMount, tick } from "svelte";
  import Button from "../../lib/components/ui/button/button.svelte";
  import {
    setThemePreference,
    startThemeManagement,
    subscribeToTheme,
    type ThemePreference,
  } from "./theme";

  const { darkModeAllowed = true }: { darkModeAllowed?: boolean } = $props();

  const options: Array<{
    value: ThemePreference;
    icon: string;
    selectedIcon: string;
    label: string;
  }> = [
    {
      value: "dark",
      icon: "bi-moon",
      selectedIcon: "bi-moon-fill",
      label: "Dark theme",
    },
    {
      value: "light",
      icon: "bi-sun",
      selectedIcon: "bi-sun-fill",
      label: "Light theme",
    },
    {
      value: "system",
      icon: "bi-circle-half",
      selectedIcon: "bi-circle-half",
      label: "System theme",
    },
  ];

  let root = $state<HTMLDivElement | null>(null);
  let trigger = $state<HTMLButtonElement | null>(null);
  let menu = $state<HTMLDivElement | null>(null);
  let expanded = $state(false);
  let preference = $state<ThemePreference>("system");
  let menuPreference = $state<ThemePreference>("system");

  const currentOption = $derived(
    options.find((option) => option.value === preference) ?? options[2],
  );

  const menuItems = () =>
    Array.from(
      menu?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
    );

  async function openMenu(focus: "first" | "last" = "first") {
    menuPreference = preference;
    expanded = true;
    await tick();
    const items = menuItems();
    items[focus === "first" ? 0 : items.length - 1]?.focus();
  }

  function closeMenu({ returnFocus = false } = {}) {
    expanded = false;
    if (returnFocus) {
      trigger?.focus();
    }
  }

  function selectPreference(nextPreference: ThemePreference) {
    setThemePreference(nextPreference);
    closeMenu({ returnFocus: true });
  }

  function handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
      return;
    }

    event.preventDefault();
    void openMenu(event.key === "ArrowDown" ? "first" : "last");
  }

  function handleMenuKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ returnFocus: true });
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    const items = menuItems();
    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = items.length - 1;
        break;
    }

    if (nextIndex === undefined || items.length === 0) {
      return;
    }

    event.preventDefault();
    items[nextIndex]?.focus();
  }

  function handleDocumentPointerDown(event: PointerEvent) {
    if (
      expanded &&
      event.target instanceof Node &&
      !root?.contains(event.target)
    ) {
      closeMenu();
    }
  }

  onMount(() => {
    const stopThemeManagement = startThemeManagement({ darkModeAllowed });
    const unsubscribe = subscribeToTheme((state) => {
      preference = state.preference;
    });

    return () => {
      unsubscribe();
      stopThemeManagement();
    };
  });
</script>

<svelte:document onpointerdown={handleDocumentPointerDown} />

{#if darkModeAllowed}
  <div
    bind:this={root}
    class="cm-theme-switcher print:hidden"
    data-testid="theme-switcher"
  >
    <div
      class="cm-theme-switcher__surface border-border bg-background/85 rounded-lg border p-1 shadow-md backdrop-blur-sm"
    >
      <div class="cm-theme-switcher__menu-clip" class:cm-expanded={expanded}>
        <div
          bind:this={menu}
          id="colormatic-theme-menu"
          role="menu"
          tabindex="-1"
          aria-label="Theme preference"
          aria-hidden={!expanded}
          inert={!expanded}
          class="cm-theme-switcher__menu flex flex-col-reverse gap-1 pb-1"
          onkeydown={handleMenuKeydown}
        >
          {#each options as option (option.value)}
            {#if option.value !== menuPreference}
              <Button
                variant="ghost"
                size="icon"
                class="cm-theme-switcher__button"
                role="menuitemradio"
                aria-checked="false"
                aria-label={option.label}
                onclick={() => selectPreference(option.value)}
              >
                <i
                  class={`bi ${option.icon} text-[1.15rem]`}
                  aria-hidden="true"
                ></i>
              </Button>
            {/if}
          {/each}
        </div>
      </div>

      <Button
        bind:ref={trigger}
        variant="ghost"
        size="icon"
        class="cm-theme-switcher__button"
        aria-label={`Theme: ${currentOption.label}. Change theme preference`}
        aria-haspopup="menu"
        aria-expanded={expanded}
        aria-controls="colormatic-theme-menu"
        onclick={() => (expanded ? closeMenu() : openMenu())}
        onkeydown={handleTriggerKeydown}
      >
        <i
          class={`bi ${currentOption.selectedIcon} text-[1.15rem]`}
          aria-hidden="true"
        ></i>
      </Button>
    </div>
  </div>
{/if}

<style>
  .cm-theme-switcher {
    position: fixed;
    right: 1.25rem;
    bottom: 1.25rem;
    z-index: 1000;
    color: var(--foreground);
  }

  .cm-theme-switcher__surface {
    isolation: isolate;
  }

  .cm-theme-switcher__menu-clip {
    position: relative;
    width: 100%;
    height: 5rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 300ms ease-out;
  }

  .cm-theme-switcher__menu-clip.cm-expanded {
    max-height: 5rem;
  }

  .cm-theme-switcher__menu {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
  }

  :global(.cm-theme-switcher__button) {
    color: var(--foreground);
  }

  @media (prefers-reduced-motion: reduce) {
    .cm-theme-switcher__menu-clip {
      transition-duration: 0ms;
    }
  }
</style>
