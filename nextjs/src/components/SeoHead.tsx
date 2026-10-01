import Head from 'next/head';
import { SITE } from '@/constants/site';
import type { OgImage } from '@/utils/ogImage';

interface SeoHeadProps {
    title: string;
    description: string;
    url: string;
    image: OgImage;
    type?: 'website' | 'video.movie';
}

export const SeoHead = ({ title, description, url, image, type = 'website' }: SeoHeadProps) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE.NAME} />
            <meta property="og:locale" content={SITE.LOCALE} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image.url} />
            <meta property="og:image:width" content={String(image.width)} />
            <meta property="og:image:height" content={String(image.height)} />
            <meta property="og:image:alt" content={image.alt} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image.url} />
            <meta name="twitter:image:alt" content={image.alt} />
        </Head>
    );
};
