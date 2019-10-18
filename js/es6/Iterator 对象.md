

### Set 和 Map 数据结构
* <font size=5 color=blue><a href="http://es6.ruanyifeng.com/#docs/set-map#Set">Set</a></font>
 <b> Set 结构的实例对象使用 keys方法、values方法、entries方法返回的都是遍历器对象</b>
  ```
  let set = new Set(['red', 'green', 'blue']);

  for (let item of set.keys()) {
    console.log(item);
  }
  ```
  <b>数组的map和filter方法也可以间接用于 Set</b>
  ```
  let set = new Set([1, 2, 3]);
  set = new Set([...set].map(x => x * 2));
  ```
* <font size=5 color=blue><a href="http://es6.ruanyifeng.com/#docs/set-map#Set">WeakSet</a></font>
> WeakSet 的成员只能是对象，而不能是其他类型的值