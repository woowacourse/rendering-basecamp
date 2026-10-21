import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;

performance.mark("hydration-start");
hydrateRoot(
  document.getElementById("root"),
  <App initialData={initialData} />
);
// hydrateRoot는 hydration을 예약만 하고 바로 돌아온다.
// 실제 hydration이 끝난 시점은 App의 useEffect에서 기록한다.
performance.mark("hydrateRoot-returned");
performance.measure(
  "hydrateRoot 호출",
  "hydration-start",
  "hydrateRoot-returned"
);
