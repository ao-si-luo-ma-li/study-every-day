### 本文记录开发中遇到的典型问题的解决方案！

1、 分包加载逻辑

* a) APP 启动时加载基础包
* b) 打开 RN 容器前加载相应的 RN Module
* c) 加载 Module 前需确保基础包已经加载完毕（使用信号量控制）
* d) 业务包不可以重复加载（维护加载过的业务包信息）
* e) 监听 JSBUNDLE 加载完成的事件（RN 框架发出），由 PARN 包装成 PARNBundleLoadedEvent 携带上 BUNDLE 名进行分发。

2、 [适配] Android 导航栏偏移

react-navigation 使用中的问题

* 1、在 android 中 Bar 标题居中问题：createStackNavigator({页面路由}, {headerLayoutPreset: 'center'})

* 2、在 android 中默认开启了 StatusBar，它会延伸到状态栏形成“沉浸式”，而导航栏高度不包含 StatusBar 高度，出现导航嵌入状态栏且高度不够问题。
```
解决方法：

headStyle: {

  paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,

  height: height +（ Platform.OS === "ios" ? 0 : StatusBar.currentHeight）

}
```

3、某些 android 手机导航标题会出现标题太长，变成省略号...。
```
解决方法：增加 headerTitleStyle 宽度，比如 headerTitleStyle: {flex: 1}
```

1. [适配] Android 搜索文本框被遮住
```

问题: 在安卓上<TextInput>组件的输入值会浮动到输入框外面

原因: 安卓会给<TextInput>一个默认的paddingBottom

解决方案: 手动指定paddingBottom:0 或者verticalPadding:0 (paddingBottom and paddingTop)
```

<b>4、 Cookie 处理的整体方案</b>

* a) 采用手动管理方式
* b) RN 端因 Axios 和 XHR 的 withCredential 的默认值不同，导致 RN 端无法禁用自动 Cookie 处理机制
* c) RN 端发请求前清理自动储存的 Cookie
  
<b>5、选择弹框的按钮样式定制</b>
```
问题: picker组件与UI设计稿存在差异
原因: 第三方组件antd中官方文档中没有暴露出api
解决方案: 传入props，并且对第三方组件进行改写

styles={{
  headerItem: {
    paddingRight: 16,
    alignItems: 'flex-end'
  },
  actionText: {

    color: '#2972EC'
  }
}}
```

<b>6、 面向前端工程师的 iOS 联机调试、打包指南</b>

IOS联机调试react native app的步骤

<b>7、 面向前端工程师的 Android 联机调试、打包指南</b>

Android联机调试react native app的步骤

<b>8、 从 NATIVE 跳转到 RN 任意页面</b>

* a) 到列表的方式，额外增加 rnScreen (值为 MemberEdit) 及 id 参数 (值为成员的 id)

* b）为了支持从 native 跳到任意 RN 页面，RN 页面间传递数据直接使用 { canEdit: true, id: 123, name: 'BIAN' } 这样的扁平结构，而不是之前的 { canEdit: true, data: {id: 123, name: 'BIAN'} } 这样的

* c）因为任意 RN 页面都有可能作为 RN 导航栏的根页面，所以任意 RN 页面的返回按钮都可能返回到 native，这一部分如何实现由 @余超 实现并介绍用法