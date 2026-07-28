import type {
  TextInputProps,
  TextInputTypes,
} from "../../@patternfly/react-core";
import {
  Button,
  ButtonVariant,
  InputGroup,
  TextInput,
  InputGroupItem,
} from "../../@patternfly/react-core";
import { type TFunction } from "i18next";
import { get } from "lodash-es";
import { Fragment, useEffect, useId, useMemo, useRef } from "react";
import type { FieldPath, UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

import type { InputType, UserProfileFieldProps } from "./UserProfileFields";
import { BootstrapIcon } from "../icons/BootstrapIcon";
import { UserProfileGroup } from "./UserProfileGroup";
import type { UserFormFields } from "./utils";
import { fieldName, labelAttribute } from "./utils";

export const MultiInputComponent = ({
  t,
  form,
  attribute,
  renderer,
  ...rest
}: UserProfileFieldProps) => (
  <UserProfileGroup t={t} form={form} attribute={attribute} renderer={renderer}>
    <MultiLineInput
      t={t}
      form={form}
      aria-label={labelAttribute(t, attribute)}
      aria-describedby={`${attribute.name}-error`}
      name={fieldName(attribute.name)!}
      defaultValue={[attribute.defaultValue || ""]}
      addButtonLabel={t("addMultivaluedLabel", {
        fieldLabel: labelAttribute(t, attribute),
      })}
      isDisabled={attribute.readOnly}
      {...rest}
    />
  </UserProfileGroup>
);

export type MultiLineInputProps = Omit<TextInputProps, "form"> & {
  t: TFunction;
  name: FieldPath<UserFormFields>;
  form: UseFormReturn<UserFormFields>;
  addButtonLabel?: string;
  isDisabled?: boolean;
  defaultValue?: string[];
  inputType: InputType;
};

const MultiLineInput = ({
  t,
  name,
  inputType,
  form,
  addButtonLabel,
  isDisabled = false,
  defaultValue,
  id,
  ...rest
}: MultiLineInputProps) => {
  const { register, setValue, control } = form;
  const fieldIdPrefix = useId();
  const nextFieldId = useRef(0);
  const fieldIds = useRef<string[]>([]);
  const error = get(form.formState.errors, name);
  const value = useWatch({
    name,
    control,
    defaultValue: defaultValue || "",
  });

  const fields = useMemo<string[]>(() => {
    return Array.isArray(value) && value.length !== 0
      ? value
      : defaultValue || [""];
  }, [value]);
  while (fieldIds.current.length < fields.length) {
    fieldIds.current.push(`${fieldIdPrefix}-${nextFieldId.current++}`);
  }
  fieldIds.current.length = fields.length;

  const remove = (index: number) => {
    fieldIds.current.splice(index, 1);
    update([...fields.slice(0, index), ...fields.slice(index + 1)]);
  };

  const append = () => {
    fieldIds.current.push(`${fieldIdPrefix}-${nextFieldId.current++}`);
    update([...fields, ""]);
  };

  const updateValue = (index: number, value: string) => {
    update([...fields.slice(0, index), value, ...fields.slice(index + 1)]);
  };

  const update = (values: string[]) => {
    const fieldValue = values.flatMap((field) => field);
    setValue(name, fieldValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const type = inputType.startsWith("html")
    ? (inputType.substring("html".length + 2) as TextInputTypes)
    : "text";

  useEffect(() => {
    register(name);
  }, [name, register]);

  return (
    <div id={id} className="cm-multi-input">
      {fields.map((value, index) => (
        <Fragment key={fieldIds.current[index]}>
          <InputGroup>
            <InputGroupItem isFill>
              <TextInput
                data-testid={name + index}
                onChange={(_event, value) => updateValue(index, value)}
                name={`${name}.${index}.value`}
                value={value}
                isDisabled={isDisabled}
                type={type}
                {...rest}
                aria-label={`${rest["aria-label"] ?? name} ${index + 1}`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? rest["aria-describedby"] : undefined}
              />
            </InputGroupItem>
            <InputGroupItem>
              <Button
                type="button"
                data-testid={"remove" + index}
                variant={ButtonVariant.link}
                onClick={() => remove(index)}
                aria-label={`${t("remove")} ${rest["aria-label"] ?? name} ${
                  index + 1
                }`}
                isDisabled={fields.length === 1 || isDisabled}
              >
                <BootstrapIcon icon="bi-dash-circle" />
              </Button>
            </InputGroupItem>
          </InputGroup>
          {index === fields.length - 1 && (
            <Button
              type="button"
              variant={ButtonVariant.link}
              onClick={append}
              aria-label={addButtonLabel || t("add")}
              data-testid="addValue"
              isDisabled={!value || isDisabled}
            >
              <BootstrapIcon icon="bi-plus-circle" />{" "}
              {addButtonLabel || t("add")}
            </Button>
          )}
        </Fragment>
      ))}
    </div>
  );
};
