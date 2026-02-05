import type { DropdownProps } from "../../@patternfly/react-core";
import {
  Dropdown,
  DropdownList,
  MenuToggle,
} from "../../@patternfly/react-core";
import { EllipsisVIcon } from "../../@patternfly/react-icons";
import type { ReactNode } from "react";
import { useState } from "react";

type KeycloakDropdownProps = Omit<DropdownProps, "toggle"> & {
  "data-testid"?: string;
  isKebab?: boolean;
  title?: ReactNode;
  dropDownItems: ReactNode[];
};

export const KeycloakDropdown = ({
  isKebab = false,
  title,
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
          data-testid={`${rest["data-testid"]}-toggle`}
          ref={ref}
          onClick={() => setOpen(!open)}
          isExpanded={open}
          variant={isKebab ? "plain" : "default"}
        >
          {isKebab ? <EllipsisVIcon /> : title}
        </MenuToggle>
      )}
      isOpen={open}
    >
      <DropdownList>{dropDownItems}</DropdownList>
    </Dropdown>
  );
};
