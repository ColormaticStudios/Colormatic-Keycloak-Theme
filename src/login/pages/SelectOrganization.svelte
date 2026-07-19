<script lang="ts">
  import { tick } from "svelte";
  import type { I18n } from "../i18n";
  import type { KcContext } from "../KcContext";
  import type { PageProps } from "./PageProps";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "select-organization.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const organizations = $derived(kcContext.user.organizations ?? []);
  const shouldDisplayGrid = $derived(organizations.length > 3);
  const msg = $derived($i18n.msg);

  let form: HTMLFormElement;
  let selectedOrganization = $state("");
  let isSubmitting = $state(false);

  async function selectOrganization(alias: string) {
    selectedOrganization = alias;
    isSubmitting = true;
    await tick();

    if (typeof form.requestSubmit === "function") {
      form.requestSubmit();
      return;
    }

    form.submit();
  }
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}{/snippet}

  <form
    bind:this={form}
    action={url.loginAction}
    class="form-vertical"
    method="post"
  >
    <div id="kc-user-organizations" class="kcFormGroupClass">
      <h2>{@render msg("organization.select")()}</h2>
      <ul
        class="kcFormSocialAccountListClass {shouldDisplayGrid
          ? 'kcFormSocialAccountListGridClass'
          : ''}"
      >
        {#each organizations as organization (organization.alias)}
          <li>
            <button
              id={`organization-${organization.alias}`}
              class="kcFormSocialAccountListButtonClass {shouldDisplayGrid
                ? 'kcFormSocialAccountGridItem'
                : ''}"
              type="button"
              onclick={() => selectOrganization(organization.alias)}
              disabled={isSubmitting}
            >
              <span class="kcFormSocialAccountNameClass">
                {organization.name ?? organization.alias}
              </span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <input type="hidden" name="kc.org" value={selectedOrganization} />
  </form>
</Template>
