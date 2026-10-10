import type { ComponentType } from 'react';

export interface LoaderContext {
  params: Record<string, string | string[]>;
  url: URL;
}

type Loader<TProps> = (context: LoaderContext) => NoInfer<TProps> | Promise<NoInfer<TProps>>;

export type Route<TProps extends object> = {
  path: string | string[];
  component: ComponentType<TProps>;
  loadingComponent?: ComponentType;
  errorComponent?: ComponentType<{ error: unknown }>;
} & ({} extends TProps
  ? { loader?: Loader<TProps> }
  : { loader: Loader<TProps> });

export function defineRoutes<const TProps extends readonly object[]>(
  routes: { [Index in keyof TProps]: Route<TProps[Index]> },
) {
  return routes;
}
