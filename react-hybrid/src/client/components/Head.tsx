const SITE_NAME = '라바의 TMDB';

interface HeadProps {
    title: string;
    description: string;
    image?: string | null;
    type?: 'website' | 'video.movie';
}

// React 19는 트리 어디서 렌더링하든 <title>, <meta>를 <head>로 호이스팅한다.
export const Head = ({ title, description, image, type = 'website' }: HeadProps) => {
    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />

            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="ko_KR" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}

            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </>
    );
};

export const toOgImageUrl = (path: string | null | undefined) =>
    path ? `https://image.tmdb.org/t/p/w1280${path}` : undefined;

export { SITE_NAME };
