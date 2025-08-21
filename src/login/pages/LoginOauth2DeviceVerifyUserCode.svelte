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
    Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>,
    I18n
  > = $props();

  const { url } = kcContext;

  const { msg, msgStr } = $i18n;
</script>

<Template {kcContext} {i18n} {doUseDefaultCss} {classes}>
  {#snippet headerNode()}
    {@render msg("oauth2DeviceVerificationTitle")()}
  {/snippet}
  <form
    id="kc-user-verify-device-user-code-form"
    class="kcFormClass"
    action={url.oauth2DeviceVerificationAction}
    method="post"
  >
    <div class="kcFormGroupClass">
      <div class="kcLabelWrapperClass">
        <label for="device-user-code" class="kcLabelClass">
          {@render msg("verifyOAuth2DeviceUserCode")()}
        </label>
      </div>

      <div class="kcInputWrapperClass">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          id="device-user-code"
          name="device_user_code"
          autocomplete="off"
          type="text"
          class="kcInputClass"
          autofocus
        />
      </div>
    </div>

    <div class="kcFormGroupClass">
      <div id="kc-form-options" class="kcFormOptionsClass">
        <div class="kcFormOptionsWrapperClass"></div>
      </div>

      <div id="kc-form-buttons" class="kcFormButtonsClass">
        <div class="kcFormButtonsWrapperClass">
          <input
            class="
              kcButtonClass
              kcButtonPrimaryClass
              kcButtonLargeClass
              kcButtonBlockClass
            "
            type="submit"
            value={msgStr("doSubmit")}
          />
        </div>
      </div>
    </div>
  </form>
</Template>
