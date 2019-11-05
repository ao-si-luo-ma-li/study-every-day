// 用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值
const testArr = Array.from(Array(33)).map((item, index) => index).slice(2);
function randomArr(arr, lg) {
  const _arr = [...arr];
  if (lg === 1) {
    return _arr.splice(Math.floor(Math.random() * _arr.length), 1);
  }
  else {
    return [
      ..._arr.splice(Math.floor(Math.random() * _arr.length), 1),
      ...randomArr(_arr, lg - 1)
    ];
  }
}
// console.log(randomArr(testArr, 5))

// 将树形结构数据通过递归给出树状图
const treeData = [
  {
    name: 'xx1',
    children: [
      {
        name: 'yy1-1'
      },
      {
        name: 'yy1-2'
      }
    ]
  },
  {
    name: 'xx2',
    children: [
      {
        name: 'yy2-1'
      },
      {
        name: 'yy2-2'
      }
    ]
  }
]

// 深拷贝
function deepClone(initObj) {
  let obj;
  if (typeof initObj === 'object') {
    obj = initObj.constructor === Array ? [] : {};
    for (let key in initObj) {
      if (initObj.hasOwnProperty(key)) {
        obj[key] = typeof initObj[key] === 'object' 
          ? deepClone(initObj[key])
          : initObj[key]
      }
    }
  }
  return obj;
}
// console.log(deepClone(treeData))

// 实现一个 instance 运算
// 核心是沿着原型链往上找
function judgeType(data, type) {
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

// console.log(judgeType({}, Object))

// 订阅发布模式
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
function getlist1(...params) {
  console.log('getlist---1', params)
}
function getlist2(...params) {
  console.log('getlist---2', params)
}
function getlist3(...params) {
  console.log('getlist---3', params)
}
// 订阅
// EventEmitter.on('fresh', getlist1);
// EventEmitter.on('fresh', getlist2);
// EventEmitter.once('fresh', getlist3);

// EventEmitter.emit('fresh', [1,2,3,4]);

// 手写一个promise构造方法
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

// 测试 promise方法
// new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(99);
//   }, 1000);
// })
// .then(data => {
//   console.log('data => ', data);
// })

/**
 * 实现js中的继承
 */

// 1、借助call。【无法获取父类原型对象上的方法】
function Parent1(params) {
  this.name = 'www';
  this.num = [1,2,3];
}
Parent1.prototype.ask = function (params) {
  console.log('I ask')
}
function Children1(params) {
  Parent1.call(this);
  this.age = 19;
}
var child1 = new Children1();
var parent1 = new Parent1();
// parent1.ask();
// console.log('child1', child1)

// 2、借助原型链 【原型对象相同，修改属性会互相影响；构造函数是Parent2，不是Child2】
function Parent2(params) {
  this.name = 'www';
  this.num = [1,2,3];
}
Parent2.prototype.ask = function (params) {
  console.log('I ask for 2')
}
function Children2(params) {
  // Parent2.call(this);
  this.age = 22;
}
Children2.prototype = new Parent2();
var child2 = new Children2();
var child2_2 = new Children2();
child2_2.num.push(99);
// console.log('=====', child2.num, child2_2.num)

// 3、组合继承优化（寄生组合继承）
function Parent3(params) {
  this.name = 'www';
  this.num = [1,2,3];
}
function Children3(params) {
  Parent3.call(this);
  this.age = 30;
}
Children3.prototype = Object.create(Parent3.prototype);
Children3.prototype.constructor = Children3;
var child3 = new Children3();
console.log('child3', child3)