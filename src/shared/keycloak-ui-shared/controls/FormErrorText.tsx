import type { FormHelperTextProps } from "../../@patternfly/react-core";
import {
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "../../@patternfly/react-core";
import { BootstrapIcon } from "../icons/BootstrapIcon";

export type FormErrorTextProps = FormHelperTextProps & {
  message?: string;
};

export const FormErrorText = ({ message, ...props }: FormErrorTextProps) => {
  return (
    <FormHelperText {...props} aria-live="polite">
      <HelperText>
        <HelperTextItem
          icon={<BootstrapIcon icon="bi-exclamation-circle-fill" />}
          variant="error"
        >
          {message}
        </HelperTextItem>
      </HelperText>
    </FormHelperText>
  );
};
