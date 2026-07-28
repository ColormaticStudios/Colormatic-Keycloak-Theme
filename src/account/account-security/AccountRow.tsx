import {
  BootstrapIcon,
  IconMapper,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import {
  Button,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Label,
} from "../../shared/@patternfly/react-core";
import { useTranslation } from "react-i18next";

import { unLinkAccount } from "../api/methods";
import type { LinkedAccountRepresentation } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";

type AccountRowProps = {
  account: LinkedAccountRepresentation;
  isLinked?: boolean;
  refresh: () => void;
};

export const AccountRow = ({
  account,
  isLinked = false,
  refresh,
}: AccountRowProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { login } = context.keycloak;
  const { addAlert, addError } = useAccountAlerts();
  const providerNameId = `${account.providerAlias}-idp-name`;

  const unLink = async (account: LinkedAccountRepresentation) => {
    try {
      await unLinkAccount(context, account);
      addAlert(t("unLinkSuccess"));
      refresh();
    } catch (error) {
      addError("unLinkError", error);
    }
  };

  return (
    <DataListItem
      id={`${account.providerAlias}-idp`}
      key={account.providerName}
      aria-labelledby={providerNameId}
    >
      <DataListItemRow
        key={account.providerName}
        data-testid={`linked-accounts/${account.providerName}`}
      >
        <DataListItemCells
          dataListCells={[
            <DataListCell key="idp">
              <Flex
                alignItems={{ default: "alignItemsCenter" }}
                gap={{ default: "gapSm" }}
              >
                <FlexItem>
                  <IconMapper icon={account.providerName} />
                </FlexItem>
                <FlexItem grow={{ default: "grow" }}>
                  <strong id={providerNameId}>
                    {label(t, account.displayName)}
                  </strong>
                </FlexItem>
              </Flex>
            </DataListCell>,
            <DataListCell key="label">
              <Label
                id={`${account.providerAlias}-idp-label`}
                color={account.social ? "blue" : "green"}
              >
                {t(account.social ? "socialLogin" : "systemDefined")}
              </Label>
            </DataListCell>,
            <DataListCell key="username" width={5}>
              <span id={`${account.providerAlias}-idp-username`}>
                {account.linkedUsername}
              </span>
            </DataListCell>,
          ]}
        />
        <DataListAction
          aria-label={t(isLinked ? "unLink" : "link")}
          aria-labelledby={providerNameId}
          id={`${account.providerAlias}-idp-action`}
        >
          {isLinked && (
            <Button
              type="button"
              id={`${account.providerAlias}-idp-unlink`}
              variant="secondary"
              icon={<BootstrapIcon icon="bi-link-45deg" />}
              onClick={() => unLink(account)}
            >
              {t("unLink")}
            </Button>
          )}
          {!isLinked && (
            <Button
              type="button"
              id={`${account.providerAlias}-idp-link`}
              variant="secondary"
              icon={<BootstrapIcon icon="bi-link" />}
              onClick={() => {
                void login({
                  action: "idp_link:" + account.providerAlias,
                });
              }}
            >
              {t("link")}
            </Button>
          )}
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
};
