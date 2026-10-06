import { ErrorState } from '@/components/common/ErrorState';
import { SITE } from '@/constants/site';
import Head from 'next/head';
import Link from 'next/link';

export default function ServerErrorPage() {
    return (
        <>
            <Head>
                <title>{`일시적인 오류가 발생했어요 | ${SITE.NAME}`}</title>
            </Head>
            <ErrorState title="잠시 문제가 생겼어요" description="영화 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.">
                <button className="retry-button" onClick={() => window.location.reload()}>
                    다시 시도
                </button>
                <Link href="/" className="close-button">
                    홈으로 가기
                </Link>
            </ErrorState>
        </>
    );
}
