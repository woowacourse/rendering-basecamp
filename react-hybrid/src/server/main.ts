import express from 'express';
import path from 'path';

import apiRouter from './routes/api';
import movieRouter from './routes/index';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const staticDirectory = path.resolve(__dirname, '../static');

app.use('/static', express.static(staticDirectory));
app.use(express.static(staticDirectory));

app.use('/api', apiRouter);
app.use('/', movieRouter);

const server = app.listen(PORT);

server.on('listening', () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

server.on('error', error => {
  console.error('서버 실행에 실패했습니다.', error);
});
