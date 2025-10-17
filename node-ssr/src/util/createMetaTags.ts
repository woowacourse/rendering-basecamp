interface CreateMetaTagsProps {
	title: string;
	description: string;
	url: string;
	image: string;
}

export const createMetaTags = ({
	title,
	description,
	url,
	image,
}: CreateMetaTagsProps) => {
	return /*html*/ `
  <meta name="description" content="지금 가장 인기 있는 영화를 만나보세요. TMDB 데이터를 기반으로 최신 평점과 줄거리를 제공합니다." />
  <meta name="keywords" content="영화, 리뷰, 인기 영화, TMDB, 평점, 최신 영화" />
  <meta name="author" content="우아한테크코스" />
  <meta name="robots" content="index, follow" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="${title}" />
  <meta property="og:locale" content="ko_KR" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  `;
};
