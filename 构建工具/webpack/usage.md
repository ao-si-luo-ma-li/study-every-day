### Webpack 手册 [LinkTo](https://www.webpackjs.com/concepts/)

> webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle

<b>核心概念</b>
* [入口(entry)](https://www.webpackjs.com/concepts/entry-points/)
* [输出(output)](https://www.webpackjs.com/concepts/output/)
* [loader](https://www.webpackjs.com/concepts/loaders/)
* [插件(plugins)](https://www.webpackjs.com/concepts/plugins/)

### MODULES
#### 模块方法
* require.context，使用 directory 路径、includeSubdirs 选项和 filter 来指定一系列完整的依赖关系，便于更细粒度的控制模块引入
  require.context函数执行后返回的是一个函数,并且<b>这个函数有3个属性</b>
  * resolve {Function} 
  * keys {Function} - 返回匹配成功模块的名字组成的数组
  * id {String}
```
require.context(directory:String, includeSubdirs:Boolean /* 可选的，默认值是 true */, filter:RegExp /* 可选的 */)
```

#### webpack 中那些最易混淆的知识点
<b>1、module、chunk、bundle的区别是什么？</b>
答：其实module、chunk、bundle是同一份逻辑代码在不同转换场景下的取了3个名字。我们直接写出来的是module，webpack处理时是chunk，最后生成浏览器可以运行的bundle。
![webpack处理文件时不同名字](https://user-gold-cdn.xitu.io/2019/5/29/16b0153001913dc5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

<b>2、filename和chunkFilename的区别？</b>
* filename 指的是列在entry中，打包后输出的文件的名称
* chunkFilename 是指未列在entry中，却又需要打包输出的文件的名称


<b>3、webpackPrefetch、webpackPreload 和 webpackChunkName 到底是干什么的？</b>
来自 webpack [魔法注释](https://webpack.docschina.org/api/module-methods/#magic-comments)
* 由于打包成 chunkFilename 时，往往打包的文件是意义不明、辨识度不高的 chunk id。使用 webpackChunkName，我们可以在 import 文件时，在 import 里以注释的形式为 chunk 文件取别名。
```
async function getAsyncComponent() {
    var element = document.createElement('div');
  
    // 在 import 的括号里 加注释 /* webpackChunkName: "lodash" */ ，为引入的文件取别名
    const { default: _ } = await import(/* webpackChunkName: "lodash" */ 'lodash');

    element.innerHTML = _.join(['Hello!', 'dynamic', 'imports', 'async'], ' ');

    return element;
}
```
* webpackPrefetch 「预拉取」。如果我们 import 的时候添加 webpackPrefetch (注释形式)，就会以 ```<link rel="prefetch" as="script">``` 的形式预拉取 chunk 代码
* webpackPreload 「预加载」。会预加载当前导航下可能需要资源

> <b>一句话总结：</b>webpackChunkName 是为预加载的文件取别名，webpackPrefetch 会在浏览器闲置下载文件，webpackPreload 会在父 chunk 加载时并行下载文件

<b>4、hash、chunkhash、contenthash 有什么不同？</b>
```
首先来个背景介绍，哈希一般是结合 CDN 缓存来使用的。
如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，
触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存
```
* hash 计算是跟整个项目的构建相关，项目中如果有些变动，hash 一定会变。这样子是没办法实现 CDN 和浏览器缓存的
* chunkhash 就是解决这个问题的，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值
* 但是对于同一 chunk 可能存在多种资源，如 js 引入了 css，如果js发生了变化，css的 chunkhash 也会变。
为此，contenthash 将根据资源内容创建出唯一 hash，也就是说文件内容不变，hash 就不变。
```
{
    entry: {
        index: "../src/index.js",
        utils: '../src/utils.js',
    },
    output: {
        filename: "[name].[chunkhash].js",
    },
      
    ......
    
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'index.[contenthash].css' // 这里改为 contenthash
        }),
    ]
}
```
> <b>一句话总结：</b>hash 计算与整个项目的构建相关；chunkhash 计算与同一 chunk 内容相关；contenthash 计算与文件内容本身相关。

<b>5、sourse-map 中 eval、cheap、inline 和 module 各是什么意思？</b>

sourse-map <b>就是一份源码和转换后代码的映射文件</b>
![sourse-map 种类：](https://user-gold-cdn.xitu.io/2019/5/29/16b01530fc5b70a3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

参数|参数解释
---|:--
eval|打包后的模块都使用 eval() 执行，行映射可能不准；不产生独立的 map 文件
cheap|map 映射只显示行不显示列，忽略源自 loader 的 source map
inline|映射文件以 base64 格式编码，加在 bundle 文件最后，不产生独立的 map 文件
module|增加对 loader source map 和第三方模块的映射


参考：
[webpack 中那些最易混淆的 5 个知识点](https://juejin.im/post/5cede821f265da1bbd4b5630)

<b>6、移除webpack默认的严格模式</b>


<b>7、设置目录别名后，css、html、图片路径需要修改</b>
>但是在 css 文件，如 less、 sass、 stylus 中，使用 @import '@/style/theme' 的语法引用相对 @ 的目录确会报错，”找不到 ‘@’ 目录”，说明 webpack 没有正确识别资源相对路径。

>原因是 css 文件会被用 css-loader 处理，这里 css @import 后的字符串会被 css-loader 视为绝对路径解析，因为我们并没有添加 css-loader 的 alias ，所以会报找不到 @ 目录。


```
alias: {
  '@src': path.resolve('src'),
  '@static': path.resolve('static')
},
```
> 使用 ~@xx的方式引入资源
> > 请注意！！！中文的～，英文的~。弄错了，bug找死人


<b>8、webpack引入less相关loader报Error: Cannot find module 'less'</b>
需要额外的 less 模块，神奇！！！
> npm install less --save-dev

<b>9、自己写组件库，需要注意些什么？知不知道 antd 是如何实现的？</b>
[怎么写一个React组件库（一）](https://www.cnblogs.com/mingjiezhang/archive/2017/06/16/7029421.html)
* .npmignore
    在这里我们将忽略lib目录。我们的用户将只和在build目录中的转码(transpile)后的代码接触，因此我们不需要(或者不想要)使得他们的node_modules由于不必要的代码而变得臃肿

<b>10、先了解懒加载，动态导入的功能。webpack4.0，新功能就是可以用import做动态加载</b>
    ```
    //如果你知道 export的函数名
    import('./' + filename). then(({fnName}) =>{
        console(fnName);
    }).catch(err => {
        console(err.message); 
    });
    ```
    这里有一点要注意的是：
    > import的加载是加载的模块的引用。而import()加载的是模块的拷贝，就是类似于require()
    ```
    module.js 文件：
    export let counter = 3;
    export function incCounter() {
        counter++;
    }

    main.js 文件：
    【案例一】
    let filename = 'module.js'; 
    import('./' + filename).then(({counter, incCounter})=>{
        console.log(counter); //3
        incCounter(); 
        console.log(counter); //3
    }); 
    【案例二】
    import {counter, incCounter} from './module.js';
    console.log(counter); //3
    incCounter();
    console.log(counter); //4
    ```
<b>11、优化配置指优化哪些指标？</b>
* 1、优化打包速度
  > 构建速度指的是我们每次修改代码后热更新的速度以及发布前打包文件的速度。
	+ 明确区分 mode 类型，因为 mode 默认是 production。production 模式下会进行 tree shaking（除去无用代码）和 uglifyjs （代码混淆压缩）
	+ 缩小文件的搜索范围（配置 include exclude alias noParse extensions）
		- noParse  当我们代码中使用到import jq from 'jquery'时，webpack会去解析jq这个库是否有依赖其他的包。但是我们对类似jquery这类依赖库，一般会认为不会引用其他的包(特殊除外,自行判断)。增加noParse属性,告诉webpack不必解析，以此增加打包速度
	+ 使用 HappyPack 开启多进程Loader转换
		- HappyPack的基本原理是将这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间
	+ 优化代码的压缩时间
		- 使用webpack-parallel-uglify-plugin 增强代码压缩

### 杂谈：
* 1、cross-env模块， npm i -D cross-env 模块。在执行webpack命令之前写上 cross-env xxx=yyy即可配置，那么即可通过process.env.xxx来访问
```cross-env NODE_ENV=production webpack --config build/webpack.config.js```

* 2、url-loader和file-loader可以加载任何文件。url-loader可以将图片转为base64字符串，能更快的加载图片，一旦图片过大，就需要使用file-loader的加载本地图片，故url-loader可以设置图片超过多少字节时，使用file-loader加载图片

* 3、webpack可以通过注释干好多事