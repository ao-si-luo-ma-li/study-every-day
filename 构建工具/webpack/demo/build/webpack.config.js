const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 向html中自动插入js链接
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 自动清理插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');  // 拆分css单一个文件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');  // 拆分css到多个文件
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const Webpack = require('webpack');
const HappyPack = require('happypack');
const os = require('os');
const happayThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

const indexMain = new ExtractTextWebpackPlugin({filename: '[name].[hash:8].css'});
const indexOther = new ExtractTextWebpackPlugin({filename: 'third-part.css'});
const isProdution = process.env.NODE_ENV === 'production';
module.exports = {
  mode: 'development', // 开发者模式
  // entry: ['@babel/polyfill', path.resolve(__dirname, '../src/index.js')],  // 入口文件是src下的index.js
  entry: {
    main: path.resolve(__dirname, '../src/index.js')
  },  // 入口文件是src下的index.js
  output: {
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].js',  // chunkname就是未被列在entry中，但有些场景需要被打包出来的文件命名配置
    // publicPath: path.resolve(__dirname, '../dist'), // js引用路径
    path: path.resolve(__dirname, '../dist'),  // 出口目录，dist文件
  },
  module: {
    rules: [
      {
        test: /.vue$/i,
        use: ['vue-loader']
      },
      {
        test: /.css$/,
        use: isProdution
        ? indexMain.extract({
          fallback: ['style-loader'],
          use: [
            'css-loader', 
            'postcss-loader'
          ]
        })
        : ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /.less$/,
        use: isProdution
        ? indexOther.extract({
          fallback: ['style-loader'],
          use: [
            'css-loader', 
            'postcss-loader',
            'less-loader'
          ]
        })
        : [
          'style-loader',   // 将css插入到html中
          // MiniCssExtractPlugin.loader, // 拆分css到单文件
          'css-loader', 
          'postcss-loader', 
          // {
          //   loader:'postcss-loader',
          //   options:{
          //       plugins:[require('autoprefixer')]
          //   }
          'less-loader'
        ]
      },
      {
        test: /.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20480,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20480,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20480,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /.js$/i,
        exclude: /node-modules/,
        use: [
          {
            loader: 'happypack/loader?id=happyBabel'
          }
        ]
      },
      // {
      //   test: /.js$/i,
      //   exclude: /node-modules/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         // 上面的babel-loader只会将 ES6/7/8语法转换为ES5语法，但是对新api并不会转换 例如(promise、Generator、Set、Maps、Proxy等)
      //         // 此时我们需要借助babel-polyfill来帮助我们转换
      //         presets: ['@babel/preset-env']
      //       },
      //     }
      //   ]
      // }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['*', '.js', '.json', '.vue']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      filename: 'index.html',
      chunks: ['main']  // 与入口文件对应的模块名
    }),
    indexMain,
    indexOther,
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css'
    }),
    new HappyPack({
      id: 'happyBabel', // 与loader对应的id标志
      // 用法和 loader 的配置一样，注意这里是 loaders
      loaders:[
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          },
          cacheDirectory: true
        }
      ],
      threadPool: happayThreadPool  // 共享进程池
    }),
    new CleanWebpackPlugin(),
    new vueLoaderPlugin(),
  ]
}