import {
  FormErrorText,
  SelectControl,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import {
  Button,
  Chip,
  ChipGroup,
  Form,
  FormGroup,
  InputGroup,
  InputGroupItem,
  Modal,
  TextInput,
  ValidatedOptions,
} from "../../shared/@patternfly/react-core";
import { useEffect } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { updateRequest } from "../api";
import type { Permission, Resource } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { SharedWith } from "./SharedWith";

type ShareTheResourceProps = {
  resource: Resource;
  permissions?: Permission[];
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  permissions: string[];
  usernames: { value: string }[];
};

export const ShareTheResource = ({
  resource,
  permissions,
  open,
  onClose,
}: ShareTheResourceProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();
  const form = useForm<FormValues>({ mode: "onChange" });
  const {
    control,
    register,
    reset,
    formState: { errors, isValid },
    setError,
    clearErrors,
    handleSubmit,
  } = form;
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "usernames",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" });
    }
  }, [append, fields.length]);

  const watchFields = useWatch({
    control,
    name: "usernames",
    defaultValue: [],
  });

  const isDisabled = watchFields.every(
    ({ value }) => value.trim().length === 0,
  );

  const addShare = async ({ usernames, permissions }: FormValues) => {
    try {
      await Promise.all(
        usernames
          .map(({ value }) => value.trim())
          .filter(Boolean)
          .map((username) =>
            updateRequest(context, resource._id, username, permissions),
          ),
      );
      addAlert(t("shareSuccess"));
      reset({ permissions: [], usernames: [{ value: "" }] });
      onClose();
    } catch (error) {
      addError("shareError", error);
    }
  };

  const validateUser = () => {
    const userOrEmails = watchFields
      .map(({ value }) => value.trim())
      .filter(Boolean);
    const userPermission = permissions
      ?.map((p) => [p.username, p.email])
      .flat();

    const hasUsers = userOrEmails.length > 0;
    const alreadyShared =
      userOrEmails.filter((u) => userPermission?.includes(u)).length !== 0;

    if (!hasUsers || alreadyShared) {
      setError("usernames", {
        message: !hasUsers ? t("required") : t("resourceAlreadyShared"),
      });
    } else {
      clearErrors("usernames");
    }

    return hasUsers && !alreadyShared;
  };

  return (
    <Modal
      title={t("shareTheResource", { name: resource.name })}
      variant="medium"
      isOpen={open}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          data-testid="done"
          isDisabled={!isValid}
          type="submit"
          form="share-form"
        >
          {t("done")}
        </Button>,
        <Button key="cancel" variant="link" type="button" onClick={onClose}>
          {t("cancel")}
        </Button>,
      ]}
    >
      <FormProvider {...form}>
        <Form id="share-form" onSubmit={handleSubmit(addShare)}>
          <FormGroup
            label={t("shareUser")}
            type="string"
            fieldId="users"
            isRequired
          >
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  id="users"
                  data-testid="users"
                  placeholder={t("usernamePlaceholder")}
                  validated={
                    errors.usernames
                      ? ValidatedOptions.error
                      : ValidatedOptions.default
                  }
                  {...register(`usernames.${fields.length - 1}.value`, {
                    validate: validateUser,
                  })}
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button
                  key="add-user"
                  type="button"
                  variant="secondary"
                  data-testid="add"
                  onClick={() => append({ value: "" })}
                  isDisabled={isDisabled}
                >
                  {t("add")}
                </Button>
              </InputGroupItem>
            </InputGroup>
            {fields.length > 1 && (
              <ChipGroup categoryName={t("shareWith") + " "}>
                {fields.map(
                  (field, index) =>
                    index !== fields.length - 1 && (
                      <Chip key={field.id} onClick={() => remove(index)}>
                        {watchFields[index]?.value ?? field.value}
                      </Chip>
                    ),
                )}
              </ChipGroup>
            )}
            {errors.usernames && (
              <FormErrorText message={errors.usernames.message!} />
            )}
          </FormGroup>
          <FormGroup
            label={t("permissions")}
            fieldId="permissions-selected"
            data-testid="permissions"
          >
            <SelectControl
              name="permissions"
              variant="typeaheadMulti"
              controller={{ defaultValue: [] }}
              options={resource.scopes.map(({ name, displayName }) => ({
                key: name,
                value: displayName || name,
              }))}
            />
          </FormGroup>
          <SharedWith permissions={permissions} />
        </Form>
      </FormProvider>
    </Modal>
  );
};
