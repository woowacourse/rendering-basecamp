import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";

import movieRouter from "./routes/index";
import detailRouter from "./routes/detail";

const app = express();
const PORT = 3000;

app.use("/", movieRouter);
app.use("/detail", detailRouter);

app.use("/static", express.static(path.join(__dirname, "../static")));
app.use("/images", express.static(path.join(__dirname, "../static/images")));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
