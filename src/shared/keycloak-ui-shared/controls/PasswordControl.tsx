import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  ValidatedOptions,
} from "../../@patternfly/react-core";
import type {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
} from "react-hook-form";
import { useController } from "react-hook-form";
import { getRuleValue } from "../utils/getRuleValue";
import { FormLabel } from "./FormLabel";
import type { PasswordInputProps } from "./PasswordInput";
import { PasswordInput } from "./PasswordInput";

export type PasswordControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> &
  Omit<PasswordInputProps, "name" | "isRequired" | "required"> & {
    label: string;
    labelIcon?: string;
    isDisabled?: boolean;
    helperText?: string;
  };

export const PasswordControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: PasswordControlProps<T, P>,
) => {
  const {
    control,
    defaultValue: providedDefaultValue,
    helperText,
    label,
    labelIcon,
    name,
    rules,
    shouldUnregister,
    ...inputProps
  } = props;
  const required = !!getRuleValue(rules?.required);
  const defaultValue = providedDefaultValue ?? ("" as PathValue<T, P>);

  const { field, fieldState } = useController({
    control,
    defaultValue,
    name,
    rules,
    shouldUnregister,
  });
  const helperId = helperText ? `${name}-description` : undefined;
  const errorId = fieldState.error ? `${name}-error` : undefined;
  const describedBy =
    [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FormLabel
      name={name}
      label={label}
      labelIcon={labelIcon}
      isRequired={required}
      error={fieldState.error}
    >
      <PasswordInput
        isRequired={required}
        id={name}
        data-testid={name}
        validated={
          fieldState.error ? ValidatedOptions.error : ValidatedOptions.default
        }
        aria-describedby={describedBy}
        aria-invalid={fieldState.invalid}
        isDisabled={props.isDisabled}
        {...inputProps}
        {...field}
      />
      {helperText && (
        <FormHelperText id={helperId}>
          <HelperText>
            <HelperTextItem>{helperText}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormLabel>
  );
};
