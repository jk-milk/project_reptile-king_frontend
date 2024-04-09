import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 페이지 이동 시 스크롤 위치 조정(특정 페이지 제외)
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 스크롤을 조정하지 않을 페이지의 경로 목록
    const excludePaths = ['/board/write', '/board/modify'];

    // 현재 경로가 제외 목록에 없으면 스크롤을 최상단으로 이동
    if (!excludePaths.includes(pathname)) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
