export interface HeadTag {
  tag: 'title' | 'meta' | 'base' | 'link' | 'style' | 'script';
  key?: string;
  props: Record<string, string | number | boolean | { __html: string }>;
}

export function getTagKey({ tag, props, key }: HeadTag) {
  if (tag === 'title' || tag === 'base') return tag;
  if (tag === 'meta' && props.charSet !== undefined) return 'meta:charSet';
  if (key !== undefined) return `key:${key}`;
  if (tag === 'meta') {
    const attributes = ['name', 'property', 'httpEquiv', 'itemProp']
      .filter(attribute => props[attribute] !== undefined);
    if (attributes.length === 1) {
      const attribute = attributes[0];
      return `meta:${attribute}:${props[attribute]}`;
    }
  }
  return undefined;
}

export function createHeadStore(initialTags: HeadTag[] = []) {
  const entries: { id: string; tags: HeadTag[] }[] = [];
  const listeners = new Set<() => void>();
  let snapshot = initialTags;
  let pending = false;

  function publish() {
    const seen = new Set<string>();
    snapshot = entries.flatMap(entry => entry.tags).reverse().filter(tag => {
      const key = getTagKey(tag);
      if (key === undefined) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).reverse();
    listeners.forEach(listener => listener());
  }

  function schedule() {
    if (pending) return;
    pending = true;
    queueMicrotask(() => {
      pending = false;
      publish();
    });
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    getSnapshot: () => snapshot,
    set(id: string, tags: HeadTag[], server = false, prepend = false) {
      const index = entries.findIndex(entry => entry.id === id);
      if (tags.length) {
        const entry = { id, tags };
        if (index < 0) prepend ? entries.unshift(entry) : entries.push(entry);
        else entries[index] = entry;
      } else if (index >= 0) {
        entries.splice(index, 1);
      }
      if (server) publish();
      else schedule();
    },
    remove(id: string) {
      this.set(id, []);
    },
  };
}
