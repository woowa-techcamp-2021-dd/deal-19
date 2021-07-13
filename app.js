import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import sassMiddleware from "node-sass-middleware";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpack from "webpack";

import indexRouter from "./routes/index.js";

import config from "./webpack.config.js";
const compiler = webpack(config);

const __dirname = path.resolve();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);
app.use(
  webpackHotMiddleware(compiler, {
    heartbeat: 2 * 1000,
  })
);

// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

export default app;
