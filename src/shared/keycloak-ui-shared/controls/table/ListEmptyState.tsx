import type { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import {
  EmptyState,
  EmptyStateBody,
  Button,
  ButtonVariant,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from "../../../@patternfly/react-core";
import type { BootstrapIconName } from "../../icons/BootstrapIcon";
import { BootstrapIcon } from "../../icons/BootstrapIcon";

export type Action = {
  text: string;
  type?: ButtonVariant;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export type ListEmptyStateProps = {
  message: string;
  instructions?: ReactNode;
  primaryActionText?: string;
  onPrimaryAction?: MouseEventHandler<HTMLButtonElement>;
  hasIcon?: boolean;
  icon?: BootstrapIconName;
  isSearchVariant?: boolean;
  secondaryActions?: Action[];
  isDisabled?: boolean;
};

export const ListEmptyState = ({
  message,
  instructions,
  onPrimaryAction,
  hasIcon = true,
  isSearchVariant,
  primaryActionText,
  secondaryActions,
  icon,
  isDisabled = false,
  children,
}: PropsWithChildren<ListEmptyStateProps>) => {
  return (
    <EmptyState data-testid="empty-state" variant="lg">
      {hasIcon && (
        <div className="pf-v5-c-empty-state__icon">
          <BootstrapIcon
            icon={isSearchVariant ? "bi-search" : (icon ?? "bi-plus-circle")}
          />
        </div>
      )}
      <EmptyStateHeader titleText={message} headingLevel="h2" />
      {instructions ? <EmptyStateBody>{instructions}</EmptyStateBody> : null}
      <EmptyStateFooter>
        {primaryActionText && (
          <Button
            type="button"
            data-testid={`${message
              .replace(/\W+/g, "-")
              .toLowerCase()}-empty-action`}
            variant="primary"
            onClick={onPrimaryAction}
            isDisabled={isDisabled}
          >
            {primaryActionText}
          </Button>
        )}
        {children}
        {secondaryActions && (
          <EmptyStateActions>
            {secondaryActions.map((action) => (
              <Button
                type="button"
                key={action.text}
                data-testid={`${action.text
                  .replace(/\W+/g, "-")
                  .toLowerCase()}-empty-action`}
                variant={action.type || ButtonVariant.secondary}
                onClick={action.onClick}
                isDisabled={isDisabled}
              >
                {action.text}
              </Button>
            ))}
          </EmptyStateActions>
        )}
      </EmptyStateFooter>
    </EmptyState>
  );
};
