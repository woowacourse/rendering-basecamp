import React from 'react';
import { OverlayProvider } from 'overlay-kit';
import { matchRoute } from '../router';

interface AppProps {
    initialPathname: string;
    initialData?: unknown; // 페이지에 보여주기 위한 목적
}

function App({ initialPathname, initialData }: AppProps) {
    const { route, params } = matchRoute(initialPathname);
    const Page = route.component;
    return (
        <>
            <OverlayProvider>
                <Page params={params} loader={route.loader} initialData={initialData} />
            </OverlayProvider>
        </>
    );
}

export default App;
