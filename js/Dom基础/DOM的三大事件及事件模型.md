### DOM的三大事件
1、鼠标事件
2、键盘事件
3、HTML事件

#### 1.鼠标事件
* click：单击 
* dblclick：双击
* mousedown：按下鼠标 
* mousepress：按下到松开鼠标的过程
* mouseup：松开鼠标
* mouseove：鼠标移到什么上 
* mouseout：鼠标从哪移开
* mousemove：移动鼠标
* mouseenter：鼠标进入 
* mouseleave：鼠标离开

#### 2.键盘事件
* keydown：按下键盘
* keyup：松开键盘
* keypress：按下到松开的过程

```
<!-- onkeydown 不区分大小写 -->
document.onkeydown = function(event) {
  <!-- 获取键盘按键的ASCII数字 -->
  var code;
  if (window.event) {
    <!-- IE、chrome -->
    code = event.keyCode;
  }
  else {
    <!-- W3C -->
    code = event.which;
  }
  console.log('code', code);
}

<!-- onkeypress 区分大小写 -->
document.onkeypress = function(event) {
  console.log(event.keyCode);
}
```

#### 3.HTML事件
* load：文档加载完毕
* select：选择文本内容
* change：改变文本内容
* focus：获得光标
* resize：网页窗口变化
* scroll：滚动条滚动
  
window.onload = function() {}

### DOM之事件模型
1、脚本模型
2、内联模型
3、动态绑定

```
<body>
  <!-- 行内绑定：脚本模型 -->
  <button onclick="javascript:alert('Hello')"></button>
  <!-- 内联模型 -->
  <button onclick="showHello"></button>
  <!-- 动态绑定 -->
  <button id="btn"></button>
</body>
<script>
/* 
  * DOM0：同一元素，同类型事件只能添加一个，
  * 如果添加多个，后面添加的事件会覆盖之前的
*/
function showHello() {
  alert('Hello)
}
var btn = document.getElementById('btn');
btn.onclick = function() {
  alert('Hello');
}

/*
  * DOM2：可以给同一元素添加多个同类型事件
*/
btn.addEventListener('click', function() {
  alert('Hello1);
});
btn.addEventListener('click', function() {
  alert('Hello2');
});
// 浏览器兼容性
if(btn.attchEvent) {
  <!-- IE -->
  btn.attchEvent('onclick', function() {
    alert('Hello3');
  });
}
else {
  <!-- W3C -->
  btn.addEventListener('click', function() {
    alert('Hello3');
  });
}
</script>
```

#### 0级DOM
分为2种形式：
* 一是在标签内写 onclick 事件
* 二是用JS写 onclick = function() {} 事件

#### 2级DOM
只有一个形式：给了两个监听方法，用来添加和移除事件处理程序，addEventListener() 和 removeEventListener()。

它们都有三个参数：
* 第一个参数是事件名（如click）
* 第二个参数是事件处理程序函数
* 第三个参数如果是true表示在捕获阶段调用，如果是false表示在冒泡阶段调用

> addEventListener(): 可以为元素添加多个事件处理程序，触发时会按照添加顺序依次执行。

> removeEventListener(): 不能移除匿名添加的函数。

<b>只有2级DOM包含3个事件，事件捕获阶段、处于目标阶段、事件冒泡阶段</b>

<b> 如图：DOM事件流 </b>
![DOM事件流](https://images0.cnblogs.com/blog/37001/201408/141533286861687.png)

更多参考：
[理解：javascript中DOM0,DOM2,DOM3级事件模型](https://cloud.tencent.com/info/ad98989873342090462fc921832c68ac.html)
[JS--DOM0级事件处理和DOM2级事件处理--简单记法](https://www.cnblogs.com/holyson/p/3914406.html)