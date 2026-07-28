import {
  Button,
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from "../../shared/@patternfly/react-core";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  BootstrapIcon,
  ListEmptyState,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import type { Environment } from "../environment";
import { getCredentials } from "../api/methods";
import type {
  CredentialContainer,
  CredentialMetadataRepresentation,
} from "../api/representations";
import { EmptyRow } from "../components/datalist/EmptyRow";
import { AccountPageSection, Page } from "../components/page/Page";
import faviconUrl from "../assets/favicon.svg?url";
import type { TFuncKey } from "../i18n-type";
import { formatDate } from "../utils/formatDate";
import { usePromise } from "../utils/usePromise";

const passkeyIconUrls = import.meta.glob<string>("../assets/passkeys/*", {
  eager: true,
  import: "default",
  query: "?url",
});

export const SigningIn = () => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();
  const { login } = context.keycloak;

  const [credentials, setCredentials] = useState<CredentialContainer[]>();

  const getPasskeyIconUrl = (fileName: string) => {
    return passkeyIconUrls[`../assets/passkeys/${fileName}`];
  };

  usePromise(
    (signal) => getCredentials({ signal, context }),
    setCredentials,
    [],
  );

  const credentialRowCells = (
    credMetadata: CredentialMetadataRepresentation,
    showIcon: boolean,
  ) => {
    const credential = credMetadata.credential;
    const icon = credMetadata.iconLight || credMetadata.iconDark;
    const authenticatorProvider = credMetadata.infoProperties?.find(
      (property) => property.key === "webauthn-authenticator-provider",
    )?.parameters?.[0];
    const iconSrc = (icon && getPasskeyIconUrl(icon)) || faviconUrl;
    const iconDarkSrc = credMetadata.iconDark
      ? getPasskeyIconUrl(credMetadata.iconDark)
      : undefined;
    const items = [
      ...(showIcon
        ? [
            <DataListCell
              key="icon"
              data-testrole="icon"
              className="cm-credential-icon"
            >
              <div className="cm-credential-icon__frame">
                {iconDarkSrc && (
                  <img
                    src={iconDarkSrc}
                    alt=""
                    width="40"
                    height="40"
                    className="hidden dark:block"
                  />
                )}
                <img
                  src={iconSrc}
                  alt=""
                  width="40"
                  height="40"
                  className={iconDarkSrc ? "block dark:hidden" : undefined}
                />
              </div>
            </DataListCell>,
          ]
        : []),
      <DataListCell
        key="title"
        id={`credential-${credential.id}-label`}
        data-testrole="label"
        className="cm-credential-label"
      >
        <div>{t(credential.userLabel) || t(credential.type as TFuncKey)}</div>
        {authenticatorProvider && (
          <div className="cm-credential-provider">{authenticatorProvider}</div>
        )}
      </DataListCell>,
    ];

    if (credential.createdDate) {
      items.push(
        <DataListCell
          key={"created" + credential.id}
          data-testrole="created-at"
        >
          <Trans
            i18nKey="credentialCreatedAt"
            values={{
              date: formatDate(
                new Date(credential.createdDate),
                context.environment.locale,
              ),
            }}
          >
            <strong />
          </Trans>
        </DataListCell>,
      );
    }
    if (
      credMetadata.infoMessage ||
      credMetadata.infoProperties ||
      (credMetadata.warningMessageTitle &&
        credMetadata.warningMessageDescription)
    ) {
      items.push(
        <DataListCell
          key={"warning-message" + credential.id}
          data-testrole="warning-message"
        >
          <>
            {credMetadata.infoMessage && (
              <p>
                <BootstrapIcon icon="bi-info-circle" />{" "}
                {t(
                  credMetadata.infoMessage.key,
                  credMetadata.infoMessage.parameters?.reduce(
                    (acc, val, idx) => ({ ...acc, [idx]: val }),
                    {},
                  ),
                )}
              </p>
            )}
            {credMetadata.infoProperties && (
              <Split hasGutter className="cm-credential-details">
                <SplitItem>
                  <BootstrapIcon icon="bi-info-circle" />
                </SplitItem>
                <SplitItem isFilled>
                  <DescriptionList
                    isHorizontal
                    horizontalTermWidthModifier={{
                      "2xl": "15ch",
                    }}
                  >
                    {credMetadata.infoProperties
                      .filter(
                        (property) =>
                          property.key !== "webauthn-authenticator-provider",
                      )
                      .map((property) => (
                        <DescriptionListGroup key={property.key}>
                          <DescriptionListTerm>
                            {t(property.key)}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {property.parameters?.[0] ?? ""}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      ))}
                  </DescriptionList>
                </SplitItem>
              </Split>
            )}
            {credMetadata.warningMessageTitle &&
              credMetadata.warningMessageDescription && (
                <>
                  <p>
                    <BootstrapIcon icon="bi-exclamation-triangle" />{" "}
                    {t(
                      credMetadata.warningMessageTitle.key,
                      credMetadata.warningMessageTitle.parameters?.reduce(
                        (acc, val, idx) => ({ ...acc, [idx]: val }),
                        {},
                      ),
                    )}
                  </p>
                  <p>
                    {t(
                      credMetadata.warningMessageDescription.key,
                      credMetadata.warningMessageDescription.parameters?.reduce(
                        (acc, val, idx) => ({ ...acc, [idx]: val }),
                        {},
                      ),
                    )}
                  </p>
                </>
              )}
          </>
        </DataListCell>,
      );
    }
    return items;
  };

  if (!credentials) {
    return (
      <Page title={t("signingIn")} description={t("signingInDescription")}>
        <Spinner aria-label={t("signingIn")} />
      </Page>
    );
  }

  const credentialUniqueCategories = [
    ...new Set(credentials.map((c) => c.category)),
  ];

  return (
    <Page title={t("signingIn")} description={t("signingInDescription")}>
      {credentialUniqueCategories.length === 0 ? (
        <ListEmptyState
          message={t("notSetUp", { name: t("signingIn") })}
          instructions={t("signingInDescription")}
          hasIcon={false}
        />
      ) : (
        <Stack hasGutter>
          {credentialUniqueCategories.map((category) => (
            <StackItem key={category}>
              <AccountPageSection title={t(category as TFuncKey)}>
                <Stack hasGutter>
                  {credentials
                    .filter((credential) => credential.category === category)
                    .map((container) => {
                      const titleId = `${container.type}-credential-title`;
                      const setupLabel = t("setUpNew", {
                        name: t(`${container.type}-display-name` as TFuncKey),
                      });

                      return (
                        <StackItem key={container.type}>
                          <section aria-labelledby={titleId}>
                            <Flex
                              alignItems={{ default: "alignItemsFlexStart" }}
                              justifyContent={{
                                default: "justifyContentSpaceBetween",
                              }}
                              flexWrap={{ default: "wrap" }}
                              gap={{ default: "gapMd" }}
                              className="cm-credential-method__header"
                            >
                              <FlexItem grow={{ default: "grow" }}>
                                <Title
                                  headingLevel="h3"
                                  size="md"
                                  id={titleId}
                                  className="cred-title cm-credential-method__title"
                                  data-testid={`${container.type}/help`}
                                >
                                  <span data-testid={`${container.type}/title`}>
                                    {t(container.displayName as TFuncKey)}
                                  </span>
                                </Title>
                                <p data-testid={`${container.type}/help-text`}>
                                  {t(container.helptext as TFuncKey)}
                                </p>
                              </FlexItem>
                              {container.createAction && (
                                <FlexItem>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    icon={<BootstrapIcon icon="bi-plus-lg" />}
                                    onClick={() =>
                                      login({
                                        action: container.createAction,
                                      })
                                    }
                                    data-testid={`${container.type}/create`}
                                  >
                                    {setupLabel}
                                  </Button>
                                </FlexItem>
                              )}
                            </Flex>

                            <DataList
                              aria-label={t(container.displayName as TFuncKey)}
                              aria-labelledby={titleId}
                              className="cm-credential-list"
                              data-testid={`${container.type}/credential-list`}
                            >
                              {container.userCredentialMetadatas.length ===
                                0 && (
                                <EmptyRow
                                  message={t("notSetUp", {
                                    name: t(container.displayName as TFuncKey),
                                  })}
                                  data-testid={`${container.type}/not-set-up`}
                                />
                              )}

                              {container.userCredentialMetadatas.map((meta) => (
                                <DataListItem key={meta.credential.id}>
                                  <DataListItemRow
                                    id={`cred-${meta.credential.id}`}
                                  >
                                    <DataListItemCells
                                      className="cm-credential-row"
                                      dataListCells={credentialRowCells(
                                        meta,
                                        container.type.startsWith("webauthn"),
                                      )}
                                    />
                                    {(container.removeable ||
                                      container.updateAction) && (
                                      <DataListAction
                                        id={`action-${meta.credential.id}`}
                                        aria-label={t("updateCredAriaLabel")}
                                        aria-labelledby={`credential-${meta.credential.id}-label`}
                                      >
                                        {container.removeable && (
                                          <Button
                                            type="button"
                                            variant="danger"
                                            data-testrole="remove"
                                            onClick={() =>
                                              login({
                                                action:
                                                  "delete_credential:" +
                                                  meta.credential.id,
                                              })
                                            }
                                          >
                                            {t("delete")}
                                          </Button>
                                        )}
                                        {container.updateAction && (
                                          <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                              login({
                                                action: container.updateAction,
                                              })
                                            }
                                            data-testrole="update"
                                          >
                                            {t("update")}
                                          </Button>
                                        )}
                                      </DataListAction>
                                    )}
                                  </DataListItemRow>
                                </DataListItem>
                              ))}
                            </DataList>
                          </section>
                        </StackItem>
                      );
                    })}
                </Stack>
              </AccountPageSection>
            </StackItem>
          ))}
        </Stack>
      )}
    </Page>
  );
};

export default SigningIn;
