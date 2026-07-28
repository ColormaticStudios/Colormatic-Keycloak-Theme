import type {
  FieldValues,
  FieldPath,
  UseControllerProps,
  PathValue,
} from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { SwitchProps } from "../../@patternfly/react-core";
import { Switch } from "../../@patternfly/react-core";
import { FormLabel } from "./FormLabel";
import { debeerify } from "../user-profile/utils";
import { getRuleValue } from "../utils/getRuleValue";

export type SwitchControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = Omit<SwitchProps, "name" | "defaultValue" | "ref"> &
  UseControllerProps<T, P> & {
    name: string;
    label?: string;
    labelIcon?: string;
    labelOn: string;
    labelOff: string;
    stringify?: boolean;
  };

export const SwitchControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  control: providedControl,
  label,
  labelOff,
  labelOn,
  name,
  rules,
  shouldUnregister,
  stringify,
  defaultValue,
  labelIcon,
  ...switchProps
}: SwitchControlProps<T, P>) => {
  const fallbackValue = stringify ? "false" : false;
  const defValue = defaultValue ?? (fallbackValue as PathValue<T, P>);
  const { control: contextControl } = useFormContext<T>();
  const control = providedControl ?? contextControl;
  return (
    <FormLabel
      hasNoPaddingTop
      name={name}
      isRequired={Boolean(getRuleValue(rules?.required))}
      label={label}
      labelIcon={labelIcon}
    >
      <Controller
        control={control}
        name={name}
        defaultValue={defValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        render={({ field: { onBlur, onChange, ref, value }, fieldState }) => (
          <Switch
            {...switchProps}
            id={name}
            data-testid={debeerify(name)}
            label={labelOn}
            labelOff={labelOff}
            aria-label={label}
            aria-invalid={fieldState.invalid}
            isChecked={stringify ? value === "true" : value}
            onBlur={onBlur}
            onChange={(e, checked) => {
              const value = stringify ? checked.toString() : checked;
              switchProps.onChange?.(e, checked);
              onChange(value);
            }}
            ref={ref}
          />
        )}
      />
    </FormLabel>
  );
};
