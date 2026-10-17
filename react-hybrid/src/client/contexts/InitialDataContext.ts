import { createContext, useContext } from "react";
import type { MovieItem } from "../types/Movie.types";

type InitialData = { movies: MovieItem[] };

export const InitialDataContext = createContext<InitialData>({ movies: [] });

export const useInitialData = () => useContext(InitialDataContext);
