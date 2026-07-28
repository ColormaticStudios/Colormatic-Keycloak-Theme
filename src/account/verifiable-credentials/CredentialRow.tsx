import { BootstrapIcon, useEnvironment } from "../../shared/keycloak-ui-shared";
import {
  Button,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
} from "../../shared/@patternfly/react-core";
import { Td, Tr } from "../../shared/@patternfly/react-table";
import { useState } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { deleteVerifiableCredential } from "../api/methods";
import type { UserVerifiableCredentialRepresentation } from "../api/representations";
import { formatDate, FORMAT_DATE_ONLY } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import type { Environment } from "../environment";
import { UserAttributesDialog } from "./UserAttributesDialog";
import { IssuedCredentialsModal } from "./IssuedCredentialsModal";

type CredentialRowProps = {
  credential: UserVerifiableCredentialRepresentation;
  refresh: () => void;
};

type RevokeDialogProps = {
  isOpen: boolean;
  credentialName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  t: TFunction;
};

const RevokeDialog = ({
  isOpen,
  credentialName,
  onClose,
  onConfirm,
  t,
}: RevokeDialogProps) => {
  if (!isOpen) return null;

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("revokeVerifiableCredentialTitle")}
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          type="button"
          variant="danger"
          onClick={async () => {
            await onConfirm();
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
      {t("deleteCredentialConfirm", {
        credentialName,
      })}
    </Modal>
  );
};

export const CredentialRow = ({ credential, refresh }: CredentialRowProps) => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();
  const { addAlert, addError } = useAccountAlerts();
  const [showAttributesDialog, setShowAttributesDialog] = useState(false);
  const [showIssuedCredentialsModal, setShowIssuedCredentialsModal] =
    useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  const hasUserAttributes =
    credential.userAttributes != null &&
    Object.keys(credential.userAttributes).length > 0;

  const hasManageRole = () => {
    const token = context.keycloak.tokenParsed;
    const accountRoles = token?.resource_access?.["account"]?.roles || [];
    return (
      accountRoles.includes("manage-account") ||
      accountRoles.includes("manage-verifiable-credentials")
    );
  };

  const handleDelete = async () => {
    try {
      await deleteVerifiableCredential(
        context,
        credential.credentialScopeName!,
      );
      addAlert(t("credentialDeletedSuccess"));
      refresh();
    } catch (error) {
      addError("credentialDeleteError", error);
    }
  };

  const handleIssueToWallet = async () => {
    try {
      // Construct the AIA action parameter
      const config = {
        credentialConfigurationId: credential.credentialConfigurationId,
        preAuthorized: false,
      };

      // Base64 encode the config
      const encodedConfig = btoa(JSON.stringify(config));

      // Trigger AIA flow using keycloak.login()
      await context.keycloak.login({
        action: `verifiable_credential_offer:${encodedConfig}`,
      });
    } catch (error) {
      addError("credentialIssuanceError", error);
    }
  };

  return (
    <>
      <RevokeDialog
        isOpen={showRevokeDialog}
        credentialName={credential.credentialScopeName!}
        onClose={() => setShowRevokeDialog(false)}
        onConfirm={handleDelete}
        t={t}
      />
      {showAttributesDialog && hasUserAttributes && (
        <UserAttributesDialog
          credentialScopeName={credential.credentialScopeName!}
          userAttributes={credential.userAttributes!}
          onClose={() => setShowAttributesDialog(false)}
        />
      )}
      {showIssuedCredentialsModal && (
        <IssuedCredentialsModal
          credentialScopeName={credential.credentialScopeName!}
          parentRevision={credential.revision}
          onClose={() => setShowIssuedCredentialsModal(false)}
        />
      )}
      <Tr id={`credential-${credential.credentialScopeName}`}>
        <Td dataLabel={t("credentialScopeName")}>
          {credential.credentialScopeName}
        </Td>
        <Td dataLabel={t("credentialCreatedDate")}>
          {credential.createdDate
            ? formatDate(
                new Date(credential.createdDate),
                context.environment.locale,
                FORMAT_DATE_ONLY,
              )
            : "—"}
        </Td>
        <Td dataLabel={t("credentialUpdatedDate")}>
          {credential.updatedDate
            ? formatDate(
                new Date(credential.updatedDate),
                context.environment.locale,
                FORMAT_DATE_ONLY,
              )
            : "—"}
        </Td>
        <Td dataLabel={t("credentialActions")}>
          <Flex
            role="group"
            spaceItems={{ default: "spaceItemsSm" }}
            aria-label={`${t("credentialActions")}: ${
              credential.credentialScopeName
            }`}
          >
            {hasUserAttributes && (
              <FlexItem>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowAttributesDialog(true)}
                >
                  {t("credentialUserAttributes")}
                </Button>
              </FlexItem>
            )}
            <FlexItem>
              <Button
                type="button"
                id={`credential-${credential.credentialScopeName}-view-issued`}
                variant="link"
                onClick={() => setShowIssuedCredentialsModal(true)}
              >
                {t("viewIssuedCredentials")}
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                type="button"
                id={`credential-${credential.credentialScopeName}-issue`}
                variant="link"
                onClick={handleIssueToWallet}
                icon={<BootstrapIcon icon="bi-box-arrow-up-right" />}
              >
                {t("issueToWallet")}
              </Button>
            </FlexItem>
            {hasManageRole() && (
              <FlexItem>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowRevokeDialog(true)}
                >
                  {t("doRevoke")}
                </Button>
              </FlexItem>
            )}
          </Flex>
        </Td>
      </Tr>
    </>
  );
};
