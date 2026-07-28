import type { FileUploadProps } from "../../@patternfly/react-core";
import { FileUpload, ValidatedOptions } from "../../@patternfly/react-core";
import type { ReactNode } from "react";
import { useState } from "react";
import type {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
} from "react-hook-form";
import { useController } from "react-hook-form";
import { getRuleValue } from "../utils/getRuleValue";
import { FormLabel } from "./FormLabel";
import { useTranslation } from "react-i18next";

export type FileUploadControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> &
  Omit<FileUploadProps, "name" | "isRequired" | "required"> & {
    label: string;
    labelIcon?: string | ReactNode;
    isDisabled?: boolean;
    "data-testid"?: string;
    type?: string;
  };

export const FileUploadControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: FileUploadControlProps<T, P>,
) => {
  const {
    control,
    defaultValue: providedDefaultValue,
    id: providedId,
    label,
    labelIcon,
    name,
    rules,
    shouldUnregister,
    ...uploadProps
  } = props;
  const required = !!getRuleValue(rules?.required);
  const defaultValue = providedDefaultValue ?? ("" as PathValue<T, P>);

  const { t } = useTranslation();

  const [filename, setFilename] = useState<string>("");

  const { field, fieldState } = useController({
    control,
    defaultValue,
    name,
    rules,
    shouldUnregister,
  });

  return (
    <FormLabel
      id={providedId}
      name={name}
      label={label}
      labelIcon={labelIcon}
      isRequired={required}
      error={fieldState.error}
    >
      <FileUpload
        id={providedId ?? name}
        aria-label={label}
        isRequired={required}
        data-testid={props["data-testid"] || name}
        filename={filename}
        browseButtonText={t("browse")}
        validated={
          fieldState.error ? ValidatedOptions.error : ValidatedOptions.default
        }
        hideDefaultPreview
        isDisabled={props.isDisabled}
        type="text"
        onFileInputChange={(_, file) => {
          field.onChange(file);
          setFilename(file.name);
        }}
        onClearClick={() => {
          field.onChange(null);
          setFilename("");
        }}
        {...uploadProps}
        {...field}
      />
    </FormLabel>
  );
};
