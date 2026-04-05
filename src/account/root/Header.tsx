import {
  KeycloakMasthead,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Button } from "../../shared/@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "../../shared/@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";

import { getKcContext } from "../KcContext";
import type { Environment } from "../environment";

import style from "./header.module.css";

const ReferrerLink = () => {
  const { environment } = useEnvironment<Environment>();
  const { t } = useTranslation();

  return environment.referrerUrl ? (
    <Button
      data-testid="referrer-link"
      component="a"
      href={environment.referrerUrl.replace("_hash_", "#")}
      variant="link"
      icon={<ExternalLinkSquareAltIcon />}
      iconPosition="right"
      isInline
    >
      {t("backTo", {
        app: label(t, environment.referrerName, environment.referrerUrl),
      })}
    </Button>
  ) : null;
};

export const Header = () => {
  const { environment, keycloak } = useEnvironment<Environment>();
  const { t } = useTranslation();

  const { kcContext } = getKcContext();
  const resourcesPath =
    kcContext.url?.resourcesPath ?? kcContext["x-keycloakify"]?.resourcesPath;
  const normalizedResourcesPath =
    typeof resourcesPath === "string"
      ? resourcesPath.replace(/\/dist\/?$/, "")
      : undefined;

  const stripHtml = (value: string | undefined | null) =>
    typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : value;
  const propertiesDisplayName = stripHtml(
    kcContext.properties?.realmDisplayName ||
      kcContext.properties?.realmDisplayNameHtml,
  );
  const environmentDisplayName = stripHtml(
    environment.realmDisplayName || environment.realmDisplayNameHtml,
  );
  const realmTitle =
    propertiesDisplayName ||
    environmentDisplayName ||
    stripHtml(kcContext.realm?.displayName) ||
    stripHtml(kcContext.realm?.displayNameHtml) ||
    environment.realm ||
    kcContext.realm?.name;
  const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
  const logoSrc =
    normalizedResourcesPath != null
      ? `${normalizedResourcesPath}/dist/colormatic_logo.svg`
      : environment.logo || "/colormatic_logo.svg";
  const internalLogoHref = useHref(logoUrl);

  // User can indicate that he wants an internal URL by starting it with "/"
  const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl;

  return (
    <KeycloakMasthead
      data-testid="page-header"
      keycloak={keycloak}
      features={{ hasManageAccount: false }}
      title={realmTitle}
      brand={{
        href: indexHref,
        src: logoSrc,
        alt: t("logo"),
        className: style.brand,
      }}
      toolbarItems={[<ReferrerLink key="link" />]}
    />
  );
};
