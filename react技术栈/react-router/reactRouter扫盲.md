## 深入了解 React Router 原理
### 1、使用 hashRouter 来切换
> 不同 url -> 不同页面 -> 不同组件

如下react hooks代码。
```
function App() {
  const {hash} = window.location;
  const initUI = hash === '#login' ? 'login' : 'register';
  const [UI, setUI] = useState(initUI);

  <!-- 更新Url，更新状态 -->
  const handleClick = (name) => {
    setUI(name);
    window.location.hash = name;
  }
  const showUI = () => {
    switch (UI): {
      case: 'login':
        return <Login />
      case: 'register':
        return <Register />
    }
  }
  return (
    <div>
      <button onclick={() => handleClick('login')}></button>
      <button onclick={() => handleClick('register')}></button>
      {showUI()}
    </div>
  )
}
```
这样点击切换，hash值发生了变化，但页面没有刷新。location:8080/#login，location:8080/#register 加载了不同的组件

<b>痛点: 这个 “#” 符号不太好看，能否将url改为 location:8080/login?</b>

### 2、使用browserRouter模式

* 使用 window.location.pathname ? 不行，页面会发生刷新
* 幸运的是H5提供了<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/History_API">History API</a>，使用 <b>window.history.pushState()</b> 我们可以修改url，还不会刷新页面
  ```
  <!-- window的history对象提供了很多有用方法 -->
  window.history.back();
  window.history.foward();
  window.history.go();

  history.pushState(状态对象, 标题(目前被忽略), URL)
  ```
  【 history.pushState 参数详解 】
  + 状态对象，
  + 标题(目前被忽略)，可以传个空字符串
  + 新URL，可以是绝对地址，可以是相对地址。但是新URl必须与当前URl同源，否则报错
  
  【 history.pushState 优点】
  <b>与设置 window.location = #hash 一样，二者都会在当前页面创建并激活新的历史记录</b>
```
function App() {
  const {pathname} = window.location;
  const initUI = pathname === '/login' ? 'login' : 'register';
  const [UI, setUI] = useState(initUI);

  <!-- 更新Url，更新状态 -->
  const handleClick = (name) => {
    setUI(name);
    <!-- 通过 pushState，可以改变当前url，并且不刷新页面 -->
    window.history.pushState(null, '', name);
  }
  const showUI = () => {
    switch (UI): {
      case: 'login':
        return <Login />
      case: 'register':
        return <Register />
    }
  }
  return (
    <div>
      <button onclick={() => handleClick('login')}></button>
      <button onclick={() => handleClick('register')}></button>
      {showUI()}
    </div>
  )
}
```

<b>约束:</b>
像是这种单页面应用，需要后端将所有页面都指向index.html，否则后端会出现404错误。
* 开发环境，我们启用node服务，并使用 <b>connect-history-api-fallback 中间件</b>来解决在 browserHistory 模式下页面刷新出现404错误情况。
> connect-history-api-fallback,每当出现符合以下条件的请求时，它将把请求定位到你指定的索引文件(默认为/index.html)
* 请求是Get请求
* 请求的Content-Type类型是text/html类型
* 不是直接的文件请求，即所请求的路径不包含.(点)字符，(比如 location:8080/login)
* 不匹配option参数中提供的模式
  

扩展知识：
react-router 和 react-router-dom 有什么关系？
* react-router: 实现了路由的核心功能
* react-router-dom: 基于react-router，但加入了浏览器运行环境的一些功能

可以说，react-router-dom是浏览器端的加强版，由于类似react-router-native也是基于react-router，是原生运行环境下的加强版.
<img src="https://upload-images.jianshu.io/upload_images/2979799-ae177bd0fd1e2f9e.png?imageMogr2/auto-orient/strip|imageView2/2/w/506/format/webp">

### 3、在组件中使用路由
* import {Link} from 'react-router-dom'
  ```
  <Link to='path/xxx' activeClassName='selected'>题啊转</Link>
  ```
* import {Route} from 'react-router-dom'
  ```
  <Route path='xx/xx' component={Component}></Route>
  ```