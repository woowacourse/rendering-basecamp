import 'dotenv/config';
import express from 'express';
import path from 'path';
import movieRouter from './routes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/images', express.static(path.join(__dirname, '../static/images')));
app.use(movieRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
