import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * 영화 상세 모달로 가는 Link 설정
 * - 사이트 안에서 클릭: 실제로는 홈(/?movieId=123)에 머문 채 모달만 띄우고, 주소창에는 /detail/123을 보여준다.
 *   shallow라서 홈의 getServerSideProps(인기 목록 요청)가 다시 실행되지 않는다.
 * - 새로고침/공유 링크: 브라우저가 /detail/123을 직접 요청하므로 상세 페이지가 SSR된다(OG 태그 유지).
 * - 렌더링되는 <a href>는 as 값(/detail/123)이라 크롤러도 상세 페이지를 발견할 수 있다.
 */
export const getMovieDetailLinkProps = (movieId: number) => ({
    href: { pathname: '/', query: { movieId } },
    as: `/detail/${movieId}`,
    shallow: true,
    scroll: false,
});

// 이 탭에서 클라이언트 라우팅이 한 번이라도 있었는지 (Pages Router는 history에 몇 번째 기록인지 남기지 않아 직접 기록)
let hasClientNavigation = false;

if (typeof window !== 'undefined') {
    Router.events.on('routeChangeComplete', () => {
        hasClientNavigation = true;
    });
}

/**
 * 모달 닫기
 * - 사이트 안에서 연 모달이면 뒤로가기로 닫아 히스토리를 깔끔하게 유지
 * - /?movieId=123 같은 주소로 바로 들어온 경우엔 돌아갈 기록이 없어 사이트 밖으로 나가버리므로 홈으로 교체
 */
export const closeMovieDetailModal = () => {
    if (hasClientNavigation) {
        Router.back();
        return;
    }
    Router.replace('/', undefined, { shallow: true, scroll: false });
};

/**
 * 홈 안에서의 뒤로/앞으로 가기(모달 열기/닫기)는 query(movieId)만 바뀌므로 shallow로 처리한다.
 * 처음 진입한 "/" 기록에는 shallow 정보가 없어서, 그대로 두면 그 기록으로 돌아갈 때
 * 홈의 getServerSideProps가 다시 실행돼 인기 목록을 또 요청한다.
 */
export const useShallowHistoryOnHome = () => {
    const router = useRouter();

    useEffect(() => {
        router.beforePopState(({ url, as, options }) => {
            const isHomeEntry = url === '/' || url.startsWith('/?');
            if (router.pathname === '/' && isHomeEntry) {
                router.replace(url, as, { ...options, shallow: true, scroll: false });
                return false;
            }
            return true;
        });

        return () => router.beforePopState(() => true);
    }, [router]);
};
