import Head from "next/head";

export interface MetadataData {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

interface MetadataProps {
  data: MetadataData;
}

export const Metadata = ({ data }: MetadataProps) => (
  <Head>
    <title>{data.title}</title>
    {data.description && <meta name="description" content={data.description} />}
    <meta property="og:title" content={data.ogTitle ?? data.title} />
    {data.ogDescription && (
      <meta property="og:description" content={data.ogDescription} />
    )}
    {data.ogImage && <meta property="og:image" content={data.ogImage} />}
  </Head>
);
