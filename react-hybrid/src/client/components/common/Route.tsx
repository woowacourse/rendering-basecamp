import React, { ComponentType } from "react";

interface RouteProps {
  path: string;
  element: ComponentType<any>; // 컴포넌트 타입
  serverData?: any;
  currentPath?: string; // SSR용
}

export function Route({ path, element: Element, serverData, currentPath }: RouteProps) {
  // 클라이언트에서는 window.__INITIAL_DATA__를, 서버에서는 serverData를 사용
  const data =
    typeof window === "undefined"
      ? serverData
      : (window.__INITIAL_DATA__ ?? serverData);

  // 현재 URL 가져오기 (브라우저 or 서버)
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : currentPath ?? "/";

  // 동적 라우트 매칭 지원 (예: /detail/:movieId)
  const regex = new RegExp("^" + path.replace(/:\w+/g, "([^/]+)") + "$");
  const match = pathname.match(regex);

  if (!match) return null;

  return <Element {...data} />;
}
