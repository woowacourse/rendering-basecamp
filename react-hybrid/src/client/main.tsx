import React, { useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const { movies, movieDetail } = window.__INITIAL_DATA__;

/**
 * hydrateRoot는 hydration을 예약만 하고 바로 반환하므로, afterHydrate는 "예약이 끝난 시점"이다.
 * 실제 hydration이 끝난 시점은 hydration 후 커밋된 컴포넌트의 useEffect로 기록한다.
 * (DOM을 렌더링하지 않으므로 서버 HTML과의 일치 여부에 영향이 없다.)
 */
function HydrationCompleteMarker() {
  useEffect(() => {
    performance.mark("hydrationComplete");
    performance.measure("hydration-complete", "beforeRender", "hydrationComplete");
  }, []);
  return null;
}

performance.mark("beforeRender");
hydrateRoot(
  document.getElementById("root"),
  <>
    <App movies={movies} movieDetail={movieDetail} />
    <HydrationCompleteMarker />
  </>
);
performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
