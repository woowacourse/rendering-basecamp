import axios from "axios";

const isServer = typeof window === "undefined";

export const apiClient = axios.create(
  isServer
    ? {
        baseURL: "https://api.themoviedb.org/3",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      }
    : {
        baseURL: "/api",
        headers: {
          "Content-Type": "application/json",
        },
      }
);
