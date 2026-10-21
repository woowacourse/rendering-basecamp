import { useEffect, useId, useSyncExternalStore, type ReactNode } from 'react';
import { collect, MetadataTags } from '../head/tags';
import { useHeadStore } from '../head/context';
import { isBrowser } from '../isBrowser';
import { useAppData } from './context';

const placeholderError = "throw new Error('문서의 head 태그 치환이 누락되었습니다.');";
export const HEAD_PLACEHOLDER = `<script id="__HEAD_PLACEHOLDER__">${placeholderError}</script>`;

export default function DocumentHead({ children }: { children?: ReactNode }) {
  const { assets } = useAppData();
  const store = useHeadStore();
  const id = useId();
  if (!isBrowser()) store.set(id, collect(children), true, true);
  useEffect(() => {
    store.set(id, collect(children), false, true);
  }, [store, id, children]);
  useEffect(() => () => store.remove(id), [store, id]);
  const tags = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return (
    <head>
      {isBrowser() ? <MetadataTags tags={tags} /> : (
        <script id="__HEAD_PLACEHOLDER__" dangerouslySetInnerHTML={{ __html: placeholderError }} />
      )}
      {!isBrowser() && assets?.styles.map((href) => <link key={href} rel="stylesheet" href={href} />)}
    </head>
  );
}
