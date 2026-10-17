import "dotenv/config";

import express from "express";
import path from "path";

import movieRouter from "./routes/index";

const app = express();
const PORT = process.env.PORT ?? 3000;
const STATIC_DIRECTORY = path.join(__dirname, "../static");

app.use("/static", express.static(STATIC_DIRECTORY));
app.use("/images", express.static(path.join(STATIC_DIRECTORY, "images")));

app.use("/", movieRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
