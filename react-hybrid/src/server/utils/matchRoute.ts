import { routes } from "../../client/routes";

export const matchRoute = (url: string) => {
  for (const route of routes) {
    // 정적 경로
    if (route.path === url) {
      return { route, params: {} };
    }

    // 동적 경로
    const pattern = route.path.replace(/:(\w+)/g, "([^/]+)");
    const regex = new RegExp(`^${pattern}$`);
    const match = url.match(regex);

    if (match) {
      const paramName = route.path.match(/:(\w+)/)[1];
      const paramValue = match[1];

      return { route, params: { [paramName]: paramValue } };
    }
  }

  // 404 페이지
  const hasNotFoundRoute = routes.find((r) => r.path === "/404");
  if (hasNotFoundRoute) {
    return { route: hasNotFoundRoute, params: {} };
  }

  return null;
};
