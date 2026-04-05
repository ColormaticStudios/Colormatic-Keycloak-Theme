import {
  UserProfileFields,
  debeerify,
  isUserProfileError,
  setUserProfileServerError,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import type { UserFormFields } from "../../shared/keycloak-ui-shared";
import { fieldName } from "../../shared/keycloak-ui-shared/user-profile/utils";
import {
  ActionGroup,
  Alert,
  AlertVariant,
  Button,
  ExpandableSection,
  Form,
  Spinner,
} from "../../shared/@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "../../shared/@patternfly/react-icons";
import { useState } from "react";
import type { ErrorOption, FieldPath } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  getPersonalInfo,
  getSupportedLocales,
  savePersonalInfo,
} from "../api/methods";
import type {
  UserProfileMetadata,
  UserRepresentation,
} from "../api/representations";
import { Page } from "../components/page/Page";
import type { Environment } from "../environment";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

export const PersonalInfo = () => {
  const { t } = useTranslation();
  const context = useEnvironment<Environment>();
  const [userProfileMetadata, setUserProfileMetadata] =
    useState<UserProfileMetadata>();
  const [supportedLocales, setSupportedLocales] = useState<string[]>([]);
  const form = useForm<UserFormFields>({ mode: "onChange" });
  const { handleSubmit, reset, setValue, setError } = form;
  const { addAlert } = useAccountAlerts();

  usePromise(
    (signal) =>
      Promise.all([
        getPersonalInfo({ signal, context }),
        getSupportedLocales({ signal, context }),
      ]),
    ([personalInfo, supportedLocales]) => {
      setUserProfileMetadata(personalInfo.userProfileMetadata);
      setSupportedLocales(supportedLocales);
      const { userProfileMetadata: _userProfileMetadata, ...personalInfoForm } =
        personalInfo;
      void _userProfileMetadata;
      reset(personalInfoForm as UserFormFields);
      Object.entries(personalInfo.attributes || {}).forEach(([k, v]) =>
        setValue(fieldName(k), v),
      );
    },
  );

  const onSubmit = async (user: UserFormFields) => {
    try {
      const attributes = Object.fromEntries(
        Object.entries(user.attributes || {}).map(([k, v]) => [
          debeerify(k),
          v,
        ]),
      );
      const payload: UserRepresentation = {
        ...(user as Record<string, unknown>),
        attributes,
        userProfileMetadata: userProfileMetadata ?? { attributes: [] },
      };
      await savePersonalInfo(context, payload);
      const locale = attributes["locale"]?.toString();
      if (locale) {
        window.dispatchEvent(
          new CustomEvent("languageChanged", { detail: { language: locale } }),
        );
      }
      await context.keycloak.updateToken();
      addAlert(t("accountUpdatedMessage"));
    } catch (error) {
      addAlert(t("accountUpdatedError"), AlertVariant.danger);

      const serverError = isUserProfileError(error)
        ? error
        : {
            responseData: {
              errors: [
                {
                  field: "root",
                  errorMessage:
                    error instanceof Error ? error.message : "unknownError",
                },
              ],
            },
          };

      setUserProfileServerError(
        serverError,
        (name: string | number, error: unknown) =>
          setError(name as FieldPath<UserFormFields>, error as ErrorOption),
        t,
      );
    }
  };

  if (!userProfileMetadata) {
    return <Spinner />;
  }

  const allFieldsReadOnly = () =>
    userProfileMetadata?.attributes
      ?.map((a) => a.readOnly)
      .reduce((p, c) => p && c, true);

  const {
    updateEmailFeatureEnabled,
    updateEmailActionEnabled,
    isRegistrationEmailAsUsername,
    isEditUserNameAllowed,
  } = context.environment.features;
  return (
    <Page title={t("personalInfo")} description={t("personalInfoDescription")}>
      <Form isHorizontal onSubmit={handleSubmit(onSubmit)}>
        <UserProfileFields
          form={form}
          userProfileMetadata={userProfileMetadata}
          supportedLocales={supportedLocales}
          currentLocale={context.environment.locale}
          t={t}
          renderer={(attribute) => {
            const annotations = attribute.annotations
              ? attribute.annotations
              : {};
            return attribute.name === "email" &&
              updateEmailFeatureEnabled &&
              updateEmailActionEnabled &&
              annotations["kc.required.action.supported"] &&
              (!isRegistrationEmailAsUsername || isEditUserNameAllowed) ? (
              <Button
                id="update-email-btn"
                variant="link"
                onClick={() =>
                  context.keycloak.login({ action: "UPDATE_EMAIL" })
                }
                icon={<ExternalLinkSquareAltIcon />}
                iconPosition="right"
              >
                {t("updateEmail")}
              </Button>
            ) : undefined;
          }}
        />
        {!allFieldsReadOnly() && (
          <ActionGroup>
            <Button
              data-testid="save"
              type="submit"
              id="save-btn"
              variant="primary"
            >
              {t("save")}
            </Button>
            <Button
              data-testid="cancel"
              id="cancel-btn"
              variant="link"
              onClick={() => reset()}
            >
              {t("cancel")}
            </Button>
          </ActionGroup>
        )}
        {context.environment.features.deleteAccountAllowed && (
          <ExpandableSection
            data-testid="delete-account"
            toggleText={t("deleteAccount")}
          >
            <Alert
              isInline
              title={t("deleteAccount")}
              variant="danger"
              actionLinks={
                <Button
                  id="delete-account-btn"
                  variant="danger"
                  onClick={() =>
                    context.keycloak.login({
                      action: "delete_account",
                    })
                  }
                  className="delete-button"
                >
                  {t("delete")}
                </Button>
              }
            >
              {t("deleteAccountWarning")}
            </Alert>
          </ExpandableSection>
        )}
      </Form>
    </Page>
  );
};

export default PersonalInfo;
