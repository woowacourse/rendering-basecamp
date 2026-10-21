interface ErrorPageProps {
  message: string;
}

export default function ErrorPage({ message }: ErrorPageProps) {
  return (
    <div>
      <p>{message}</p>
      <a href="/">홈으로 가기</a>
    </div>
  );
}
