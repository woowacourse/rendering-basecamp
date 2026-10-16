import { useCallback, useEffect, useState } from 'react';
import { OverlayProvider } from 'overlay-kit';
import { matchRoute } from '../router';
import { NavigationContext } from './contexts/NavigationContext';

interface AppProps {
    initialPathname: string;
    initialData?: unknown; // 페이지에 보여주기 위한 목적
}

function App({ initialPathname, initialData }: AppProps) {
    const [pathname, setPathname] = useState(initialPathname);
    const [hasNavigated, setHasNavigated] = useState(false);

    const navigate = useCallback(
        (to: string) => {
            if (to === pathname) return;

            window.history.pushState(null, '', to);
            setPathname(to);
            setHasNavigated(true);
            window.scrollTo(0, 0);
        },
        [pathname]
    );

    useEffect(() => {
        const handlePopState = () => {
            setPathname(window.location.pathname);
            setHasNavigated(true);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const matched = matchRoute(pathname);

    return (
        <NavigationContext.Provider value={navigate}>
            <OverlayProvider>
                {matched ? (
                    <matched.route.component
                        key={pathname}
                        params={matched.params}
                        loader={matched.route.loader}
                        initialData={hasNavigated ? undefined : initialData}
                    />
                ) : (
                    <div>페이지를 찾을 수 없습니다.</div>
                )}
            </OverlayProvider>
        </NavigationContext.Provider>
    );
}

export default App;
