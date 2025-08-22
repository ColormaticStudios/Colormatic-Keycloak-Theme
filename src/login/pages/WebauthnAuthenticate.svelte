<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { useScript } from "@keycloakify/svelte/login/pages/WebauthnAuthenticate.useScript";
  import { clsx } from "keycloakify/tools/clsx";
  import type { ClassKey } from "keycloakify/login/lib/kcClsx";
  import type { CxArg } from "keycloakify/tools/clsx_withTransform";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

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

  const {
    url,
    realm,
    registrationDisabled,
    authenticators,
    shouldDisplayAuthenticators,
  } = kcContext;

  const { msg, msgStr, advancedMsg } = $i18n;

  const authButtonId = "authenticateWebAuthnButton";

  useScript({
    authButtonId,
    kcContext,
    i18n,
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
        <a tabindex={6} href={url.registrationUrl}>
          {@render msg("doRegister")()}
        </a>
      </span>
    </div>
  {/snippet}
  <div id="kc-form-webauthn" class="kcFormClass">
    <form id="webauth" action={url.loginAction} method="post">
      <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
      <input type="hidden" id="authenticatorData" name="authenticatorData" />
      <input type="hidden" id="signature" name="signature" />
      <input type="hidden" id="credentialId" name="credentialId" />
      <input type="hidden" id="userHandle" name="userHandle" />
      <input type="hidden" id="error" name="error" />
    </form>
    <div class={clsx("kcFormGroupClass", "no-bottom-margin")}>
      {#if authenticators}
        <form id="authn_select" class="kcFormClass">
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
              <button
                id={`kc-webauthn-authenticator-item-${i}`}
                type="button"
                class="kcSelectAuthListItemClass group flex w-full
                  cursor-pointer items-center justify-between rounded-xl
                  border border-slate-300 bg-white p-2 text-left
                  shadow-sm transition hover:border-slate-400
                  hover:shadow-md focus:ring-2 focus:ring-blue-500
                  focus:outline-none dark:border-slate-700 dark:bg-slate-800
                  dark:hover:border-slate-600"
              >
                <div
                  class="mr-4 flex h-10 w-10 items-center justify-center
                    rounded-full bg-slate-100 text-slate-500 transition
                    group-hover:bg-slate-200 dark:bg-slate-700
                    dark:text-slate-300 dark:group-hover:bg-slate-600"
                >
                  <i class="bi bi-key-fill text-xl"></i>
                </div>

                <div
                  class="kcSelectAuthListItemArrowIconClass flex flex-1 flex-col"
                >
                  <div
                    id={`kc-webauthn-authenticator-label-${i}`}
                    class="kcSelectAuthListItemHeadingClass text-lg
                      font-medium text-slate-900 dark:text-slate-100"
                  >
                    {@render advancedMsg(authenticator.label)()}
                  </div>

                  {#if authenticator.transports.displayNameProperties?.length}
                    <div
                      id={`kc-webauthn-authenticator-transport-${i}`}
                      class="kcSelectAuthListItemDescriptionClass
                        mt-1 text-sm text-slate-600 dark:text-slate-400"
                    >
                      {#each authenticator.transports.displayNameProperties as displayNameProperty, i (i)}
                        {@const hasNext =
                          i !==
                          authenticator.transports.displayNameProperties
                            .length -
                            1}
                        {@render advancedMsg(displayNameProperty)()}
                        {#if hasNext}<span>,</span>{/if}
                      {/each}
                    </div>
                  {/if}

                  <div
                    class="kcSelectAuthListItemDescriptionClass mt-1
                      flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <span
                      id={`kc-webauthn-authenticator-createdlabel-${i}`}
                      class="font-medium"
                    >
                      {@render msg("webauthn-createdAt-label")()}:
                    </span>
                    <span id={`kc-webauthn-authenticator-created-${i}`}>
                      {authenticator.createdAt}
                    </span>
                  </div>
                </div>

                <div class="kcSelectAuthListItemFillClass ml-4"></div>
              </button>
            {/each}
          </div>
        {/if}
      {/if}
      <div id="kc-form-buttons" class="kcFormButtonsClass">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          id={authButtonId}
          type="button"
          autofocus
          value={msgStr("webauthn-doAuthenticate")}
          class="
            kcButtonClass
            kcButtonPrimaryClass
            kcButtonBlockClass
            kcButtonLargeClass
          "
        />
      </div>
    </div>
  </div>
</Template>
