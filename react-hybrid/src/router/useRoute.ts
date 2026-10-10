import { useMemo } from 'react';
import { useUrl } from './useUrl';
import { match } from 'path-to-regexp';
import { routes } from '../routes';

export function useRoute() {
  const url = useUrl();
  const { pathname } = url;

  const matchedRoute = useMemo(() => matchRoute(pathname), [pathname]);

  return { url, ...matchedRoute };
}

const routeMatchers = routes.map(route => ({
  route,
  match: match(route.path, { sensitive: false, end: true, trailing: true }),
}));

function matchRoute(pathname: string) {
  for (const { route, match: matchPath } of routeMatchers) {
    const matched = matchPath(pathname);
    if (matched) return { route, params: matched.params };
  }

  return { route: undefined, params: undefined };
}
