import { createRoot } from "react-dom/client";
import KcPage from "./KcPage";
import type { KcContext } from "./KcContext";
import { getKcContextMock } from "./kcContextMock";

function ensureDevEnvironment() {
  if (!import.meta.env.DEV) {
    return;
  }

  if (document.getElementById("environment")) {
    return;
  }

  const origin = window.location.origin;
  const environment = {
    serverBaseUrl: origin,
    realm: "master",
    clientId: "account",
    resourceUrl: `${origin}/resources`,
    logo: `${origin}/colormatic_logo.svg`,
    logoUrl: origin,
    scope: "openid",
    baseUrl: `${origin}/`,
    locale: "en",
    referrerName: "Account",
    referrerUrl: "",
    features: {
      isRegistrationEmailAsUsername: false,
      isEditUserNameAllowed: true,
      isLinkedAccountsEnabled: true,
      isMyResourcesEnabled: true,
      deleteAccountAllowed: true,
      updateEmailFeatureEnabled: true,
      updateEmailActionEnabled: true,
      isViewGroupsEnabled: true,
      isViewOrganizationsEnabled: false,
      isOid4VciEnabled: false,
    },
  };

  const script = document.createElement("script");
  script.id = "environment";
  script.type = "application/json";
  script.textContent = JSON.stringify(environment);
  document.head.append(script);
}

ensureDevEnvironment();

let kcContext = (window as { kcContext?: KcContext }).kcContext;

if (import.meta.env.DEV && !kcContext) {
  (window as { kcContext?: KcContext }).kcContext = getKcContextMock();
  kcContext = (window as { kcContext?: KcContext }).kcContext;
}

if (kcContext) {
  const rootElement = document.getElementById("kc-root");

  if (rootElement) {
    createRoot(rootElement).render(<KcPage kcContext={kcContext} />);
  }
}
