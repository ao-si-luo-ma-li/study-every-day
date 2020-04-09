#### 1.前期准备

* 确保手机已链接到电脑并启用开发者模式
* 将iOS/SmartOperationMobile 文件夹导入到xcode
* 点击红框这里选择机型最上面就是你自己的手机
* 点击左侧的项目目录进入项目配置界面，在general>signing下选择team(如未登录请先登录)
  ```
    如果认证失败，请先修改Identity>Bundle Identifier 比如改为{你的名字}.com.pingan.SmartOperationMobile

    没有认证开发者的话在编译是会报错，如果一直认证失败，请找到iOS/{项目名}/{项目名}.entitlements文件，注释掉<key>aps-environment</key>这行代码来跳过认证
  ```

#### 2.打包

react native会把js打包成jsbundle，native端会把jsbundle和native app打在一起，native端获取jsbundle的方式有两种，一种是a.从node server下载jsbundle  b.从本地jsbundle文件获取

<b>a. 从node server获取(在开发过程中需要频繁修改，一般用此方式)</b>
  1. 确保手机和电脑已链接到同一局域网下
   
  2. 打开SmartOperationMobile/RN/RNViewController.m 将这行代码

     jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil]; 

    替换为jsCodeLocation = [NSURL URLWithString:@"http://{Your pc Ip Address}:{Your port, 8081 by default}/index.bundle?platform=ios&dev=true"]; (如果没有启动node server那么则使用本地      jsbundle)



<b>b.打本地jsbundle包</b>

    jsbundle分为基础包和业务包

    1. 进入项目根目录，进入metro_build.sh文件，检查generateJSBundleFile函数里的react-native bundle命令单的 --platform参数是否是ios，如不是，请改成ios

    2. 执行 ./metro_build.sh c index.common.js common.jsbundle 打基础包

    3. 执行 ./metro_build.sh b index.js {moduleName}.jsbundle 打业务包

    4. 执行完2 3后，会在/jsbundle文件夹下生成common.jsbundle和contacts.jsbundle两个文件

    5. 将第4步生成的两个jsbundle文件复制到iOS/SmartOperationMobile/RN目录下

#### 3.运行调试

* 1.Product>Scheme>Edit Scheme>Run>Info>Build Configuration 选择Debug或者Release(Release模式下只能用本地jsbundle包)

* 2.点击运行按钮启动app(快捷键cmd+r)

* 3.Debug模式下按cmd+d调出debug选项