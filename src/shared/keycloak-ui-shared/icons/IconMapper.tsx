import type { BootstrapIconName } from "./BootstrapIcon";
import { BootstrapIcon } from "./BootstrapIcon";

type IconMapperProps = {
  icon: string;
};

const providerIcons: Record<string, BootstrapIconName> = {
  github: "bi-github",
  facebook: "bi-facebook",
  gitlab: "bi-gitlab",
  google: "bi-google",
  linkedin: "bi-linkedin",
  "linkedin-openid-connect": "bi-linkedin",
  "openshift-v4": "bi-box",
  stackoverflow: "bi-stack-overflow",
  twitter: "bi-twitter-x",
  microsoft: "bi-microsoft",
  bitbucket: "bi-box",
  instagram: "bi-instagram",
  paypal: "bi-paypal",
};

export const IconMapper = ({ icon }: IconMapperProps) => (
  <BootstrapIcon
    icon={providerIcons[icon.toLowerCase()] ?? "bi-box"}
    className="cm-identity-provider-icon"
  />
);
