import type { SelectOptionProps } from "../../@patternfly/react-core";
import { MenuToggle, Select, SelectList } from "../../@patternfly/react-core";
import { Children, useRef } from "react";
import type { KeycloakSelectProps } from "./KeycloakSelect";
import { propertyToString } from "./KeycloakSelect";

type SingleSelectProps = Omit<KeycloakSelectProps, "variant">;

export const SingleSelect = ({
  toggleId,
  onToggle,
  onSelect,
  selections,
  isOpen,
  menuAppendTo,
  direction,
  width,
  maxHeight,
  toggleIcon,
  className,
  isDisabled,
  children,
  ...props
}: SingleSelectProps) => {
  const ref = useRef<HTMLElement>();
  const toggle = () => {
    onToggle(!isOpen);
  };

  const append = () => {
    if (menuAppendTo === "parent") {
      return ref.current?.parentElement || "inline";
    }
    return "inline";
  };

  const childArray = Children.toArray(
    children,
  ) as React.ReactElement<SelectOptionProps>[];

  return (
    <Select
      ref={ref}
      maxMenuHeight={propertyToString(maxHeight)}
      isScrollable
      popperProps={{
        appendTo: append(),
        direction,
        width: propertyToString(width),
      }}
      {...props}
      onOpenChange={onToggle}
      selected={selections}
      onSelect={(_, value) => {
        onSelect?.(value || "");
        onToggle(false);
      }}
      toggle={(ref) => (
        <MenuToggle
          id={toggleId}
          ref={ref}
          className={className}
          onClick={toggle}
          isExpanded={isOpen}
          aria-label={props["aria-label"]}
          icon={toggleIcon}
          isDisabled={isDisabled}
          isFullWidth
        >
          {childArray.find((c) => c.props.value === selections)?.props
            .children ||
            selections ||
            props["aria-label"]}
        </MenuToggle>
      )}
      isOpen={isOpen}
    >
      <SelectList>{children}</SelectList>
    </Select>
  );
};
