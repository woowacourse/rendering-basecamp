export default function ErrorPage({ message }: { message?: string }) {
  return /* html */ `
        <div id="wrap">
        ${
          message
            ? `<h1>${message}</h1>`
            : " <h1>에러가 발생했습니다.</h1> <p>잠시 후 다시 시도해주세요.</p>"
        }
        </div>
    `;
}
