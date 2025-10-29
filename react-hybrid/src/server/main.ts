import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";

import router from "./routes/index";

const app = express();
const PORT = 3000;

app.use("/", router);

app.use("/static", express.static(path.join(__dirname, "../static")));
app.use("/images", express.static(path.join(__dirname, "../static/images")));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
