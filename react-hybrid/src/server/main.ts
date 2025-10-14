import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import movieRouter from "./routes/index";
import detailRouter from "./routes/detail";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/static", express.static(path.join(__dirname, "../../dist/static")));

app.use("/", movieRouter);
app.use("/detail", detailRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
