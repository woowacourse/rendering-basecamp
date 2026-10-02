import Head from "next/head";

interface PageHeadProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  url: string;
  type?: "website" | "video.movie";
  noIndex?: boolean;
}

export const PageHead = ({
  title,
  description,
  image,
  imageAlt,
  url,
  type = "website",
  noIndex = false,
}: PageHeadProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} key="description" />
    <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} key="robots" />
    <link rel="canonical" href={url} key="canonical" />
    <meta property="og:site_name" content="영화 리뷰" key="og:site_name" />
    <meta property="og:locale" content="ko_KR" key="og:locale" />
    <meta property="og:type" content={type} key="og:type" />
    <meta property="og:title" content={title} key="og:title" />
    <meta property="og:description" content={description} key="og:description" />
    <meta property="og:image" content={image} key="og:image" />
    <meta property="og:image:alt" content={imageAlt} key="og:image:alt" />
    <meta property="og:url" content={url} key="og:url" />
    <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
    <meta name="twitter:title" content={title} key="twitter:title" />
    <meta name="twitter:description" content={description} key="twitter:description" />
    <meta name="twitter:image" content={image} key="twitter:image" />
  </Head>
);
