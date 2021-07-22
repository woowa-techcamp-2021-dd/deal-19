import webpack from 'webpack';
import { merge } from 'webpack-merge';

import common from './webpack.common.js';

const PORT = process.env.PORT || 9000;

export default merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: 'dist',
    port: PORT
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
});
