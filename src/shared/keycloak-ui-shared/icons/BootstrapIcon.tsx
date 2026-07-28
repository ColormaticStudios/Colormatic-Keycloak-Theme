import type { HTMLAttributes } from "react";

export type BootstrapIconName = `bi-${string}`;

export type BootstrapIconProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> & {
  icon: BootstrapIconName;
  label?: string;
};

/**
 * The common icon primitive for project-owned login and account UI.
 *
 * PatternFly components can still provide structure and behavior without
 * making their icon set part of Colormatic's visual language.
 */
export const BootstrapIcon = ({
  icon,
  label,
  className,
  ...props
}: BootstrapIconProps) => (
  <i
    {...props}
    className={["bi", icon, className].filter(Boolean).join(" ")}
    aria-hidden={label ? undefined : true}
    aria-label={label}
    role={label ? "img" : undefined}
  />
);
