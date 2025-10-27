import React, { ComponentType } from "react";

interface RouteProps {
  path: string;
  element: ComponentType<any>; // 컴포넌트 타입
  serverData?: any;
  currentPath?: string; // SSR용
}

export function Route({ path, element: Element, serverData, currentPath }: RouteProps) {
  // 현재 URL 가져오기 (브라우저 or 서버)
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : currentPath ?? "/";

  // 동적 라우트 매칭 지원 (예: /detail/:movieId)
  const regex = new RegExp("^" + path.replace(/:\w+/g, "([^/]+)") + "$");
  const match = pathname.match(regex);

  if (!match) return null;

  // 정규식 캡처 그룹을 이용해 params 추출
  const paramNames = (path.match(/:(\w+)/g) || []).map((p) => p.slice(1));
  const params = paramNames.reduce((acc, name, i) => {
    acc[name] = match[i + 1];
    return acc;
  }, {} as Record<string, string>);

  // 실제 렌더링
  return <Element {...serverData} params={params} />;
}
