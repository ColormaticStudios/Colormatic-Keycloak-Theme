import {
  KeycloakSpinner,
  ListEmptyState,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import {
  Table,
  TableVariant,
  Tbody,
  Th,
  Thead,
  Tr,
} from "../../shared/@patternfly/react-table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getVerifiableCredentials } from "../api/methods";
import type { UserVerifiableCredentialRepresentation } from "../api/representations";
import { AccountPageSection, Page } from "../components/page/Page";
import { CredentialRow } from "./CredentialRow";

export const VerifiableCredentials = () => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const [credentials, setCredentials] =
    useState<UserVerifiableCredentialRepresentation[]>();
  const [loadError, setLoadError] = useState(false);

  const [key, setKey] = useState(1);
  const refresh = () => setKey((current) => current + 1);

  useEffect(() => {
    const controller = new AbortController();
    setCredentials(undefined);
    setLoadError(false);

    async function fetchCredentials() {
      try {
        const data = await getVerifiableCredentials({
          signal: controller.signal,
          context,
        });
        setCredentials(data);
      } catch {
        if (!controller.signal.aborted) {
          setLoadError(true);
        }
      }
    }

    void fetchCredentials();
    return () => controller.abort();
  }, [key, context]);

  return (
    <Page
      title={t("verifiableCredentials")}
      description={t("verifiableCredentialsDescription")}
    >
      <AccountPageSection title={t("myVerifiableCredentials")}>
        {loadError ? (
          <ListEmptyState
            message={t("somethingWentWrong")}
            instructions={t("somethingWentWrongDescription")}
            primaryActionText={t("tryAgain")}
            onPrimaryAction={refresh}
            icon="bi-exclamation-triangle"
          />
        ) : !credentials ? (
          <KeycloakSpinner />
        ) : credentials.length === 0 ? (
          <ListEmptyState
            message={t("noVerifiableCredentials")}
            hasIcon={false}
          />
        ) : (
          <Table
            id="verifiable-credentials"
            aria-label={t("verifiableCredentials")}
            variant={TableVariant.compact}
          >
            <Thead>
              <Tr>
                <Th>{t("credentialScopeName")}</Th>
                <Th>{t("credentialCreatedDate")}</Th>
                <Th>{t("credentialUpdatedDate")}</Th>
                <Th screenReaderText={t("credentialActions")} />
              </Tr>
            </Thead>
            <Tbody>
              {credentials.map((credential) => (
                <CredentialRow
                  key={credential.credentialScopeName}
                  credential={credential}
                  refresh={refresh}
                />
              ))}
            </Tbody>
          </Table>
        )}
      </AccountPageSection>
    </Page>
  );
};

export default VerifiableCredentials;
