// See: https://github.com/i18next/react-i18next/issues/1543
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FormTitle } from "./FormTitle";

type ScrollPanelProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title: string;
  scrollId: string;
  children?: ReactNode;
};

export const ScrollPanel = (props: ScrollPanelProps) => {
  const { title, children, scrollId, className, ...rest } = props;
  return (
    <section
      {...rest}
      aria-labelledby={scrollId}
      className={["cm-scroll-panel", className].filter(Boolean).join(" ")}
    >
      <FormTitle id={scrollId} title={title} />
      {children}
    </section>
  );
};
