import type { KeycloakContext } from "../../shared/keycloak-ui-shared";
import { ErrorPage, useEnvironment } from "../../shared/keycloak-ui-shared";
import { Page, Spinner } from "../../shared/@patternfly/react-core";
import { Suspense, useState } from "react";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import fetchContentJson from "../content/fetchContent";
import type { Environment } from "../environment";
import { environment } from "../environment";
import { usePromise } from "../utils/usePromise";
import { Header } from "./Header";
import type { MenuItem } from "./PageNav";
import { PageNav } from "./PageNav";
import { routes } from "../routes";

function mapRoutes(
  context: KeycloakContext<Environment>,
  content: MenuItem[],
): RouteObject[] {
  return content
    .map((item) => {
      if ("children" in item) {
        return mapRoutes(context, item.children);
      }

      // Do not add route disabled via feature flags
      if (item.isVisible && !context.environment.features[item.isVisible]) {
        return null;
      }

      return {
        ...item,
        element:
          "path" in item
            ? routes.find((r) => r.path === (item.id ?? item.path))?.element
            : undefined,
      };
    })
    .filter((item) => !!item)
    .flat();
}

export const Root = () => {
  const context = useEnvironment<Environment>();
  const [content, setContent] = useState<RouteObject[]>();

  usePromise(
    (signal) => fetchContentJson({ signal, context }),
    (content) => {
      setContent([
        {
          path: decodeURIComponent(new URL(environment.baseUrl).pathname),
          element: (
            <Page header={<Header />} sidebar={<PageNav />} isManagedSidebar>
              <Suspense fallback={<Spinner />}>
                <Outlet />
              </Suspense>
            </Page>
          ),
          errorElement: <ErrorPage />,
          children: mapRoutes(context, content),
        },
      ]);
    },
  );

  if (!content) {
    return <Spinner />;
  }
  return <RouterProvider router={createBrowserRouter(content)} />;
};
