import type { TextInputTypes } from "../../@patternfly/react-core";
import { TextInput, ValidatedOptions } from "../../@patternfly/react-core";
import { get } from "lodash-es";

import type { UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, isRequiredAttribute, label } from "./utils";

export const TextComponent = (props: UserProfileFieldProps) => {
  const { form, inputType, attribute } = props;
  const isRequired = isRequiredAttribute(attribute);
  const error = get(form.formState.errors, fieldName(attribute.name));
  const type = inputType.startsWith("html")
    ? (inputType.substring("html".length + 2) as TextInputTypes)
    : "text";

  return (
    <UserProfileGroup {...props}>
      <TextInput
        id={attribute.name}
        data-testid={attribute.name}
        type={type}
        placeholder={
          attribute.readOnly
            ? ""
            : label(
                props.t,
                attribute.annotations?.["inputTypePlaceholder"] as string,
                "",
                attribute.annotations?.[
                  "inputOptionLabelsI18nPrefix"
                ] as string,
              )
        }
        isDisabled={attribute.readOnly}
        isRequired={isRequired}
        validated={error ? ValidatedOptions.error : ValidatedOptions.default}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${attribute.name}-error` : undefined}
        defaultValue={attribute.defaultValue}
        {...form.register(fieldName(attribute.name))}
      />
    </UserProfileGroup>
  );
};
