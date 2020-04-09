### Proxy 提供了强大的javascript元编程
> Proxy 用于修改某些操作的more行为，也可以理解为在目标对象之前架设一层拦截，外部所有的访问都必须先通过这层拦截，因此提供了一种机制，可以对外部的访问进行过滤和修改。【这个词的原理为代理，表示由它“代理”某些操作，译为“代理器”】

```
var proxy = new Proxy(target, handler);

* target是表示所要拦截的对象
* handle是用来定制拦截行为的对象
```

Proxy 陷阱:

* handler.get
* handler.set
* handler.has
* handler.apply
* handler.construct
* handler.ownKeys
* handler.deleteProperty
* handler.defineProperty
* handler.isExtensible
* handler.preventExtensions
* handler.getPrototypeOf
* handler.setPrototypeOf
* handler.getOwnPropertyDescriptor

<b>主要功能：</b>
* 运算符重载
* 对象模拟

<b>实际开发中的应用：</b>
* 1、默认值/“零值”
  ```
  const withZeroValue = (target, zeroValue) =>
    new Proxy(target, {
      get: (obj, prop) => (prop in obj ? obj[prop] : zeroValue)
  });
  ```
* 2、负索引数组
  ```
  const negativeArray = els =>
    new Proxy(els, {
        get: (target, propKey, receiver) =>
            Reflect.get(
                target,
                +propKey < 0 ? String(target.length + +propKey) : propKey,
                receiver
            )
    });
  ```
* 3、隐藏属性
  ```
  const hide = (target, prefix = "_") =>
    new Proxy(target, {
        has: (obj, prop) => !prop.startsWith(prefix) && prop in obj,
        ownKeys: obj =>
            Reflect.ownKeys(obj).filter(
                prop => typeof prop !== "string" || !prop.startsWith(prefix)
            ),
        get: (obj, prop, rec) => (prop in rec ? obj[prop] : undefined)
    });
  ```
* 4、缓存控制
  ```
  const ephemeral = (target, ttl = 60) => {
    const CREATED_AT = Date.now();
    const isExpired = () => Date.now() - CREATED_AT > ttl * 1000;

    return new Proxy(target, {
        get: (obj, prop) => (isExpired() ? undefined : Reflect.get(obj, prop))
    });
  };
  ```
* 5、


补充知识：
<b>vue 3.0 以后不再使用 Object.defineProperty 做属性劫持。而是使用 Proxy 对象</b>