import {
  BootstrapIcon,
  useEnvironment,
  KeycloakDataTable,
  ListEmptyState,
  ErrorBoundaryFallback,
  ErrorBoundaryProvider,
  label,
} from "../../shared/keycloak-ui-shared";
import type { Action, FallbackProps } from "../../shared/keycloak-ui-shared";
import {
  Button,
  Modal,
  ModalVariant,
} from "../../shared/@patternfly/react-core";
import { cellWidth } from "../../shared/@patternfly/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getIssuedVerifiableCredentials,
  revokeIssuedVerifiableCredential,
} from "../api/methods";
import type { IssuedUserVerifiableCredentialRepresentation } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import type { Environment } from "../environment";
import { formatDate } from "../utils/formatDate";

type IssuedCredentialsModalProps = {
  credentialScopeName: string;
  parentRevision?: string;
  onClose: () => void;
};

type RevokeDialogProps = {
  isOpen: boolean;
  credential: IssuedUserVerifiableCredentialRepresentation | undefined;
  onClose: () => void;
  onConfirm: (credentialId: string) => Promise<void>;
  t: (key: string) => string;
};

const IssuedCredentialsError = ({ error }: FallbackProps) => {
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

const RevokeDialog = ({
  isOpen,
  credential,
  onClose,
  onConfirm,
  t,
}: RevokeDialogProps) => {
  if (!isOpen || !credential) return null;

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("revokeIssuedCredentialTitle")}
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          type="button"
          variant="danger"
          onClick={async () => {
            await onConfirm(credential.id!);
            onClose();
          }}
        >
          {t("doRevoke")}
        </Button>,
        <Button
          key="cancel"
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          {t("doCancel")}
        </Button>,
      ]}
    >
      {t("deleteIssuedCredentialConfirm")}
    </Modal>
  );
};

export const IssuedCredentialsModal = ({
  credentialScopeName,
  onClose,
}: IssuedCredentialsModalProps) => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();
  const { addAlert, addError } = useAccountAlerts();
  const [selectedCredential, setSelectedCredential] =
    useState<IssuedUserVerifiableCredentialRepresentation>();
  const [key, setKey] = useState(0);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  const refresh = () => setKey((prev) => prev + 1);

  const toggleRevokeDialog = () => setShowRevokeDialog(!showRevokeDialog);

  const hasManageRole = () => {
    const token = context.keycloak.tokenParsed;
    const accountRoles = token?.resource_access?.["account"]?.roles || [];
    return (
      accountRoles.includes("manage-account") ||
      accountRoles.includes("manage-verifiable-credentials")
    );
  };

  const loader = async (first?: number, max?: number, search?: string) => {
    const data = await getIssuedVerifiableCredentials({
      signal: new AbortController().signal,
      context,
    });

    // Filter by credential type
    let filtered = data.filter(
      (ic) => ic.credentialType === credentialScopeName,
    );

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (ic) =>
          ic.id?.toLowerCase().includes(searchLower) ||
          ic.clientId?.toLowerCase().includes(searchLower) ||
          ic.clientName?.toLowerCase().includes(searchLower) ||
          ic.revision?.toLowerCase().includes(searchLower),
      );
    }

    // Apply pagination if provided
    if (first !== undefined && max !== undefined) {
      return filtered.slice(first, first + max);
    }

    return filtered;
  };

  const handleRevoke = async (credentialId: string) => {
    try {
      await revokeIssuedVerifiableCredential(context, credentialId);
      addAlert(t("issuedCredentialRevokeSuccess"));
      refresh();
    } catch (error) {
      addError(t("issuedCredentialRevokeError"), error);
    }
  };

  return (
    <>
      <RevokeDialog
        isOpen={showRevokeDialog}
        credential={selectedCredential}
        onClose={toggleRevokeDialog}
        onConfirm={handleRevoke}
        t={t}
      />
      <Modal
        variant={ModalVariant.large}
        title={`${t("issuedCredentials")}: ${credentialScopeName}`}
        isOpen={true}
        onClose={onClose}
        width="90%"
      >
        <ErrorBoundaryProvider>
          <ErrorBoundaryFallback fallback={IssuedCredentialsError}>
            <KeycloakDataTable
              loader={loader}
              key={key}
              ariaLabelKey="issuedCredentials"
              searchPlaceholderKey=" "
              columns={[
                {
                  name: "issuedAt",
                  displayKey: t("issuedCredentialsIssuedAt"),
                  cellRenderer: ({ issuedAt }) =>
                    issuedAt
                      ? formatDate(
                          new Date(issuedAt),
                          context.environment.locale,
                        )
                      : "—",
                  transforms: [cellWidth(25)],
                },
                {
                  name: "expiresAt",
                  displayKey: t("issuedCredentialsExpiresAt"),
                  cellRenderer: ({ expiresAt }) => {
                    if (!expiresAt) return "—";
                    const expirationDate = new Date(expiresAt);
                    const isExpired = expirationDate < new Date();
                    return (
                      <span
                        className={
                          isExpired
                            ? "cm-expiration cm-expiration--expired"
                            : "cm-expiration"
                        }
                      >
                        {isExpired && (
                          <BootstrapIcon
                            icon="bi-exclamation-triangle"
                            className="cm-expiration__icon"
                          />
                        )}
                        {formatDate(expirationDate, context.environment.locale)}
                      </span>
                    );
                  },
                  transforms: [cellWidth(25)],
                },
                {
                  name: "clientId",
                  displayKey: t("issuedCredentialsWalletClient"),
                  cellRenderer: (
                    credential: IssuedUserVerifiableCredentialRepresentation,
                  ) => {
                    // Backend now provides clientName and clientBaseUrl
                    const displayName =
                      credential.clientName || credential.clientId;
                    if (!displayName) return "—";

                    // If client has a base URL, create a clickable link
                    if (credential.clientBaseUrl) {
                      return (
                        <Button
                          component="a"
                          variant="link"
                          href={credential.clientBaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          icon={<BootstrapIcon icon="bi-box-arrow-up-right" />}
                          iconPosition="right"
                        >
                          {label(t, displayName)}
                        </Button>
                      );
                    }

                    // No base URL, just display the name/clientId
                    return <>{label(t, displayName)}</>;
                  },
                  transforms: [cellWidth(35)],
                },
              ]}
              actions={
                hasManageRole()
                  ? [
                      {
                        title: t("doRevoke"),
                        onRowClick: (credential) => {
                          setSelectedCredential(credential);
                          toggleRevokeDialog();
                        },
                      } as Action<IssuedUserVerifiableCredentialRepresentation>,
                    ]
                  : []
              }
              emptyState={
                <ListEmptyState message={t("noIssuedCredentials")} hasIcon />
              }
            />
          </ErrorBoundaryFallback>
        </ErrorBoundaryProvider>
      </Modal>
    </>
  );
};
