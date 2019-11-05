## JS面试题库

#### [前端 100 问：能搞懂 80% 的请把简历给我](https://juejin.im/post/5d23e750f265da1b855c7bbe?utm_source=gold_browser_extension)

#### [20道JS原理题助你面试一臂之力！](https://juejin.im/post/5d2ee123e51d4577614761f8?utm_source=gold_browser_extension)
* 1. 实现一个call函数
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
* 2. 实现一个apply函数
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
* 3. 实现一个bind函数
  
* 4. instanceof的原理
* 5. Object.create的基本实现原理
* 6. new本质
* 7. 实现一个基本的Promise
  ```
  class Promise {
    constructor() {
      this.sucList = [];
      this.failList = [];
      this.state = 'pending';
    }
    then(sucCallBack, failCallBack) {
      this.sucList.push = [];
    }
    resolve() {

    }
  }
  <!-- test demo -->
  new Promise((resolve, reject) => {

  })
  .then(data => {
    console.log('data => ', data);
  })
  ```
* 8. 实现浅拷贝
* 9. 实现一个基本的深拷贝
  + 1、JSON.parse(JSON.stringify(obj))
  弊端和局限性：
    + 无法处理 function，还有 RegExp
    + 无法处理循环引用对象
    + 会丢弃对象的constructor
* 10. 使用setTimeout模拟setInterval
* 11. js实现一个继承方法
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

* 12. 实现一个基本的Event Bus（订阅、发布模式）
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
* 13. 实现一个双向数据绑定
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
* 14. 实现一个简单路由
* 15. 实现懒加载
* 16. rem基本设置
* 17. 手写实现AJAX
* 18. 实现拖拽
* 19. 实现一个节流函数
* 20. 实现一个防抖函数写法非常简单，而且可以应对大部分的应用场景，但是它还是有很大缺陷的，比如拷贝其他引用类型、拷贝函数、循环引用等情况
* 21. 实现一个深拷贝
  <pre>
    方法一、写法非常简单，而且可以应对大部分的应用场景，但是它还是有很大缺陷的，比如拷贝其他引用类型、拷贝函数、循环引用等情况
    <code>
      JSON.parse(JSON.stringify());
    </code>
    方法二、可以深克隆数组和对象，不支持循环引用
    <code>
      module.export const cloneDeep = (target) => {
        // 需要进行递归，直到返回基本数据类型
        if(typeof target === 'object') {
          let cloneTarget = Array.isArray(target) ? [] : {};
          for(key in target) {
            cloneTarget[key] = clone(target[key]);
          }
        }
        else {
          return target;
        }
      }
    </code>
    方法三、
  </pre>
* 22. 通过js把网页加入到收藏夹
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

* 23、http请求三次握手与4次具体过程
  <img src=https://upload-images.jianshu.io/upload_images/5291509-f1e796c2d96f2b84.png?imageMogr2/auto-orient/strip|imageView2/2/w/505/format/webp>

  <b>知识扩展:</b>
  HTTP1、HTTP1.1、HTTP2.0分别代表什么意思？

  HTTP2 优势：
  * HTTP2与HTTP1.1最重要的区别就是解决了<b>线头阻塞</b>的问题！
  * HTTP2所有性能增强的核心在于<b>新的二进制分帧层</b>(不再以文本格式来传输了)，它定义了如何封装http消息并在客户端与服务器之间传输
<br>
* 24、js forEach方法中，this指向谁？如何改变this？
  ```
  array.forEach(function(currentVal, index, arr), thisValue);
  一般方法中this都指向window。可以使用thisValue， 表示给函数传递使用的this，修改函数中的this
  ```
* 25、实现数组的flat, reduce方法
  ```
  ```
  
* 26、react hooks的实现原理
* 27、二叉树前、中、后遍历原理？知道前序遍历和中序结果，请问后序遍历结果是什么？
* 28、react 路由中hash值起什么作用？