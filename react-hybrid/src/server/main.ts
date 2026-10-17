import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import movieRouter from './routes/index';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticDirectory = path.join(__dirname, '../../dist/static');

app.use('/static', express.static(staticDirectory));
app.use('/images', express.static(path.join(staticDirectory, 'images')));

app.use('/', movieRouter);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
