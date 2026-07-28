import type { TextInputProps } from "../../@patternfly/react-core";
import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  ValidatedOptions,
} from "../../@patternfly/react-core";
import type { ReactNode } from "react";
import type {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
} from "react-hook-form";
import { useController } from "react-hook-form";
import { getRuleValue } from "../utils/getRuleValue";
import { FormLabel } from "./FormLabel";

export type TextControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> &
  Omit<TextInputProps, "name" | "isRequired" | "required"> & {
    label: string;
    labelIcon?: string | ReactNode;
    isDisabled?: boolean;
    helperText?: string;
    "data-testid"?: string;
    type?: string;
  };

export const TextControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: TextControlProps<T, P>,
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
  const required = !!getRuleValue(props.rules?.required);
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
      <TextInput
        isRequired={required}
        id={name}
        data-testid={props["data-testid"] || name}
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
