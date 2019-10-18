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
console.log(randomArr(testArr, 5))

// 将树形结构数据通过递归给出树状图