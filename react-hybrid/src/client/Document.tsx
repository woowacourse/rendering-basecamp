import { PropsWithChildren, useLayoutEffect } from 'react';

interface DocumentProps {
    initialData?: unknown; // 스크립트 __INITIAL_DATA__에 넣어두기 위한 목적
}

const Document = ({ children, initialData }: PropsWithChildren<DocumentProps>) => {
    // 하이드레이션 커밋 직후(페인트 전)에 실행된다. 루트라서 자식들의 layout effect가 모두 끝난 뒤 실행된다.
    useLayoutEffect(() => {
        performance.mark('hydrated');
        performance.measure('hydration-commit', 'beforeRender', 'hydrated');
    }, []);

    return (
        <html lang="ko">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/static/styles/index.css" />
            </head>
            <body>
                {children}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, '\\u003c')}`,
                    }}
                ></script>
                <script src="/static/bundle.js"></script>
            </body>
        </html>
    );
};

export default Document;
