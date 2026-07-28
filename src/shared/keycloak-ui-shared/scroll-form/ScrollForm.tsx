import type { GridProps } from "../../@patternfly/react-core";
import {
  Grid,
  GridItem,
  JumpLinks,
  JumpLinksItem,
  PageSection,
} from "../../@patternfly/react-core";
import type { ReactNode } from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { FormPanel } from "./FormPanel";
import { ScrollPanel } from "./ScrollPanel";

import style from "./scroll-form.module.css";

export const mainPageContentId = "kc-main-content-page-container";

type ScrollSection = {
  title: string;
  panel: ReactNode;
  isHidden?: boolean;
};

type ScrollFormProps = GridProps & {
  label: string;
  sections: ScrollSection[];
  borders?: boolean;
  showJumpLinks?: boolean;
};

const sectionId = (title: string, index: number): string =>
  `section-${index + 1}-${title
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")}`;

export const ScrollForm = ({
  label,
  sections,
  borders = false,
  showJumpLinks = true,
  ...rest
}: ScrollFormProps) => {
  const shownSections = useMemo(
    () => sections.filter(({ isHidden }) => !isHidden),
    [sections],
  );

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const scroller = document.getElementById(mainPageContentId);
    if (!scroller) return;

    const offset = 100;
    const updateActive = () => {
      const scrollTop = scroller.scrollTop + offset;
      let active = 0;

      shownSections.forEach(({ title }, index) => {
        const id = sectionId(title, index);
        const element = document.getElementById(id);
        if (element && scrollTop >= element.offsetTop) {
          active = index;
        }
      });

      setActiveSection(active);
    };

    updateActive();
    scroller.addEventListener("scroll", updateActive);
    return () => scroller.removeEventListener("scroll", updateActive);
  }, [shownSections]);

  return (
    <Grid hasGutter {...rest}>
      <GridItem md={showJumpLinks ? 8 : 12} sm={12}>
        {shownSections.map(({ title, panel }, index) => {
          const scrollId = sectionId(title, index);

          return (
            <Fragment key={title}>
              {borders ? (
                <FormPanel
                  scrollId={scrollId}
                  title={title}
                  className={style.panel}
                >
                  {panel}
                </FormPanel>
              ) : (
                <ScrollPanel scrollId={scrollId} title={title}>
                  {panel}
                </ScrollPanel>
              )}
            </Fragment>
          );
        })}
      </GridItem>
      {showJumpLinks && (
        <GridItem md={4} sm={12} order={{ default: "-1", md: "1" }}>
          <PageSection className={style.sticky}>
            <JumpLinks isVertical label={label}>
              {shownSections.map(({ title }, index) => {
                const scrollId = sectionId(title, index);

                return (
                  <JumpLinksItem
                    key={title}
                    isActive={activeSection === index}
                    onClick={() => {
                      const element = document.getElementById(scrollId);
                      if (element) {
                        element.focus({ preventScroll: true });
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    data-testid={`jump-link-${scrollId}`}
                  >
                    {title}
                  </JumpLinksItem>
                );
              })}
            </JumpLinks>
          </PageSection>
        </GridItem>
      )}
    </Grid>
  );
};
