import type { TextAreaProps } from "../../@patternfly/react-core";
import { TextArea, ValidatedOptions } from "../../@patternfly/react-core";
import type {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
} from "react-hook-form";
import { useController } from "react-hook-form";

import { getRuleValue } from "../utils/getRuleValue";
import { FormLabel } from "./FormLabel";

export type TextAreaControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> &
  TextAreaProps & {
    label: string;
    labelIcon?: string;
    isDisabled?: boolean;
  };

export const TextAreaControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: TextAreaControlProps<T, P>,
) => {
  const {
    control,
    defaultValue: providedDefaultValue,
    label,
    labelIcon,
    name,
    rules,
    shouldUnregister,
    ...textAreaProps
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

  return (
    <FormLabel
      isRequired={required}
      label={label}
      labelIcon={labelIcon}
      name={name}
      error={fieldState.error}
    >
      <TextArea
        isRequired={required}
        id={name}
        data-testid={name}
        validated={
          fieldState.error ? ValidatedOptions.error : ValidatedOptions.default
        }
        aria-describedby={fieldState.error ? `${name}-error` : undefined}
        aria-invalid={fieldState.invalid}
        isDisabled={props.isDisabled}
        {...textAreaProps}
        {...field}
      />
    </FormLabel>
  );
};
