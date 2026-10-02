import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'default' | 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export const getButtonClassName = (variant: ButtonVariant = 'default') =>
  [variant === 'primary' && 'primary'].filter(Boolean).join(' ');

export const Button = ({ variant = 'default', className = '', children, ...props }: ButtonProps) => {
  return (
    <button className={[getButtonClassName(variant), className].join(' ')} {...props}>
      {children}
    </button>
  );
};
