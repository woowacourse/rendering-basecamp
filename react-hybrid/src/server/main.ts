import "dotenv/config";

import express, { ErrorRequestHandler } from "express";
import path from "path";

import apiRouter from "./routes/api";
import movieRouter from "./routes/index";
import { renderNotFoundPage, renderServerErrorPage } from "./errorPages";

const app = express();
const PORT = process.env.PORT ?? 3000;
const STATIC_DIRECTORY = path.join(__dirname, "../static");

app.use("/static", express.static(STATIC_DIRECTORY));
app.use("/images", express.static(path.join(STATIC_DIRECTORY, "images")));

app.use("/api", apiRouter);
app.use("/", movieRouter);

app.use((_req, res) => {
  res.status(404).send(renderNotFoundPage());
});

const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("요청을 처리하지 못했습니다.", error);
  res.status(500).send(renderServerErrorPage());
};

app.use(handleError);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
