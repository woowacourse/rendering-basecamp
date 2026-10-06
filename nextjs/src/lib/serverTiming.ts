import type { ServerResponse } from 'http';

/**
 * Server-Timing 헤더를 내보낼지 여부 (서버 전용 환경변수라 요청 시점에 서버에서만 읽힌다)
 * - Preview 배포(VERCEL_ENV=preview): 엣지 <-> 함수 리전 왕복, 콜드 스타트까지 포함한 실제 TTFB 분석용
 * - ENABLE_SERVER_TIMING=true: Production 등에서 필요할 때만 잠깐 켜기
 * 그 외(Production 기본값)에는 서버 내부 처리 시간과 메트릭 이름이 응답 헤더로 노출되지 않도록 끈다.
 */
const isServerTimingEnabled = () =>
    process.env.ENABLE_SERVER_TIMING === 'true' || process.env.VERCEL_ENV === 'preview';

/**
 * getServerSideProps 안의 작업 시간을 재서 Server-Timing 헤더로 내보낸다.
 * DevTools > Network > 문서 요청 > Timing 탭에서 서버 구간을 확인할 수 있다.
 * (헤더 값은 ASCII만 허용되므로 name/desc는 영어로 작성)
 */
export const createServerTiming = () => {
    const enabled = isServerTimingEnabled();
    const startedAt = performance.now();
    const metrics: string[] = [];

    const record = (name: string, desc: string, duration: number) => {
        metrics.push(`${name};desc="${desc}";dur=${duration.toFixed(1)}`);
    };

    const measure = async <T>(name: string, desc: string, task: () => Promise<T>) => {
        if (!enabled) {
            return task();
        }

        const start = performance.now();
        try {
            return await task();
        } finally {
            record(name, desc, performance.now() - start);
        }
    };

    const apply = (res: ServerResponse) => {
        if (!enabled) {
            return;
        }

        record('gssp', 'getServerSideProps total', performance.now() - startedAt);
        res.setHeader('Server-Timing', metrics.join(', '));
    };

    return { measure, apply };
};
