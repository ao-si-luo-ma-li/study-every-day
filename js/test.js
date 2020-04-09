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
// console.log('child3', child3)

function getRepeatEle(arr) {
  let obj = {};
  arr.forEach(element => {
    if (obj[element]) {
      obj[element] += 1;
    }
    else {
      obj[element] = 1
    }
  });
  console.log(arr.filter(ele => obj[ele] === 1))
}

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  let cuStr = '';
  let max = 0;
  let front = 0;
  let next = 0;
  while(next < s.length) {
    const repeatIndex = cuStr.indexOf(s[next]);
    if (repeatIndex > -1) {
        max = max < cuStr.length ? cuStr.length : max;
        front = front + repeatIndex + 1;
    }
    cuStr = s.slice(front, next+1);
    next++;
  }
  return max < cuStr.length ? cuStr.length : max;
};

// console.log(lengthOfLongestSubstring('igigikiii'))

function Fa(x, y) {
  this.x = x;
  this.y = y;
}
Fa.sum = function (z) {
  return this.x + this.y + z;
}
const fa = new Fa('a', 2);
// console.log(fa.sum(3))

async function async1() {
  console.log('async1 start -> ', 2); // 
  await async2();
  setTimeout(function() {
      console.log('setTimeout1 ->', 7)  
  },0)
}
async function async2() {
  setTimeout(function() {
      console.log('setTimeout2 ->', 6)  
  },0)
}
console.log('script start -> ', 1);
setTimeout(function() {
  console.log('setTimeout3 -> ', 5);  
}, 0)
async1();

new Promise(function(resolve) {
  console.log('promise1 -> ', 3);  
  resolve();
}).then(function() {
  console.log('promise2 ->', 8);  
});
console.log('script end -> ', 4);  

function findMinOver(target, origin) {
  let temp;
  origin.forEach(num => {
    if (num > target) {
      temp = !temp ? num : num < temp ? num : temp;
    }
  })
  return temp
}

// 根据一组数字，排列组合最小数字 99887123 => 12378899
function getMin(str) {
  return parseInt(`${str}`.split('').sort((a,b) => +a - +b).join(''))
}

// 实验： map方法时，修改原数组会出现怎么样子？
function arrShift() {
  var a = b = [1,2,3,4];
  var c = a.map(num => {
    console.log('num', num)
    let hh = a.shift()
    return hh;
  });
  console.log(b, c)
}

// 输出环形数据
function outputCircle(arr) {
  let rows = arr.length;
  let columns = arr[0].length;
  let minRow = 0;
  let maxRow = rows -1;
  let minColumn = 0;
  let maxColumn = columns -1;
  while (true) {
    // 输出外圈上一行
    arr[minRow].forEach((num, index) => {
      if (index >= minColumn && index <= maxColumn) {
        console.log('num', num);
      }
    });
    // 输出外圈右一列
    for (let index = minRow + 1; index < maxRow; index++) {
      console.log('num', arr[index][maxColumn])
    }
    // 输出外圈下一列
    arr[maxRow].slice(0).reverse().forEach((num, index) => {
      if (index >= minColumn && index <= maxColumn) {
        console.log('num', num);
      }
    });
    // 输出外圈左一列
    for (let index = maxRow - 1; index > minRow; index--){
      console.log('num', arr[index][minColumn]);
    }
    minRow++;
    maxRow--;
    minColumn++;
    maxColumn--;
    if (minRow >= maxRow || minColumn >= maxColumn) {
      break;
    }
  }
  console.log('00000')
}
var a = [
  [1,2,3,4],
  [12,13,14,5],
  [11,16,15,6],
  [10,9,8,7]
]
outputCircle(a)

// 实现一个bind函数
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('这不是一个函数')
  }
  const fn = this;
  const args = [...arguments].slice(1);
  return function F() {
    // 处理函数使用new的情况。bind 不能改变构造方法的this，构造方法中this指向实例
    if (this instanceof F) {
      return new fn(...args, ...arguments);
    }
    else {
      return fn.apply(context,[...args, ...arguments])
    }
  }
}

// 实现千分位
function thsoundSplit(params) {
  if (!params) return;
  const ls = `${params}`;
  let mainStr = null;
  let strArr = [];
  let handleData = ls.split('.');
  let mainData = handleData[0];
  let dotData = handleData[1];
  let splitIndex = mainData.length;
  while (splitIndex > 2) {
    strArr.push(mainData.slice(splitIndex - 3, splitIndex));
    splitIndex = splitIndex - 3;
  }
  if (splitIndex > 0) {
    strArr.push(mainData.slice(0, splitIndex));
  }
  mainStr = strArr.reverse().join(',');
  if (dotData && dotData.length > 0) {
    mainStr = `${mainStr}.${dotData}`
  }
  return mainStr;
}

// 合并两个有序数组
let a = [1,2,6];
let b = [3,4,5,7];
function sortArr(a, b) {
  let sort = [];
  let toA = 0;
  let toB = 0;
  while (toA < a.length && toB < b.length) {
    if (a[toA] < b[toB]) {
      sort.push(a[toA]);
      toA++;
    }
    else {
      sort.push(b[toB]);
      toB++;
    }
  }
  if (a.length > b.length) {
    sort = sort.concat(a.slice(toA))
  }
  else {
    sort = sort.concat(b.slice(toB))
  }
  return sort;
}

// 实现Promise.all
Promise.my = function (list) {
  return new Promise((resolve, reject) => {
    let i = 0;
    let result = [];
    function doNext(promise) {
      promise.then((data) => {
        result.push(data);
        if (i === list.length) {
          resolve(result);
        }
        else {
          doNext(list[++i]);
        }
      })
      .catch(() => {
        reject();
      })
    }
    doNext(list[i])
  })
}

Promise.resolve()
.then(() => {
  throw 'www error';
})
.catch((e) => {
  console.log('1 =>', e);
  // return Promise.reject('asdads');
  throw 'kkkkkk';
})
.then((data) => {
  console.log('2 =>', data);
},
(e) => {
  console.log('3 =>', e);
}
)

const responseList = [	
  { id: 1, a: 1 },	
  { id: 2, a: 2 },	
  { id: 3, a: 3 },	
  { id: 1, a: 4 },	
];
function filterProperty(arr, property) {
  return responseList.reduce((start, next) => {
    if (!start.find(item => item[property] === next[property])) {
      start.push(next)
    }
    return start
  }, [])
}
filterProperty(responseList, 'id')

// 返回当前参数的饿数据类型
function paramType(param) {
  if (param === null) {
    return
  }
  // 如"[object Object]", "[object Number]"
  return typeof param === 'object' 
  ? Object.prototype.toString.call(param).replace(/\[[a-z]+\s/, '').replace(/\]/, '')
  : typeof param
}

var template = 'hi, {{name}}. my year is {{age}}. but no {{money}}';
var data = {
  name: 'QiuQiu',
  age: 26
};
function strEngine(template, data) {
  let str = template;
  for (key in data) {
    var currentRxep = new RegExp(`\{\{${key}\}\}`, 'g');
    str = str.replace(currentRxep, data[key]);
  }
  str = str.replace(/\{\{.*\}\}/g , undefined);
  return str
}
strEngine(template, data);