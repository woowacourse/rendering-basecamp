import type { ServerResponse } from 'http';

/**
 * getServerSideProps 안의 작업 시간을 재서 Server-Timing 헤더로 내보낸다.
 * 배포 환경에서도 DevTools > Network > Timing 탭에서 서버 구간을 확인할 수 있다.
 * (헤더 값은 ASCII만 허용되므로 name/desc는 영어로 작성)
 */
export const createServerTiming = () => {
    const startedAt = performance.now();
    const metrics: string[] = [];

    const record = (name: string, desc: string, duration: number) => {
        metrics.push(`${name};desc="${desc}";dur=${duration.toFixed(1)}`);
    };

    const measure = async <T>(name: string, desc: string, task: () => Promise<T>) => {
        const start = performance.now();
        try {
            return await task();
        } finally {
            record(name, desc, performance.now() - start);
        }
    };

    const apply = (res: ServerResponse) => {
        record('gssp', 'getServerSideProps total', performance.now() - startedAt);
        res.setHeader('Server-Timing', metrics.join(', '));
    };

    return { measure, apply };
};
