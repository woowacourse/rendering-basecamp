import { Children, Fragment, createElement, isValidElement, type ReactNode } from 'react';
import { getTagKey, type HeadTag } from './store';

export function collect(children: ReactNode): HeadTag[] {
  const tags: HeadTag[] = [];
  Children.forEach(children, child => {
    if (!isValidElement<Record<string, unknown>>(child)) return;
    if (child.type === Fragment) {
      tags.push(...collect(child.props.children as ReactNode));
      return;
    }
    if (child.type !== 'title' && child.type !== 'meta' && child.type !== 'base' && child.type !== 'link'
      && child.type !== 'style' && child.type !== 'script') {
      throw new Error('Head는 title, meta, base, link, style, script 태그만 지원합니다.');
    }
    const props: HeadTag['props'] = {};
    for (const [key, value] of Object.entries(child.props)) {
      if (value === undefined || value === null) continue;
      if (key === 'children') {
        props.children = Children.toArray(value as ReactNode).map(content => {
          if (typeof content !== 'string' && typeof content !== 'number') {
            throw new Error('Head 태그의 내용은 문자열이나 숫자여야 합니다.');
          }
          return content;
        }).join('');
      } else if (key === 'dangerouslySetInnerHTML' && typeof value === 'object'
        && '__html' in value && typeof value.__html === 'string') {
        props[key] = { __html: value.__html };
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        props[key] = value;
      } else {
        throw new Error(`Head에서 지원하지 않는 속성입니다: ${key}`);
      }
    }
    tags.push({ tag: child.type, props, ...(child.key !== null ? { key: String(child.key) } : {}) });
  });
  return tags;
}

export function MetadataTags({ tags }: { tags: HeadTag[] }) {
  return tags.map((item, index) => createElement(item.tag, { ...item.props, key: getTagKey(item) ?? `entry:${index}` }));
}

