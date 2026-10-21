import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__;

performance.mark("beforeRender");
hydrateRoot(document.getElementById("root"), <App initialData={initialData} />, {
  onRecoverableError: (error) => {
    console.error("[hydration] 서버 HTML 과 클라이언트 렌더 결과가 다릅니다.", error);
  },
});
performance.mark("afterHydrate");
performance.measure("hydration", "beforeRender", "afterHydrate");
