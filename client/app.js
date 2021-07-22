import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';

import devServerMiddleware from './middlewares/devServerMiddleware.js';
import webpackDevConfig from './webpack.dev.js';

import router from './routes/index.js';

const compiler = webpack(webpackDevConfig);
const __dirname = path.resolve();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath
  }));
  app.use(devServerMiddleware(compiler));
} else {
  app.use(express.static(path.join(__dirname, '/dist')));
}

app.use('/', router);

app.all('*', (req, res) => {
  res.status(400).send('404');
});

export default app;
