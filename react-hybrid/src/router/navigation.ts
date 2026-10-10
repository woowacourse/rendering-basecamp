export const URL_CHANGE_EVENT = 'urlchange';

export const router = {
  push(href: string) {
    window.history.pushState(null, '', href);
    window.dispatchEvent(new Event(URL_CHANGE_EVENT));
  },
};
