import { useContext, useEffect, useState, type ReactNode } from 'react';
import { RouterContext, type InitialData } from './context';
import { useRoute } from './useRoute';
import { useLoader } from './useLoader';

interface RouterProps {
  initialData?: InitialData;
}

export default function Router({ initialData }: RouterProps) {
  return (
    <RouterContext.Provider value={initialData}>
      <RouterContent />
    </RouterContext.Provider>
  );
}

function RouterContent() {
  const initialData = useContext(RouterContext);
  const { route, url, params } = useRoute();

  const routeKey = url.pathname + url.search;
  const state = useLoader(route?.loader, { params, url }, routeKey, initialData?.props);

  const [previousPage, setPreviousPage] = useState<ReactNode>(null);

  const Component = route?.component;

  const props = state.status === 'ready' ? state.content : undefined;
  const page = state.status === 'ready' && Component ? <Component {...props} /> : null;

  useEffect(() => {
    if (state.status === 'ready') {
      setPreviousPage(page);
    }
  }, [Component, state.status, props]);

  if (!route) return null;

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
