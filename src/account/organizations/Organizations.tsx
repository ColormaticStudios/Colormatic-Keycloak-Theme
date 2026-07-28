import type OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import {
  ErrorBoundaryFallback,
  ErrorBoundaryProvider,
  KeycloakSpinner,
  ListEmptyState,
  OrganizationTable,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import type { FallbackProps } from "../../shared/keycloak-ui-shared";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserOrganizations } from "../api/methods";
import { Page } from "../components/page/Page";
import type { Environment } from "../environment";
import { usePromise } from "../utils/usePromise";

const OrganizationsError = ({ error }: FallbackProps) => {
  const { t } = useTranslation();

  return (
    <ListEmptyState
      message={t("somethingWentWrong")}
      instructions={error.message || t("somethingWentWrongDescription")}
      primaryActionText={t("tryAgain")}
      onPrimaryAction={() => window.location.reload()}
      icon="bi-exclamation-triangle"
    />
  );
};

export const Organizations = () => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();

  const [userOrgs, setUserOrgs] = useState<OrganizationRepresentation[]>();

  usePromise(
    (signal) => getUserOrganizations({ signal, context }),
    setUserOrgs,
  );

  return (
    <Page title={t("organizations")} description={t("organizationDescription")}>
      {!userOrgs ? (
        <KeycloakSpinner />
      ) : (
        <ErrorBoundaryProvider>
          <ErrorBoundaryFallback fallback={OrganizationsError}>
            <OrganizationTable
              link={({ children }) => <span>{children}</span>}
              loader={userOrgs}
            >
              <ListEmptyState
                message={t("emptyUserOrganizations")}
                instructions={t("emptyUserOrganizationsInstructions")}
                hasIcon={false}
              />
            </OrganizationTable>
          </ErrorBoundaryFallback>
        </ErrorBoundaryProvider>
      )}
    </Page>
  );
};

export default Organizations;
