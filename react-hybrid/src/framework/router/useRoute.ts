import { useMemo } from 'react';
import { useLocation } from './useLocation';
import { match } from 'path-to-regexp';
import { routes } from '../../routes';
import type { LoaderContext } from './defineRoutes';

export function useRoute() {
  const location = useLocation();
  const { pathname } = location;

  const matchedRoute = useMemo(() => matchRoute(pathname), [pathname]);

  return { ...location, ...matchedRoute };
}

const routeMatchers = routes.map(route => ({
  route,
  match: match(route.path, { sensitive: false, end: true, trailing: true }),
}));

function matchRoute(pathname: string):
  | { route: (typeof routes)[number]; params: LoaderContext['params'] }
  | { route: undefined; params: undefined } {
  for (const { route, match: matchPath } of routeMatchers) {
    const matched = matchPath(pathname);
    if (matched) return { route, params: matched.params };
  }

  return { route: undefined, params: undefined };
}
