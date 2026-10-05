// CDN(Vercel)이 HTML과 _next/data JSON을 60초 동안 캐싱하고, 이후 5분간은 이전 응답을 주면서 백그라운드에서 갱신
export const CDN_CACHE_CONTROL =
  "public, s-maxage=60, stale-while-revalidate=300";
