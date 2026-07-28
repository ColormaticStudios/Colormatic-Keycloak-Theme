import type { DropdownProps } from "../../@patternfly/react-core";
import {
  Dropdown,
  DropdownList,
  MenuToggle,
} from "../../@patternfly/react-core";
import type { ReactNode } from "react";
import { useState } from "react";
import { BootstrapIcon } from "../icons/BootstrapIcon";

type KeycloakDropdownProps = Omit<DropdownProps, "toggle"> & {
  "data-testid"?: string;
  isKebab?: boolean;
  title?: ReactNode;
  toggleAriaLabel?: string;
  dropDownItems: ReactNode[];
};

export const KeycloakDropdown = ({
  isKebab = false,
  title,
  toggleAriaLabel,
  dropDownItems,
  ...rest
}: KeycloakDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      {...rest}
      popperProps={{
        position: "right",
      }}
      onOpenChange={(isOpen) => setOpen(isOpen)}
      toggle={(ref) => (
        <MenuToggle
          className="cm-masthead-menu-toggle"
          data-testid={`${rest["data-testid"]}-toggle`}
          ref={ref}
          onClick={() => setOpen(!open)}
          isExpanded={open}
          variant={isKebab ? "plain" : "default"}
          aria-label={toggleAriaLabel}
        >
          {isKebab ? <BootstrapIcon icon="bi-three-dots-vertical" /> : title}
        </MenuToggle>
      )}
      isOpen={open}
    >
      <DropdownList>{dropDownItems}</DropdownList>
    </Dropdown>
  );
};
