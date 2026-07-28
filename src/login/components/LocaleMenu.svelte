<script lang="ts">
  import { tick } from "svelte";

  type Language = {
    languageTag: string;
    label: string;
  };

  type EnabledLanguage = Language & {
    href: string;
  };

  let {
    currentLanguage,
    enabledLanguages,
    label,
  }: {
    currentLanguage: Language;
    enabledLanguages: EnabledLanguage[];
    label: string;
  } = $props();

  let open = $state(false);
  let root = $state<HTMLDivElement>();
  let button = $state<HTMLButtonElement>();
  let menu = $state<HTMLUListElement>();

  const items = () =>
    Array.from(
      menu?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? [],
    );

  async function openMenu(focus: "first" | "last" = "first") {
    open = true;
    await tick();
    const menuItems = items();
    menuItems[focus === "first" ? 0 : menuItems.length - 1]?.focus();
  }

  function closeMenu(returnFocus = false) {
    open = false;
    if (returnFocus) button?.focus();
  }

  function handleButtonKeydown(event: KeyboardEvent) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    void openMenu(event.key === "ArrowDown" ? "first" : "last");
  }

  function handleMenuKeydown(event: KeyboardEvent) {
    const menuItems = items();
    const currentIndex = menuItems.indexOf(
      document.activeElement as HTMLAnchorElement,
    );

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    const nextIndex =
      event.key === "ArrowDown"
        ? (currentIndex + 1) % menuItems.length
        : event.key === "ArrowUp"
          ? (currentIndex - 1 + menuItems.length) % menuItems.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? menuItems.length - 1
              : undefined;

    if (nextIndex === undefined || menuItems.length === 0) return;
    event.preventDefault();
    menuItems[nextIndex]?.focus();
  }

  function handleDocumentClick(event: MouseEvent) {
    if (open && event.target instanceof Node && !root?.contains(event.target)) {
      closeMenu();
    }
  }
</script>

<svelte:document onclick={handleDocumentClick} />

<div bind:this={root} class="cm-login-locale" id="kc-locale">
  <button
    bind:this={button}
    type="button"
    id="kc-current-locale-link"
    class="cm-login-locale__trigger"
    aria-label={label}
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls="language-switch1"
    onclick={() => (open ? closeMenu(true) : openMenu())}
    onkeydown={handleButtonKeydown}
  >
    <i class="bi bi-globe2" aria-hidden="true"></i>
    <span>{currentLanguage.label}</span>
    <i class="bi bi-chevron-down" aria-hidden="true"></i>
  </button>
  <ul
    bind:this={menu}
    role="menu"
    aria-labelledby="kc-current-locale-link"
    id="language-switch1"
    class="kcLocaleListClass cm-login-locale__menu"
    hidden={!open}
    onkeydown={handleMenuKeydown}
  >
    {#each enabledLanguages as language, index (language.languageTag)}
      <li class="kcLocaleListItemClass" role="none">
        <a
          role="menuitem"
          tabindex={-1}
          id={`language-${index + 1}`}
          class="kcLocaleItemClass cm-login-locale__item"
          href={language.href}
          aria-current={language.languageTag === currentLanguage.languageTag
            ? "true"
            : undefined}
        >
          {language.label}
        </a>
      </li>
    {/each}
  </ul>
</div>
