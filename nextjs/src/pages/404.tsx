import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <div id="wrap">
      <Head>
        <title>영화를 찾을 수 없습니다 | 영화 리뷰</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="error-container page-error">
        <h1>영화를 찾을 수 없습니다.</h1>
        <Link href="/" className="primary">홈으로 돌아가기</Link>
      </main>
    </div>
  );
}
