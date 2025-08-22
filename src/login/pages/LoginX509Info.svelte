<script lang="ts">
  import type { PageProps } from "./PageProps";
  import type { KcContext } from "../KcContext";
  import type { I18n } from "../i18n";

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<
    Extract<KcContext, { pageId: "login-x509-info.ftl" }>,
    I18n
  > = $props();

  const { url, x509 } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("doLogIn")()}
  {/snippet}
  <form
    id="kc-x509-login-info"
    class="kcFormClass"
    action={url.loginAction}
    method="post"
  >
    <div class="kcFormGroupClass">
      <div class="kcLabelWrapperClass">
        <label for="certificate_subjectDN" class="kcLabelClass">
          {@render msg("clientCertificate")()}
        </label>
      </div>
      {#if x509.formData.subjectDN}
        <div class="kcLabelWrapperClass">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label id="certificate_subjectDN" class="kcLabelClass">
            {x509.formData.subjectDN}
          </label>
        </div>
      {:else}
        <div class="kcLabelWrapperClass">
          <label id="certificate_subjectDN" class="kcLabelClass">
            {@render msg("noCertificate")()}
          </label>
        </div>
      {/if}
    </div>
    <div class="kcFormGroupClass">
      {#if x509.formData.isUserEnabled}
        <div class="kcLabelWrapperClass">
          <label for="username" class="kcLabelClass">
            {@render msg("doX509Login")()}
          </label>
        </div>
        <div class="kcLabelWrapperClass">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label id="username" class="kcLabelClass">
            {x509.formData.username}
          </label>
        </div>
      {/if}
    </div>
    <div class="kcFormGroupClass">
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass"></div>
      </div>
      <div id="kc-form-buttons" class="kcFormButtonsWrapperClass">
        <input
          class="
                kcButtonClass
                kcButtonPrimaryClass
                kcButtonLargeClass
              "
          name="login"
          id="kc-login"
          type="submit"
          value={msgStr("doContinue")}
        />
        {#if x509.formData.isUserEnabled}
          <input
            class="
                  kcButtonClass
                  kcButtonDefaultClass
                  kcButtonLargeClass
                "
            name="cancel"
            id="kc-cancel"
            type="submit"
            value={msgStr("doIgnore")}
          />
        {/if}
      </div>
    </div>
  </form>
</Template>
