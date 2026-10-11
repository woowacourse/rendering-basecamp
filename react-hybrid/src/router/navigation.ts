export const ROUTE_CHANGE_START_EVENT = 'routeChangeStart';
export const ROUTE_CHANGE_COMPLETE_EVENT = 'routeChangeComplete';

export const router = {
  push(href: string) {
    window.history.pushState(null, '', href);
    window.dispatchEvent(new Event(ROUTE_CHANGE_START_EVENT));
  },
};
