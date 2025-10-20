import axios from "axios";

console.log(process.env);
console.log(process.env.TMDB_ACCESS_TOKEN);

export const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});
