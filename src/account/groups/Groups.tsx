import {
  Checkbox,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "../../shared/@patternfly/react-core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeycloakSpinner,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../shared/@patternfly/react-table";
import { getGroups } from "../api/methods";
import type { Group } from "../api/representations";
import { Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";

const withMissingParents = (groups: Group[]) => {
  const result = [...groups];
  const groupPaths = new Set(groups.map(({ path }) => path));

  for (const group of groups) {
    let parentPath = group.path.slice(0, group.path.lastIndexOf("/"));

    while (parentPath) {
      if (!groupPaths.has(parentPath)) {
        result.push({
          name: parentPath.slice(parentPath.lastIndexOf("/") + 1),
          path: parentPath,
        });
        groupPaths.add(parentPath);
      }
      parentPath = parentPath.slice(0, parentPath.lastIndexOf("/"));
    }
  }

  return result;
};

export const Groups = () => {
  const { t } = useTranslation();
  const context = useEnvironment();

  const [groups, setGroups] = useState<Group[]>();
  const [directMembership, setDirectMembership] = useState(false);

  usePromise(
    (signal) => getGroups({ signal, context }),
    (groups) =>
      setGroups(directMembership ? groups : withMissingParents(groups)),
    [directMembership],
  );

  return (
    <Page title={t("groups")} description={t("groupDescriptionLabel")}>
      <Toolbar aria-label={t("groupsListHeader")}>
        <ToolbarContent>
          <ToolbarItem>
            <Checkbox
              label={t("directMembership")}
              id="directMembership-checkbox"
              data-testid="directMembership-checkbox"
              isChecked={directMembership}
              onChange={(_event, checked) => {
                setGroups(undefined);
                setDirectMembership(checked);
              }}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      {!groups ? (
        <KeycloakSpinner />
      ) : (
        <Table id="groups-list" aria-label={t("groups")}>
          <Thead>
            <Tr>
              <Th>{t("name")}</Th>
              <Th>{t("path")}</Th>
              <Th>{t("directMembership")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {groups.length === 0 ? (
              <Tr>
                <Td colSpan={3}>{t("noGroupsText")}</Td>
              </Tr>
            ) : (
              groups.map((group, index) => (
                <Tr key={group.path}>
                  <Td
                    dataLabel={t("name")}
                    data-testid={`group[${index}].name`}
                  >
                    {group.name}
                  </Td>
                  <Td dataLabel={t("path")}>{group.path}</Td>
                  <Td dataLabel={t("directMembership")}>
                    <Checkbox
                      id={`${index}-checkbox-directMembership`}
                      aria-label={`${group.name}: ${t("directMembership")}`}
                      isChecked={group.id != null}
                      isDisabled
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      )}
    </Page>
  );
};

export default Groups;
