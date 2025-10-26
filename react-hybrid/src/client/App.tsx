import React from "react";
import { OverlayProvider } from "overlay-kit";
import { Route, Routes } from "react-router-dom";
import MovieHomePage from "./pages/MovieHomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

function App() {
	return (
		<OverlayProvider>
			<Routes>
				<Route path="/" element={<MovieHomePage />} />
				<Route path="/detail/:movieId" element={<MovieDetailPage />} />
			</Routes>
		</OverlayProvider>
	);
}

export default App;
