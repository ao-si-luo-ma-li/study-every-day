### 从react 快速入手 rn
> React.js利用虚拟DOM，而React Native使用本机API

<img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3427047902,1767178262&fm=173&app=49&f=JPEG">

#### react 与 rn 开发时的区别
* 1、DOM和Styles不同
  + react使用virtual dom在浏览器中渲染成HTML，使用css进行样式布局
  + rn不使用HTML来渲染App，但提供了类似组件<View/>、<Text/>更多，编译后映射到原生UI组件。因为代码不是渲染在HTML页面中，不能重用之前使用ReactJS渲染的HTML, SVG或Canvas任何库。对于rn是没有css代码，不过得益于Yoga 引擎，我们可以在客户端上像写css一样的去书写我们的样式。Yoga提供的Flexible Layouts，是构建响应式App是最好不过的选择

  ```
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row' // 默认是column
    },
    content: {
      backgroundColor: '#fff',
      padding: 30,
    },
    button: {
      alignSelf: 'center',
      marginTop: 20,
      width: 100,
    },
  });
  ```
* 2、使用图片
  + 在rn中展示图片时，使用标签Image标签。如果图片是静态资源则source={path}，如果是其他资源（包括网络资源）使用source={uri: path}。静态图片资源需要import或require，不支持路径中带 @ 符号

* 3、动画和手势
  + react多用transition和animation制作动画效果，或js配合cavans
  + 没有CSS动画，因此rn提供Animated API，并且提供了类似JavaScript的touch事件 web API PanResponder。 例如onPanResponderGrant (touchstart ), onPanResponderMove (touchmove ) 或onPanResponderRelease (touchend )；比如想做一些touch的反馈效果，rn提供Touchable Components

* 4、导航
  + react通过react-router插件控制页面跳转
  <img src="https://user-images.githubusercontent.com/8401872/29739490-c1dbb054-8a71-11e7-9c9f-31cbbd6adbcb.png">
  +  rn可以通过react-navigation插件，对屏幕组件(类似react路由组件)进行切换和设置。react-navigation一并提供导航相关的UI架构。在rn中，切换组件不一定能触发componentDidMount等部分生命钩子，主要是页面栈不会被销毁，但提供了其他lifecycle events，如didFocus，didBlur

* 5、显示超过一屏的内容
  + rn页面内容中超过一屏的部分会看不到，也无法滚动，可以使用listview 或scrollview

* 6、发送网络请求
  + 尽管文档中给出使用Fetch进行请求的例子，但rn是可以和react一样使用axios库的。因为rn内置XMLHttpRequest API，基于XMLHttpRequest的第三方库都可以

* 7、全局状态管理
  + rn和react一样方法使用redux

* 8、图片文件上传
  + rn提供 CameraRoll api。IOS上使用这个模块之前，你需要先链接RCTCameraRoll库
    - IOS 10的权限要求：访问相册需要用户授权。戳这边
    - IOS 11的权限要求：如果您的项目有保存图片需求，需要额外申请用户授权。戳这边

#### 直接封装rn组件，前端的工作
基于rn现在的生态，将已有组件组合成功能更强、更贴近项目要求的组件，如图片选择上传功能(需要用户权限设置)。
* [原生模块](https://facebook.github.io/react-native/docs/native-modules-ios)
需要实现某些高性能、多线程的代码，譬如图片处理、数据库、或者各种高级扩展。扩展功能，即要实现原生App独有的效果，此时不再适合rn开发组件。rn写了一些地产云功能，目前发现只能原生实现功能：
* 文件上传，指上传非图片类文件时。rn功能受限，需要大量App配置参数，而且方案都是非兼容性的。[Andriod](https://github.com/prscX/react-native-file-selector)，[IOS](https://github.com/marmelroy/FileBrowser)
* 依托带UI效果的rn组件
  尽管有众多框架提供带有UI效果的移动端组件，但更多要考虑实际开发的UI稿。根据实际情况，可以进行有限的定制或组合
* 完全前端开发模块
  通常列表展示类组件，表单类组件是可以由前端提供rn组件

【踩坑】
* 使用react native debugger工具时，控制台是默认看不到网络请求的。可以通过在node_modules/react-native/Libraries/Core/setUpXHR.js 里把polyfillGlobal('XMLHttpRequest');这行代码注释掉解决