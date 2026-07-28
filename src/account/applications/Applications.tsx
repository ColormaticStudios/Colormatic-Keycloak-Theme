import {
  BootstrapIcon,
  ContinueCancelModal,
  KeycloakSpinner,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
} from "../../shared/@patternfly/react-core";
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../shared/@patternfly/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Environment } from "../environment";
import { deleteConsent, getApplications } from "../api/methods";
import type { ClientRepresentation } from "../api/representations";
import { Page } from "../components/page/Page";
import type { TFuncKey } from "../i18n-type";
import { formatDate } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

type Application = ClientRepresentation & {
  open: boolean;
};

export const Applications = () => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();
  const { addAlert, addError } = useAccountAlerts();

  const [applications, setApplications] = useState<Application[]>();
  const [key, setKey] = useState(1);
  const refresh = () => setKey((current) => current + 1);

  usePromise(
    (signal) => getApplications({ signal, context }),
    (clients) => setApplications(clients.map((c) => ({ ...c, open: false }))),
    [key],
  );

  const toggleOpen = (clientId: string) => {
    setApplications((current) =>
      current?.map((a) =>
        a.clientId === clientId ? { ...a, open: !a.open } : a,
      ),
    );
  };

  const removeConsent = async (id: string) => {
    try {
      await deleteConsent(context, id);
      refresh();
      addAlert(t("removeConsentSuccess"));
    } catch (error) {
      addError("removeConsentError", error);
    }
  };

  return (
    <Page title={t("applications")} description={t("applicationsIntroMessage")}>
      {!applications ? (
        <KeycloakSpinner />
      ) : (
        <Table id="applications-list" aria-label={t("applications")}>
          <Thead>
            <Tr>
              <Th screenReaderText={t("application")} />
              <Th>{t("name")}</Th>
              <Th>{t("applicationType")}</Th>
              <Th>{t("status")}</Th>
            </Tr>
          </Thead>
          {applications.length === 0 ? (
            <Tbody>
              <Tr>
                <Td colSpan={4}>{t("applicationsIntroMessage")}</Td>
              </Tr>
            </Tbody>
          ) : (
            applications.map((application, index) => (
              <Tbody
                key={application.clientId}
                isExpanded={application.open}
                data-testid="applications-list-item"
              >
                <Tr>
                  <Td
                    expand={{
                      isExpanded: application.open,
                      rowIndex: index,
                      onToggle: () => toggleOpen(application.clientId),
                      expandId: `application-${application.clientId}`,
                    }}
                  />
                  <Td dataLabel={t("name")}>
                    {application.effectiveUrl && (
                      <Button
                        component="a"
                        variant="link"
                        href={application.effectiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label(
                          t,
                          application.clientName || application.clientId,
                        )}{" "}
                        <BootstrapIcon icon="bi-box-arrow-up-right" />
                      </Button>
                    )}
                    {!application.effectiveUrl && (
                      <span className="cm-account-application-name">
                        {label(
                          t,
                          application.clientName || application.clientId,
                        )}
                      </span>
                    )}
                  </Td>
                  <Td dataLabel={t("applicationType")}>
                    {application.userConsentRequired
                      ? t("thirdPartyApp")
                      : t("internalApp")}
                    {application.offlineAccess ? ", " + t("offlineAccess") : ""}
                  </Td>
                  <Td dataLabel={t("status")}>
                    {application.inUse ? t("inUse") : t("notInUse")}
                  </Td>
                </Tr>
                <Tr isExpanded={application.open}>
                  <Td />
                  <Td
                    colSpan={3}
                    id={`content-${application.clientId}`}
                    aria-label={t("applicationDetails", {
                      clientId: application.clientId,
                    })}
                  >
                    <ExpandableRowContent>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("client")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {application.clientId}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        {application.description && (
                          <DescriptionListGroup>
                            <DescriptionListTerm>
                              {t("description")}
                            </DescriptionListTerm>
                            <DescriptionListDescription>
                              {application.description}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        )}
                        {application.effectiveUrl && (
                          <DescriptionListGroup>
                            <DescriptionListTerm>URL</DescriptionListTerm>
                            <DescriptionListDescription>
                              <Button
                                component="a"
                                variant="link"
                                isInline
                                href={application.effectiveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={
                                  <BootstrapIcon icon="bi-box-arrow-up-right" />
                                }
                                iconPosition="right"
                              >
                                {application.effectiveUrl}
                              </Button>
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        )}
                        {application.consent && (
                          <>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                {t("hasAccessTo")}
                              </DescriptionListTerm>
                              {application.consent.grantedScopes.map(
                                (scope) => (
                                  <DescriptionListDescription
                                    key={`scope${scope.id}`}
                                  >
                                    <BootstrapIcon icon="bi-check" />{" "}
                                    {t(
                                      scope.name as TFuncKey,
                                      scope.displayText,
                                    )}
                                  </DescriptionListDescription>
                                ),
                              )}
                            </DescriptionListGroup>
                            {application.tosUri && (
                              <DescriptionListGroup>
                                <DescriptionListTerm>
                                  {t("termsOfService")}
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Button
                                    component="a"
                                    variant="link"
                                    isInline
                                    href={application.tosUri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    icon={
                                      <BootstrapIcon icon="bi-box-arrow-up-right" />
                                    }
                                    iconPosition="right"
                                  >
                                    {application.tosUri}
                                  </Button>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            )}
                            {application.policyUri && (
                              <DescriptionListGroup>
                                <DescriptionListTerm>
                                  {t("privacyPolicy")}
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Button
                                    component="a"
                                    variant="link"
                                    isInline
                                    href={application.policyUri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    icon={
                                      <BootstrapIcon icon="bi-box-arrow-up-right" />
                                    }
                                    iconPosition="right"
                                  >
                                    {application.policyUri}
                                  </Button>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            )}
                            {application.logoUri && (
                              <DescriptionListGroup>
                                <DescriptionListTerm>
                                  {t("logo")}
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  <img
                                    src={application.logoUri}
                                    alt={label(
                                      t,
                                      application.clientName ||
                                        application.clientId,
                                    )}
                                  />
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            )}
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                {t("accessGrantedOn")}
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                {formatDate(
                                  new Date(application.consent.createdDate),
                                  context.environment.locale,
                                )}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </>
                        )}
                      </DescriptionList>
                      {(application.consent || application.offlineAccess) && (
                        <>
                          <Divider className="cm-account-application-details-divider" />
                          <div className="cm-account-application-actions">
                            <ContinueCancelModal
                              buttonTitle={t("removeAccess")}
                              modalTitle={t("removeAccess")}
                              continueLabel={t("confirm")}
                              cancelLabel={t("cancel")}
                              buttonVariant="secondary"
                              onContinue={() =>
                                removeConsent(application.clientId)
                              }
                            >
                              {t("removeModalMessage", {
                                name: application.clientId,
                              })}
                            </ContinueCancelModal>
                            <p>
                              <BootstrapIcon icon="bi-info-circle" />{" "}
                              {t("infoMessage")}
                            </p>
                          </div>
                        </>
                      )}
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              </Tbody>
            ))
          )}
        </Table>
      )}
    </Page>
  );
};

export default Applications;
