import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import movieRouter from "./routes/index";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/static", express.static(path.join(__dirname, "../../dist/static")));
app.use("/images", express.static(path.join(__dirname, "../../public/images")));

app.use("/", movieRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
