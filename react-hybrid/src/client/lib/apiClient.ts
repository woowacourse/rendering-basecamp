import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
  },
});

// 모듈 평가 시점이 아니라 요청 시점에 토큰을 읽는다.
// 서버 번들에서는 import 호이스팅 때문에 dotenv.config()보다 이 모듈이 먼저 평가될 수 있다.
apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  return config;
});
