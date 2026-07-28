import { Title } from "../../../shared/@patternfly/react-core";
import { useId } from "react";
import type { PropsWithChildren, ReactNode } from "react";

type PageProps = {
  title: string;
  description: string;
};

export const Page = ({
  title,
  description,
  children,
}: PropsWithChildren<PageProps>) => {
  const titleId = useId();

  return (
    <article className="cm-account-page" aria-labelledby={titleId}>
      <header className="cm-account-page__header">
        <Title headingLevel="h1" id={titleId} data-testid="page-heading">
          {title}
        </Title>
        <p className="cm-account-page__description">{description}</p>
      </header>
      <div className="cm-account-page__body">{children}</div>
    </article>
  );
};

type AccountPageSectionProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export const AccountPageSection = ({
  title,
  description,
  actions,
  className,
  children,
}: PropsWithChildren<AccountPageSectionProps>) => {
  const titleId = useId();

  return (
    <section
      className={["cm-account-section", className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
    >
      <header className="cm-account-section__header">
        <div className="cm-account-section__heading">
          <Title headingLevel="h2" id={titleId} size="xl">
            {title}
          </Title>
          {description ? (
            <p className="cm-account-section__description">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="cm-account-section__actions">{actions}</div>
        ) : null}
      </header>
      <div className="cm-account-section__body">{children}</div>
    </section>
  );
};
