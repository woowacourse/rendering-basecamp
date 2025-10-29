let originalMetaTags: { property: string; content: string }[] | null = null;

export const updateMetaTags = (movieDetail) => {
  if (!movieDetail) return;

  const head = document.head;

  if (!originalMetaTags) {
    const oldTags = head.querySelectorAll("meta[property^='og:']");
    originalMetaTags = Array.from(oldTags).map((tag) => ({
      property: tag.getAttribute("property") || "",
      content: tag.getAttribute("content") || "",
    }));
  }

  head
    .querySelectorAll("meta[property^='og:']")
    .forEach((tag) => head.removeChild(tag));

  const metaInfo = [
    { property: "og:title", content: movieDetail.title },
    { property: "og:description", content: movieDetail.overview },
    {
      property: "og:image",
      content: `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`,
    },
    {
      property: "og:url",
      content: `${window.location.origin}/detail/${movieDetail.id}`,
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Movie App" },
  ];

  metaInfo.forEach(({ property, content }) => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", property);
    meta.setAttribute("content", content);
    head.appendChild(meta);
  });
};

export const restoreOriginalMetaTags = () => {
  if (!originalMetaTags) return;

  const head = document.head;

  head
    .querySelectorAll("meta[property^='og:']")
    .forEach((tag) => head.removeChild(tag));

  originalMetaTags.forEach(({ property, content }) => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", property);
    meta.setAttribute("content", content);
    head.appendChild(meta);
  });

  originalMetaTags = null;
};
