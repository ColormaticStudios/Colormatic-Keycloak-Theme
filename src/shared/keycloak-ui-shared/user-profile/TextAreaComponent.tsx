import { ValidatedOptions } from "../../@patternfly/react-core";
import { get } from "lodash-es";
import { KeycloakTextArea } from "../controls/keycloak-text-area/KeycloakTextArea";
import type { UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, isRequiredAttribute } from "./utils";

export const TextAreaComponent = (props: UserProfileFieldProps) => {
  const { form, attribute } = props;
  const isRequired = isRequiredAttribute(attribute);
  const error = get(form.formState.errors, fieldName(attribute.name));

  return (
    <UserProfileGroup {...props}>
      <KeycloakTextArea
        id={attribute.name}
        data-testid={attribute.name}
        {...form.register(fieldName(attribute.name))}
        cols={attribute.annotations?.["inputTypeCols"] as number}
        rows={attribute.annotations?.["inputTypeRows"] as number}
        readOnly={attribute.readOnly}
        isRequired={isRequired}
        validated={error ? ValidatedOptions.error : ValidatedOptions.default}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${attribute.name}-error` : undefined}
        defaultValue={attribute.defaultValue}
      />
    </UserProfileGroup>
  );
};
