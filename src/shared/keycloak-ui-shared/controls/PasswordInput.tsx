import {
  Button,
  InputGroup,
  InputGroupItem,
  TextInput,
  type TextInputProps,
} from "../../@patternfly/react-core";
import type { Ref, RefObject } from "react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BootstrapIcon } from "../icons/BootstrapIcon";

export type PasswordInputProps = TextInputProps & {
  hasReveal?: boolean;
};

type PasswordInputBaseProps = PasswordInputProps & {
  innerRef?: RefObject<HTMLInputElement>;
};

const PasswordInputBase = ({
  hasReveal = true,
  innerRef,
  ...rest
}: PasswordInputBaseProps) => {
  const { t } = useTranslation();
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          {...rest}
          type={hidePassword ? "password" : "text"}
          innerRef={innerRef}
        />
      </InputGroupItem>
      {hasReveal && (
        <Button
          type="button"
          variant="control"
          aria-label={t(hidePassword ? "showPassword" : "hidePassword")}
          aria-pressed={!hidePassword}
          onClick={() => setHidePassword(!hidePassword)}
        >
          <BootstrapIcon icon={hidePassword ? "bi-eye" : "bi-eye-slash"} />
        </Button>
      )}
    </InputGroup>
  );
};

export const PasswordInput = forwardRef(
  (props: PasswordInputProps, ref: Ref<HTMLInputElement>) => {
    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    return <PasswordInputBase {...props} innerRef={innerRef} />;
  },
);
PasswordInput.displayName = "PasswordInput";
