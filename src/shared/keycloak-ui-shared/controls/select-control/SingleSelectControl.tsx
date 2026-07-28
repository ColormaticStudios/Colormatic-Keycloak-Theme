import {
  MenuToggle,
  MenuToggleStatus,
  Select,
  SelectList,
  SelectOption,
} from "../../../@patternfly/react-core";
import { get } from "lodash-es";
import { useMemo, useState } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import { getRuleValue } from "../../utils/getRuleValue";
import { FormLabel } from "../FormLabel";
import type { SelectControlProps } from "./SelectControl";
import { isSelectBasedOptions, isString, key } from "./SelectControl";

export const SingleSelectControl = <
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
  isDisabled,
  isFullWidth = true,
  onSelect,
  ...rest
}: SelectControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const [open, setOpen] = useState(false);
  const required = getRuleValue(controller.rules?.required) === true;
  const allOptions = useMemo(
    () =>
      [...options, ...selectedOptions].filter(
        (option, index, all) =>
          all.findIndex((candidate) => key(candidate) === key(option)) ===
          index,
      ),
    [options, selectedOptions],
  );

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
        render={({ field: { onBlur, onChange, value } }) => (
          <Select
            {...rest}
            variant="default"
            onOpenChange={setOpen}
            selected={
              isSelectBasedOptions(options)
                ? options
                    .filter((o) =>
                      Array.isArray(value)
                        ? value.includes(o.key)
                        : value === o.key,
                    )
                    .map((o) => o.value)
                : value
            }
            toggle={(ref) => {
              const selectedValue = Array.isArray(value) ? value[0] : value;
              const selectedOption = allOptions.find(
                (option) => key(option) === selectedValue,
              );
              const selectedLabel =
                selectedOption && !isString(selectedOption)
                  ? selectedOption.value
                  : selectedValue;

              return (
                <MenuToggle
                  id={id || name}
                  ref={ref}
                  onClick={() => setOpen(!open)}
                  isExpanded={open}
                  isFullWidth={isFullWidth}
                  status={
                    get(errors, name) ? MenuToggleStatus.danger : undefined
                  }
                  aria-label={label}
                  aria-describedby={
                    get(errors, name) ? `${name}-error` : undefined
                  }
                  aria-invalid={Boolean(get(errors, name))}
                  isDisabled={isDisabled}
                  onBlur={onBlur}
                >
                  {selectedLabel}
                </MenuToggle>
              );
            }}
            onSelect={(_event, v) => {
              const option = v?.toString();
              if (option === undefined) {
                return;
              }
              const convertedValue = Array.isArray(value) ? [option] : option;
              if (onSelect) {
                onSelect(convertedValue, onChange);
              } else {
                onChange(convertedValue);
              }
              setOpen(false);
            }}
            isOpen={open}
          >
            <SelectList data-testid={`select-${name}`}>
              {allOptions.map((option) => (
                <SelectOption
                  key={key(option)}
                  value={key(option)}
                  description={
                    !isString(option) && "description" in option
                      ? option.description
                      : undefined
                  }
                >
                  {isString(option) ? option : option.value}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
        )}
      />
    </FormLabel>
  );
};
