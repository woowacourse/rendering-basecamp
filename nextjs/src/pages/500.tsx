import Head from "next/head";
import Link from "next/link";

export default function ServerError() {
  return (
    <div id="wrap">
      <Head>
        <title>영화 정보를 불러올 수 없습니다 | 영화 리뷰</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="error-container page-error">
        <h1>영화 정보를 불러오는데 실패했습니다.</h1>
        <p>잠시 후 다시 시도해주세요.</p>
        <Link href="/" prefetch={false} className="retry-button">홈으로 돌아가기</Link>
      </main>
    </div>
  );
}
