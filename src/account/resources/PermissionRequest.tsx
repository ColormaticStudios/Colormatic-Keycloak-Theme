import { BootstrapIcon, useEnvironment } from "../../shared/keycloak-ui-shared";
import {
  ActionList,
  ActionListItem,
  Badge,
  Button,
  Chip,
  ChipGroup,
  Modal,
  ModalVariant,
  Text,
} from "../../shared/@patternfly/react-core";
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../shared/@patternfly/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchPermission, updateRequest } from "../api";
import type { Permission, Resource } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";

type PermissionRequestProps = {
  resource: Resource;
  refresh: () => void;
};

const scopeName = (scope: Permission["scopes"][number]) =>
  typeof scope === "string" ? scope : scope.name;

export const PermissionRequest = ({
  resource,
  refresh,
}: PermissionRequestProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const approveDeny = async (
    shareRequest: Permission,
    approve: boolean = false,
  ) => {
    try {
      const permissions = await fetchPermission({ context }, resource._id);
      const { scopes, username } = permissions.find(
        (p) => p.username === shareRequest.username,
      ) || { scopes: [], username: shareRequest.username };

      await updateRequest(
        context,
        resource._id,
        username,
        approve
          ? [
              ...new Set([
                ...scopes.map(scopeName),
                ...shareRequest.scopes.map(scopeName),
              ]),
            ]
          : scopes.map(scopeName),
      );
      addAlert(t("shareSuccess"));
      toggle();
      refresh();
    } catch (error) {
      addError("shareError", error);
    }
  };

  return (
    <>
      <Button
        variant="plain"
        aria-label={t("permissionRequests")}
        title={t("permissionRequests")}
        onClick={toggle}
      >
        <BootstrapIcon
          icon="bi-person-check"
          className="cm-account-permission-request-icon"
        />
        <Badge>{resource.shareRequests?.length}</Badge>
      </Button>
      <Modal
        title={t("permissionRequest", { name: resource.name })}
        variant={ModalVariant.large}
        isOpen={open}
        onClose={toggle}
        actions={[
          <Button key="close" variant="link" onClick={toggle}>
            {t("close")}
          </Button>,
        ]}
      >
        <Table aria-label={t("resources")}>
          <Thead>
            <Tr>
              <Th>{t("requestor")}</Th>
              <Th>{t("permissionRequests")}</Th>
              <Th screenReaderText={t("actions")} />
            </Tr>
          </Thead>
          <Tbody>
            {resource.shareRequests?.map((shareRequest) => (
              <Tr key={shareRequest.username}>
                <Td>
                  <strong>
                    {[shareRequest.firstName, shareRequest.lastName]
                      .filter(Boolean)
                      .join(" ") || shareRequest.username}
                  </strong>
                  <br aria-hidden="true" />
                  <Text component="small">{shareRequest.email}</Text>
                </Td>
                <Td>
                  <ChipGroup>
                    {shareRequest.scopes.map((scope) => {
                      const displayName =
                        typeof scope === "string"
                          ? scope
                          : (scope.displayName ?? scope.name);

                      return (
                        <Chip key={scopeName(scope)} isReadOnly>
                          {displayName}
                        </Chip>
                      );
                    })}
                  </ChipGroup>
                </Td>
                <Td dataLabel={t("actions")}>
                  <ActionList>
                    <ActionListItem>
                      <Button
                        type="button"
                        onClick={() => {
                          void approveDeny(shareRequest, true);
                        }}
                      >
                        {t("accept")}
                      </Button>
                    </ActionListItem>
                    <ActionListItem>
                      <Button
                        type="button"
                        onClick={() => {
                          void approveDeny(shareRequest);
                        }}
                        variant="danger"
                      >
                        {t("deny")}
                      </Button>
                    </ActionListItem>
                  </ActionList>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Modal>
    </>
  );
};
