import Head from "next/head";

interface MetaProps {
  title?: string;
  url?: string;
  imgUrl?: string;
}

const defaultTitle = "Movielist";
const description = "모든 영화를 한눈에, Movielist";

function Meta({ title, url, imgUrl }: MetaProps) {
  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const metaUrl = url ? url : "https://rendering-basecamp-wo-o29.vercel.app";
  const metaImgUrl = imgUrl
    ? imgUrl
    : "https://rendering-basecamp-wo-o29.vercel.app/images/logo.png";

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="title" content={metaTitle} />
      <meta
        name="keyword"
        content="Movielist, 영화 목록, 영화 보기, 인기 영화"
      />
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImgUrl} />
      <meta property="og:image:alt" content="Movielist 로고" />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter */}
      <meta property="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="website" />
      <meta property="twitter:site" content={metaUrl} />
      <meta name="twitter:image" content={metaImgUrl} />
      <meta property="twitter:image:alt" content="Movielist 로고" />
    </Head>
  );
}

export default Meta;
