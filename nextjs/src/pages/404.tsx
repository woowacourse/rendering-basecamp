import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();
  return (
    <>
      <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <button onClick={() => router.push('/')}>홈으로 가기</button>
    </>
  );
}
