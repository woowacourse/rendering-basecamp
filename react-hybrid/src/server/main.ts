import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";

import movieRouter from "./routes/index";

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve("dist/server");

// 정적 파일 제공
app.use("/static", express.static(path.resolve("dist/static")));
app.use("/images", express.static(path.resolve("dist/static/images")));
app.use("/styles", express.static(path.resolve("dist/static/styles")));

app.use("/", movieRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
