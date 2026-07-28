import {
  BootstrapIcon,
  ContinueCancelModal,
  ListEmptyState,
  useEnvironment,
  label,
} from "../../shared/keycloak-ui-shared";
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
  Grid,
  GridItem,
  Label,
  Spinner,
} from "../../shared/@patternfly/react-core";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Environment } from "../environment";
import { deleteSession, getDevices } from "../api/methods";
import type {
  ClientRepresentation,
  DeviceRepresentation,
  SessionRepresentation,
} from "../api/representations";
import { AccountPageSection, Page } from "../components/page/Page";
import { formatDate } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

export const DeviceActivity = () => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();
  const { addAlert, addError } = useAccountAlerts();

  const [devices, setDevices] = useState<DeviceRepresentation[]>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey((currentKey) => currentKey + 1);

  const moveCurrentToTop = (devices: DeviceRepresentation[]) => {
    const orderedDevices = devices
      .map((device) => ({
        ...device,
        sessions: [...device.sessions].sort(
          (left, right) => Number(right.current) - Number(left.current),
        ),
      }))
      .sort((left, right) => Number(right.current) - Number(left.current));

    setDevices(orderedDevices);
  };

  usePromise((signal) => getDevices({ signal, context }), moveCurrentToTop, [
    key,
  ]);

  const signOutAll = async () => {
    await deleteSession(context);
    await context.keycloak.logout();
  };

  const signOutSession = async (
    session: SessionRepresentation,
    device: DeviceRepresentation,
  ) => {
    try {
      await deleteSession(context, session.id);
      addAlert(
        t("signedOutSession", { browser: session.browser, os: device.os }),
      );
      refresh();
    } catch (error) {
      addError("errorSignOutMessage", error);
    }
  };

  const makeClientsString = (clients: ClientRepresentation[]): string => {
    let clientsString = "";
    clients.forEach((client, index) => {
      let clientName: string;
      if (client.clientName !== "") {
        clientName = label(t, client.clientName);
      } else {
        clientName = client.clientId;
      }

      clientsString += clientName;

      if (clients.length > index + 1) clientsString += ", ";
    });

    return clientsString;
  };

  if (!devices) {
    return (
      <Page
        title={t("deviceActivity")}
        description={t("signedInDevicesExplanation")}
      >
        <Spinner aria-label={t("deviceActivity")} />
      </Page>
    );
  }

  const deviceSessions = devices.flatMap((device) =>
    device.sessions.map((session) => ({ device, session })),
  );
  const sessionCount = deviceSessions.length;

  return (
    <Page
      title={t("deviceActivity")}
      description={t("signedInDevicesExplanation")}
    >
      <AccountPageSection
        title={t("signedInDevices")}
        actions={
          <Flex
            alignItems={{ default: "alignItemsCenter" }}
            flexWrap={{ default: "wrap" }}
            gap={{ default: "gapSm" }}
          >
            <FlexItem>
              <Button
                type="button"
                id="refresh-page"
                variant="secondary"
                onClick={refresh}
                icon={<BootstrapIcon icon="bi-arrow-clockwise" />}
              >
                {t("refreshPage")}
              </Button>
            </FlexItem>

            {sessionCount > 1 && (
              <FlexItem>
                <ContinueCancelModal
                  buttonTitle={t("signOutAllDevices")}
                  modalTitle={t("signOutAllDevices")}
                  continueLabel={t("confirm")}
                  cancelLabel={t("cancel")}
                  buttonVariant="secondary"
                  onContinue={signOutAll}
                >
                  {t("signOutAllDevicesWarning")}
                </ContinueCancelModal>
              </FlexItem>
            )}
          </Flex>
        }
      >
        {sessionCount === 0 ? (
          <ListEmptyState
            message={t("signedInDevices")}
            instructions={t("signedInDevicesExplanation")}
            hasIcon={false}
          />
        ) : (
          <DataList
            className="signed-in-device-list"
            aria-label={t("signedInDevices")}
          >
            {deviceSessions.map(({ device, session }, index) => {
              const sessionKey = `${device.id}-${session.id}`;
              const sessionTitleId = `session-${sessionKey}-title`;

              return (
                <DataListItem key={sessionKey} aria-labelledby={sessionTitleId}>
                  <DataListItemRow data-testid={`row-${index}`}>
                    <DataListItemCells
                      dataListCells={[
                        <DataListCell key="details">
                          <Grid hasGutter>
                            <GridItem span={1}>
                              <BootstrapIcon
                                icon={device.mobile ? "bi-phone" : "bi-display"}
                              />
                            </GridItem>
                            <GridItem sm={11} span={10}>
                              <Flex
                                alignItems={{ default: "alignItemsCenter" }}
                                flexWrap={{ default: "wrap" }}
                                gap={{ default: "gapSm" }}
                              >
                                <FlexItem>
                                  <strong
                                    id={sessionTitleId}
                                    className="session-title"
                                  >
                                    {device.os.toLowerCase().includes("unknown")
                                      ? t("unknownOperatingSystem")
                                      : device.os}{" "}
                                    {!device.osVersion
                                      .toLowerCase()
                                      .includes("unknown") &&
                                      device.osVersion}{" "}
                                    / {session.browser}
                                  </strong>
                                </FlexItem>
                                {session.current && (
                                  <FlexItem>
                                    <Label color="green">
                                      {t("currentSession")}
                                    </Label>
                                  </FlexItem>
                                )}
                              </Flex>
                            </GridItem>
                            <GridItem span={11} offset={1}>
                              <DescriptionList
                                className="signed-in-device-grid"
                                columnModifier={{ sm: "2Col", lg: "3Col" }}
                                cols={5}
                                rows={1}
                              >
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    {t("ipAddress")}
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {session.ipAddress}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    {t("lastAccessedOn")}
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {formatDate(
                                      new Date(session.lastAccess * 1000),
                                      context.environment.locale,
                                    )}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    {t("clients")}
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {makeClientsString(session.clients)}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    {t("started")}
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {formatDate(
                                      new Date(session.started * 1000),
                                      context.environment.locale,
                                    )}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    {t("expires")}
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {formatDate(
                                      new Date(session.expires * 1000),
                                      context.environment.locale,
                                    )}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
                            </GridItem>
                          </Grid>
                        </DataListCell>,
                      ]}
                    />
                    {!session.current && (
                      <DataListAction
                        id={`session-${sessionKey}-action`}
                        aria-label={t("signOut")}
                        aria-labelledby={sessionTitleId}
                      >
                        <ContinueCancelModal
                          buttonTitle={t("signOut")}
                          modalTitle={t("signOut")}
                          continueLabel={t("confirm")}
                          cancelLabel={t("cancel")}
                          buttonVariant="secondary"
                          onContinue={() => signOutSession(session, device)}
                        >
                          {t("signOutWarning")}
                        </ContinueCancelModal>
                      </DataListAction>
                    )}
                  </DataListItemRow>
                </DataListItem>
              );
            })}
          </DataList>
        )}
      </AccountPageSection>
    </Page>
  );
};

export default DeviceActivity;
