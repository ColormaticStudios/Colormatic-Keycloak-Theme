import { Icon, Popover } from "../../@patternfly/react-core";
import type { ReactNode } from "react";
import { useHelp } from "../context/HelpContext";
import { BootstrapIcon } from "../icons/BootstrapIcon";

type HelpItemProps = {
  helpText: string | ReactNode;
  fieldLabelId: string;
  noVerticalAlign?: boolean;
  unWrap?: boolean;
  isRecommendation?: boolean;
};

export const HelpItem = ({
  helpText,
  fieldLabelId,
  noVerticalAlign = true,
  unWrap = false,
  isRecommendation = false,
}: HelpItemProps) => {
  const { enabled } = useHelp();
  const icon = isRecommendation
    ? "bi-exclamation-triangle"
    : "bi-question-circle";

  return enabled ? (
    <Popover bodyContent={helpText}>
      <>
        {!unWrap && (
          <button
            type="button"
            data-testid={`help-label-${fieldLabelId}`}
            aria-label={fieldLabelId}
            onClick={(e) => e.preventDefault()}
            className="pf-v5-c-form__group-label-help"
          >
            <Icon
              isInline={noVerticalAlign}
              status={isRecommendation ? "warning" : undefined}
            >
              <BootstrapIcon icon={icon} />
            </Icon>
          </button>
        )}
        {unWrap && (
          <Icon
            isInline={noVerticalAlign}
            status={isRecommendation ? "warning" : undefined}
          >
            <BootstrapIcon icon={icon} />
          </Icon>
        )}
      </>
    </Popover>
  ) : null;
};
