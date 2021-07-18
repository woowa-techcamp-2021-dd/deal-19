import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import './env.js';

import indexRouter from './routes/index.js';

import config from './webpack.config.js';
import devServerMiddleware from './devServerMiddleware.js';

const compiler = webpack(config);
const __dirname = path.resolve();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname)));

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));
app.use(devServerMiddleware(compiler));

app.use('/', indexRouter);

export default app;
