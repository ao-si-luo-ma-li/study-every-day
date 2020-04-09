### 1、JavaScript 逗号表达式
```
逗号表达式的一般形式是：表达式1，表达式2，表达式3……表达式n 
逗号表达式的求解过程是：先计算表达式1的值，再计算表达式2的值，……
一直计算到表达式n的值。最后整个逗号表达式的值是表达式n的值
```

### 2、for…in 循环
* for…in循环会遍历数组对象的原型链中所有的可枚举属性（可以使用<b><font color=red>hasOwnProperty()</font></b>方法判断是否为对象自身属性，而非原型链中属性）
* 循环除了访问数组元素以外，还会访问其它的可遍历属性

### 3、new Object和Object.create到底干了啥
* new XXX()时发生了什么?
  ```
    var obj={};
    obj.__proto__=Car.prototype
    Car.call(obj)
  ```
  第一步，创建了一个空对象obj；
  第二步，将空对象的__proto__成员指向了Car函数的原型属性，该原型属性是一个原型对象，也就意味着obj的原型属性上拥有了Car.prototype中的属性或方法；
  第三步，将Car函数中的this指针指向obj，obj有了Car构造函数中的属性或方法 ，然后Car函数无返回值或返回的不是对象，直接返回obj，否则返回Car函数中的对象

  <b>扩展知识：使用 new 和不使用的区别？</b>
  + 对于不加new来执行构造函数来说，返回值就是构造函数的执行结果；
  + 对于加new关键字来执行构造函数而言，如果return的是基本数据类型，那么忽视掉该return值，如果返回的是一个引用类型，那么返回该引用类型。

+ Object.create时发生了什么？
  <font color=red>语法：Object.create(proto[, propertiesObject])</font>
  proto: 新创建对象的原型对象;
  propertiesObject: 
  + 1. Object.create(o),如果o是一个构造函数，则采用这种方法来创建对像没有意义
  + 2. Object.create(o),如果o是一个字面量对象或实例对象，那么相当于是实现了对象的浅拷贝。并且新创建对象的__proto__指向现有的对象


### 4、parseInt 详解
> parseInt 函数将其第一个参数转换为字符串，解析它，并返回一个整数或NaN。如果不是NaN，返回的值将是作为指定基数（基数）中的数字的第一个参数的整数。

<font size=5>parseInt(string, radix)。</font>
string 要被解析的值，如果不是字符串，则将其转化为字符串（使用toString抽象操作）。
radix 一个介于2和36之间的整数，表示上述字符串的基数

<font color=red>扩展：引用对象也能转字符串；</font>


返回值：返回解析后的整数值。 如果parseInt的字符不是指定基数中的数字，则忽略该字符和所有后续字符，并返回解析到该点的整数值。parseInt将数字截断为整数值。如果被解析参数的第一个字符无法被转化成数值类型，则返回 NaN。

### 5、JS中类型转换有哪几种？
JS中，类型转换只有三种：
* 转换成数字
* 转换成布尔值
* 转换成字符串

<img src="https://user-gold-cdn.xitu.io/2019/10/20/16de9512eaf1158a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

<font size=5>隐式类型转换详解</font>
哪些坑？
* 坑一：字符串连接符和算数运算符隐式转换规则混淆
* 坑二：关系运算符：会把其他数据类型转换成Number类型再进行比较
* 坑三：复杂类型隐式转换时会先转成String，然后再转成Number运算
* 坑四：逻辑非隐式转换和关系运算符隐式转换混淆

规则：
* 1、转成string类型： +（字符串连接符） 即（只要 + 号有一边是字符串）
* 2、转成number类型：++/--(自增自减运算符) + - * / %(算术运算符) > < >= <= == != === !=== (关系运算符)
* 3、 转成boolean类型：!（逻辑非运算符）

数据隐式转换扩展知识：

<b>复杂类型转Number类型顺序:</b>
1、先使用valueOf()方法获取其原始值，<b>如果返回值不是原始数据类型</b>，则使用toString()方法转成string
2、再将string转成Number类型

扩展知识点：
* 1、使用 == 运算符时涉及了哪些隐式类型转换？
  + 两边的类型是否相同，相同的话就比较值的大小，例如1==2，返回false
  + 判断的是否是null和undefined，是的话就返回true
  + 判断的类型是否是String和Number，是的话，把String类型转换成Number，再进行比较
  + 判断其中一方是否是Boolean，是的话就把Boolean转换成Number，再进行比较
  + 如果其中一方为Object，且另一方为String、Number或者Symbol，会将Object转换成字符串，再进行比较
  ```
  例：
    console.log({a: 1} == true);  // false
    console.log({a: 1} == "[object Object]");  // true
  ```
* 2、对象转原始类型是根据什么流程运行的？
  <font color=red>对象转原始类型，会调用内置的[Symbol.toPrimitive]函数，对于该函数而言，其逻辑如下：</font>
  + 1、如果Symbol.toPrimitive()方法，优先调用再返回
  + 2、调用valueOf()，如果转换为原始类型，则返回
  + 3、调用toString()，如果转换为原始类型，则返回
  + 4、如果都没有返回原始类型，会报错
  ```
  例：
    var obj = {
      value: 6,
      valueOf() {
        return this.value + 100
      },
      toString() {
        return '4'
      },
      [Symbol.toPrimitive]() {
        return 99
      }
    }
    console.log(obj + 1)   // 100
  ```
### 6、订阅发布模式
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

### 7、JavaScript小括号、中括号、大括号的多义性
* <b>小括号：</b>
  语义1，函数声明时参数表（形参）
  语义2，和一些语句联合使用以达到某些限定作用（if、for等）
  语义3，和new一起使用用来传值(实参)
  语义4，作为函数或对象方法的调用运算符(如果定义了参数也可与语义3一样传实参)
  语义5，强制表达式运算（常用有eval解析JSON和匿名函数自执行）

* <b>中括号：</b>
  语义1，声明数组
  语义2，取数组成员
  语义3，定义对象成员(可以不遵循标识符规则，可以以数字开头定义标识符)
  语义4，取对象成员

* <b>大括号：</b>
  语义1，组织复合语句,这是最常见的 (for, if)
  语义2，对象直接量声明(赋值对象）
  语义3，声明函数或函数直接量赋值
  语义4，结构化异常处理的语法符号（try...catch语句)

疑惑点：
```
function() {} ()
{}.construtor
以上代码会报错。原因是js'语句优先'在作怪，即{}被理解成复合语句块(语义1)而不是对象直接量(语义2)或声明函数(语义3)的语义。

因此：
function(){}()，大括号被理解成复合语句，自然前面的function()声明函数的语法不完整导致语法分析期出错。
{}.constructor，大括号被理解成复合语句，大括号后面是点运算符，点运算符前没有合理的对象自然也报错。

解决：
(function(){})()，(function(){});//强制其理解为函数(语义3)，“函数()”表示执行该函数，即声明后立即执行了。
({}).constructor //({})强制把大括号理解成对象直接量(语义2)，“对象.xx”表示获取对象的成员，自然后面的点运算符可以正常执行了。  
```
<font color=red>扩展考点：</font>
1、函数提升，如果加了小括号，还会提升吗？
答：不能。小括号进行强制表达式运算，函数表达式是不会提升的。

### 8、typeof 和 instanceof 有什么区别及使用场景？
  * typeof：对【原始数据类型】，除了null都可以使用typeof显示正确的类型。typeof null === 'object'，js历史遗留bug。对引用数据类型，除函数外，都会显示 ‘object’
  * instanceof：基于原型链查询，通过对比原型对象判断是否是某构造函数的实例
  但对基本数据类型无法作出判断。实现方式如下：
  ```
  class PrimitiveNumber {
    <!-- 在执行 instanceof 运算时，会自动执行下面静态方法 -->
    static [Symbol.hasInstance](instance) {
      return typeof instance === 'number'
    }
  }
  console.log(111 instanceof PrimitiveNumber);  true
  ```
  <b>那如何自己实现 instanceof 方法？</b> 
  核心：沿着原型链一直向上找
  ```
  function dataType(data, type) {
    // 对于基本数据类型，直接返回 false。因为 instance 判断不了原始数据类型（Number,String,Boolean）
    if (typeof data !== 'object' || typeof data === null) return false;
    // 获取数据的原型对象
    let proto = Object.getPrototypeOf(data);
    while(proto) {
      // 找到相同的原型对象
      if (proto === type.prototype) return true;
      proto = Object.getPrototypeOf(proto);
      // 查找到尽头，也没有找到
      if (proto === null) return false;
    }
  } 
  ```
  <font color=red><b>但是还是无法正常判断数组类型！？</b></font>
  ```
  要严格验证是否是数组，最好使用constructor；
  [].constructor === Array
  ```
### 9、HTTP 状态码
* 2开头表示成功的请求
  + 200 表示OK，正常返回信息
  + 201 表示请求成功且服务器创建了新的资源
  + 202 表示服务器已经接受了请求，但还未处理
  + 204 表示无内容。服务器处理成功，但未返回内容
    > 主要用于在浏览器不转为显示新文档的情况下，对其进行更新主要用于在浏览器不转为显示新文档的情况下，对其进行更新
    ```
    重要场景：
    1、表单提交后，需要跳转a.html，但a.html返回204，则页面不发生跳转，停留在当前页面
    2、使用ajax时，只需要知道响应成功或失败的情况，可以用204代替200，减少服务器多余数据传输
    ```
  + 205 告知浏览器清除当前页面中所有的表单元素，即表单重置
  + 206 表示客户端发送范围请求头Accept-Range抓取资源的部分数据
    ```
    参照以下命令，可以进行大文件分片下载：
    
    curl -v -r 0-20000 https://s0.cyberciti.org/images/misc/static/2012/11/ifdata-welcome-0.png -o part1
    curl -v -r 20001-30354 https://s0.cyberciti.org/images/misc/static/2012/11/ifdata-welcome-0.png -o part2
    cat part1 part2 >> testAcceptRangePic.png
    open testAcceptRangePic.png

    curl命令是一个和远程服务器交换数据的工具。它支持HTTP/FTPSFTP/FILE协议上的范围请求
    在下例中,使用两段范围来请求远程文件ifdata-welcome-0.png,然后使用cat命令将两段数据合并成完整文件
    ```
* 3开头表示各种重定向
  + 301 表示永久重定向，请求的网页已经永久移动到新位置（http 1.0）
  + 302 表示临时重定向，不保证不改变methods，不能确保POST会重定向为POST（http 1.0）
  + 303 表示临时重定向，只允许任意请求到GET的重定向（http 1.1）
  + 304 表示自从上一次请求以来，页面的内容没有改变过（http 1.1）
  + 307 同样表示临时重定向，不会改变method（http 1.1）
  + 308 表示永久重定向，不会h改变method（http 1.1）
* 4开头表示客户端错误
  + 400 1、语义有误，当前请求无法被服务器理解 2、请求参数有误
  + 401 表示请求未授权，用户未登录
  + 402 该状态码是为了将来可能的需求而预留的
  + 403 表示禁止访问
  + 404 表示请求的资源不存在，一般是路径写错了
  + 405 表示客户端请求中的方法被禁止
  + 407 表示要求代理身份验证
+ 5开头表示服务器网关错误
  + 500 表示最常见的服务器错误
  + 503 表示服务器暂时无法处理请求
  + 504 表示网关或代理服务器，未及时从远端服务器获取请求
  + 505 表示服务器不支持请求的HTTP协议的版本

[更多HTTP状态码，戳](https://blog.csdn.net/qq_36908872/article/details/94157930)
  
### 10、带副作用的数组方法有哪些？
* push, pop, unshift, shift, splice
* sort, reverse, fill

知识扩展：
> 我们都知道map方法不改变原数组，并返回一个新数组。那是用map时，同时进行原数组的改变，会出现什么问题？

```
var a =  b = [1,2,3,4];
var c = a.map(() => {
  return a.shift();
});
console.log(b ,c);
// 输出以下结果
[3,4]
[1,2,empty,empty];
```
解析：
> 当一个数组运行map时，数组的长度在第一次调用callback时已经确认。
> <font color=red>callback函数只会在有值的索引上被调用，那些没被赋值或delete删除的索引则不会被调用</font>

+ 原数组增加元素，map方法不会遍历到
+ 原数组删除元素，map方法会出现数组越界，calbback不执行，直接返回 empty 标识
+ 原数组进行元素修改，传入callback的值是map遍历到它n那一刻的值

```
当a.shift执行两次后，a的长度变为2，所以map需要访问的索引已经越界
```

### 11、http 请求头和响应头中都有哪些字段？哪些字段与页面缓存信息有关？
  <img src="https://images2015.cnblogs.com/blog/667706/201612/667706-20161205162518897-1265527411.png">

  【仅仅列举常见字段】
  <font size=5 color=red>request header:</font>
  + Accept : 指定客户端能够接收的内容类型，内容类型中的先后次序表示客户端接收的先后次序。(application/json, text/javascript, */*)
  + Accept-Encoding : 指定客户端浏览器可以支持的web服务器返回内容压缩编码类型。
  + 
  + Connection: 表示是否需要持久连接。
  + Content-Type : 显示此HTTP请求提交的内容类型。一般只有post提交时才需要设置该属性
  > 重要：浏览器通常使用MIME类型（而不是文件扩展名）来确定如何处理URL
  ```
  一般Content-Type语法结构:
  media-type
  资源或数据的 MIME type;
      +
  charset
  字符编码标准;
      +
  boundary
  对于多部分实体，boundary 是必需的

  MIME语法：
  通用结构: type/subtype
  {
    独立类型: [
      text/plain
      text/html
      image/jpeg
      image/png
      audio/mpeg
      audio/ogg
      audio/*
      video/mp4
      application/*
      application/json
      application/javascript
      ...
    ]
    Multipart 类型: [
      multipart/form-data
      multipart/byteranges
    ]
  }

  charset=utf-8

  实际运用如下，POST请求，一个是上传表单数据，一个是上文文件
  有关Content-Type属性值可以如下两种编码类型：
  (1) “application/x-www-form-urlencoded”： 
  表单数据向服务器提交时所采用的编码类型，默认的缺省值就是“application/x-www-form-urlencoded”。 

  (2) “multipart/form-data;boundary=something”： 
  在文件上传时，所使用的编码类型应当是“multipart/form-data”，它既可以发送文本数据，也支持二进制数据上载。
  对于多部分实体，boundary指令是必需的
  ```
  + Content-Length: 请求头的长度。
  + Cookie: 浏览器端cookie。
  + Host: 客户端地址
  + Origin: 目标地址
  + Referer: 一个URL地址，表示请求是从哪个页面url发出的
  + User-Agent: 客户端信息
  + x－Requested-With: 是否为同步请求 ，如果为XMLHttpRequest，则为 Ajax 异步请求。如果为null则为传统同步请求
  
  <font size=5 color=red>response header:</font>
  Access-Control-Allow与跨域有关
  + Access-Control-Allow-Headers: 首部字段用于预检请求的响应。正式请求是返回空
  + Access-Control-Allow-Methods: (GET, OPTIONS, HEAD, PUT, POST)
  + Access-Control-Allow-Origin: 控制该资源可以被其他外域访问 （* 表示任意外域）
  + Access-Control-Max-Age: 表明该响应的有效时间。在有效时间内，浏览器无须为同一请求再次发起预检请求
  + Content-Length: 响应体的长度
  + Content-Encoding: 服务端使用哪种类型压缩编码格式
  + Cache-Control: 告诉所有的缓存机制是否可以缓存及哪种类型
  + Expires: 本次响应过期的日期和时间
  + Last-Modified: 请求资源的最后修改时间
  + Content-Type: 返回内容的类型（application/json;）
  + Set-Cookie：设置Http Cookie

### 12、浏览器缓存、HTTP缓存（强缓存、协商缓存），浏览器缓存和CDN的关系
> CDN: Content Delivery Network，即内容分发网络

对于（图片，css，js）等不经常发生变化的文件，将他们存储起来，对客户端而言是优化用户浏览体验的方法。
<b>文件缓存多久？一般是由<font color=red size=5>服务器</font>进行设置的</b>

<b>什么是CDN缓存，使用CDN有什么好处？</b>
```

```
> HTTP 响应头中 Expires 和 Cache-Control 就是完成这个事情的（就是通常指的“强缓存”）


* Expires: 本次响应过期的日期和时间
  ```
  Expires: Sun, 16 Oct 2016 05:43:02 GMT。（服务器绝对时间）
  告诉浏览器在 Sun, 16 Oct 2016 05:43:02 GMT 之前不要去服务器获取该文件了
  ```
* Cache-Control: 告诉所有的缓存机制是否可以缓存及哪种类型
  ```
  Cache-Control: max-age: 600 （浏览器相对时间）
  告诉客户端，以客户端相对时间，文件可以缓存10分钟
  ```
如果两个字段同时设置，则以 Cache-Control 为标准。

<b>Cache-Control详解:</b>
<table>
  <tr>
    <th>字段值</th>
    <th>请求报文中的作用</th>
    <th>响应报文中的作用</th>
  </tr>
  <tr>
    <td>no-store</td>
    <td>不可缓存</td>
    <td>暗示响应报文中可能含有机密信息，不可缓存</td>
  </tr>
  <tr>
    <td>no-cache</td>
    <td>客户端提醒缓存服务器，在使用缓存前，不管缓存资源是否过期了，都必须进行校验</td>
    <td>缓存服务器在缓存资源前，必须进行校验，判断是否有效</td>
  </tr>
  <tr>
    <td>max-age=[秒]</td>
    <td>如果缓存资源的缓存时间值小于指定的时间值，则客户端接收缓存资源（如果值为0，缓存服务器通常需要将请求转发给源服务器进行响应，不使用缓存）</td>
    <td>在指定时间内，缓存服务器不再对资源的有效性进行确认，可以使用</td>
  </tr>
  <tr>
    <td>no-transform</td>
    <td colspan="2">禁止代理改变实体主体的媒体类型（例如禁止代理压缩图片等）</td>
  </tr>
  <tr>
    <td>max-stale(=[秒])</td>
    <td>提示缓存服务器，资源过期后的指定时间内，客户端也会接收</td>
    <td>无</td>
  </tr>
  <tr>
    <td>min-fresh=[秒]</td>
    <td>提示缓存服务器，如果资源在指定时间内还没过期，则返回</td>
    <td>无</td>
  </tr>
  <tr>
    <td>only-if-cached</td>
    <td>如果缓存服务器有缓存该资源，则返回，不需要确认有效性。否则返回504网关超时</td>
    <td>无</td>
  </tr>
  <tr>
    <td>public</td>
    <td>无</td>
    <td>明确指明其他用户也可以使用缓存资源</td>
  </tr>
  <tr>
    <td>private</td>
    <td>无</td>
    <td>缓存服务器只给指定的用户返回缓存资源，对于其他用户不返回缓存资源</td>
  </tr>
  <tr>
    <td>must-revalidate</td>
    <td>无</td>
    <td>缓存资源未过期，则返回，否则代理要向源服务器再次验证即将返回的响应缓存是否有效，如果连接不到源服务器，则返回504网关超时</td>
  </tr>
  <tr>
    <td>proxy-revalidate</td>
    <td>无</td>
    <td>所有缓存服务器在客户端请求返回响应之前，再次向源服务器验证缓存有效性</td>
  </tr>
</table>

<b>进阶知识:</b>
> 有个文件可能时不时会更新，需要客户端能时不时过来访问下这个文件是否过期。如果没过期，服务器就不会返回数据，而是告诉客户端你的缓存还没有过期（304）。然后浏览器使用自己的缓存来显示，这个叫做<font size=4 color=blue><b >协商缓存</b></font>。

实现过程：
* 1、客户端访问资源数据时，服务端在返回数据同时返回了<font color=red>Last-Modifed</font>:Wed, 07 Aug 2013 15:32:18 GMT，告诉客户端你获取的文件最后修改时间是Wed, 07 Aug 2013 15:32:18 GMT。客户端将文件放入缓存中，同时记录文件最后修改时间
* 2、第二次访问的时候（假设没有设置Expires和Cache-Control），客户端把服务器之前告诉的文件最后修改时间加在Request Header中 <font color=red>If-Modify-since</font>: Wed, 07 Aug 2013 15:32:18 GMT
* 3、服务器根据 Request Header 中 If-Modify-since，与文件最后修改时间进行比较。如果没修改返回304，否则返回200，并带上资源内容

【协商缓存】另一种实现方案：
打标签（Tag）<font color=red>ETag/ If-None-Match</font>，实现过程同Last-Modifed/If-Modify-since

<b>题外话：各种刷页面请求数据时表现的不同点？</b>
假设客户端第一次请求数据内容时，服务端返回了 Cache-Control: max-age=600，Last_Modify: Wed, 10 Aug 2013 15:32:18 GMT 字段。
* 直接浏览器url回车健一敲，浏览器以最少的请求来获取网页的数据，根据 Cache-Control 文件缓存时间没有过，直接从缓存中获取文件
* 按下F5或刷新按钮，浏览器会在请求中附加必要的缓存协商，带上 Last_Modify_since 检测下文件是否已经修改
* Ctrl + F5，删除本地缓存文件，去服务端请求完整数据

### 13、浏览器加载和渲染html、js、css的顺序
<b>域名解析 -> 加载html -> 加载js和css -> 加载图片等其他信息</b>
html的解析详细步骤：
1. 解析html结构
2. 加载外部脚本和样式表文件
3. 解析并执行脚本文件
4. 构造 HTML DOM Tree
5. 加载图片的外部资源
6. 页面加载完毕

扩展知识：

> 页面加载完毕后，执行操作。我们使用哪个事件？

<b>页面资源加载完成</b>
* 1、window.onload = fn

<b>DOM树加载完成</b>
jquery 实现：
* 1、$.ready(fn)
* 2、$(fn)

原生js未实现，我们手动实现一版
```
document.ready = function(callback) {
  if(document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function() {
      document.removeEventListener('DOMContentLoaded', agruments.callee, false);
      callback();
    })
  }
}
```

所有我们在XX情况下使用
在XX情况下使用

### 14、jsonp原理与实践
拥有”src”这个属性的标签都拥有跨域的能力，比如<\script>、<\img>、<\iframe>。
哪怕跨域js文件中的代码（当然指符合web脚本安全策略的），web页面也是可以无条件执行的。
```
// 提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
var url = "http://flightQuery.com/jsonp/flightResult.aspx?code=CA1998&callback=flightHandler";
// 创建script标签，设置其属性
var script = document.createElement('script');
script.setAttribute('src', url);
// 把script标签加入head，此时调用开始
document.getElementsByTagName('head')[0].appendChild(script); 
```
核心思想：
1、页面通过src属性引入服务器端的资源路径，告诉服务器需要执行的js方法
2、服务器端动态生成js脚本并响应

扩展知识：
ajax与jsonp的异同？
<font color=red>ajax的核心是通过XmlHttpRequest获取非本页内容，而jsonp的核心则是动态添加</font>

### 15、xss/crsf 攻击是什么？如何避免？
> xss攻击 全称跨站脚本攻击

危害：
1、盗取各类账号
2、篡改敏感信息
3、控制受害机器向其他网站发动攻击

攻击方式：
* 1、反射型XSS，也叫非持久型XSS
  ```
  XSS代码出现在请求URL中，作为参数提交到服务器，服务器解析并响应.
  响应结果中包含XSS代码，最后浏览器解析并执行
  ```
* 2、存储型XSS，也叫持久型XSS
  ```
  （如：留言板）主要是将XSS代码发送到服务器，那些XSS代码会从服务器解析之后加载出来
  ```
  威胁：
  + 1、窃取用户信息，如cookie，token，账号密码等。
    ```
    将一段脚本提交保存到服务器，下次浏览页面会将这段恶意脚本读取，展示到html中
    ```
  + 2、劫持流量实现恶意跳转

<b>扩展：XSS防范手段</b>
* 1、入参字符过滤
  + 如移除用户提交的的DOM属性（事件行为），```移除用户上传的Style节点，<iframe>, <script>，<a>```节点
* 2、出参进行编码
  + 转义一些特殊符号。如<>在输出的时候要对其进行转换编码，这样做浏览器是不会对该标签进行解释执行的
* 3、入参长度限制
* 4、设置cookie httponly为true

> CSRF跨站点请求伪造。攻击者盗用了你的身份，进行恶意操作

<b>扩展：防御CSRF攻击</b>
* 1、验证 HTTP Referer 字段
  ```
  HTTP 请求的来源地址，给安全敏感的请求统一增加一个拦截器来检查 Referer 的值。
  但是 Referer 用户可以设置关闭使用，并且低版本浏览器可以被篡改。出现校验失败！
  ```
* 2、在请求地址中添加 token 并验证
* 3、在 HTTP 头中自定义属性并验证。
  ```
  把 token 放到 HTTP 头中自定义的属性里
  ```

### 16、HTTP协议详解
> HTTP协议是基于TCP的，TCP每次要经过3次握手，4次挥手

HTTP目前有三个版本：
+ HTTP1.0
+ HTTP1.1
+ HTTP/2

<b>HTTP版本之间的区别</b>
* <font color=red>1、HTTP1.0 和 HTTP1.1</font>
  最主要区别：
  + HTTP1.0 只支持短连接。<b>每次和服务器交互，都要新开一个连接</b>
  + HTTP1.1 支持持久化连接的，默认开启。<b>增加了新的请求头来帮助实现，Connection请求头的值为Keep-alive</b>

  其他重要区别：
  + HTTP1.1 增加host字段
  + HTTP1.1 增加缓存处理（新的字段 Cache-Control）
  + HTTP1.1 引入了Chunked transfer-coding，实现断点续传
  + HTTP1.1 管线化（pipelining）理论，客户端可以同时发出多个HTTP请求，而不用一个个等待响应之后再请求（注意：pipelining仅属于理论场景，在HTTP1.1下，浏览器默认关闭pipelining）
  <br>
* <font color=red>2、HTTP1.1 与 HTTP/2</font>
  > 性能提升的核心在于二进制帧层，它定义了如何封装http请求在客户端和服务器之间传输

  最主要区别：
  + 二进制分帧。HTTP/2 解决了线头阻塞问题，最重要改动：多路复用。

  其他重要改动：
  + 使用HPACK算法对HTTP/2头部压缩
  + 服务器推送；HTTP2推送资料：https://segmentfault.com/a/1190000015773338
  + 流量控制
  + 流优先级控制（Stream Priority）它被用来告诉对端哪个流更重要

扩展知识：
<font color=red><b>1、进行一次TCP连接</b></font>
<img src="https://upload-images.jianshu.io/upload_images/5291509-f1e796c2d96f2b84.png?imageMogr2/auto-orient/strip|imageView2/2/w/505/format/webp">

<font size=4 color=red>2、HTTPS再次回顾</font>
浏览器发送消息，进行加密保护的发展进程。
* 对称加密
  + 加密和解密用的同一个密钥
* 非对称加密
  + 加密用公开的密钥，解密用私钥
* 数字签名
  + 验证传输的内容是<b>对方发送的消息</b>
  + 发送的数据<b>有没有被修改过</b>
  <b>实现原理：</b>
* 数字证书，简称CA
  + 认证机构证明是<b>真实的服务器发送的内容</b>

说到底，就是为了解决信息安全的问题。
* 1、保密性
* 2、完整性
* 3、有效性
公钥密码解决保密性，数字签名解决完整性和有效性。
那数字签名和数字证书保证了服务器传输信息的安全性

数字证书，如ssl证书部署在服务器，并随加密消息一起发送到客户端

### 17、Promise 实现原理
> Promise 规范有很多，如Promise/A，Promise/B，Promise/D 以及 Promise/A 的升级版 Promise/A+。ES6 中采用了 Promise/A+ 规范

<font color=red>Promise标准解读</font>
* 1. 一个promise的当前状态只能是pending、fulfilled和rejected三种之一。状态改变只能是pending到fulfilled或者pending到rejected。状态改变不可逆
* 2. promise的then方法接收两个可选参数，表示该promise状态改变时的回调
  ```
  (promise.then(onFulfilled, onRejected))。
  then方法返回一个promise。then 方法可以被同一个 promise 调用多次
  ```

### 18、js 事件循环机制 eventLoop。Macor task 和 Micor task分别表示什么
<font size=5>事件循环的基本概念</font>

* 任务分为macro task，micro task 对应都有不同的<b>任务队列</b>
  + script 正常代码
  + micro task（微任务 -> jobs）: process.netTick, promise, mutationObserver
    - js引擎线程维护
  + macro task（宏任务 -> task）: setTimeout, setInterval, I/O, UI Rendering
    - 由事件触发引擎维护
  + 最终都是在函数调用栈中完成

<font>事件循环执行的顺序</font>
* 执行函数调用栈中的macro task，直到调用栈清空（剩下全局）
* 执行 job queues 中所有可执行的micro task
* 执行 UI Render
* 从事件队列中获取 macro task，开始新的事件循环

### 19、JQuery的 deferred 对象是作什么？
  > deferred 对象是 jQuery 回调函数解决方法

  主要功能归结为4点：
  + 1、ajax操作的链式写法（jquery版本高于1.5）
    jquery1.5以前，ajax操作返回xhr对象，只能采用传统写法：
      ```
        $.ajax({
          url: 'test.html',
          success: function() {},
          error: function() {}
        })
      ```
    jquery1.5以后，ajax操作返回deferred对象，可以进行链式调用：
      ```
        $.ajax('test.html')
        .done(function() {})
        .fail(function() {})
      ```
  + 2、指定同一操作的多个回调函数
    ```
      $.ajax('test.html')
      .done(function() {})
      .fail(function() {})
      .done(function() {})
    ```
  + 3、为多个操作指定回调函数
    ```
    <!-- 请求全部成功执行done的回调函数，只要有一个失败执行fail中的回调函数 -->
    $.when(
      $.ajax('test1.html'),
      $.ajax('test2.html)
    )
    .done()
    .fail()
    ```
  + 4、给普通操作添加回调函数接口
    ```
    <!-- 版本一 -->
    function wait() {
      var dtd = $.Deferred(); // 新建一个deferred对象
      var task = function () {
        alert('over');
        dtd.resolve(); // 改变deferred执行状态
      }
      setTimeout(task, 5000);
      return dtd.promise;
    }
    $.when(wait(dtd))
    .done(function() {
      alert('执行成功')
    })
    .fail(function() {
      alert('执行失败咯')
    })
    ```
    ```
    <!-- 
    $.Deferred接受一个函数名作为参数，
    $.Deferred生成的deferred对象将作为参数传入wait函数中 
    -->

    function wait(dtd) {
      var task = function () {
        alert('over');
        dtd.resolve(); // 改变deferred执行状态
      }
      setTimeout(task, 5000);
      return dtd.promise;
    }
    $.Deferred(wait)
    .done()
    .fail()
    ```
### 20、V8引擎如何进行内存垃圾回收？

扩展知识：

<b>重要，内存泄漏识别！</b>
chrome 控制台打开 Memory，进行记录。如果 Memory 趋于平缓内存正常。反之就是内存泄漏

<b>重要，内存泄漏场景！</b>
* 1、意外的全局变量
  + 解决：使用严格模式，'use strict;'
* 2、被遗忘的定时器或回调函数。尤其是 setInterval，给dom注册的监听事件等
  + 解决：及时清理不需要的定时器，removeEventListener
* 3、闭包。导致函数内部变量不能被垃圾回收
  + 解决：V8垃圾回收机制

<b>重要，内存泄漏解决方案！</b>
* <font color=red>1、很多用不到的值，需要手动解除值的引用</font>
```
var arr  = [1,2,3,4];
console.log('aaa');
arr = null; //  手动解除值引用，内存可以被垃圾回收机制释放！
```

* <font color=red>2、使用弱引用：WeakMap、WeapSet</font>
> <b>只要外部的引用消失，WeakMap的内部引用，就会自动被垃圾回收机制清理</b>

<b>重要，垃圾回收机制！</b>
> IE方法是“引用计数”。语言引擎中有一张“引用表”，保存了内存中所有资源的引用次数。如果一个值的引用次数为0，就表示这个值不再使用，可以将这块内存释放。但是无法解决循环引用问题

> 最新js内核使用"标记清除"算法

### 21、正则详解

<font size=5><b>小括号 () 用法，理解捕获应用</b></font>

<font color=red>是正则在非全局(g)模式下:</font>
> 正则表达式分组（）中的所匹配出的字符串内容；每一个分组（）代表一个捕获；在一个正则中，按（）的顺序为第一组，第二组捕获；

> 由于（）具有分组和捕获双重意义，所以JS引擎会将所有的（）都解释为捕获和分组，这会影响效率，因此在对不需要捕获的分组用（?:）标识，即可完成单纯的分组功能

<b>哪里能获得捕获的值？</b>
* 1、String  match（regex）
  ```
  这个方法返回值为数组，其中按索引排列，第0号是匹配的项，随后就是第1个捕获，第2个捕获
  ```
* 2、regex test (String)
* 3、String.replace(regex, "$$1" / function(str,$1,$2....)) 
  <b>注意：replace 返回一个新字符串</b>
  ```
  这是字符串替换，第二参数为字符串时，可以直接用"$1,$2...."来获取到对应的捕获值，
  如果是函数，则函数的第二个参数开始也是对应的捕获值
  ```
* 4、 正则表达式内部，利用“\1,\2...”可以作为反引用，匹配与之前对应捕获的内容

<b>分组捕获更多应用：</b>
* 对匹配的字符串反向引用
  ```
  'Can you can a can as a canner can can a can?'.match(/([cC]an+)\s+\1/g);
  // ["can can"]
  // 注意 `\1` 等价于正则里的 `([cC]an+)`，即与下面示例相同
  ```
* 非捕获用法：(?:n ) 表示非捕获组
  ```
  'adobe12ps15test'.match(/[a-z]+(?:\d+)([a-z]+)/);
  // ["adobe12ps", "ps"]
  ```

<font color=red>注意：符号的特殊含义</font>
* 1）^ 在 [] 内开始位置及正则双斜线开始位置有特殊含义
  + 正则开头位置表示以某某开头的字符串
  ```
  'adobe 2016'.match(/^[a-zA-Z]+/);
  // ["adobe"]
  ```
  + 在正则 或 匹配中(即 | 匹配)，表示 或者以某某字符开始的字符串
  ```
  'adobe2016ps'.match(/\d+|^[a-z]+/g);
  // ["adobe", "2016"]  
  ```
  + 在 [] 内开始位置时，表示不匹配 [] 内除 ^ 以外的所有字符
  ```
  'adobe'.match(/[^abc]/g);
  // ["d", "o", "e"]
  ```

* 2） 匹配任何***字符n的字符串
  + (?=n ) 匹配任何其后紧跟字符n的字符串，但返回中不包含n
  + (?!n ) 匹配任何其后没有紧跟字符n的字符串，返回中不包含n
  + (?<=n ) 匹配任何其前紧跟字符n的字符串，返回中不包含n
  + (?<!n ) 匹配任何其前紧跟字符n的字符串，返回中不包含n


[JS正则表达式总结](https://www.jianshu.com/p/488d60349325)

<b>常见缩写：</b>
* 1、\w 可匹配字母、数字、下划线。等价于[a-zA-Z0-9_]
* 2、\d 匹配数字。等价于[0-9]
* 3、\s 匹配空白字符串
* 4、\b 匹配单词边界，注意连续的数字、字母或下划线组成的字符串会认为一个单词
  ```
  'adobe(2016) ps6.4'.match(/\b(\w+)/g);
  // ["adobe", "2016", "ps6", "4"]
  ```

<b>常见正则：</b>
* 1、手机号码：```/^((13[0-9])|(15[^4,\D])|(18[0-9]))\d{8}$/```
* 2、电子邮箱：
  规则：
  + 以大写字母[A-Z]、小写字母[a-z]、数字[0-9]、下滑线[_]、减号[-]及点号[.]开头，并需要重复一次至多次[+]
  + 中间必须包括@符号
  + @之后需要连接大写字母[A-Z]、小写字母[a-z]、数字[0-9]、下滑线[_]、减号[-]及点号[.]，并需要重复一次至多次[+]
  + 结尾必须是点号[.]连接2至4位的大小写字母[A-Za-z]{2,4}

  综上：
  ```/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/```

[更多正则案例](https://juejin.im/post/5e6cf42bf265da57397e3694?utm_source=gold_browser_extension#heading-98)

### 22、script 标签中的 defer 和 async 属性
* defer：<font size=5>延迟加载</font>。<b>标识脚本可以延迟到文档完全被解析和显示之后再执行</b>。只对外部脚本文件有效
* async: <font size=5>异步加载</font>。<b>表示应该立即下载脚本，但不应妨碍页面中的其他操作</b>，比如下载其他资源或等待加载其他脚本

### 23、restful接口详解
> 只是一种风格

对于资源的具体操作类型，由HTTP动词表示
* GET（SELECT）：从服务器取出资源（一项或多项）
* POST（CREATE）：在服务器新建一个资源。
* PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
* DELETE（DELETE）：从服务器删除资源。
* PATCH （UPDATE）：在服务器更新资源（客户端提供改变的属性）。

还有二个不常用的HTTP动词
* HEAD：获取资源的元数据。
* OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。

【For Exmaple】
  + GET /zoos：列出所有动物园
  + POST /zoos：新建一个动物园
  + GET /zoos/ID：获取某个指定动物园的信息
  + PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
  + PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
  + DELETE /zoos/ID：删除某个动物园
  + GET /zoos/ID/animals：列出某个指定动物园的所有动物
  + DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物

【添加过滤信息】
如果记录数量很多，服务器不可能都将它们返回给用户。API应该提供参数，过滤返回结果
  + ?limit=10：指定返回记录的数量
  + ?offset=10：指定返回记录的开始位置。
  + ?page=2&per_page=100：指定第几页，以及每页的记录数。
  + ?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
  + ?animal_type_id=1：指定筛选条件

### 24、Reflect、Proxy解读
> Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API
  * 1、将Object对象的一些明显属于语言内部的方法，放到Reflect对象上
  * 2、修改某些Object方法的返回结果，让其变得更合理

### 25、js bridge 原理。涉及native端和js端
<b>JavaScript 调用 Native 推荐使用注入 API 的方式</b>
> 注入 API 方式的主要原理是，通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法
* js 端怎么调用？
  + an
  + IOS: ```window.webkit.messageHandlers.nativeBridge.postMessage(message);```
  其中，nativeBridge 就是 IOS 提供的方法
* js 端怎么提供？
  > 从外部调用 JavaScript 中的方法，因此 JavaScript 的方法必须在全局的 window 上

[更多 JS Bridge](https://blog.csdn.net/yuzhengfei7/article/details/93468914)

### 26、js 为什么是单线程的？
> 首先浏览器是多进程的，在浏览器中，每打开一个tab页面，其实就是新开了一个进程，在这个进程中，还有ui渲染线程，js引擎线程，http请求线程等

单线程必要性：js设计的初衷是实现用户和浏览器交互，dom操作等。如多线程dom操作，会导致复杂的同步问题，浏览器将无法处理页面渲染

扩展知识：
> H5提出 Web Worker 标准，允许Js创建多个线程，但子线程完全受控于主线程，并且不允许操作 DOM。

### 27、MVVM 和 MVC的区别


### <font color=red>28、React与Vue对比</font>
* 1、相似点
  + 1、都使用 Virual DOM
  + 2、提供了响应式和组件化的视图组件
  + 3、将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库
* 2、区别
  + 1、组件渲染方式不同
    - 在React应用中，当某个组件状态发生变化（props或state），它会以该组件为根，重新渲染整个组件子树。如要避免不必要的子组件重新渲染，需要手动实现（componentShouldUpdate，PureComponent）
    - 在vue应用中，组件的依赖是在渲染过程中自动追踪的（属性劫持 + 数据订阅），系统能精确知道哪个组件确实需要被重新渲染，开发者不需要考虑组件是否需要重新渲染之类的优化
  + 2、视图渲染方式不同
    - 在react中，所有组件的渲染功能都依靠 js，可以充分发挥js的功能来构建我们的视图页面
    - 在Vue中自带渲染函数（比如各种指令），并且官方推荐使用模版渲染视图
  + 3、组件内CSS作用域问题（补）
    - react中，使用 CSS-in-js方案实现
    ```
    webpack的配置:
    {
      test: /\.css/,
      use:['style-loader','css-loader?modules$localIdentName=[path][name]-[local]-[hash]']
    }

    [path]表示样式表相对于项目根目录所在的路径
    [name] 表示样式表文件名称
    [local] 表示样式表的类名定义名称
    [hash:length] 表示32位的hash值
    
    注意：只有类名选择器和ID选择器才会被模块化控制，类似body h2 span 这些标签选择器是不会被模块化控制
    ```
    - 在vue中，通过给style标签加scoped标记实现。（原理：给根节点动态生成一个属性，通过组件根节点的属性选择器约束子节点的样式）