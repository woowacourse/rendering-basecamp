import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import movieRouter from './routes/index';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static(path.join(__dirname, '../../dist/static')));
app.use(
  '/images',
  express.static(path.join(__dirname, '../../dist/static/images'))
);

app.use('/', movieRouter);

// Start server
app.listen(PORT, () => {
  console.log(`서버는  http://localhost:${PORT} 여긴데용ㅋ`);
});
