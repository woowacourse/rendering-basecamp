// import 는 호이스팅되므로, 환경변수 로드는 반드시 첫 import 로 둔다.
import "dotenv/config";

import express from "express";
import path from "path";

import movieRouter from "./routes/index";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const STATIC_DIR = path.resolve(__dirname, "../static");

// Railway 같은 프록시 뒤에서도 og:url 에 https 가 찍히도록 X-Forwarded-* 를 신뢰한다.
app.set("trust proxy", true);

app.use("/static", express.static(STATIC_DIR));
// 컴포넌트는 /images/... 경로로 이미지를 참조한다.
app.use("/images", express.static(path.join(STATIC_DIR, "images")));

app.use("/", movieRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
