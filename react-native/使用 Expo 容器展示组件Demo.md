### 建expo项目进行组件展示？
详细文档，请移步官网 expo

#### 一、创建步骤

* 1、全局安装 expo-cli 工具
* 2、可以先init一个expo相关项目，将配置文件与我们的react-native-ui项目合并。重点关注 package.json 和 app.json
* 3、expo start 启动加入新配置的信息的项目

#### 二、遇到的各种问题

* 1、react-native 依赖必须在 dependencies 目录，否则启动项目就会报错
* 2、expo 版本对 app.json 中的 sdkVersion 版本有着强依赖，版本号必须完全一致
* 3、expo 版本对 react-native 版本也有强依赖，随便使用rn版本会报错 "react native version mismatch."。推荐使用 "react-native": "https://github.com/expo/react-native/archive/sdk-xx.x.x.tar.gz"，来关*联expo/react-native
* 4、使用expo最新版本(32.0.0)，依赖react-native@0.57.1，这个rn会依赖 schedule@0.4.0（版本号绝不能错） React-native can't find schedule/tracking。

* 5、使用expo后，原来引用的字体模块 react-native-vector-icon 会依赖 @expo/vector-icons/createIconSet，然后所有的字体引入或字体方法都要使用 @expo/vector-icons 中的模块了

相关issues：https://github.com/expo/vector-icons/issues/9

* 6、expo start后发现总是报错：Uncaught Error: Module AppRegistry is not a registered callable module 。原因是AppRegistry从来没有被执行，expo是在模块中默认执行的。将package.json中的入口文件main的映射修改，"main": "node_modules/expo/AppEntry.js"，原来是（"main"：“src/index.js”）。但这个修改提交会导致别人安装我们组件库时入口丢失，导致组件使用失败。（代替方法寻找中）

* 7、引入自定义的 iconfont 时，import createIconSet from 'react-native-vector-icons/lib/create-icon-set'; 改为 import createIconSet from '@expo/vector-icons/createIconSet'; 并且要引入字体资源作为第三个参数，否则会报错，资源找不到

