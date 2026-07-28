import {
  Button,
  Chip,
  ChipGroup,
  MenuToggle,
  MenuToggleStatus,
  Select,
  SelectList,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "../../../@patternfly/react-core";
import { get } from "lodash-es";
import { useId, useMemo, useRef, useState } from "react";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getRuleValue } from "../../utils/getRuleValue";
import { FormLabel } from "../FormLabel";
import { BootstrapIcon } from "../../icons/BootstrapIcon";
import type {
  OptionType,
  SelectControlOption,
  SelectControlProps,
} from "./SelectControl";
import {
  SelectVariant,
  isSelectBasedOptions,
  isString,
  key,
} from "./SelectControl";

const getValue = (option: SelectControlOption | string) =>
  isString(option) ? option : option.value;

export const TypeaheadSelectControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  id,
  name,
  label,
  options,
  selectedOptions = [],
  controller,
  labelIcon,
  placeholderText,
  onFilter,
  variant,
  isFullWidth = true,
  ...rest
}: SelectControlProps<T, P>) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const [open, setOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(0);
  const [selectedOptionsState, setSelectedOptions] = useState<
    SelectControlOption[]
  >([]);
  const textInputRef = useRef<HTMLInputElement>();
  const listboxId = useId();
  const required = getRuleValue(controller.rules?.required) === true;
  const isTypeaheadMulti = variant === SelectVariant.typeaheadMulti;

  const combinedOptions = useMemo(
    () =>
      [
        ...options.filter(
          (o) => !selectedOptions.map((o) => getValue(o)).includes(getValue(o)),
        ),
        ...selectedOptions,
      ] as OptionType,
    [selectedOptions, options],
  );

  const filteredOptions = combinedOptions.filter((option) =>
    getValue(option).toLowerCase().startsWith(filterValue.toLowerCase()),
  );

  const updateValue = (
    option: string,
    value: unknown,
    onChange: (value: string[]) => void,
  ) => {
    const values = Array.isArray(value) ? value : [];
    if (values.includes(option)) {
      onChange(values.filter((item: string) => item !== option));
      if (isSelectBasedOptions(options)) {
        setSelectedOptions(
          selectedOptionsState.filter((item) => item.key !== option),
        );
      }
    } else {
      onChange([...values, option]);
      if (isSelectBasedOptions(combinedOptions)) {
        setSelectedOptions([
          ...selectedOptionsState,
          combinedOptions.find((o) => o.key === option)!,
        ]);
      }
    }
  };

  const onInputKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    field: ControllerRenderProps<T, P>,
  ) => {
    const focusedItem = filteredOptions[focusedItemIndex];
    setOpen(true);

    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        if (!focusedItem) break;

        if (!isTypeaheadMulti) {
          setFilterValue(getValue(focusedItem));
        } else {
          setFilterValue("");
        }

        if (isTypeaheadMulti) {
          updateValue(key(focusedItem), field.value, field.onChange);
        } else {
          field.onChange(key(focusedItem));
        }

        setOpen(false);
        setFocusedItemIndex(0);

        break;
      }
      case "Tab":
      case "Escape": {
        setOpen(false);
        break;
      }
      case "Backspace": {
        if (variant === SelectVariant.typeahead) {
          field.onChange("");
        }
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        if (filteredOptions.length === 0) break;

        let indexToFocus = 0;

        if (event.key === "ArrowUp") {
          if (focusedItemIndex === 0) {
            indexToFocus = filteredOptions.length - 1;
          } else {
            indexToFocus = focusedItemIndex - 1;
          }
        }

        if (event.key === "ArrowDown") {
          if (focusedItemIndex === filteredOptions.length - 1) {
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
    <FormLabel
      id={id}
      name={name}
      label={label}
      isRequired={required}
      error={get(errors, name)}
      labelIcon={labelIcon}
    >
      <Controller
        {...controller}
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...rest}
            onOpenChange={setOpen}
            selected={
              isSelectBasedOptions(combinedOptions)
                ? combinedOptions
                    .filter((o) =>
                      Array.isArray(field.value)
                        ? field.value.includes(o.key)
                        : field.value === o.key,
                    )
                    .map((o) => o.value)
                : field.value
            }
            shouldFocusFirstItemOnOpen={false}
            toggle={(ref) => (
              <MenuToggle
                ref={ref}
                id={id || name}
                variant="typeahead"
                onClick={() => {
                  setOpen(!open);
                  textInputRef.current?.focus();
                }}
                isExpanded={open}
                isFullWidth={isFullWidth}
                status={get(errors, name) ? MenuToggleStatus.danger : undefined}
                aria-label={label}
                aria-describedby={
                  get(errors, name) ? `${name}-error` : undefined
                }
                aria-invalid={Boolean(get(errors, name))}
                isDisabled={rest.isDisabled}
              >
                <TextInputGroup isPlain>
                  <TextInputGroupMain
                    placeholder={placeholderText}
                    value={
                      variant === SelectVariant.typeahead && field.value
                        ? isSelectBasedOptions(combinedOptions)
                          ? combinedOptions.find(
                              (o) =>
                                o.key ===
                                (Array.isArray(field.value)
                                  ? field.value[0]
                                  : field.value),
                            )?.value
                          : field.value
                        : filterValue
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpen(true);
                    }}
                    onChange={(_, value) => {
                      setFilterValue(value);
                      setOpen(true);
                      onFilter?.(value);
                    }}
                    onKeyDown={(event) => onInputKeyDown(event, field)}
                    autoComplete="off"
                    innerRef={textInputRef}
                    role="combobox"
                    isExpanded={open}
                    aria-controls={listboxId}
                    aria-label={label}
                  >
                    {variant === SelectVariant.typeaheadMulti &&
                      Array.isArray(field.value) && (
                        <ChipGroup
                          aria-label={t(
                            "currentSelections",
                            "Current selections",
                          )}
                        >
                          {field.value.map((selection: string) => (
                            <Chip
                              key={selection}
                              onClick={(ev) => {
                                ev.stopPropagation();
                                field.onChange(
                                  field.value.filter(
                                    (item: string) => item !== key(selection),
                                  ),
                                );
                              }}
                            >
                              {isSelectBasedOptions(combinedOptions)
                                ? [
                                    ...combinedOptions,
                                    ...selectedOptionsState,
                                  ].find((o) => selection === o.key)?.value
                                : getValue(selection)}
                            </Chip>
                          ))}
                        </ChipGroup>
                      )}
                  </TextInputGroupMain>
                  <TextInputGroupUtilities>
                    {(!!filterValue || field.value) && (
                      <Button
                        variant="plain"
                        onClick={() => {
                          setFilterValue("");
                          field.onChange(isTypeaheadMulti ? [] : "");
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
            onSelect={(event, v) => {
              event?.stopPropagation();
              const option = v?.toString();
              if (isTypeaheadMulti && Array.isArray(field.value)) {
                setFilterValue("");
                updateValue(option || "", field.value, field.onChange);
              } else {
                field.onChange(option);
                setOpen(false);
              }
            }}
            isOpen={open}
          >
            <SelectList id={listboxId}>
              {filteredOptions.map((option, index) => (
                <SelectOption
                  key={key(option)}
                  value={key(option)}
                  isFocused={focusedItemIndex === index}
                  isActive={
                    Array.isArray(field.value) &&
                    field.value.includes(key(option))
                  }
                  description={
                    !isString(option) && "description" in option
                      ? option.description
                      : undefined
                  }
                >
                  {getValue(option)}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
        )}
      />
    </FormLabel>
  );
};
