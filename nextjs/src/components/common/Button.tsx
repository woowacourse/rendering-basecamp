import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'secondary';
    children: ReactNode;
}

export const Button = ({
    variant = 'default',
    className = '',
    children,
    ...props
}: ButtonProps) => {
    const variantClass = variant === 'primary' ? 'primary' : '';

    const buttonClass = [variantClass, className].filter(Boolean).join(' ');

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
};

