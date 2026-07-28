import type { UserProfileAttributeMetadata } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import {
  FormGroup,
  InputGroup,
  InputGroupItem,
} from "../../@patternfly/react-core";
import type { TFunction } from "i18next";
import { get } from "lodash-es";
import type { PropsWithChildren, ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { type FieldError } from "react-hook-form";

import { FormErrorText } from "../controls/FormErrorText";
import { HelpItem } from "../controls/HelpItem";
import type { UserFormFields } from "./utils";
import { fieldName, isRequiredAttribute, label, labelAttribute } from "./utils";

export type UserProfileGroupProps = {
  t: TFunction;
  form: UseFormReturn<UserFormFields>;
  attribute: UserProfileAttributeMetadata;
  renderer?: (attribute: UserProfileAttributeMetadata) => ReactNode;
};

export const UserProfileGroup = ({
  t,
  form,
  attribute,
  renderer,
  children,
}: PropsWithChildren<UserProfileGroupProps>) => {
  const helpText = label(
    t,
    attribute.annotations?.["inputHelperTextBefore"] as string,
  );
  const {
    formState: { errors },
  } = form;

  const component = renderer?.(attribute);
  const error = get(errors, fieldName(attribute.name)) as FieldError;

  return (
    <FormGroup
      key={attribute.name}
      label={labelAttribute(t, attribute) || ""}
      fieldId={attribute.name}
      isRequired={isRequiredAttribute(attribute)}
      labelIcon={
        helpText ? (
          <HelpItem helpText={helpText} fieldLabelId={attribute.name!} />
        ) : undefined
      }
    >
      {component ? (
        <InputGroup>
          <InputGroupItem isFill>{children}</InputGroupItem>
          <InputGroupItem>{component}</InputGroupItem>
        </InputGroup>
      ) : (
        children
      )}
      {error && (
        <FormErrorText
          id={`${attribute.name}-error`}
          data-testid={`${attribute.name}-helper`}
          message={error.message as string}
        />
      )}
    </FormGroup>
  );
};
