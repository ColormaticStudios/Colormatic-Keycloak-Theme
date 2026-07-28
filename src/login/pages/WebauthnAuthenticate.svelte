<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { useScript } from "@keycloakify/svelte/login/pages/WebauthnAuthenticate.useScript";
  import { clsx } from "keycloakify/tools/clsx";
  import { untrack } from "svelte";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import AuthChoice from "../components/AuthChoice.svelte";
  import { Button } from "../../lib/components/ui/button";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>,
    I18n
  > = $props();

  const url = $derived(kcContext.url);
  const realm = $derived(kcContext.realm);
  const registrationDisabled = $derived(kcContext.registrationDisabled);
  const authenticators = $derived(kcContext.authenticators);
  const shouldDisplayAuthenticators = $derived(
    kcContext.shouldDisplayAuthenticators,
  );

  const msg = $derived($i18n.msg);
  const advancedMsg = $derived($i18n.advancedMsg);

  const authButtonId = "authenticateWebAuthnButton";

  useScript({
    authButtonId,
    kcContext: untrack(() => kcContext),
    i18n: untrack(() => i18n),
  });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayInfo={realm.registrationAllowed && !registrationDisabled}
>
  {#snippet headerNode()}
    {@render msg("webauthn-login-title")()}
  {/snippet}
  {#snippet infoNode()}
    <div id="kc-registration">
      <span>
        {@render msg("noAccount")()}
        <a href={url.registrationUrl}>
          {@render msg("doRegister")()}
        </a>
      </span>
    </div>
  {/snippet}
  <div id="kc-form-webauthn" class="kcFormClass cm-login-form">
    <form
      class="cm-login-form"
      id="webauth"
      action={url.loginAction}
      method="post"
    >
      <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
      <input type="hidden" id="authenticatorData" name="authenticatorData" />
      <input type="hidden" id="signature" name="signature" />
      <input type="hidden" id="credentialId" name="credentialId" />
      <input type="hidden" id="userHandle" name="userHandle" />
      <input type="hidden" id="error" name="error" />
    </form>
    <div class={clsx("kcFormGroupClass", "no-bottom-margin")}>
      {#if authenticators}
        <form id="authn_select" class="kcFormClass cm-login-form">
          {#each authenticators.authenticators as authenticator, i (i)}
            <input
              type="hidden"
              name="authn_use_chk"
              value={authenticator.credentialId}
            />
          {/each}
        </form>

        {#if shouldDisplayAuthenticators}
          {#if authenticators.authenticators.length > 1}
            <p class="kcSelectAuthListItemTitle">
              {@render msg("webauthn-available-authenticators")()}
            </p>
          {/if}
          <div class="kcFormOptionsClass space-y-4 py-2">
            {#each authenticators.authenticators as authenticator, i (i)}
              <AuthChoice
                id={`kc-webauthn-authenticator-item-${i}`}
                type="button"
              >
                {#snippet title()}
                  <span id={`kc-webauthn-authenticator-label-${i}`}>
                    {@render advancedMsg(authenticator.label)()}
                  </span>
                {/snippet}
                {#snippet description()}
                  {#if authenticator.transports.displayNameProperties?.length}
                    <span id={`kc-webauthn-authenticator-transport-${i}`}>
                      {#each authenticator.transports.displayNameProperties as displayNameProperty, i (i)}
                        {@const hasNext =
                          i !==
                          authenticator.transports.displayNameProperties
                            .length -
                            1}
                        {@render advancedMsg(displayNameProperty)()}
                        {#if hasNext}<span>,</span>{/if}
                      {/each}
                    </span>
                  {/if}
                  <span>
                    <span id={`kc-webauthn-authenticator-createdlabel-${i}`}>
                      {@render msg("webauthn-createdAt-label")()}:
                    </span>
                    <span id={`kc-webauthn-authenticator-created-${i}`}>
                      {authenticator.createdAt}
                    </span>
                  </span>
                {/snippet}
              </AuthChoice>
            {/each}
          </div>
        {/if}
      {/if}
      <div id="kc-form-buttons" class="kcFormButtonsClass cm-login-actions">
        <Button id={authButtonId} type="button" autofocus class="w-full">
          {@render msg("webauthn-doAuthenticate")()}
        </Button>
      </div>
    </div>
  </div>
</Template>
