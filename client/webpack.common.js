import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __dirname = path.resolve();

export default {
  target: 'web',
  entry: {
    main: './public/pages/main/index.js',
    editor: './public/pages/editor/index.js',
    productDetail: './public/pages/productDetail/index.js',
    location: './public/pages/location/index.js'
  },
  output: {
    filename: '[name]/[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import "${__dirname}/public/configs/globalStyle.scss";`
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(svg|png|ico|jpg|jpeg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2|otf|ttf)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]/style.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'main/index.html',
      template: 'public/pages/main/index.html',
      chunks: ['main'],
      favicon: 'public/assets/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      filename: 'editor/index.html',
      template: 'public/pages/editor/index.html',
      chunks: ['editor'],
      favicon: 'public/assets/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      filename: 'productDetail/index.html',
      template: 'public/pages/productDetail/index.html',
      chunks: ['productDetail'],
      favicon: 'public/assets/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      filename: 'location/index.html',
      template: 'public/pages/location/index.html',
      chunks: ['location'],
      favicon: 'public/assets/favicon.ico'
    })
  ]
};
