import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import apiRouter from './routes/api';
import movieRouter from "./routes/index";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticDirectory = path.join(__dirname, '../../dist/static');

app.use('/static', express.static(staticDirectory));
app.use(express.static(staticDirectory));

app.use('/api', apiRouter);
app.use("/", movieRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
