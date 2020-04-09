const path = require('path');
const WebpackConfig = require('./webpack.config');
const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = WebpackMerge(WebpackConfig, {
  mode: 'production',
  devtool: 'cheap-modules-source-map',
  plugins: [
    new CopyWebpackPlugin({
      from: path.resolve(__dirname, '../public'),
      to: path.resolve(__dirname, '../dist')
    })
  ],
  optimization: {
    // 可以自定义UglifyJsPlugin和一些配置
    minimizer: [
      // new UglifyJsPlugin({
      //   // 压缩js
      //   cache: true,
      //   parallel: true,
      //   sourceMap: true
      // }),
      new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJs: {
          output: {
            comments: false,
            beauitfy: fase
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      }),
      new OptimizeCssAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        }
      }
    }
  }
})