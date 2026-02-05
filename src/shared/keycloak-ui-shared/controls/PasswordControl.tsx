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
  const { labelIcon, ...rest } = props;
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
      <PasswordInput
        isRequired={required}
        id={props.name}
        data-testid={props.name}
        validated={
          fieldState.error ? ValidatedOptions.error : ValidatedOptions.default
        }
        isDisabled={props.isDisabled}
        {...rest}
        {...field}
      />
      {props.helperText && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{props.helperText}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormLabel>
  );
};
