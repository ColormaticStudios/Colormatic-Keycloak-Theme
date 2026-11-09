import { Suspense, lazy, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  KeycloakSpinner,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import type { MenuItem } from "../root/PageNav";
import type { ContentComponentParams } from "../routes";
import { joinPath } from "../utils/joinPath";
import { usePromise } from "../utils/usePromise";
import fetchContentJson from "./fetchContent";

function findComponent(
  content: MenuItem[],
  componentId: string,
): string | undefined {
  for (const item of content) {
    if (
      "path" in item &&
      item.path.endsWith(componentId) &&
      "modulePath" in item
    ) {
      return item.modulePath;
    }
    if ("children" in item) {
      const modulePath = findComponent(item.children, componentId);
      if (modulePath) {
        return modulePath;
      }
    }
  }
  return undefined;
}

export const ContentComponent = () => {
  const context = useEnvironment();

  const [content, setContent] = useState<MenuItem[]>();
  const { componentId } = useParams<ContentComponentParams>();

  usePromise((signal) => fetchContentJson({ signal, context }), setContent);
  const modulePath = useMemo(
    () => findComponent(content || [], componentId!),
    [content, componentId],
  );

  if (!content) {
    return <KeycloakSpinner />;
  }

  if (!componentId || !modulePath) {
    throw new Error("pageNotFound");
  }

  return <Component key={modulePath} modulePath={modulePath} />;
};

type ComponentProps = {
  modulePath: string;
};

const Component = ({ modulePath }: ComponentProps) => {
  const { environment } = useEnvironment();

  const Element = lazy(
    () => import(joinPath(environment.resourceUrl, modulePath)),
  );
  return (
    <Suspense fallback={<KeycloakSpinner />}>
      <Element />
    </Suspense>
  );
};

export default ContentComponent;
