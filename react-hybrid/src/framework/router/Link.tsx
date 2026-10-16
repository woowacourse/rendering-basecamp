import type { ComponentProps, MouseEvent } from 'react';
import { router } from './navigation';

type LinkProps = ComponentProps<'a'> & { href: string };

export default function Link({ href, onClick, ...props }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    const anchor = event.currentTarget;

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (anchor.target && anchor.target.toLowerCase() !== '_self') ||
      anchor.hasAttribute('download')
    )
      return;

    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    router.push(url.href);
  }

  return <a {...props} href={href} onClick={handleClick} />;
}
