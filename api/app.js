import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';

import router from './routes/index.js';

const PORT = process.env.PORT || 3000;

const app = express();

dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', router);

app.all('*', (req, res) => {
  res.status(400).send('404');
});

app.listen(PORT, () => {
  console.log(`api server opened at ${PORT}`);
});

export default app;
