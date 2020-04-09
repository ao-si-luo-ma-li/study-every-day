## JS面试题库

#### [前端 100 问：能搞懂 80% 的请把简历给我](https://juejin.im/post/5d23e750f265da1b855c7bbe?utm_source=gold_browser_extension)

#### [20道JS原理题助你面试一臂之力！](https://juejin.im/post/5d2ee123e51d4577614761f8?utm_source=gold_browser_extension)
* #### 1. 实现一个call函数
   <b>将要改变this的函数挂载到目标this上并执行</b>
   <pre>
   <code>
    Function.prototype.mycall = function(context) {
      if (typeof this !== 'function') {
        throw new TypeError('not function')
      }
      context = context || window;
      let args = [...arguments].slice(1);
      context.fn = this;
      let result = context.fn(...args);
      delete context.fn;
      return result;
    }
   </code>
   </pre>
* #### 2. 实现一个apply函数
  <b>将要改变this的函数挂载到目标this上并执行</b>
  <pre>
  <code>
    Function.prototype.myapply = function(context) {
      if(typeof this !== 'function') {
        throw new Error('not function');
      }
      context = context || window;
      context.fn = this;
      let args = arguments[1];
      let result;
      if(args) {
        result = context.fn(...args);
      }
      else {
        result = context.fn();
      }
      delete context.fn;
      return result;
    }
  </code>
  </pre>
* #### 3. 实现一个bind函数
  <b>思路类似call， 但返回的是函数</b>
  ```
  Function.prototype.myBind = function(context) {
    if(typeof this !== 'function') {
      throw new TypeError('not function')
    }
    const fn = this;
    const args = [...arguments].slice(1);
    return function F() {
      // 处理new操作!this 永远指向 实例。
      // 当返回的新函数被作为构造函数使用时，bind 不起任何作用
      if(this instanceof F) {
        return new fn(...args, ...arguments);
      }
      else {
        return fn.apply(context, [...args, ...arguments]);
      }
    }
  }
  ```
  
* #### 4. instanceof的原理
* #### 5. Object.create的基本实现原理
<b>思路：将传入的对象作为原型</b>
```
function createObj(obj) {
  function F() {}
  f.prototype = obj;
  return new F();
}
```
* #### 6. new本质
```
function myNew(fn) {
  return function() {
    //  将 obj 的隐式原型指向 fn的原型
    var obj = {
      __proto__: fn.prototype
    }
    // 执行fn，将属性绑定到obj上
    fn.call(obj, ...arguments);
    return obj;
  }
}
function Person(name, age) {
  this.name = name;
  this.age = age;
}
// 平常是这么写的 new Person('gg', 24);
var instance = myNew(Person)('gg', 24);
console.log('name:', instance.name);
```
* #### 7. 实现一个基本的Promise
  ```
  class Promise {
    constructor(fn) {
      this.sucList = [];
      this.failList = [];
      this.state = 'pending';
      this.resolve.bind(this);
      this.reject.bind(this);
      fn(this.resolve, this.reject);
    }
    static all(proArr) {
      return new Promise((re, rj) => {
        let index = 0;
        let result = [];
        function handlePro(promise) {
          promise.then(res => {
            result.push(res);
            if (index === proArr.length) {
              resolve(result);
            }
            else {
              handlePro(proArr[++index])
            }
          })
          .catch(err => {
            reject(err);
          })
        }
        handlePro(proArr[index]);
      })
    }
    static race(proArr) {

    }
    then(sucCallBack, failCallBack) {
      // 调用.then方法会立刻返回一个promise实例，继续链式调用
      return new Promise((resolve, reject) => {
        function suc(value) {
          // 判断当前 .then 方法是否再次返回了promise实例。如果是则注册then方法
          let ret = typeof sucCallBack === 'function' && sucCallBack(value) || value;
          if (ret && typeof ret['then'] === 'function') {
            ret.then((value) => {
              this.resolve(value);
            });
          }
          else {
            this.resolve(value);
          }
        }
        if (this.state === 'pending') {
          this.sucList.push(suc);
          this.failList.push(failCallBack);
        }
      })
    }
    resolve(value) {
      this.state = 'success';
      // 保证then方法已经执行，回调函数已经注入
      setTimeout(() => {
        this.sucList.forEach(cb => cb(value));
      }, 0);
    }
    reject(reason) {
      this.state = 'failed';
      setTimeout(() => {
        this.failList.forEach(cb => cb(reason));
      }, 0);
    }
  }
  ```

  扩展知识：
  > 其实通过setTimeout 设置 resolve 和 reject 会出现时序问题。
  <b>在js事件循环机制中，setTimeout是放在Macor task中的，Promise是放在
  Micor task 中的，意思是promise会先执行。</b>

  进一步优化方法：

  * 基于浏览器可以用 MutationObserver 这个api 去保证 promise 时序问题
  * 在node 中可以将promise中的time改成 process.nextTick
  <br>

* #### 8. 实现浅拷贝
* #### 9. 实现一个基本的深拷贝
  + 1、JSON.parse(JSON.stringify(obj))
  弊端和局限性：
    + 无法处理 function，还有 RegExp
    + 无法处理循环引用对象
    + 会丢弃对象的constructor
* #### 10. 使用setTimeout模拟setInterval
<b>可避免setInterval因函数执行时间不一致导致每次执行间隔都不同</b>
```
setTimeout(function() {
  setTimeout(arguments.callee, 500);
}, 500)
```
* #### 11. js实现一个继承方法
  ```
  父类：
  function Parent() {
    this.type = 'father';
  }
  Parent.prototype.work = function() {console.log('000000')}
  ```
  + 1、借助call；弊端，无法获得父类原型对象上的方法
  ```
  function Children1() {
    Parent.call(this);
  }
  new Children1();
  ```
  + 2、借助原型链继承；弊端，所有子类实例公继承同一套父类属性，导致子类修改属性时会互相影响
  ```
  function Children2() {

  }
  Children2.prototype = new Parent();
  new Children2();
  ```
  + 3、组合call和原型链进行继承；弊端，Parent构造方法执行了多了一次啊，导致Children3.prototype上多了一套父类属性，就是这一步 {Children3.prototype = new Parent();} 造成的
  ```
  function Children3() {
    Parent.call(this);
  }
  Children3.prototype = new Parent();
  Children3.constructor = Children3;
  console.log(new Children3());
  ```
  + 4、继承最优解 (寄生组合继承)
  ```
  function Children4() {
    Parent.call(this);
  }
  方案一：
  function Fn() {
    <!-- 空 -->
  }
  Fn.prototype = Parent.prototype;
  Children4.prototype = new Fn();
  方案二：
  Children4.prototype = Object.create(Parent.prototype);

  Children4.prototype.constructor = Children4;
  console.log(new Children4())
  ```
  <b>追问: ES6中继承的实现原理是什么？</b>
  也是使用寄生组合继承，并且使用 Object.setPrototypeOf(subClass, superClass)，复制了父类的静态方法.
  ```
  原理：
  Object.setPrototypeOf: 设置一个指定对象的隐式原型（即，内部的[__proto__]）到另一个对象。
  如果浏览时不支持该方法，兼容写法即 subClass.__proto__ = superClass;
  ```
  <b>追问: 面向对象的设计一定是好的设计吗？</b> 那不一定
  > 继承的最大问题在于：无法决定继承哪些属性，所有属性都得继承。

  <b>追问: 那如何来解决继承的诸多问题呢？</b>
  用组合，采用面向组合的设计方式。
  > 顾名思义，面向组合就是先设计一系列零件，然后将这些零件进行拼装，来形成不同的实例或者类。

* #### 12. 实现一个基本的Event Bus（订阅、发布模式）
  ```
  const EventEmitter = {
    events: {},
    // 订阅
    on: function(eventName, cb, once=false) {
      if (typeof cb !== 'function') {
        throw new Error('cb 不是一个函数！');
      }
      !this.events[eventName] && (this.events[eventName] = []);
      this.events[eventName].push({fn: cb, once});
    },
    // 触发
    emit: function(eventName, ...args) {
      const cblist = this.events[eventName];
      // 找到已订阅的事件
      if (cblist) {
        for (let index = 0; index < cblist.length; index++) {
          cblist[index].fn(...args);
          if (cblist[index].once) {
            cblist.splice(index, 1);
          }
        }
      }
    },
    // 清除订阅
    off: function(eventName, removeCb) {
      if (eventName && this.events[eventName]) {
        // 具体删除某一次订阅
        if (removeCb) {
          const index = this.events[eventName].findIndex(event => event.fn === removeCb);
          index > -1 && this.events[eventName].splice(index, 1);
        }
        else {
          this.events[eventName] = [];
        }
      }
      else {
        // 清空全部订阅
        this.events = {};
      }
    },
    // 订阅一次
    once: function(eventName, cb) {
      this.on(eventName, cb, true);
    }
  }
  ```
* #### 13. 实现一个双向数据绑定
  + 简单版
  ```
  var span = document.getElementById('span');
  var input = document.getElementById('input');
  var obj = {};
  Object.defineProperty(obj, 'value', {
    configurable: false,
    enumerable: false,
    get() {
      console.log('获取数据');
      return value
    },
    set(newVal) {
      console.log('数据更新');
      input.value = newVal;
      span.innerText = newVal;
    }
  })
  input.addEventListener('keyup', function(e) {
    obj.value = e.target.value;
  })
  ```
  + 复杂版
  [https://github.com/YuFy1314/simpleVue]()
  <b>扩展知识：vue 依赖收集是在created生命钩子执行</b>
* #### 14. 实现一个简单路由
思路：实现一个hash路由，在hash值不同时，执行不同的回调函数
```
class Router{
  constructor() {
    //  存储路由与对应的回调函数
    this.router = {};
    this.currentHash = '';
    this.refresh = this.refresh.bind(this);

    window.addEventListener('load', this.refresh);
    window.addEventListener('hashchange', this.refresh);
  }
  refresh() {
    this.currentHash = window.location.hash.slice(1) || '/';
    this.router[this.currentHash]();
  }
  storeRouter(path, cb) {
    this.router[path] = cb || function() {};
  }
}
var routers = new Router();
routers.storeRouter('pp', function() {console.log('渲染pp')})
routers.storeRouter('bb', function() {console.log('渲染bb')})
```
* #### 15. 实现懒加载
* #### 16. rem基本设置
* #### 17. 手写实现AJAX
* #### 18. 实现拖拽
* #### 19. 实现一个节流函数
  <b>思路：规定时间内只触发一次</b>
  ```
  
  ```
* #### 20. 实现一个防抖函数
  <b>思路：规定时间内未触发第二次，则执行</b>
  ```
  function debunce(fn, delay) {
    var timer = null;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn.bind(this), delay);
    }
  }

  // 具体使用
  window.addEventListener('mousemove', debunce(function() {console.log('111',this)}, 1000))
  ```
* #### 21. 实现一个深拷贝
  <img src="https://img2018.cnblogs.com/blog/1356703/201905/1356703-20190517154335468-348467492.png">
  <pre>
    方法一、写法非常简单，而且可以应对大部分的应用场景，
    弊端和局限性：
    + 无法处理 function，还有 RegExp
    + 无法处理循环引用对象
    + 会丢弃对象的constructor
    <code>
      JSON.parse(JSON.stringify());
    </code>
    方法二、可以深克隆数组和对象，不支持循环引用
    <code>
      module.export const cloneDeep = (target) => {
        // 需要进行递归，直到返回基本数据类型
        if(typeof target === 'object' && target !=== null) {
          let cloneTarget = Array.isArray(target) ? [] : {};
          for(key in target) {
            if(target.hasOwnProperty(key)) {
              cloneTarget[key] = cloneDeep(target[key]);
            }
          }
          return cloneTarget;
        }
        else {
          return target;
        }
      }
    </code>
    方法三、支持循环引用对象
    <code>
      function isObject(target) {
        return typeof target === 'object' && target !== null;
      }
      var deepClone = function(source, unqiuneLs=[]) {
        if (isObject(source)) {

          let cloneTarget = Array.isArray(source) ? [] : {};

          // 使用数组保存对象是否被引用过
          const repeatItem = unqiuneLs.find((item => item.source === source));
          if(repeatItem) {
            return repeatItem.target;
          }
          unqiuneLs.push({
            source: source,
            target: cloneTarget
          });
          console.log(unqiuneLs, source);
          for (key in source) {
            if (source.hasOwnProperty(key)) {
              cloneTarget[key] = deepClone(source[key], unqiuneLs);
            }
          }

          return cloneTarget;
        }
        else {
          return source;
        }
      }
      <!-- 使用es6的 WeakMap（弱引用） 可代替数组的教研方法 -->
      var deepClone = function(source, unqiuneLs) {
        if (isObject(source)) {
          if(!unqiuneLs) unqiuneLs = new WeakMap();
          let cloneTarget = Array.isArray(source) ? [] : {};
          
          const repeatItem = unqiuneLs.get(source);
          console.log(unqiuneLs, source, repeatItem);
          if(repeatItem) {
            return repeatItem;
          }
          unqiuneLs.set(source, cloneTarget);
          for (key in source) {
            if (source.hasOwnProperty(key)) {
              cloneTarget[key] = deepClone(source[key], unqiuneLs);
            }
          }

          return cloneTarget;
        }
        else {
          return source;
        }
      }
    </code>
  </pre>
* #### 22. 通过js把网页加入到收藏夹
  <pre>
  <a href="https://gist.github.com/zzuhan/8000653">js加入收藏夹，各浏览器兼容性问题</a>
    <code>
      function addFavorite(url, title) {
        if(window.external && 'addFavorite' in window.external){ // IE
            window.external.addFavorite(url, title);
        } else if(window.sidebar && window.sidebar.addPanel) { // Firefox23后被弃用
            window.sidebar.addPanel(url, title);
        } else if(window.opera && window.print) { // rel=sidebar，读取a链接的href，title 注：opera也转战webkit内核了
            this.title = title;
            return true;
        } else { // webkit - safari/chrome
            alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
        }
      }
    </code>
  </pre>

* #### 23、http请求三次握手与4次具体过程
  <img src="https://mmbiz.qpic.cn/mmbiz_png/JfTPiahTHJhrPpTTVvskbcnQT7XP5H7Q1QELwVGhyfEibBfLux9bbzbFqcZfic2PpQfuHLQzwnZY8wtPLSPgOmpAA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1">
  <img src="https://mmbiz.qpic.cn/mmbiz_png/JfTPiahTHJhrPpTTVvskbcnQT7XP5H7Q1Z1mhz2icmQRDomF4x4UB0M5WEBOpSLojicFIa9Hxf7ekT8x1Cucx1y8g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1">

> TCP有6种标识：SYN(建立连接)、ACK(确认)、PSH(传送)、FIN(结束)、RST(重置)、URG(紧急)

<b>三次握手</b>
* 第一次握手，客户端向服务器连接请求报文
* 第二次握手，TCP服务器接收到请求报文后，如果同意连接，则发出确认报文
* 第三次握手，TCP客户端接收到确认报文后，还要向服务器给出确认

> <font color=red>思考：为什么要三次握手呢，有人说两次握手就好了</font>
```
服务器收到一条已失效的连接请求，如果没有客户端发出确认连接请求，导致服务器直接建立连接，
一直等待客户端发送请求，白白浪费资源
```
<b>四次挥手</b>
* 客户端发送一个FIN(结束)，用来关闭客户端和服务端的连接
* 服务端接收到FIN，并返回一个ACK(确认)。服务端通知上层应用，此过程中服务端处于CLOSE-WAIT
* 服务端发送一个FIN(结束)到客户端，服务端关闭客户端连接。服务端进入LAST-ACK(最后确认)
* 客户端发送ACK(确认)报文确认。<font color=red>注意此时TCP连接还没有释放，必须经过2∗∗MSL（最长报文段寿命）的时间</font>

> <font color=red>思考：那么为什么是4次挥手呢？不是3次</font>
```
服务端收到客户端FIN后，并不能马上关闭SOCKET，需要等Sever端所有报文都发送完了。
服务端才可以发送FIN表示同意现在关闭连接。所有需要多一步骤
```

  <b>知识扩展:</b>

* 1、SYN 攻击
  > 攻击客户端在短时间内伪造大量不存在的IP地址，向服务器不断发送SVN包，服务器回复确认包，并等待客户端的确认。（在没有收到客户端确认时，server会进行5次重发，总时长63s）

* 2、TCP和UDP的区别
    + TCP基于连接；UDO无连接
    + TCP保证数据正确性，保证数据顺序；UDP会丢包，数据顺序不能保证
    + UDP具有较好实时性，工作效率比TCP高，适用于广播通信
    + TCP连接是点对点；UDP可以多对多
  
参考：https://mp.weixin.qq.com/s/ANBpgkprBbB3g1UgvvOBjw

* #### 24、js forEach方法中，this指向谁？如何改变this？
  ```
  array.forEach(function(currentVal, index, arr), thisValue);
  一般方法中this都指向window。可以使用thisValue， 表示给函数传递使用的this，修改函数中的this
  ```
* #### 25、实现数组的flat, reduce方法
  <b>数组扁平化（Array.flat(params)），多维数组 -> 一维数组</b>
  > 参数params: 扁平化几层。如果要将任意多维转一维，传入 Infinite(无穷大)
  ```
  let ary = [1, [2, [3, [4, 5]]], 6];

  0、第0种处理
    ary.flat(Infinity);

  1、第一种处理
    let str = JSON.Stringify(ary);
    ary.replace(/[\[\]]/g, '').split(',')
  2、递归处理
    function toFlat(arr) {
      let result = [];
      function toFlat(arr) {
        arr.forEach(item => {
          if(Array.isArray(item)) {
            toFlat(item);
          }
          else {
            result.push(item);
          }
        })
      }
      toFlat(arr);
      return result;
    }

  ```
  
* #### 26、react hooks的实现原理
* #### 27、二叉树前、中、后遍历原理？知道前序遍历和中序结果，请问后序遍历结果是什么？
* #### 28、react 路由中hash值起什么作用？
* #### 29、什么是事件委托？
  > JS 中DOMs事件委托依赖 addEventListener(type,listener,useCapture) 实现

  * type: 必填，String类型，事件类型
  * listenr: 必填， 订阅的事件方法
  * useCapture: 可选，Boolean类型。指定事件是否发生在捕获阶段，默认时false，事件发生在冒泡阶段

  事件委托的优点:

  * 提高性能:每一个函数都会占用内存空间，只需添加一个事件处理程序代理所有事件,所占用的内存空间更少。
  * 动态监听:使用事件委托可以自动绑定动态添加的元素,即新增的节点不需要主动添加也可以一样具有和其他元素一样的事件。
  
* #### 30、如何将一个隐藏的dom，获取它的宽高？
  <font color=red>不能使用display: none，改用visibility：hidden + 脱离文档流... 特殊处理</font>
  https://blog.csdn.net/dragoo1/article/details/50260255

* #### 31、在React中，如何自己实现antd的模态框？

* #### 32、实现 LazyMan
  https://www.jianshu.com/p/f1b7cb456d37

* #### 33、Process.nextTick（node），setImmediate（node） 和 promise.then 的优先级
> 在浏览器中，执行优先级为 一个宏任务（包括同步代码） > 微任务队列清空 > UI render，继续事件循环

同步方法promise.then -> 

* #### 34、https 的加密过程
> HTTPS其实是有两部分组成：HTTP + SSL/TLS，在HTTP上多了一层处理加密信息的模块
  + 1、客户端发起HTTPS请求，给出支持的加密方式
  + 2、服务器端返回数字证书，证书中包含服务端的公钥
  + 3、客户端解析证书。验证公钥有效性。一般就是检查数字证书的合法性
    - 如果有问题，弹出警告框，提示证书有问题
    - 没有问题，生成一个随机数，用公钥将随机数加密
  + 4、传送加密随机数。以后客户端和服务器就使用来进行加解密
  + 5、服务器使用私钥解密随机数（相当于客户端私钥），把内容使用该随机数进行对称加密。
  + 6、客户端用之前生成的私钥解密服务端传来的信息
  
* #### 35、js 多个异步 的并发控制
  ```
  请实现如下的函数，可以批量请求数据，所有的URL地址在urls参数中，同时可以通过max参数 控制请求的并发度。
  当所有的请求结束后，需要执行callback回调。发请求的函数可以直接使用fetch

  function sendRequest(arr, max, callback) {
        let fetchArr = [],  // 存储并发max的promise数组
            i = 0;

        function toFetch() {
            if (i === arr.length) {   // 所有的都处理完了， 返回一个resolve
                return Promise.resolve();
            }

            let one = fetch(arr[i++]); // 取出第i个url， 放入fetch里面 , 每取一次i++
            one.then( () => {fetchArr.splice(fetchArr.indexOf(one), 1)}); // 当promise执行完毕后，从数组删除
            fetchArr.push(one);  //将当前的promise存入并发数组中       其实将这个push放到上一行会更好理解，那样就是我们同步的思维顺序，先push进去，再等promise执行完了之后再删除。  但由于then是异步的，所以怎么放都可以。

            let p = Promise.resolve();
            if (fetchArr.length >= max) {     // 当并行数量达到最大后， 用race比较 第一个完成的， 然后再调用一下函数自身。
                p = Promise.race(fetchArr);
            }
            return p.then(() => toFetch());
        }
        
        // arr循环完后， 现在fetchArr里面剩下最后max个promise对象， 使用all等待所有的都完成之后执行callback
        toFetch().then(() => Promise.all(fetchArr)).then(() => {
            callback();
        })
  }
  ```
  
* #### 36、cookie 结构有什么字段
  * name：cookie的名称
  * value：cookie的值
  * max-age：有效时间
  * size：cookie的大小
  * domain：设置cookie的服务器域名
  * path：可以访问该cookie的页面路径
  * http-only：是否只允许服务器端访问
* #### 37、原码，补码，反码
  + 原码就是符号位加上真值的绝对值, 即用第一位表示符号
  ```
  [+1]原 = 0000 0001
  [-1]原 = 1000 0001
  ```
  + 正数的反码是其本身；负数的反码是在其原码的基础上, 符号位不变，其余各个位取反
  + 正数的补码就是其本身；负数的补码是在其原码的基础上, 符号位不变, 其余各位取反, 最后+1. (即在反码的基础上+1)

扩展：为什么出现了反码、补码？
* 为了解决原码做减法的问题, 出现了反码
  ```
  1 - 1 = 1 + (-1)
  = [0000 0001]原 + [1000 0001]原
  = [0000 0001]反 + [1111 1110]反
  = [1111 1111]反 = [1000 0000]原
  = -0
  ```
  但是0带符号是没有任何意义的. 而且会有[0000 0000]原和[1000 0000]原两个编码表示0.
* 补码的出现, 解决了0的符号

### 38、js 根据url 下载图片
```
downloadIamge(imgsrc, name) {//下载图片地址和图片名
  let image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function() {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgsrc;
}
```

### 39、你所知道的前端性能优化方案
* DOM层面
  + 1、重绘和回流的操作都应减少执行，将多次操作合并成一次
  + 2、通过事件委托方式进行事件绑定，可以避免大量绑定导致内存占用过多
  + 3、扁平化，避免过多的层级嵌套
* CSS层面
  + 1、使用CSS的动画属性来实现，开启GPU加速
    ```
    {
      transform: translateZ(0);
    }
    ```
  + 2、指定宽高或脱离文档流，可避免加载后重新计算导致的页面回流
  + 3、css在```<header />```引入，js在```<body />```引入，优化关键渲染路径
* js 逻辑层面
  + 1、CDN加载静态资源，合理使用浏览器的强缓存和协商缓存
  + 2、小图片可以使用base64代替
  + 3、代码压缩混淆，删除无用代码，代码分割减小文件体积
  + 4、小图片使用雪碧图，图片选择合适的质量，尺寸
  + 5、合理使用浏览器的```预取指令prefetch```和 ```预加载指令preload```
    - preload：告诉浏览器页面必定需要的资源，并把资源下载顺序权重提高，浏览器一定会加载这些资源
    - prefetch：告诉浏览器下个页面可能需要的资源，浏览器不一定加载这些资源

扩展知识：
<b>webpack 搭配prefetch优化单页面应用code-splitting</b>
* 1、动态引入js模块，实现code-splitting，减少首屏打开时间

### 40、如何正确判断数据类型？
> 前言：typeof 和 instanceof 为何还是不满足我们对数据类型的判断

* 1、typeof是否能正确判断类型？
  答案是：不可以，因为由于历史原因，在判断原始类型时，typeof null会等于object。而且对于对象来说，除了函数，都会转换成object

* 2、instanceof是否能正确判断类型？
  答案是：还是不可以，虽然instanceof是通过原型链来判断的，但是对于对象来说，Array也会被转换成Object，而且也不能区分基本类型 string 、boolean、symbol

> 结论：使用 Object.prototype.toString.call()。如果此方法未在自定义对象中被覆盖，则toString()返回[Object type]，其中type是对象类型
```
Object.prototype.toString.call(new Date()) // [object Date]
Object.prototype.toString.call("1") // [object String]
Object.prototype.toString.call(1) // [object Numer]
Object.prototype.toString.call(undefined) // [object Undefined]
Object.prototype.toString.call(null) // [object Null]
```
so，可以封装统一方法
```
var type = function(data) {
      var toString = Object.prototype.toString;
      var dataType =
        data instanceof Element
          ? "element" // 为了统一DOM节点类型输出
          : toString
              .call(data)
              .replace(/\[object\s(.+)\]/, "$1")
              .toLowerCase()
      return dataType
};
```
按如下方式使用：
```
type("a") // string
type(1) // number
type(window) // window
type(document.querySelector("h1")) // element
```

### 41、通用的数组/类数组对象封装
> 前言：如果我们要循环一个类数组对象呢？例如NodeList。直接循环是会报错的
可以利用call的特性，将NodeList里的元素一个一个的插入到数组中
```
var listMap = function(array, type, fn) {
    return !fn ? array : Array.prototype[type]["call"](array, fn)
};
```
```
var divs = document.querySelectorAll("div");
listMap(divs, "forEach", function(e) {
    console.log(e)
});
```

### 42、Fade 特效
* <b>Fade in</b>
  ```
  var fadeIn = function (el) {
    el.style.opacity = 0
    var last = +new Date()
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400
        last = +new Date()
        if (+el.style.opacity < 1) {
            requestAnimationFrame(tick))
        }
    }
    tick()
  }
  ```

* <b>Fade out</b>
  ```
  var fadeOut = function (el) {
    el.style.opacity = 1
    var last = +new Date()
    var tick = function() {
        el.style.opacity = +el.style.opacity - (new Date() - last) / 400
        last = +new Date()
        if (+el.style.opacity > 0) {
            requestAnimationFrame(tick)
        }
    }
    tick()
  }
  ```

补充知识：<b>这里需要提一个概念，就是时间分片</b>。例如 React 的 Fiber 核心实现就是时间分片

### 43、







<br><br>
今日头条面试题：
1、执行setState后，react做了什么渲染操作？ setState的异步原理
2、实现Promise.all
3、两个有序数组排序
4、浏览器中还有哪些微观任务
4、怎么认识react和vue框架的，区别和实现原理
5、vue怎么实现双向数据绑定的，defineProperty有哪些参数？vue最新版中怎么解决无法监听对象属性改变问题
6、知道hooks吗？useEffect和useLayoutEffect有什么不同？如何用useEffect实现其他生命周期。

