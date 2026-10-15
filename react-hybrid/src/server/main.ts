import "dotenv/config";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import movieRouter from "./routes/index";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/static", express.static(path.join(__dirname, "../../dist/static")));
// 컴포넌트들이 이미지를 /images/... 로 부르므로 같은 폴더를 /images 로도 연다.
app.use("/images", express.static(path.join(__dirname, "../../dist/static/images")));

app.use("/", movieRouter);

// Start server
app.listen(PORT, (error?: Error) => {
  if (error) {
    console.error(`서버를 시작하지 못했습니다: ${error.message}`);
    process.exit(1);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
