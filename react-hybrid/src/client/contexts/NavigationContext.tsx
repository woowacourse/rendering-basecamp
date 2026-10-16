import { createContext, useContext } from 'react';

export type Navigate = (to: string) => void;

export const NavigationContext = createContext<Navigate | null>(null);

export const useNavigate = () => {
    const navigate = useContext(NavigationContext);
    if (!navigate) {
        throw new Error('useNavigate는 NavigationContext 안에서만 사용할 수 있습니다.');
    }
    return navigate;
};
