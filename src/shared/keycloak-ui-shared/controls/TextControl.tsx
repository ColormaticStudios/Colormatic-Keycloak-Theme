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
  const { labelIcon, helperText, ...rest } = props;
  const required = !!getRuleValue(props.rules?.required);
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>);

  const { field, fieldState } = useController({
    ...props,
    defaultValue,
  });

  return (
    <FormLabel
      name={props.name}
      label={props.label}
      labelIcon={labelIcon}
      isRequired={required}
      error={fieldState.error}
    >
      <TextInput
        isRequired={required}
        id={props.name}
        data-testid={props["data-testid"] || props.name}
        validated={
          fieldState.error ? ValidatedOptions.error : ValidatedOptions.default
        }
        isDisabled={props.isDisabled}
        {...rest}
        {...field}
      />
      {helperText && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{helperText}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormLabel>
  );
};
