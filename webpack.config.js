import webpack from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = path.resolve();
const PORT = process.env.PORT || 8080;

export default {
  mode: "development",
  target: "web",
  entry: ["./public/javascripts/main.js", "webpack-hot-middleware/client"],
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
    publicPath: "/",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    port: PORT,
    hot: true,
  },
};
