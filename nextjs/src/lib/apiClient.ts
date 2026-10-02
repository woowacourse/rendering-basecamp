import axios from "axios";

// 이 클라이언트는 getServerSideProps에서만 사용합니다.
export const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN 환경 변수가 필요합니다.");
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
