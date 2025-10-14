import useCurrentUrl from "@/hooks/useCurrentUrl";
import Head from "next/head";

interface MetaProps {
  title?: string;
  description?: string;
  imgUrl?: string;
}

const defaultTitle = "Movielist";
const defaultDescription = "모든 영화를 한눈에, Movielist";

function Meta({ title, description, imgUrl }: MetaProps) {
  const currentUrl = useCurrentUrl();
  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const metaDescription = description ? description : defaultDescription;
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
      <meta name="description" content={metaDescription} />

      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={metaImgUrl} />
      <meta property="og:image:alt" content="Movielist 로고" />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter */}
      <meta property="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:card" content="website" />
      <meta property="twitter:site" content={currentUrl} />
      <meta name="twitter:image" content={metaImgUrl} />
      <meta property="twitter:image:alt" content="Movielist 로고" />
    </Head>
  );
}

export default Meta;
