import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import { SERVER_PORT } from "./constants/site";
import { PageResponse } from "./controllers/types";
import { homeController } from "./controllers/homeController";
import { movieDetailController } from "./controllers/movieDetailController";
import { notFoundController } from "./controllers/errorController";

const app = express();

app.use(express.json());

const send = (res: Response, { status, html }: PageResponse) => {
  res.status(status).type("html").send(html);
};

app.get("/", async (_req: Request, res: Response) => {
  send(res, await homeController());
});

app.get("/detail/:id", async (req: Request<{ id: string }>, res: Response) => {
  send(res, await movieDetailController(req.params.id));
});

// public 폴더 속 정적 파일을 웹에서 접근할 수 있도록 만든다.
// 목업 HTML(index.html)이 "/" 응답을 가로채지 않도록 index 파일은 제공하지 않는다.
app.use(express.static(path.join(__dirname, "../public"), { index: false }));

app.use((_req: Request, res: Response) => {
  send(res, notFoundController());
});

app.listen(SERVER_PORT, (): void => {
  console.log(`🌟 서버가 http://localhost:${SERVER_PORT} 에서 실행 중입니다.`);
});

export default app;
