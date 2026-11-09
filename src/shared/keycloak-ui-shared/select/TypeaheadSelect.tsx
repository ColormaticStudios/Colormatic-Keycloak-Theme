import type { SelectOptionProps } from "../../@patternfly/react-core";
import {
  Button,
  Chip,
  ChipGroup,
  MenuFooter,
  MenuToggle,
  MenuToggleStatus,
  Select,
  SelectList,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "../../@patternfly/react-core";
import { Children, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { KeycloakSelectProps } from "./KeycloakSelect";
import { SelectVariant, propertyToString } from "./KeycloakSelect";
import { BootstrapIcon } from "../icons/BootstrapIcon";

export const TypeaheadSelect = ({
  toggleId,
  onSelect,
  onToggle,
  onFilter,
  onClear,
  variant,
  validated,
  placeholderText,
  maxHeight,
  width,
  toggleIcon,
  direction,
  selections,
  typeAheadAriaLabel,
  inputAriaDescribedBy,
  chipGroupComponent,
  chipGroupProps,
  footer,
  isDisabled,
  children,
  ...rest
}: KeycloakSelectProps) => {
  const { t } = useTranslation();
  const [filterValue, setFilterValue] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(0);
  const textInputRef = useRef<HTMLInputElement>();
  const listboxId = useId();

  const childArray = Children.toArray(
    children,
  ) as React.ReactElement<SelectOptionProps>[];

  // Only filter while the user is actually typing, so that re-opening the menu
  // after a selection still lists every option.
  const visibleChildren =
    onFilter || !isFiltering || !filterValue
      ? childArray
      : childArray.filter((child) => {
          const { children: label, value } = child.props;
          const text = typeof label === "string" ? label : String(value ?? "");
          return text.toLowerCase().includes(filterValue.toLowerCase());
        });
  const getOptionLabel = (value: string | number) => {
    const option = childArray.find((child) => child.props.value === value);
    return option?.props.children ?? value;
  };

  // The single typeahead shows the current selection whenever the user is not
  // editing, but their keystrokes must always win over it while they are.
  const inputValue =
    variant === SelectVariant.typeahead && !isFiltering && selections
      ? String(getOptionLabel(selections as string | number))
      : filterValue;

  const stopFiltering = () => {
    setIsFiltering(false);
    setFilterValue("");
    setFocusedItemIndex(0);
    onFilter?.("");
  };

  const toggle = () => {
    onToggle?.(!rest.isOpen);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedItem = visibleChildren.at(focusedItemIndex);
    onToggle?.(true);

    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        if (!focusedItem) break;

        onSelect?.(focusedItem.props.value);
        onToggle?.(false);
        stopFiltering();

        break;
      }
      case "Escape": {
        event.stopPropagation();
        onToggle?.(false);
        stopFiltering();
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        if (visibleChildren.length === 0) break;

        let indexToFocus = 0;

        if (event.key === "ArrowUp") {
          if (focusedItemIndex === 0) {
            indexToFocus = visibleChildren.length - 1;
          } else {
            indexToFocus = focusedItemIndex - 1;
          }
        }

        if (event.key === "ArrowDown") {
          if (focusedItemIndex === visibleChildren.length - 1) {
            indexToFocus = 0;
          } else {
            indexToFocus = focusedItemIndex + 1;
          }
        }

        setFocusedItemIndex(indexToFocus);
        break;
      }
    }
  };

  return (
    <Select
      {...rest}
      onOpenChange={(isOpen) => {
        onToggle?.(isOpen);
        if (!isOpen) {
          stopFiltering();
        }
      }}
      onSelect={(_, value) => {
        onSelect?.(value || "");
        stopFiltering();
      }}
      maxMenuHeight={propertyToString(maxHeight)}
      popperProps={{ direction, width: propertyToString(width) }}
      toggle={(ref) => (
        <MenuToggle
          ref={ref}
          id={toggleId}
          variant="typeahead"
          onClick={toggle}
          icon={toggleIcon}
          isDisabled={isDisabled}
          isExpanded={rest.isOpen}
          isFullWidth
          status={validated === "error" ? MenuToggleStatus.danger : undefined}
        >
          <TextInputGroup isPlain>
            <TextInputGroupMain
              placeholder={placeholderText}
              value={inputValue}
              onClick={(event) => {
                event.stopPropagation();
                onToggle?.(true);
              }}
              onChange={(_, value) => {
                setIsFiltering(true);
                setFilterValue(value);
                setFocusedItemIndex(0);
                onToggle?.(true);
                onFilter?.(value);
              }}
              onKeyDown={(event) => onInputKeyDown(event)}
              autoComplete="off"
              innerRef={textInputRef}
              role="combobox"
              isExpanded={rest.isOpen}
              aria-controls={listboxId}
              aria-label={typeAheadAriaLabel}
              aria-describedby={inputAriaDescribedBy}
            >
              {variant === SelectVariant.typeaheadMulti &&
                Array.isArray(selections) &&
                (chipGroupComponent ? (
                  chipGroupComponent
                ) : (
                  <ChipGroup {...chipGroupProps}>
                    {selections.map((selection) => (
                      <Chip
                        key={selection}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onSelect?.(selection);
                        }}
                      >
                        {getOptionLabel(selection)}
                      </Chip>
                    ))}
                  </ChipGroup>
                ))}
            </TextInputGroupMain>
            <TextInputGroupUtilities>
              {!!inputValue && (
                <Button
                  variant="plain"
                  onClick={() => {
                    // Consumers that track their own value need to reset it
                    // themselves: onSelect("") stores an empty entry rather
                    // than an empty selection.
                    if (onClear) {
                      onClear();
                    } else {
                      onSelect?.("");
                    }
                    stopFiltering();
                    textInputRef.current?.focus();
                  }}
                  aria-label={t("clearInputValue", "Clear input value")}
                >
                  <BootstrapIcon icon="bi-x-lg" />
                </Button>
              )}
            </TextInputGroupUtilities>
          </TextInputGroup>
        </MenuToggle>
      )}
    >
      <SelectList id={listboxId}>{visibleChildren}</SelectList>
      {footer && <MenuFooter>{footer}</MenuFooter>}
    </Select>
  );
};
