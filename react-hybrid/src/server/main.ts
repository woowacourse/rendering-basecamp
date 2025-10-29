import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import movieRouter from "./routes/index";

const app = express();
const PORT = 3000;

const staticPath = path.resolve(process.cwd(), "dist/static");

app.use("/", movieRouter);
app.use("/static", express.static(staticPath));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
