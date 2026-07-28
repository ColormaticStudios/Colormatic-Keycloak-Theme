<script lang="ts">
  import { Button } from "../../lib/components/ui/button";
  import * as DropdownMenu from "../../lib/components/ui/dropdown-menu";

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
</script>

<div class="shrink-0" id="kc-locale">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          type="button"
          variant="outline"
          size="sm"
          id="kc-current-locale-link"
          aria-label={label}
        >
          <i class="bi bi-globe2" aria-hidden="true"></i>
          <span>{currentLanguage.label}</span>
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end" class="max-h-[60vh] min-w-48">
      {#each enabledLanguages as language, index (language.languageTag)}
        <DropdownMenu.Item
          id={`language-${index + 1}`}
          onSelect={() => {
            window.location.href = language.href;
          }}
          aria-current={language.languageTag === currentLanguage.languageTag
            ? "true"
            : undefined}
        >
          {language.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
