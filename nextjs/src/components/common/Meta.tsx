import Head from "next/head";

interface Image {
  url: string;
  alt: string;
}

interface MetaProps {
  title?: string;
  description?: string;
  image?: Image;
  currentUrl: string;
}

const defaultTitle = "Movielist";
const defaultDescription = "모든 영화를 한눈에, Movielist";

function Meta({ title, description, image, currentUrl }: MetaProps) {
  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const metaDescription = description ? description : defaultDescription;
  const metaImage = image
    ? image
    : {
        url: "https://rendering-basecamp-wo-o29.vercel.app/images/logo.png",
        alt: "Movielist 로고",
      };

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
      <meta property="og:image" content={metaImage.url} />
      <meta property="og:image:alt" content={metaImage.alt} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter */}
      <meta property="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:card" content="website" />
      <meta property="twitter:site" content={currentUrl} />
      <meta name="twitter:image" content={metaImage.url} />
      <meta property="twitter:image:alt" content={metaImage.alt} />
    </Head>
  );
}

export default Meta;
