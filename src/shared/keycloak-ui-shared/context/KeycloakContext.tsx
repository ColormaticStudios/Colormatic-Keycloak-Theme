/* eslint-disable */

// @ts-nocheck

import { Spinner } from "../../@patternfly/react-core";
import { Keycloak } from "oidc-spa/keycloak-js";
import {
  type ReactNode,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertProvider } from "../alerts/Alerts";
import { ErrorPage } from "./ErrorPage";
import { Help } from "./HelpContext";
import { BaseEnvironment } from "./environment";

export type KeycloakContext<T extends BaseEnvironment = BaseEnvironment> =
  KeycloakContextProps<T> & {
    keycloak: Keycloak;
  };

const createKeycloakEnvContext = <T extends BaseEnvironment>() =>
  createContext<KeycloakContext<T> | undefined>(undefined);

let KeycloakEnvContext: any;

export const useEnvironment = <
  T extends BaseEnvironment = BaseEnvironment,
>() => {
  const context = useContext<KeycloakContext<T>>(KeycloakEnvContext);
  if (!context)
    throw Error(
      "no environment provider in the hierarchy make sure to add the provider",
    );
  return context;
};

interface KeycloakContextProps<T extends BaseEnvironment> {
  environment: T;
  loadingFallback?: ReactNode;
}

export const KeycloakProvider = <T extends BaseEnvironment>({
  environment,
  loadingFallback,
  children,
}: PropsWithChildren<KeycloakContextProps<T>>) => {
  KeycloakEnvContext = createKeycloakEnvContext<T>();
  const calledOnce = useRef(false);
  const [init, setInit] = useState(false);
  const [error, setError] = useState<unknown>();
  const keycloak = useMemo(() => {
    if (import.meta.env.DEV) {
      return {
        init: async () => true,
        updateToken: async () => true,
        login: async () => undefined,
        logout: async () => undefined,
        accountManagement: async () => undefined,
        oidc: {
          isUserLoggedIn: true,
          subscribeToAutoLogoutCountdown: () => ({
            unsubscribeFromAutoLogoutCountdown: () => undefined,
          }),
        },
        token: "dev-token",
        idTokenParsed: {
          preferred_username: "dev-user",
          name: "Dev User",
          email: "dev@example.com",
        },
      } as unknown as Keycloak;
    }

    return new Keycloak({
      url: environment.serverBaseUrl,
      realm: environment.realm,
      clientId: environment.clientId,
    });
  }, [environment]);

  useEffect(() => {
    // only needed in dev mode
    if (calledOnce.current) {
      return;
    }

    if (import.meta.env.DEV) {
      setInit(true);
      calledOnce.current = true;
      return;
    }

    const init = () =>
      keycloak.init({
        onLoad: "login-required",
        pkceMethod: "S256",

        scope: environment.scope,
      });

    init()
      .then(() => setInit(true))
      .catch((error) => setError(error));

    calledOnce.current = true;
  }, [keycloak]);

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (!init) {
    return loadingFallback ?? <Spinner />;
  }

  return (
    <KeycloakEnvContext.Provider value={{ environment, keycloak }}>
      <AlertProvider>
        <Help>{children}</Help>
      </AlertProvider>
    </KeycloakEnvContext.Provider>
  );
};
