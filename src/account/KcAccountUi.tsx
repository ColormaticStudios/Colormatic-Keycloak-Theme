import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";
import "./theme.css";

import { useReducer, useEffect } from "react";
import { KeycloakProvider } from "../shared/keycloak-ui-shared";
import { environment } from "./environment";
import { i18n } from "./i18n/i18n";
import { Root } from "./root/Root";
import { SessionExpirationWarningOverlay } from "../shared/SessionExpirationWarningOverlay";
import { Spinner } from "./Spinner";

document.title = "Account Management";

const prI18nInitialized = i18n.init();

export default function KcAccountUi() {
  const [isI18nInitialized, setI18nInitialized] = useReducer(() => true, false);

  useEffect(() => {
    prI18nInitialized.then(() => setI18nInitialized());
  }, []);

  if (!isI18nInitialized) {
    return <Spinner />;
  }

  return (
    <KeycloakProvider environment={environment} loadingFallback={<Spinner />}>
      <Root />
      <SessionExpirationWarningOverlay warnUserSecondsBeforeAutoLogout={45} />
    </KeycloakProvider>
  );
}
