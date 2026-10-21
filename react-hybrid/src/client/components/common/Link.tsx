import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useNavigate } from '../../contexts/NavigationContext';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    to: string;
}

export const Link = ({ to, onClick, children, ...props }: LinkProps) => {
    const navigate = useNavigate();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);

        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }

        e.preventDefault();
        navigate(to);
    };

    return (
        <a href={to} onClick={handleClick} {...props}>
            {children}
        </a>
    );
};
