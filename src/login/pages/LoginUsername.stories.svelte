<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { KcPageStoryProps } from "../KcPageStory";
  import KcPageStory from "../KcPageStory.svelte";

  const args: KcPageStoryProps = { pageId: "login-username.ftl" };
  const { Story } = defineMeta({
    title: "login/login-username.ftl",
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<Story
  name="WithPasskeyConditionalUI"
  args={{
    ...args,
    kcContext: {
      enableWebAuthnConditionalUI: true,
      isUserIdentified: "false",
      challenge: "P9OnaFRxQv-PJxt9CUPwbg",
      userVerification: "preferred",
      rpId: "localhost",
      createTimeout: 0,
    },
  }}
/>

<!--  -->
<Story
  name="WithEmailAsUsername"
  args={{
    ...args,
    kcContext: {
      realm: {
        loginWithEmailAllowed: true,
        registrationEmailAsUsername: true,
      },
    },
  }}
/>
