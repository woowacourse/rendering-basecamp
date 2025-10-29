import React, { createContext, useContext } from "react";
import type { MovieItem } from "../types/Movie.types";
import type { MovieDetailResponse } from "../types/MovieDetail.types";

export type InitialData = {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse | null;
};

const InitialDataContext = createContext<InitialData | null>(null);

export const InitialDataProvider = ({
  value,
  children,
}: {
  value: InitialData | null;
  children: React.ReactNode;
}) => {
  return (
    <InitialDataContext.Provider value={value}>
      {children}
    </InitialDataContext.Provider>
  );
};

export const useInitialData = () => {
  return useContext(InitialDataContext);
};
