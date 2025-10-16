import Head from "next/head";

interface SEOHeadProps {
  title: string;
  description: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
}

export function SEOHead({
  title,
  description,
  ogType,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}: SEOHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
    </Head>
  );
}
