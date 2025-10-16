import type { ButtonHTMLAttributes } from 'react';
import Image from 'next/image';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  src: string;
  width?: string;
  height?: string;
  alt?: string;
}

export const IconButton = ({
  src,
  width = '24',
  height = '24',
  alt = '',
  className = '',
  ...props
}: IconButtonProps) => {
  return (
    <button className={className} {...props}>
      <Image src={src} width={Number(width)} height={Number(height)} alt={alt} />
    </button>
  );
};
