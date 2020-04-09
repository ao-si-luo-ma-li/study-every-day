const Webpack = require('webpack');
const WebpackConfig = require('./webpack.config');
const WebpackMerge = require('webpack-merge');

module.exports = WebpackMerge(WebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 3344,
    hot: true,
    contentBase: '../dist'
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin()
  ]
})