import { SITE } from '../constants/site';
import { escapeHtml } from '../utils/escapeHtml';
import { OgImage } from '../utils/ogImage';

interface SeoHeadProps {
    title: string;
    description: string;
    url: string;
    image: OgImage;
    type?: 'website' | 'video.movie';
}

export const SeoHead = ({ title, description, url, image, type = 'website' }: SeoHeadProps) => {
    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeImageAlt = escapeHtml(image.alt);

    return /*html*/ `
        <title>${safeTitle}</title>
        <meta name="description" content="${safeDescription}" />
        <link rel="canonical" href="${url}" />

        <meta property="og:type" content="${type}" />
        <meta property="og:site_name" content="${SITE.NAME}" />
        <meta property="og:locale" content="${SITE.LOCALE}" />
        <meta property="og:url" content="${url}" />
        <meta property="og:title" content="${safeTitle}" />
        <meta property="og:description" content="${safeDescription}" />
        <meta property="og:image" content="${image.url}" />
        <meta property="og:image:width" content="${image.width}" />
        <meta property="og:image:height" content="${image.height}" />
        <meta property="og:image:alt" content="${safeImageAlt}" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${safeTitle}" />
        <meta name="twitter:description" content="${safeDescription}" />
        <meta name="twitter:image" content="${image.url}" />
        <meta name="twitter:image:alt" content="${safeImageAlt}" />
    `;
};
