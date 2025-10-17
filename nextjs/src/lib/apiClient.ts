import axios from "axios";

export const apiClient = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
	},
});
