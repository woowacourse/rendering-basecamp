import { useEffect, useRef, useState, type ReactNode } from 'react';
import { RouterContext, type InitialData } from './context';
import { useRoute } from './useRoute';
import { useLoader } from './useLoader';
import { ROUTE_CHANGE_COMPLETE_EVENT, ROUTE_CHANGE_ERROR_EVENT } from './navigation';

interface RouterProps {
  initialData?: InitialData;
}

export default function Router({ initialData }: RouterProps) {
  const [initialProps, setInitialProps] = useState(initialData?.props);

  useEffect(() => {
    setInitialProps(undefined);
  }, []);

  return (
    <RouterContext.Provider value={initialData}>
      <RouteMatch initialProps={initialProps} />
    </RouterContext.Provider>
  );
}

function RouteMatch({ initialProps }: { initialProps?: InitialData['props'] }) {
  const matched = useRoute();

  useEffect(() => {
    if (!matched.route) {
      window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_ERROR_EVENT, { detail: { url: matched.url.href } }));
    }
  }, [matched.route, matched.url.href]);

  if (!matched.route) return null;
  return <MatchedPage {...matched} initialProps={initialProps} />;
}

type MatchedPageProps = Extract<ReturnType<typeof useRoute>, { route: object }> & {
  initialProps?: InitialData['props'];
};

function MatchedPage({ route, url, params, initialProps }: MatchedPageProps) {
  const routeKey = url.pathname + url.search;
  const state = useLoader(route.loader, { params, url }, routeKey, initialProps);
  const completedRoute = useRef(initialProps ? routeKey : undefined);

  useEffect(() => {
    if (state.status !== 'ready') {
      completedRoute.current = undefined;
      if (state.status === 'error') {
        window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_ERROR_EVENT, { detail: { url: url.href } }));
      }
      return;
    }
    if (completedRoute.current === routeKey) return;
    completedRoute.current = routeKey;
    window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_COMPLETE_EVENT, { detail: { url: url.href } }));
  }, [route, routeKey, state.status, url.href]);

  const [previousPage, setPreviousPage] = useState<ReactNode>(null);

  const Component = route.component;

  const props = state.status === 'ready' ? state.content : null;
  const page = props ? <Component {...props} /> : null;

  useEffect(() => {
    if (state.status === 'ready') {
      setPreviousPage(page);
    }
  }, [Component, state.status, props]);

  if (state.status === 'loading') {
    const LoadingComponent = route.loadingComponent;
    if (LoadingComponent) return <LoadingComponent />;
    return previousPage;
  }

  if (state.status === 'error') {
    const ErrorComponent = route.errorComponent;
    return ErrorComponent ? <ErrorComponent error={state.error} /> : <div>페이지를 불러오지 못했습니다.</div>;
  }

  return page;
}
