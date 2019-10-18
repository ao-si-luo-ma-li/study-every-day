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
* 3. 实现一个bind函数
* 4. instanceof的原理
* 5. Object.create的基本实现原理
* 6. new本质
* 7. 实现一个基本的Promise
* 8. 实现浅拷贝
* 9. 实现一个基本的深拷贝
* 10. 使用setTimeout模拟setInterval
* 11. js实现一个继承方法
* 12. 实现一个基本的Event Bus（订阅、发布模式）
* 13. 实现一个双向数据绑定
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