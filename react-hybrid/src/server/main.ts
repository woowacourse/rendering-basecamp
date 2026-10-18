// 다른 모듈보다 먼저 환경변수를 불러온다. (import는 끌어올려져 dotenv.config() 호출보다 먼저 실행된다)
import "dotenv/config";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import movieRouter from "./routes/index";
import { PORT } from "./site";
import { buildCssBundle } from "./cssBundle";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 서버가 시작될 때 한 번만 CSS를 합쳐 두고 재사용한다.
const CSS_BUNDLE = buildCssBundle(path.join(__dirname, "../../dist/static/styles"));
app.get("/static/styles/bundle.css", (_req, res) => {
  res.type("css").send(CSS_BUNDLE);
});

app.use("/static", express.static(path.join(__dirname, "../../dist/static")));
// 컴포넌트가 /images/... 경로로 이미지를 참조하므로 같은 파일을 /images로도 제공한다.
app.use("/images", express.static(path.join(__dirname, "../../dist/static/images")));

app.use("/", movieRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
