### js Worker 线程
> 在平时的运行的javascript脚本都在主线程中执行，如果当前脚本包含复杂的、耗时的代码。那么JavaScript脚本的执行将会被阻塞，甚至整个浏览器都是提示失去响应。

#### 使用Worker创建线程

<table><tr><td bgcolor=red><font color=white>Worker(scriptURL):scriptURL用于指定所使用JavaScript脚本的路径</font></td></tr></table>

> Worker启动的子线程找到数据之后，并不能之间把结果数据直接更新在页面上显示，必须通过postMessage(n)发送消息给前台JavaScript通信。

<img src="https://images2015.cnblogs.com/blog/845902/201608/845902-20160812123425156-706677637.png" alt="">
<img src="https://images2015.cnblogs.com/blog/845902/201608/845902-20160812123343484-1186566940.png" alt="">
