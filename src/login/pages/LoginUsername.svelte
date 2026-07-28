<script lang="ts">
  import type { PageProps } from "./PageProps";
  import { useState } from "@keycloakify/svelte/tools/useState";
  import { clsx } from "keycloakify/tools/clsx";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";
  import FormActions from "../components/FormActions.svelte";
  import FormField from "../components/FormField.svelte";
  import { Button } from "../../lib/components/ui/button";
  import { Checkbox } from "../../lib/components/ui/checkbox";
  import { Input } from "../../lib/components/ui/input";
  import { Label } from "../../lib/components/ui/label";
  import { Separator } from "../../lib/components/ui/separator";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "login-username.ftl" }>,
    I18n
  > = $props();

  const social = $derived(kcContext.social);
  const realm = $derived(kcContext.realm);
  const url = $derived(kcContext.url);
  const usernameHidden = $derived(kcContext.usernameHidden);
  const login = $derived(kcContext.login);
  const registrationDisabled = $derived(kcContext.registrationDisabled);
  const messagesPerField = $derived(kcContext.messagesPerField);
  const enableWebAuthnConditionalUI = $derived(
    kcContext.enableWebAuthnConditionalUI,
  );

  const msg = $derived($i18n.msg);
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError("username")}
  displayInfo={realm.password &&
    realm.registrationAllowed &&
    !registrationDisabled}
>
  {#snippet headerNode()}
    {@render msg("doLogIn")()}
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
  {#snippet socialProvidersNode()}
    {#if realm.password && social?.providers !== undefined && social.providers.length !== 0}
      <div id="kc-social-providers" class="kcFormSocialAccountSectionClass">
        <Separator />
        <h2>{@render msg("identity-provider-login-label")()}</h2>
        <ul
          class="
            kcFormSocialAccountListClass
				{social.providers.length > 3 ? 'kcFormSocialAccountListGridClass' : ''}
          "
        >
          {#each social.providers as p, i (i)}
            <li>
              <Button
                id={`social-${p.alias}`}
                class="h-auto w-full"
                variant="outline"
                href={p.loginUrl}
              >
                {#if p.iconClasses}
                  <i
                    class={clsx("kcCommonLogoIdP", p.iconClasses)}
                    aria-hidden="true"
                  ></i>
                {/if}
                <span
                  class={clsx(
                    "kcFormSocialAccountNameClass",
                    p.iconClasses && "kc-social-icon-text",
                  )}
                >
                  {p.displayName}
                </span>
              </Button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/snippet}

  <div id="kc-form">
    <div id="kc-form-wrapper">
      {#if realm.password}
        <form
          class="cm-login-form"
          id="kc-form-login"
          onsubmit={() => {
            setIsLoginButtonDisabled(true);
            return true;
          }}
          action={url.loginAction}
          method="post"
        >
          {#if !usernameHidden}
            <FormField
              inputId="username"
              hasError={messagesPerField.existsError("username")}
            >
              {#snippet label()}
                {#if !realm.loginWithEmailAllowed}
                  {@render msg("username")()}
                {:else if !realm.registrationEmailAsUsername}
                  {@render msg("usernameOrEmail")()}
                {:else}
                  {@render msg("email")()}
                {/if}
              {/snippet}
              {#snippet control()}
                <Input
                  id="username"
                  name="username"
                  value={login.username ?? ""}
                  type="text"
                  autofocus
                  autocomplete={enableWebAuthnConditionalUI
                    ? "username webauthn"
                    : "username"}
                  aria-invalid={messagesPerField.existsError("username")}
                />
              {/snippet}
              {#snippet error()}
                {#if messagesPerField.existsError("username")}
                  <span id="input-error">
                    {messagesPerField.getFirstError("username")}
                  </span>
                {/if}
              {/snippet}
            </FormField>
          {/if}

          <div class="kcFormGroupClass kcFormSettingClass">
            <div id="kc-form-options">
              {#if realm.rememberMe && !usernameHidden}
                <div class="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={!!login.rememberMe}
                  />
                  <Label for="rememberMe">
                    {@render msg("rememberMe")()}
                  </Label>
                </div>
              {/if}
            </div>
          </div>

          <FormActions>
            <Button
              disabled={$isLoginButtonDisabled}
              class="cm-login-action--block"
              name="login"
              id="kc-login"
              type="submit"
            >
              {@render msg("doLogIn")()}
            </Button>
          </FormActions>
        </form>
      {/if}
    </div>
  </div>
</Template>
