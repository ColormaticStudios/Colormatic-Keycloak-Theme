import {
  BootstrapIcon,
  ContinueCancelModal,
  KeycloakSpinner,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import {
  Button,
  Chip,
  ChipGroup,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  OverflowMenu,
  OverflowMenuContent,
  OverflowMenuControl,
  OverflowMenuDropdownItem,
  OverflowMenuGroup,
  OverflowMenuItem,
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

import { fetchPermission, fetchResources, updatePermissions } from "../api";
import { getPermissionRequests } from "../api/methods";
import type { Links } from "../api/parse-links";
import type { Permission, Resource } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";
import { EditTheResource } from "./EditTheResource";
import { PermissionRequest } from "./PermissionRequest";
import { ResourceToolbar } from "./ResourceToolbar";
import { ShareTheResource } from "./ShareTheResource";
import { SharedWith } from "./SharedWith";

type PermissionDetail = {
  desktopMenuOpen?: boolean;
  mobileMenuOpen?: boolean;
  rowOpen?: boolean;
  shareDialogOpen?: boolean;
  editDialogOpen?: boolean;
  permissions?: Permission[];
};

type ResourcesTabProps = {
  isShared?: boolean;
};

export const ResourcesTab = ({ isShared = false }: ResourcesTabProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [params, setParams] = useState<Record<string, string>>({
    first: "0",
    max: "5",
  });
  const [links, setLinks] = useState<Links | undefined>();
  const [resources, setResources] = useState<Resource[]>();
  const [details, setDetails] = useState<
    Record<string, PermissionDetail | undefined>
  >({});
  const [key, setKey] = useState(1);
  const refresh = () => setKey((current) => current + 1);

  usePromise(
    async (signal) => {
      const result = await fetchResources(
        { signal, context },
        params,
        isShared,
      );
      if (!isShared)
        await Promise.all(
          result.data.map(
            async (r) =>
              (r.shareRequests = await getPermissionRequests(r._id, {
                signal,
                context,
              })),
          ),
        );
      return result;
    },
    ({ data, links }) => {
      setResources(data);
      setLinks(links);
    },
    [params, key, isShared],
  );

  if (!resources) {
    return <KeycloakSpinner />;
  }

  const fetchPermissions = async (id: string) => {
    let permissions = details[id]?.permissions;
    if (permissions === undefined) {
      permissions = await fetchPermission({ context }, id);
    }
    return permissions;
  };

  const removeShare = async (resource: Resource) => {
    try {
      const permissions = (await fetchPermissions(resource._id)).map(
        ({ username }) =>
          ({
            username,
            scopes: [],
          }) as Permission,
      )!;
      await updatePermissions(context, resource._id, permissions);
      setDetails({});
      addAlert(t("unShareSuccess"));
      refresh();
    } catch (error) {
      addError("unShareError", error);
    }
  };

  const setDetailOpen = async (
    id: string,
    field: keyof PermissionDetail,
    open: boolean,
    loadPermissions = false,
  ) => {
    try {
      const permissions =
        open && loadPermissions ? await fetchPermissions(id) : undefined;

      setDetails((current) => ({
        ...current,
        [id]: {
          ...current[id],
          [field]: open,
          ...(permissions === undefined ? {} : { permissions }),
        },
      }));
    } catch (error) {
      addError("somethingWentWrongDescription", error);
    }
  };

  return (
    <>
      <ResourceToolbar
        onFilter={(name) =>
          setParams((current) => ({ ...current, first: "0", name }))
        }
        count={resources.length}
        first={parseInt(params["first"])}
        max={parseInt(params["max"])}
        onNextClick={() =>
          setParams((current) => ({ ...current, ...links?.next }))
        }
        onPreviousClick={() =>
          setParams((current) => ({ ...current, ...links?.prev }))
        }
        onPerPageSelect={(first, max) =>
          setParams((current) => ({
            ...current,
            first: `${first}`,
            max: `${max}`,
          }))
        }
        hasNext={!!links?.next}
      />
      <Table aria-label={t("resources")}>
        <Thead>
          <Tr>
            {!isShared && <Th screenReaderText={t("resources")} />}
            <Th>{t("resourceName")}</Th>
            <Th>{t("application")}</Th>
            <Th>{isShared ? t("permissions") : t("permissionRequests")}</Th>
            {!isShared && <Th screenReaderText={t("actions")} />}
          </Tr>
        </Thead>
        {resources.length === 0 && (
          <Tbody>
            <Tr>
              <Td colSpan={isShared ? 3 : 5}>{t("resourceIntroMessage")}</Td>
            </Tr>
          </Tbody>
        )}
        {resources.map((resource, index) => (
          <Tbody key={resource._id} isExpanded={details[resource._id]?.rowOpen}>
            <Tr>
              {!isShared && (
                <Td
                  data-testid={`expand-${resource.name}`}
                  expand={{
                    isExpanded: details[resource._id]?.rowOpen || false,
                    rowIndex: index,
                    expandId: `resource-${resource._id}`,
                    onToggle: () =>
                      void setDetailOpen(
                        resource._id,
                        "rowOpen",
                        !details[resource._id]?.rowOpen,
                        true,
                      ),
                  }}
                />
              )}
              <Td
                dataLabel={t("resourceName")}
                data-testid={`row[${index}].name`}
              >
                {resource.name}
              </Td>
              <Td dataLabel={t("application")}>
                {resource.client.baseUrl ? (
                  <Button
                    component="a"
                    variant="link"
                    isInline
                    href={resource.client.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<BootstrapIcon icon="bi-box-arrow-up-right" />}
                    iconPosition="right"
                  >
                    {resource.client.name || resource.client.clientId}
                  </Button>
                ) : (
                  resource.client.name || resource.client.clientId
                )}
              </Td>
              <Td
                dataLabel={
                  isShared ? t("permissions") : t("permissionRequests")
                }
              >
                {isShared ? (
                  resource.scopes.length > 0 && (
                    <ChipGroup categoryName={t("permissions")}>
                      {resource.scopes.map((scope) => (
                        <Chip key={scope.name} isReadOnly>
                          {scope.displayName || scope.name}
                        </Chip>
                      ))}
                    </ChipGroup>
                  )
                ) : (
                  <>
                    {resource.shareRequests &&
                      resource.shareRequests.length > 0 && (
                        <PermissionRequest
                          resource={resource}
                          refresh={refresh}
                        />
                      )}
                    <ShareTheResource
                      resource={resource}
                      permissions={details[resource._id]?.permissions}
                      open={details[resource._id]?.shareDialogOpen || false}
                      onClose={() => setDetails({})}
                    />
                    {details[resource._id]?.editDialogOpen && (
                      <EditTheResource
                        resource={resource}
                        permissions={details[resource._id]?.permissions}
                        onClose={() => setDetails({})}
                      />
                    )}
                  </>
                )}
              </Td>
              {!isShared && (
                <Td isActionCell dataLabel={t("actions")}>
                  <OverflowMenu breakpoint="lg">
                    <OverflowMenuContent>
                      <OverflowMenuGroup groupType="button">
                        <OverflowMenuItem>
                          <Button
                            data-testid={`share-${resource.name}`}
                            variant="link"
                            onClick={() =>
                              void setDetailOpen(
                                resource._id,
                                "shareDialogOpen",
                                true,
                                true,
                              )
                            }
                          >
                            <BootstrapIcon icon="bi-share" /> {t("share")}
                          </Button>
                        </OverflowMenuItem>
                        <OverflowMenuItem>
                          <Dropdown
                            popperProps={{
                              position: "right",
                            }}
                            onOpenChange={(isOpen) => {
                              if (!isOpen) {
                                void setDetailOpen(
                                  resource._id,
                                  "desktopMenuOpen",
                                  false,
                                );
                              }
                            }}
                            toggle={(ref) => (
                              <MenuToggle
                                variant="plain"
                                ref={ref}
                                aria-label={t("actions")}
                                onClick={() =>
                                  void setDetailOpen(
                                    resource._id,
                                    "desktopMenuOpen",
                                    !details[resource._id]?.desktopMenuOpen,
                                    true,
                                  )
                                }
                                isExpanded={
                                  details[resource._id]?.desktopMenuOpen
                                }
                              >
                                <BootstrapIcon icon="bi-three-dots-vertical" />
                              </MenuToggle>
                            )}
                            isOpen={!!details[resource._id]?.desktopMenuOpen}
                          >
                            <DropdownList>
                              <DropdownItem
                                isDisabled={
                                  details[resource._id]?.permissions?.length ===
                                  0
                                }
                                onClick={() =>
                                  void setDetailOpen(
                                    resource._id,
                                    "editDialogOpen",
                                    true,
                                    true,
                                  )
                                }
                              >
                                <BootstrapIcon icon="bi-pencil" /> {t("edit")}
                              </DropdownItem>
                              <ContinueCancelModal
                                buttonTitle={
                                  <>
                                    <BootstrapIcon icon="bi-x-circle" />{" "}
                                    {t("unShare")}
                                  </>
                                }
                                modalTitle={t("unShare")}
                                continueLabel={t("confirm")}
                                cancelLabel={t("cancel")}
                                component={DropdownItem}
                                onContinue={() => removeShare(resource)}
                                isDisabled={
                                  details[resource._id]?.permissions?.length ===
                                  0
                                }
                              >
                                {t("unShareAllConfirm")}
                              </ContinueCancelModal>
                            </DropdownList>
                          </Dropdown>
                        </OverflowMenuItem>
                      </OverflowMenuGroup>
                    </OverflowMenuContent>
                    <OverflowMenuControl>
                      <Dropdown
                        popperProps={{
                          position: "right",
                        }}
                        onOpenChange={(isOpen) => {
                          if (!isOpen) {
                            void setDetailOpen(
                              resource._id,
                              "mobileMenuOpen",
                              false,
                            );
                          }
                        }}
                        toggle={(ref) => (
                          <MenuToggle
                            variant="plain"
                            ref={ref}
                            aria-label={t("actions")}
                            isExpanded={details[resource._id]?.mobileMenuOpen}
                            onClick={() =>
                              void setDetailOpen(
                                resource._id,
                                "mobileMenuOpen",
                                !details[resource._id]?.mobileMenuOpen,
                                true,
                              )
                            }
                          >
                            <BootstrapIcon icon="bi-three-dots-vertical" />
                          </MenuToggle>
                        )}
                        isOpen={!!details[resource._id]?.mobileMenuOpen}
                      >
                        <DropdownList>
                          <OverflowMenuDropdownItem
                            key="share"
                            isShared
                            onClick={() =>
                              void setDetailOpen(
                                resource._id,
                                "shareDialogOpen",
                                true,
                                true,
                              )
                            }
                          >
                            <BootstrapIcon icon="bi-share" /> {t("share")}
                          </OverflowMenuDropdownItem>
                          <OverflowMenuDropdownItem
                            key="edit"
                            isShared
                            onClick={() =>
                              void setDetailOpen(
                                resource._id,
                                "editDialogOpen",
                                true,
                                true,
                              )
                            }
                            isDisabled={
                              details[resource._id]?.permissions?.length === 0
                            }
                          >
                            <BootstrapIcon icon="bi-pencil" /> {t("edit")}
                          </OverflowMenuDropdownItem>
                          <ContinueCancelModal
                            key="unShare"
                            buttonTitle={
                              <>
                                <BootstrapIcon icon="bi-x-circle" />{" "}
                                {t("unShare")}
                              </>
                            }
                            modalTitle={t("unShare")}
                            continueLabel={t("confirm")}
                            cancelLabel={t("cancel")}
                            component={OverflowMenuDropdownItem}
                            onContinue={() => removeShare(resource)}
                            isDisabled={
                              details[resource._id]?.permissions?.length === 0
                            }
                          >
                            {t("unShareAllConfirm")}
                          </ContinueCancelModal>
                        </DropdownList>
                      </Dropdown>
                    </OverflowMenuControl>
                  </OverflowMenu>
                </Td>
              )}
            </Tr>
            {!isShared && (
              <Tr isExpanded={details[resource._id]?.rowOpen || false}>
                <Td />
                <Td colSpan={4}>
                  <ExpandableRowContent>
                    <SharedWith
                      permissions={details[resource._id]?.permissions}
                    />
                  </ExpandableRowContent>
                </Td>
              </Tr>
            )}
          </Tbody>
        ))}
      </Table>
    </>
  );
};
