import Head from "next/head";

type MetaTagsProps = {
  title: string;
  description: string;
  url: string;
  image: string;
  favicon?: string;
};

export const MetaTags = ({
  title,
  description,
  url,
  image,
  favicon = "/favicon.ico",
}: MetaTagsProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="icon" href={favicon} />
    </Head>
  );
};
