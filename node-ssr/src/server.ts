import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  const html = /* html */ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>영화 리뷰</title>
      </head>
      <body></body>
    </html>
  `;

  res.send(html);
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
