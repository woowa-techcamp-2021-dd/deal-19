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
    chatList: './public/pages/chatList/index.js',
    chatDetail: './public/pages/chatDetail/index.js',
    location: './public/pages/location/index.js'
  },
  output: {
    filename: '[name]/[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: 'dist/',
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
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        }
      },
      {
        test: /\.(woff|woff2|otf|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '../'
        }
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
      favicon: 'public/assets/favicon.png'
    }),
    new HtmlWebpackPlugin({
      filename: 'editor/index.html',
      template: 'public/pages/editor/index.html',
      chunks: ['editor'],
      favicon: 'public/assets/favicon.png'
    }),
    new HtmlWebpackPlugin({
      filename: 'productDetail/index.html',
      template: 'public/pages/productDetail/index.html',
      chunks: ['productDetail'],
      favicon: 'public/assets/favicon.png'
    }),
    new HtmlWebpackPlugin({
      filename: 'chatList/index.html',
      template: 'public/pages/chatList/index.html',
      chunks: ['chatList'],
      favicon: 'public/assets/favicon.png'
    }),
    new HtmlWebpackPlugin({
      filename: 'chatDetail/index.html',
      template: 'public/pages/chatDetail/index.html',
      chunks: ['chatDetail'],
      favicon: 'public/assets/favicon.png'
    }),
    new HtmlWebpackPlugin({
      filename: 'location/index.html',
      template: 'public/pages/location/index.html',
      chunks: ['location'],
      favicon: 'public/assets/favicon.png'
    })
  ]
};