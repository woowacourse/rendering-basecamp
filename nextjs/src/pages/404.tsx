import { ErrorState } from '@/components/common/ErrorState';
import { SITE } from '@/constants/site';
import Head from 'next/head';
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <>
            <Head>
                <title>{`페이지를 찾을 수 없어요 | ${SITE.NAME}`}</title>
            </Head>
            <ErrorState title="영화를 찾을 수 없어요" description="주소가 잘못되었거나 더 이상 제공되지 않는 영화예요.">
                <Link href="/" className="primary">
                    홈으로 가기
                </Link>
            </ErrorState>
        </>
    );
}
