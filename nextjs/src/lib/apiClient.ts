import axios from "axios";

// 서버사이드와 클라이언트사이드 모두에서 작동하도록 환경 변수 처리
const getAccessToken = () => {
  // 서버사이드에서는 TMDB_ACCESS_TOKEN, 클라이언트사이드에서는 NEXT_PUBLIC_TMDB_ACCESS_TOKEN
  return (
    process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN
  );
};

export const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAccessToken()}`,
  },
});
