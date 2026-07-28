import { useEnvironment } from "../../shared/keycloak-ui-shared";
import {
  DataList,
  Spinner,
  Stack,
  StackItem,
} from "../../shared/@patternfly/react-core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { LinkedAccountQueryParams } from "../api/methods";
import { getLinkedAccounts } from "../api/methods";
import type { LinkedAccountRepresentation } from "../api/representations";
import { EmptyRow } from "../components/datalist/EmptyRow";
import { AccountPageSection, Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";
import { AccountRow } from "./AccountRow";
import { LinkedAccountsToolbar } from "./LinkedAccountsToolbar";

export const LinkedAccounts = () => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const [linkedAccounts, setLinkedAccounts] = useState<
    LinkedAccountRepresentation[] | undefined
  >();
  const [unlinkedAccounts, setUninkedAccounts] = useState<
    LinkedAccountRepresentation[] | undefined
  >();

  const [paramsUnlinked, setParamsUnlinked] =
    useState<LinkedAccountQueryParams>({
      first: 0,
      max: 6,
      linked: false,
    });
  const [paramsLinked, setParamsLinked] = useState<LinkedAccountQueryParams>({
    first: 0,
    max: 6,
    linked: true,
  });
  const [key, setKey] = useState(1);
  const refresh = () => setKey((currentKey) => currentKey + 1);

  usePromise(
    (signal) => getLinkedAccounts({ signal, context }, paramsUnlinked),
    setUninkedAccounts,
    [paramsUnlinked, key],
  );

  usePromise(
    (signal) => getLinkedAccounts({ signal, context }, paramsLinked),
    setLinkedAccounts,
    [paramsLinked, key],
  );

  if (!linkedAccounts || !unlinkedAccounts) {
    return (
      <Page
        title={t("linkedAccounts")}
        description={t("linkedAccountsIntroMessage")}
      >
        <Spinner aria-label={t("linkedAccounts")} />
      </Page>
    );
  }

  return (
    <Page
      title={t("linkedAccounts")}
      description={t("linkedAccountsIntroMessage")}
    >
      <Stack hasGutter>
        <StackItem>
          <AccountPageSection title={t("linkedLoginProviders")}>
            <LinkedAccountsToolbar
              id="linked-idps"
              ariaLabel={t("linkedLoginProviders")}
              onFilter={(search) =>
                setParamsLinked((currentParams) => ({
                  ...currentParams,
                  first: 0,
                  search,
                }))
              }
              count={Math.min(linkedAccounts.length, paramsLinked.max - 1)}
              first={paramsLinked.first}
              max={paramsLinked.max - 1}
              onNextClick={() => {
                setParamsLinked((currentParams) => ({
                  ...currentParams,
                  first: currentParams.first + currentParams.max - 1,
                }));
              }}
              onPreviousClick={() =>
                setParamsLinked((currentParams) => ({
                  ...currentParams,
                  first: Math.max(
                    0,
                    currentParams.first - currentParams.max + 1,
                  ),
                }))
              }
              onPerPageSelect={(first, pageSize) =>
                setParamsLinked((currentParams) => ({
                  ...currentParams,
                  first,
                  max: pageSize + 1,
                }))
              }
              hasNext={linkedAccounts.length > paramsLinked.max - 1}
            />
            <DataList id="linked-idps" aria-label={t("linkedLoginProviders")}>
              {linkedAccounts.length > 0 ? (
                linkedAccounts
                  .slice(0, paramsLinked.max - 1)
                  .map((account) => (
                    <AccountRow
                      key={account.providerName}
                      account={account}
                      isLinked
                      refresh={refresh}
                    />
                  ))
              ) : (
                <EmptyRow message={t("linkedEmpty")} />
              )}
            </DataList>
          </AccountPageSection>
        </StackItem>
        <StackItem>
          <AccountPageSection title={t("unlinkedLoginProviders")}>
            <LinkedAccountsToolbar
              id="unlinked-idps"
              ariaLabel={t("unlinkedLoginProviders")}
              onFilter={(search) =>
                setParamsUnlinked((currentParams) => ({
                  ...currentParams,
                  first: 0,
                  search,
                }))
              }
              count={Math.min(unlinkedAccounts.length, paramsUnlinked.max - 1)}
              first={paramsUnlinked.first}
              max={paramsUnlinked.max - 1}
              onNextClick={() => {
                setParamsUnlinked((currentParams) => ({
                  ...currentParams,
                  first: currentParams.first + currentParams.max - 1,
                }));
              }}
              onPreviousClick={() =>
                setParamsUnlinked((currentParams) => ({
                  ...currentParams,
                  first: Math.max(
                    0,
                    currentParams.first - currentParams.max + 1,
                  ),
                }))
              }
              onPerPageSelect={(first, pageSize) =>
                setParamsUnlinked((currentParams) => ({
                  ...currentParams,
                  first,
                  max: pageSize + 1,
                }))
              }
              hasNext={unlinkedAccounts.length > paramsUnlinked.max - 1}
            />
            <DataList
              id="unlinked-idps"
              aria-label={t("unlinkedLoginProviders")}
            >
              {unlinkedAccounts.length > 0 ? (
                unlinkedAccounts
                  .slice(0, paramsUnlinked.max - 1)
                  .map((account) => (
                    <AccountRow
                      key={account.providerName}
                      account={account}
                      refresh={refresh}
                    />
                  ))
              ) : (
                <EmptyRow message={t("unlinkedEmpty")} />
              )}
            </DataList>
          </AccountPageSection>
        </StackItem>
      </Stack>
    </Page>
  );
};

export default LinkedAccounts;
