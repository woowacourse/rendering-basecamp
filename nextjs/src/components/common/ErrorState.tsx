import type { ReactNode } from 'react';

interface ErrorStateProps {
    title: string;
    description: string;
    children?: ReactNode;
}

export const ErrorState = ({ title, description, children }: ErrorStateProps) => {
    return (
        <section className="error-state">
            <img src="/images/dizzy_planet.png" width="160" height="160" alt="" />
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="error-state-description">{description}</p>
            {children && <div className="error-state-actions">{children}</div>}
        </section>
    );
};
