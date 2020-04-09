#### 1.前期准备

* 按照官方文档安卓sdk 模拟器等
* 确保手机已链接到电脑并启用开发者模式
* 将android 文件夹导入到xcode
* 点击开始同步gradle (最好用tech网，因为一些包在内网一些在外网)

#### 2.打包

react native会把js打包成jsbundle，native端会把jsbundle和native app打在一起，native端获取jsbundle的方式有两种，一种是a.从node server下载jsbundle  b.从本地jsbundle文件获取

<b>a.从node server获取(在开发过程中需要频繁修改，一般用此方式)</b>

  1. 确保手机和电脑已链接到同一局域网下

  2. npm start 

  3. 打开安卓手机>设置>网络>代理 到pc

<b>b. 打本地jsbundle包</b>

    jsbundle分为基础包和业务包

    1. 进入项目根目录，进入metro_build.sh文件，检查generateJSBundleFile函数里的react-native bundle命令单的 --platform参数是否是ios，如不是，请改成ios

    2. 执行 ./metro_build.sh c index.common.js common.jsbundle 打基础包

    3. 执行 ./metro_build.sh b index.js {moduleName}.jsbundle 打业务包

    4. 执行完2 3后，会在/jsbundle文件夹下生成common.jsbundle和contacts.jsbundle两个文件

    5. 将第4步生成的两个jsbundle文件复制到android/app/src/main/assets目录下

#### 3.运行调试

1. 点击右侧的gradle展开工具栏

2. 执行clean(作用是清空build目录)

3. 执行installDebug(这一步同时做了build和run两个操作)

